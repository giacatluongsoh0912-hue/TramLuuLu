import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import {
  DEFAULT_SCHOOL_FACEBOOK_URL,
  isAllowedFacebookImageUrl,
  isAllowedFacebookPageUrl,
  normalizeFacebookPageUrl,
  parseFacebookPagePluginHtml,
  type ParsedFacebookFeed,
} from './src/utils/facebookFeedParser.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const FEED_CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

interface CachedFeedEntry {
  fetchedAt: number;
  feed: ParsedFacebookFeed;
}

const feedCache = new Map<string, CachedFeedEntry>();

async function fetchFacebookFeedFromPlugin(pageUrl: string): Promise<ParsedFacebookFeed> {
  const pluginUrl = new URL('https://www.facebook.com/plugins/page.php');
  pluginUrl.searchParams.set('href', pageUrl);
  pluginUrl.searchParams.set('tabs', 'timeline');
  pluginUrl.searchParams.set('width', '500');
  pluginUrl.searchParams.set('height', '600');
  pluginUrl.searchParams.set('small_header', 'false');
  pluginUrl.searchParams.set('adapt_container_width', 'true');

  const response = await fetch(pluginUrl.toString(), {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Facebook returned HTTP ${response.status}`);
  }

  const html = await response.text();
  return parseFacebookPagePluginHtml(html, pageUrl);
}

async function createAppServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  app.get('/api/facebook/posts', async (req, res) => {
    const rawPageUrl = typeof req.query.pageUrl === 'string' ? req.query.pageUrl.trim() : '';
    if (rawPageUrl && !isAllowedFacebookPageUrl(rawPageUrl)) {
      res.status(400).json({
        ok: false,
        error: 'Địa chỉ Fanpage không hợp lệ. Vui lòng dùng đường dẫn facebook.com.',
      });
      return;
    }

    const pageUrl = normalizeFacebookPageUrl(rawPageUrl || DEFAULT_SCHOOL_FACEBOOK_URL);
    const forceRefresh = req.query.force === '1' || req.query.force === 'true';

    const cached = feedCache.get(pageUrl);
    if (!forceRefresh && cached && Date.now() - cached.fetchedAt < FEED_CACHE_TTL_MS) {
      res.json({
        ok: true,
        cached: true,
        fetchedAt: cached.fetchedAt,
        ...cached.feed,
      });
      return;
    }

    try {
      const feed = await fetchFacebookFeedFromPlugin(pageUrl);
      const fetchedAt = Date.now();
      feedCache.set(pageUrl, { fetchedAt, feed });
      res.json({
        ok: true,
        cached: false,
        fetchedAt,
        ...feed,
      });
    } catch (error) {
      if (cached) {
        res.json({
          ok: true,
          cached: true,
          stale: true,
          fetchedAt: cached.fetchedAt,
          ...cached.feed,
        });
        return;
      }
      res.status(502).json({
        ok: false,
        error:
          error instanceof Error
            ? `Không thể kết nối tới Fanpage Facebook: ${error.message}`
            : 'Không thể kết nối tới Fanpage Facebook.',
      });
    }
  });

  app.get('/api/facebook/image', async (req, res) => {
    const imageUrl = typeof req.query.url === 'string' ? req.query.url.trim() : '';
    const format = typeof req.query.format === 'string' ? req.query.format : 'raw';

    if (!imageUrl || !isAllowedFacebookImageUrl(imageUrl)) {
      res.status(400).json({
        ok: false,
        error: 'Đường dẫn ảnh không hợp lệ.',
      });
      return;
    }

    try {
      const imgRes = await fetch(imageUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Referer: 'https://www.facebook.com/',
        },
        signal: AbortSignal.timeout(15000),
      });

      if (!imgRes.ok) {
        res.status(502).json({ ok: false, error: `Upstream image HTTP ${imgRes.status}` });
        return;
      }

      const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
      if (!contentType.startsWith('image/')) {
        res.status(400).json({ ok: false, error: 'Tài nguyên trả về không phải ảnh.' });
        return;
      }

      const arrayBuf = await imgRes.arrayBuffer();
      if (arrayBuf.byteLength > MAX_IMAGE_BYTES) {
        res.status(413).json({ ok: false, error: 'Ảnh vượt quá kích thước cho phép.' });
        return;
      }

      const buffer = Buffer.from(arrayBuf);
      if (format === 'dataurl') {
        const mime = contentType.split(';')[0].trim();
        const dataUrl = `data:${mime};base64,${buffer.toString('base64')}`;
        res.json({
          ok: true,
          contentType: mime,
          bytes: buffer.byteLength,
          dataUrl,
        });
        return;
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(buffer);
    } catch (error) {
      res.status(502).json({
        ok: false,
        error:
          error instanceof Error ? `Không thể tải ảnh từ Facebook: ${error.message}` : 'Lỗi tải ảnh.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

createAppServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

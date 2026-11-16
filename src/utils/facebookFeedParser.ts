/**
 * Pure parser and normalizer for Facebook Fanpage timeline posts returned by
 * Meta's official Page Plugin endpoint (no mocks, strictly deterministic).
 */

export type MemoryCategory = 'classroom' | 'flower' | 'olympiad' | 'graduation';

export interface RawFacebookTimelinePost {
  message?: string;
  createdTime?: number;
  attachmentType?: string;
  photoURL?: string;
  albumPhotoURLs?: string[];
  linkTitle?: string;
  linkDomain?: string;
  reactionCount?: number;
  commentCount?: number;
  shareCount?: number;
}

export interface ParsedFacebookPost {
  id: string;
  externalId: string;
  title: string;
  caption: string;
  year: string;
  category: MemoryCategory;
  author: string;
  imageUrl: string;
  tags: string[];
  likes: number;
  createdAt: number;
  source: 'facebook';
  sourceUrl: string;
}

export interface ParsedFacebookFeed {
  pageName: string;
  followerCount: string;
  pageUrl: string;
  posts: ParsedFacebookPost[];
}

export const DEFAULT_SCHOOL_FACEBOOK_URL = 'https://www.facebook.com/chuyensonlaofficial';

export function normalizeFacebookPageUrl(rawUrl?: string): string {
  const candidate = (rawUrl || DEFAULT_SCHOOL_FACEBOOK_URL).trim();
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return DEFAULT_SCHOOL_FACEBOOK_URL;
    }
    const host = parsed.hostname.toLowerCase();
    const allowedHosts = new Set([
      'facebook.com',
      'www.facebook.com',
      'm.facebook.com',
      'web.facebook.com',
      'fb.com',
      'www.fb.com',
    ]);
    if (!allowedHosts.has(host)) {
      return DEFAULT_SCHOOL_FACEBOOK_URL;
    }
    parsed.protocol = 'https:';
    if (host === 'm.facebook.com' || host === 'web.facebook.com') {
      parsed.hostname = 'www.facebook.com';
    }
    return parsed.toString();
  } catch {
    return DEFAULT_SCHOOL_FACEBOOK_URL;
  }
}

export function isAllowedFacebookPageUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
    const host = parsed.hostname.toLowerCase();
    return (
      host === 'facebook.com' ||
      host === 'www.facebook.com' ||
      host === 'm.facebook.com' ||
      host === 'web.facebook.com' ||
      host === 'fb.com' ||
      host === 'www.fb.com'
    );
  } catch {
    return false;
  }
}

export function isAllowedFacebookImageUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    return (
      host.endsWith('.fbcdn.net') ||
      host === 'fbcdn.net' ||
      host.endsWith('.fbsbx.com') ||
      host === 'fbsbx.com'
    );
  } catch {
    return false;
  }
}

export function extractBalancedJsonArray(source: string, keyPrefix: string): string | null {
  const keyIdx = source.indexOf(keyPrefix);
  if (keyIdx === -1) return null;

  const arrayStart = source.indexOf('[', keyIdx);
  if (arrayStart === -1) return null;

  let depth = 0;
  let inStr = false;
  let esc = false;

  for (let i = arrayStart; i < source.length; i++) {
    const ch = source[i];
    if (inStr) {
      if (esc) {
        esc = false;
      } else if (ch === '\\') {
        esc = true;
      } else if (ch === '"') {
        inStr = false;
      }
      continue;
    }

    if (ch === '"') {
      inStr = true;
    } else if (ch === '[') {
      depth++;
    } else if (ch === ']') {
      depth--;
      if (depth === 0) {
        return source.slice(arrayStart, i + 1);
      }
    }
  }

  return null;
}

function extractStringProp(source: string, propName: string): string | null {
  const regex = new RegExp(`"${propName}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`);
  const match = source.match(regex);
  if (!match) return null;
  try {
    return JSON.parse(`"${match[1]}"`) as string;
  } catch {
    return null;
  }
}

export function formatVietnameseDate(unixSeconds: number): string {
  if (!Number.isFinite(unixSeconds) || unixSeconds <= 0) {
    return 'Facebook Trường';
  }
  const date = new Date(unixSeconds * 1000);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy} · Fanpage CSL`;
}

export function inferMemoryCategory(text: string): MemoryCategory {
  const lower = (text || '').toLowerCase();
  if (
    /đội tuyển|học sinh giỏi|hsg|olympia|quốc gia|sân chơi|giải nhất|giải nhì|thí nghiệm|cuộc thi/.test(
      lower
    )
  ) {
    return 'olympiad';
  }
  if (/20\/11|tri ân|trưởng thành|bế giảng|ra trường|nhà giáo|cựu học sinh/.test(lower)) {
    return 'graduation';
  }
  if (/hoa ban|văn nghệ|hội trại|trải nghiệm|ngoại khóa|câu lạc bộ|clb|thể thao/.test(lower)) {
    return 'flower';
  }
  return 'classroom';
}

function stripDecorativeEdgeSymbols(line: string): string {
  return line
    .replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s✨🔥🏆🎉💐📚📲🧑🏻‍🏫💻💌🕊️🌸🌟⭐⚡━─\-•🔹🔸📌]+/gu, '')
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D\s✨🔥🏆🎉💐📚📲🧑🏻‍🏫💻💌🕊️🌸🌟⭐⚡━─\-•🔹🔸📌]+$/gu, '')
    .trim();
}

export function extractTitleAndCaption(
  rawMessage?: string,
  fallbackLinkTitle?: string
): { title: string; caption: string } {
  const cleaned = (rawMessage || '').replace(/\r\n/g, '\n').trim();
  const lines = cleaned
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !/^[━─\-_=]{4,}$/.test(l));

  let title = '';
  for (const line of lines) {
    if (line.startsWith('#')) continue;
    const candidate = stripDecorativeEdgeSymbols(line);
    if (candidate.length >= 8) {
      title = candidate;
      break;
    }
  }

  if (!title) {
    title = stripDecorativeEdgeSymbols(fallbackLinkTitle || '') || 'Khoảnh khắc từ Fanpage THPT Chuyên Sơn La';
  }

  if (title.length > 140) {
    title = `${title.slice(0, 137).trim()}...`;
  }

  let caption = cleaned || fallbackLinkTitle || title;
  if (caption.length > 2900) {
    caption = `${caption.slice(0, 2897).trim()}...`;
  }

  return { title, caption };
}

function simpleHash(input: string): string {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function buildFacebookMemoryId(createdTime: number, message: string, index: number): string {
  const ts = Number.isFinite(createdTime) && createdTime > 0 ? Math.floor(createdTime) : index;
  const sig = simpleHash(`${ts}:${(message || '').slice(0, 120)}`);
  return `fb-${ts}-${sig}`;
}

export function extractHashtags(message: string): string[] {
  const matches = message.match(/#[\p{L}\p{N}_]+/gu) || [];
  const tags: string[] = ['Facebook Trường'];
  for (const rawTag of matches) {
    const clean = rawTag.slice(1);
    if (clean && !tags.includes(clean) && tags.length < 4) {
      tags.push(clean);
    }
  }
  if (tags.length === 1) {
    tags.push('Chuyên Sơn La');
  }
  return tags;
}

export function parseFacebookPagePluginHtml(
  html: string,
  pageUrl: string
): ParsedFacebookFeed {
  const normalizedUrl = normalizeFacebookPageUrl(pageUrl);
  const pageName =
    extractStringProp(html, 'pageName') ||
    extractStringProp(html, 'name') ||
    'Trường THPT Chuyên Sơn La';
  const followerCount = extractStringProp(html, 'followerCountFormatted') || '';

  const timelineJson = extractBalancedJsonArray(html, '"timelinePosts":');
  if (!timelineJson) {
    return {
      pageName,
      followerCount,
      pageUrl: normalizedUrl,
      posts: [],
    };
  }

  let rawPosts: RawFacebookTimelinePost[] = [];
  try {
    const parsed = JSON.parse(timelineJson);
    if (Array.isArray(parsed)) {
      rawPosts = parsed as RawFacebookTimelinePost[];
    }
  } catch {
    rawPosts = [];
  }

  const posts: ParsedFacebookPost[] = [];
  const seenIds = new Set<string>();

  rawPosts.forEach((raw, idx) => {
    const message = (raw.message || '').trim();
    const primaryImage =
      raw.photoURL || (Array.isArray(raw.albumPhotoURLs) ? raw.albumPhotoURLs[0] : '') || '';

    // Skip empty non-photo link-less entries
    if (!message && !primaryImage) return;
    if (!primaryImage) return;

    const createdTime = Number(raw.createdTime) || 0;
    const id = buildFacebookMemoryId(createdTime, message || primaryImage, idx);
    if (seenIds.has(id)) return;
    seenIds.add(id);

    const { title, caption } = extractTitleAndCaption(message, raw.linkTitle);
    const category = inferMemoryCategory(`${title}\n${caption}`);
    const year = formatVietnameseDate(createdTime);
    const likes = Math.max(1, Number(raw.reactionCount) || 1);
    const createdAt = createdTime > 0 ? createdTime * 1000 : Date.now() - idx * 60_000;

    posts.push({
      id,
      externalId: id,
      title,
      caption,
      year,
      category,
      author: pageName,
      imageUrl: primaryImage,
      tags: extractHashtags(message),
      likes,
      createdAt,
      source: 'facebook',
      sourceUrl: normalizedUrl,
    });
  });

  return {
    pageName,
    followerCount,
    pageUrl: normalizedUrl,
    posts,
  };
}

export function selectNewFacebookPostsToSync(
  parsedPosts: ReadonlyArray<ParsedFacebookPost>,
  existingMemories: ReadonlyArray<{ id: string; externalId?: string }>,
  dismissedIds: ReadonlyArray<string>,
  options?: { includeDismissed?: boolean; maxItems?: number }
): ParsedFacebookPost[] {
  const existingIds = new Set<string>();
  for (const m of existingMemories) {
    if (m.id) existingIds.add(m.id);
    if (m.externalId) existingIds.add(m.externalId);
  }

  const dismissedSet = options?.includeDismissed ? new Set<string>() : new Set(dismissedIds || []);
  const maxItems = options?.maxItems ?? 6;

  const selected: ParsedFacebookPost[] = [];
  for (const post of parsedPosts) {
    if (existingIds.has(post.id) || existingIds.has(post.externalId)) continue;
    if (dismissedSet.has(post.id) || dismissedSet.has(post.externalId)) continue;
    selected.push(post);
    if (selected.length >= maxItems) break;
  }

  return selected;
}

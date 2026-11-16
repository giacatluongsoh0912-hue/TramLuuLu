import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isAllowedFacebookPageUrl,
  isAllowedFacebookImageUrl,
  normalizeFacebookPageUrl,
  extractBalancedJsonArray,
  inferMemoryCategory,
  extractTitleAndCaption,
  parseFacebookPagePluginHtml,
  selectNewFacebookPostsToSync,
  type ParsedFacebookPost,
} from './facebookFeedParser.ts';

test('isAllowedFacebookPageUrl validates facebook hosts and rejects non-facebook SSRF targets', () => {
  assert.equal(isAllowedFacebookPageUrl('https://www.facebook.com/chuyensonlaofficial'), true);
  assert.equal(isAllowedFacebookPageUrl('https://m.facebook.com/chuyensonlaofficial'), true);
  assert.equal(isAllowedFacebookPageUrl('https://fb.com/chuyensonlaofficial'), true);
  assert.equal(isAllowedFacebookPageUrl('https://evil.example.com/facebook.com'), false);
  assert.equal(isAllowedFacebookPageUrl('http://169.254.169.254/latest/meta-data/'), false);
  assert.equal(isAllowedFacebookPageUrl('javascript:alert(1)'), false);
});

test('isAllowedFacebookImageUrl restricts image proxy strictly to Meta CDN HTTPS URLs', () => {
  assert.equal(
    isAllowedFacebookImageUrl('https://scontent-nrt6-1.xx.fbcdn.net/v/t39.30808-6/123.jpg'),
    true
  );
  assert.equal(isAllowedFacebookImageUrl('http://scontent-nrt6-1.xx.fbcdn.net/123.jpg'), false);
  assert.equal(isAllowedFacebookImageUrl('https://localhost:3000/secret'), false);
  assert.equal(isAllowedFacebookImageUrl('https://example.com/fbcdn.net/fake.jpg'), false);
});

test('normalizeFacebookPageUrl upgrades m.facebook.com to www.facebook.com and falls back on invalid', () => {
  assert.equal(
    normalizeFacebookPageUrl('http://m.facebook.com/chuyensonlaofficial'),
    'https://www.facebook.com/chuyensonlaofficial'
  );
  assert.equal(
    normalizeFacebookPageUrl('https://invalid.local/test'),
    'https://www.facebook.com/chuyensonlaofficial'
  );
});

test('extractBalancedJsonArray handles nested brackets inside strings safely', () => {
  const sample = `
    "pageName":"Tr\\u01b0\\u1eddng THPT Chuy\\u00ean S\\u01a1n La",
    "timelinePosts":[{"message":"[TH\\u00d4NG B\\u00c1O] A [B]","createdTime":1794792600,"photoURL":"https://scontent.xx.fbcdn.net/a.jpg"}],
    "other":[1,2,3]
  `;
  const extracted = extractBalancedJsonArray(sample, '"timelinePosts":');
  assert.ok(extracted);
  const parsed = JSON.parse(extracted);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].message, '[THÔNG BÁO] A [B]');
});

test('inferMemoryCategory classifies olympiad, graduation, flower, and classroom posts accurately', () => {
  assert.equal(inferMemoryCategory('Đội tuyển Học sinh giỏi Quốc gia năm 2026'), 'olympiad');
  assert.equal(inferMemoryCategory('Chào mừng ngày Nhà giáo Việt Nam 20/11 tri ân'), 'graduation');
  assert.equal(inferMemoryCategory('Mùa hoa ban và hoạt động trải nghiệm ngoại khóa CLB'), 'flower');
  assert.equal(inferMemoryCategory('Thông báo lịch học tuần 13 toàn trường'), 'classroom');
});

test('extractTitleAndCaption strips decorative emoji edges for headline while preserving full caption', () => {
  const raw = '🔥 [CHÍNH THỨC MỞ CỔNG BÌNH CHỌN] 🔥\n━━━━━━━━━━━━━━━━━━━━\nNội dung chi tiết bài viết.\n#THPTChuyenSonLa #TriAn2011';
  const { title, caption } = extractTitleAndCaption(raw);
  assert.equal(title, '[CHÍNH THỨC MỞ CỔNG BÌNH CHỌN]');
  assert.ok(caption.includes('Nội dung chi tiết bài viết.'));
});

test('parseFacebookPagePluginHtml extracts real posts and filters out entries without photos', () => {
  const html = `
    <script>
      const payload = {
        "pageName":"Tr\\u01b0\\u1eddng THPT Chuy\\u00ean S\\u01a1n La",
        "followerCountFormatted":"23K",
        "timelinePosts":[
          {
            "message":"\\ud83c\\udfc6 CH\\u00daC M\\u1eeaNG \\u0110\\u1ed8I TUY\\u1ec2N HSG GI\\u00c0NH GI\\u1ea2I NH\\u1ea4T\\nChi ti\\u1ebft cu\\u1ed9c thi.\\n#ChuyenSonLa #HSG",
            "createdTime":1794750000,
            "photoURL":"https://scontent-nrt1-1.xx.fbcdn.net/v/t39.30808-6/photo1.jpg",
            "reactionCount":172
          },
          {
            "message":"Text only status without photo",
            "createdTime":1794700000,
            "reactionCount":10
          }
        ]
      };
    </script>
  `;

  const feed = parseFacebookPagePluginHtml(html, 'https://www.facebook.com/chuyensonlaofficial');
  assert.equal(feed.pageName, 'Trường THPT Chuyên Sơn La');
  assert.equal(feed.followerCount, '23K');
  assert.equal(feed.posts.length, 1);
  assert.equal(feed.posts[0].category, 'olympiad');
  assert.equal(feed.posts[0].likes, 172);
  assert.equal(feed.posts[0].createdAt, 1794750000 * 1000);
  assert.ok(feed.posts[0].id.startsWith('fb-1794750000-'));
  assert.deepEqual(feed.posts[0].tags, ['Facebook Trường', 'ChuyenSonLa', 'HSG']);
});

function makePostFixture(id: string): ParsedFacebookPost {
  return {
    id,
    externalId: id,
    title: `Post ${id}`,
    caption: `Caption ${id}`,
    author: 'Fanpage Trường THPT Chuyên Sơn La',
    year: '2026',
    category: 'classroom',
    imageUrl: `https://scontent.xx.fbcdn.net/${id}.jpg`,
    source: 'facebook',
    sourceUrl: 'https://www.facebook.com/chuyensonlaofficial',
    likes: 10,
    tags: ['Facebook Trường'],
    createdAt: 1794750000000,
  };
}

test('selectNewFacebookPostsToSync skips existing memories and user-dismissed IDs', () => {
  const posts: ParsedFacebookPost[] = [
    makePostFixture('fb-1'),
    makePostFixture('fb-2'),
    makePostFixture('fb-3'),
  ];

  const existing = [{ id: 'fb-1', externalId: 'fb-1' }];
  const dismissed = ['fb-2'];

  const selected = selectNewFacebookPostsToSync(posts, existing, dismissed);
  assert.deepEqual(
    selected.map((p) => p.id),
    ['fb-3']
  );

  const restored = selectNewFacebookPostsToSync(posts, existing, dismissed, {
    includeDismissed: true,
  });
  assert.deepEqual(
    restored.map((p) => p.id),
    ['fb-2', 'fb-3']
  );
});

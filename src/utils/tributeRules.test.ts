import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateTributeMessage,
  formatTributeDate,
  filterTributes,
  calculateCandleTotal,
  generateCardId,
  calculateFlowerScore,
  getContestStatus,
  validatePadletNote,
  filterPadletNotes,
  PadletNote,
  TributeMessage,
} from './tributeRules';

test('calculateFlowerScore weights grade 9 as 1 and grade 10 as 2', () => {
  const score = calculateFlowerScore({ grade9: 15, grade10: 20 });
  assert.equal(score, 15 * 1 + 20 * 2); // 55
});

test('getContestStatus calculates ongoing status correctly', () => {
  const now = new Date('2026-11-09').getTime();
  const end = new Date('2026-11-21').getTime();
  const status = getContestStatus(now, end);
  assert.equal(status.isOngoing, true);
  assert.ok(status.daysRemaining >= 11);
});

test('validatePadletNote catches empty content and short name', () => {
  const res = validatePadletNote({});
  assert.equal(res.isValid, false);
  assert.ok(res.errors.author);
  assert.ok(res.errors.className);
  assert.ok(res.errors.content);
});

test('filterPadletNotes filters correctly by tag', () => {
  const sample: PadletNote[] = [
    {
      id: '1',
      author: 'Mai Linh',
      className: '12 Văn',
      content: 'Nhớ cô Hoa nhiều lắm!',
      color: 'pink',
      tag: 'tri-an',
      likes: 10,
      createdAt: 1000,
    },
    {
      id: '2',
      author: 'Quang Huy',
      className: '11 Toán',
      content: 'Chúc mừng 20/11 thầy Tuấn',
      color: 'yellow',
      tag: 'chuc-mung',
      likes: 5,
      createdAt: 2000,
    },
  ];
  const filtered = filterPadletNotes(sample, { tag: 'tri-an' });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].author, 'Mai Linh');
});


test('validateTributeMessage catches empty inputs', () => {
  const result = validateTributeMessage({});
  assert.equal(result.isValid, false);
  assert.ok(result.errors.senderName);
  assert.ok(result.errors.affiliation);
  assert.ok(result.errors.recipient);
  assert.ok(result.errors.content);
});

test('validateTributeMessage passes with valid input', () => {
  const result = validateTributeMessage({
    senderName: 'Trần Minh Anh',
    affiliation: 'Chuyên Văn K30',
    recipient: 'Cô giáo chủ nhiệm',
    content: 'Em xin chân thành cảm ơn cô đã luôn yêu thương và dìu dắt chúng em trong suốt 3 năm qua!',
  });
  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});

test('formatTributeDate formats timestamp correctly', () => {
  // Test with fixed date: 2026-11-20
  const date = new Date(2026, 10, 20).getTime();
  const formatted = formatTributeDate(date);
  assert.equal(formatted, '20/11/2026');
});

test('filterTributes filters by department and query', () => {
  const sampleTributes: TributeMessage[] = [
    {
      id: '1',
      senderName: 'Lê Văn An',
      affiliation: 'K30 Chuyên Toán',
      recipient: 'Thầy Nguyễn Văn Nam',
      department: 'Toán',
      content: 'Nhớ những bài toán khó thầy dạy',
      paperTheme: 'parchment',
      gift: 'ban-flower',
      createdAt: 1000,
      likes: 5,
    },
    {
      id: '2',
      senderName: 'Hoàng Mai',
      affiliation: 'K31 Chuyên Văn',
      recipient: 'Cô Nguyễn Thị Hoa',
      department: 'Văn',
      content: 'Nhớ từng trang văn cô truyền cảm hứng',
      paperTheme: 'flower',
      gift: 'sunflower',
      createdAt: 2000,
      likes: 12,
    },
  ];

  const mathOnly = filterTributes(sampleTributes, { department: 'Toán' });
  assert.equal(mathOnly.length, 1);
  assert.equal(mathOnly[0].senderName, 'Lê Văn An');

  const searchResult = filterTributes(sampleTributes, { searchQuery: 'truyền cảm hứng' });
  assert.equal(searchResult.length, 1);
  assert.equal(searchResult[0].senderName, 'Hoàng Mai');
});

test('calculateCandleTotal calculates correct sum', () => {
  const counts = {
    Toán: 15,
    Văn: 20,
    Lý: 10,
  };
  assert.equal(calculateCandleTotal(counts), 45);
});

test('generateCardId generates unique string starting with CSL-', () => {
  const id = generateCardId();
  assert.ok(id.startsWith('CSL-'));
  assert.ok(id.length >= 8);
});

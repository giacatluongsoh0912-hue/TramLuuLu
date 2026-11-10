export interface TributeMessage {
  id: string;
  senderName: string;
  affiliation: string; // e.g. "Chuyên Văn K29", "Chuyên Toán K31", "Cựu học sinh 2018-2021"
  recipient: string; // e.g. "Cô Nguyễn Thị Hoa", "Tập thể thầy cô Chuyên Sơn La"
  department: string; // e.g. "Toán", "Văn", "Ban Giám Hiệu", "Lý", "Hóa", "Sinh", "Ngoại Ngữ", "Toàn trường"
  content: string;
  paperTheme: 'parchment' | 'kraft' | 'blackboard' | 'flower';
  gift: 'ban-flower' | 'sunflower' | 'chalk' | 'candle';
  createdAt: number;
  likes: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateTributeMessage(data: Partial<TributeMessage>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.senderName || data.senderName.trim().length < 2) {
    errors.senderName = 'Vui lòng nhập họ và tên của bạn (ít nhất 2 ký tự).';
  }

  if (!data.affiliation || data.affiliation.trim().length < 2) {
    errors.affiliation = 'Vui lòng nhập niên khóa hoặc lớp (ví dụ: Chuyên Toán K31).';
  }

  if (!data.recipient || data.recipient.trim().length < 2) {
    errors.recipient = 'Vui lòng nhập tên thầy cô hoặc tập thể muốn gửi gắm.';
  }

  if (!data.content || data.content.trim().length < 10) {
    errors.content = 'Lời nhắn gửi cần ít nhất 10 ký tự để bày tỏ trọn vẹn lòng tri ân.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatTributeDate(timestamp: number): string {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function filterTributes(
  tributes: TributeMessage[],
  filter: { department?: string; searchQuery?: string }
): TributeMessage[] {
  return tributes.filter((tribute) => {
    if (filter.department && filter.department !== 'all') {
      if (tribute.department !== filter.department) {
        return false;
      }
    }

    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const q = filter.searchQuery.toLowerCase();
      const matchSender = tribute.senderName.toLowerCase().includes(q);
      const matchAffiliation = tribute.affiliation.toLowerCase().includes(q);
      const matchRecipient = tribute.recipient.toLowerCase().includes(q);
      const matchContent = tribute.content.toLowerCase().includes(q);
      if (!matchSender && !matchAffiliation && !matchRecipient && !matchContent) {
        return false;
      }
    }

    return true;
  });
}

export function calculateCandleTotal(counts: Record<string, number>): number {
  return Object.values(counts).reduce((sum, count) => sum + count, 0);
}

export function generateCardId(): string {
  return 'CSL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function calculateFlowerScore(scores: { grade9: number; grade10: number }): number {
  return (scores.grade9 || 0) * 1 + (scores.grade10 || 0) * 2;
}

export function getContestStatus(currentTime: number, endTime: number): { isOngoing: boolean; daysRemaining: number } {
  const diff = endTime - currentTime;
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  return {
    isOngoing: diff > 0,
    daysRemaining: days,
  };
}

export interface PadletNote {
  id: string;
  author: string;
  className: string;
  content: string;
  color: 'yellow' | 'pink' | 'cyan' | 'purple' | 'orange';
  tag: string;
  imageUrl?: string;
  likes: number;
  createdAt: number;
}

export function validatePadletNote(data: Partial<PadletNote>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.author || data.author.trim().length < 2) {
    errors.author = 'Vui lòng nhập họ tên hoặc biệt danh (ít nhất 2 ký tự).';
  }

  if (!data.className || data.className.trim().length < 2) {
    errors.className = 'Vui lòng nhập lớp hoặc khóa (ví dụ: 12 Chuyên Toán, K31...).';
  }

  if (!data.content || data.content.trim().length < 5) {
    errors.content = 'Nội dung mẩu giấy cần ít nhất 5 ký tự.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function filterPadletNotes(
  notes: PadletNote[],
  filter: { tag?: string; searchQuery?: string }
): PadletNote[] {
  return notes.filter((n) => {
    if (filter.tag && filter.tag !== 'all') {
      if (n.tag !== filter.tag) return false;
    }
    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const q = filter.searchQuery.toLowerCase();
      const matchAuthor = n.author.toLowerCase().includes(q);
      const matchClass = n.className.toLowerCase().includes(q);
      const matchContent = n.content.toLowerCase().includes(q);
      if (!matchAuthor && !matchClass && !matchContent) return false;
    }
    return true;
  });
}


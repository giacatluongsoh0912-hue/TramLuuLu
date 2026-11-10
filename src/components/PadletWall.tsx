import React, { useState } from 'react';
import {
  Pin,
  Sparkles,
  Plus,
  Heart,
  Search,
  X,
  Share2,
  ExternalLink,
  MessageSquare,
  Award,
  Edit2,
  Trash2,
  Check,
  Save,
} from 'lucide-react';
import { PadletNote, validatePadletNote, filterPadletNotes } from '../utils/tributeRules';

interface PadletWallProps {
  notes: PadletNote[];
  onAddNote: (note: PadletNote) => void;
  onUpdateNote?: (note: PadletNote) => void;
  onDeleteNote?: (id: string) => void;
}

export const PadletWall: React.FC<PadletWallProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [editingNote, setEditingNote] = useState<PadletNote | null>(null);
  const [likesState, setLikesState] = useState<Record<string, number>>({});

  // New Note Form State
  const [author, setAuthor] = useState('');
  const [className, setClassName] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState<'yellow' | 'pink' | 'cyan' | 'purple' | 'orange'>('yellow');
  const [tag, setTag] = useState('lời chúc 20/11');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Edit Note Form State
  const [editAuthor, setEditAuthor] = useState('');
  const [editClassName, setEditClassName] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editColor, setEditColor] = useState<'yellow' | 'pink' | 'cyan' | 'purple' | 'orange'>('yellow');
  const [editTag, setEditTag] = useState('lời chúc 20/11');
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleOpenEdit = (note: PadletNote) => {
    setEditingNote(note);
    setEditAuthor(note.author);
    setEditClassName(note.className);
    setEditContent(note.content);
    setEditColor(note.color);
    setEditTag(note.tag);
    setEditErrors({});
    setIsConfirmingDelete(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    const validation = validatePadletNote({ author: editAuthor, className: editClassName, content: editContent });
    if (!validation.isValid) {
      setEditErrors(validation.errors);
      return;
    }

    const updated: PadletNote = {
      ...editingNote,
      author: editAuthor.trim(),
      className: editClassName.trim(),
      content: editContent.trim(),
      color: editColor,
      tag: editTag,
    };

    if (onUpdateNote) {
      onUpdateNote(updated);
    }
    setEditingNote(null);
  };

  const handleConfirmDelete = (id: string) => {
    if (onDeleteNote) {
      onDeleteNote(id);
    }
    setEditingNote(null);
    setIsConfirmingDelete(false);
  };

  const tags = [
    { id: 'all', label: 'Tất Cả Mẩu Giấy' },
    { id: 'lời chúc 20/11', label: '🌸 Lời Chúc 20/11' },
    { id: 'cựu học sinh', label: '🎓 Cựu Học Sinh Các Khóa' },
    { id: 'kỷ niệm vui', label: '🎒 Kỷ Niệm Học Trò' },
    { id: 'thơ văn tri ân', label: '✍️ Thơ & Tản Văn' },
  ];

  const filteredNotes = filterPadletNotes(notes, {
    tag: selectedTag,
    searchQuery: searchQuery,
  });

  const handleToggleLike = (id: string, initialLikes: number) => {
    setLikesState((prev) => {
      const current = prev[id] !== undefined ? prev[id] : initialLikes;
      return { ...prev, [id]: current + 1 };
    });
  };

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePadletNote({ author, className, content });
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    const newNote: PadletNote = {
      id: 'pdl-' + Date.now(),
      author: author.trim(),
      className: className.trim(),
      content: content.trim(),
      color: color,
      tag: tag,
      likes: 1,
      createdAt: Date.now(),
    };

    onAddNote(newNote);
    setAuthor('');
    setClassName('');
    setContent('');
    setFormErrors({});
    setIsAddingNote(false);
  };

  const getColorClasses = (c: 'yellow' | 'pink' | 'cyan' | 'purple' | 'orange') => {
    switch (c) {
      case 'pink':
        return 'bg-[#ffd5dc] text-[#4d1624] border-[#f4aab7]';
      case 'cyan':
        return 'bg-[#d2f3ec] text-[#0f4037] border-[#9fe0d2]';
      case 'purple':
        return 'bg-[#ebd8ff] text-[#341652] border-[#ccaaf3]';
      case 'orange':
        return 'bg-[#ffe4cc] text-[#542d0a] border-[#f5be8e]';
      case 'yellow':
      default:
        return 'bg-[#fef3c7] text-[#453106] border-[#f5df8e]';
    }
  };

  const getPinColor = (c: 'yellow' | 'pink' | 'cyan' | 'purple' | 'orange') => {
    switch (c) {
      case 'pink':
        return 'text-[#e11d48]';
      case 'cyan':
        return 'text-[#0d9488]';
      case 'purple':
        return 'text-[#9333ea]';
      case 'orange':
        return 'text-[#ea580c]';
      case 'yellow':
      default:
        return 'text-[#d97706]';
    }
  };

  return (
    <section id="padlet" className="py-16 bg-[#0c160f]/80 backdrop-blur-md relative border-b border-[#253a2b]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#2a4332]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e3425] border border-[#eccb76]/40 text-[#eccb76] text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Không Gian Tương Tác Số Hóa 20/11</span>
            </div>
            <h2 className="font-serif-vintage text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Bảng Tương Tác Padlet & Kỷ Niệm
            </h2>
            <p className="text-sm text-[#b8ad95] mt-2 max-w-2xl font-body">
              Góc lưu giữ những mẩu giấy note đầy màu sắc, lời nhắn gửi dễ thương của các chi đoàn và cựu học sinh gửi tới mái trường THPT Chuyên Sơn La.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => setIsAddingNote(true)}
              className="px-4 py-2.5 rounded-lg bg-[#cbbaa1] hover:bg-[#dbccb5] text-[#1c1810] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#1c1810]" />
              <span>Dán Mẩu Giấy Mới</span>
            </button>

            <a
              href="https://www.facebook.com/chuyensonlaofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-lg bg-[#1877f2]/20 hover:bg-[#1877f2]/30 text-[#60a5fa] border border-[#1877f2]/40 text-xs font-semibold transition-colors flex items-center gap-2"
              title="Ghé thăm Fanpage Facebook Trường THPT Chuyên Sơn La"
            >
              <span>Fanpage Facebook</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* School Fanpage Spotlight Card */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#172d3f]/70 via-[#16271e] to-[#172d3f]/70 border border-[#2b4c5e] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/aistudio/Logo_THPT_Chuyen_Son_La_bf6a8e06.png"
              alt="Logo Chuyên Sơn La"
              className="w-12 h-12 object-contain drop-shadow"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif-vintage text-base font-bold text-white">
                  Fanpage Chính Thức: Trường THPT Chuyên Sơn La
                </h4>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-xs text-[#9bb3a6] mt-0.5">
                Cập nhật liên tục các hoạt động, hình ảnh và video chào mừng Ngày Nhà giáo Việt Nam 20/11
              </p>
            </div>
          </div>

          <a
            href="https://www.facebook.com/chuyensonlaofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
          >
            <span>Theo dõi Fanpage</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Filter Tags & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 text-xs font-semibold no-scrollbar">
            {tags.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTag(t.id)}
                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedTag === t.id
                    ? 'bg-[#cbbaa1] text-[#1c1810] font-bold shadow-md'
                    : 'bg-[#18281e] text-[#cfc5aa] hover:bg-[#203426]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#8a9f90] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên bạn, lớp, nội dung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#142218] border border-[#2d4734] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#eccb76]"
            />
          </div>
        </div>

        {/* Corkboard Padlet Sticky Note Grid */}
        <div
          className="p-6 sm:p-8 rounded-3xl border-4 border-[#2d4434] shadow-2xl relative overflow-hidden"
          style={{
            backgroundColor: '#1b291f',
            backgroundImage: 'radial-gradient(#263a2c 1.5px, transparent 1.5px)',
            backgroundSize: '20px 20px',
          }}
        >
          {filteredNotes.length === 0 ? (
            <div className="text-center py-16 text-[#b8ad95]">
              <MessageSquare className="w-10 h-10 mx-auto text-[#eccb76] mb-3 opacity-60" />
              <p className="font-serif-vintage text-base">Chưa có mẩu giấy nào trong mục này.</p>
              <button
                onClick={() => setIsAddingNote(true)}
                className="mt-3 px-4 py-2 rounded-lg bg-[#cbbaa1] text-[#1c1810] text-xs font-bold cursor-pointer"
              >
                Hãy là người đầu tiên dán mẩu giấy!
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note, index) => {
                const rot = index % 4 === 0 ? '-rotate-1.5' : index % 4 === 1 ? 'rotate-1' : index % 4 === 2 ? '-rotate-0.5' : 'rotate-2';
                const likes = likesState[note.id] !== undefined ? likesState[note.id] : note.likes;
                const colorClasses = getColorClasses(note.color);
                const pinColor = getPinColor(note.color);

                return (
                  <div
                    key={note.id}
                    className={`relative p-5 pt-6 rounded-xl border-2 shadow-lg transition-all duration-300 hover:rotate-0 hover:scale-102 hover:shadow-2xl flex flex-col justify-between ${colorClasses} transform ${rot}`}
                  >
                    {/* Top Push Pin */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                      <Pin className={`w-6 h-6 drop-shadow-md fill-current ${pinColor}`} />
                    </div>

                    <div>
                      {/* Category Tag Badge & Edit Action */}
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider opacity-85 pb-2 border-b border-black/10">
                        <span className="font-semibold">{note.className}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold">#{note.tag}</span>
                          <button
                            onClick={() => handleOpenEdit(note)}
                            className="p-1 rounded hover:bg-black/15 text-stone-900 transition-colors cursor-pointer"
                            title="Chỉnh sửa mẩu giấy này"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="font-serif-vintage text-sm leading-relaxed mt-3 mb-4 whitespace-pre-line italic">
                        &ldquo;{note.content}&rdquo;
                      </p>
                    </div>

                    {/* Bottom Author, Edit link & Hearts */}
                    <div className="pt-2 border-t border-black/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-script-calligraphy text-sm font-bold opacity-90">
                          ✍️ {note.author}
                        </span>
                        <button
                          onClick={() => handleOpenEdit(note)}
                          className="text-[10px] underline opacity-70 hover:opacity-100 cursor-pointer font-sans"
                        >
                          Sửa
                        </button>
                      </div>

                      <button
                        onClick={() => handleToggleLike(note.id, note.likes)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/10 hover:bg-black/20 transition-colors cursor-pointer text-xs font-bold"
                        title="Thả tim mẩu giấy"
                      >
                        <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                        <span className="font-mono">{likes}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Add Padlet Note Modal */}
      {isAddingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#1b2b20] border-2 border-[#eccb76]/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-6 text-[#f6eedc]">
            <button
              onClick={() => setIsAddingNote(false)}
              className="absolute top-4 right-4 text-[#cfc5aa] hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2d4734]">
              <span className="text-2xl">📌</span>
              <div>
                <h3 className="font-serif-vintage text-xl font-bold text-white">
                  Dán Mẩu Giấy Lên Bảng Padlet
                </h3>
                <span className="text-xs text-[#b8ad95]">
                  Chia sẻ cảm xúc, lời chúc 20/11 hoặc kỷ niệm với thầy cô
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmitNote} className="space-y-4">
              {/* Color Picker */}
              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1.5">
                  Chọn màu giấy note:
                </label>
                <div className="flex gap-2.5">
                  {(['yellow', 'pink', 'cyan', 'purple', 'orange'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                        c === 'yellow'
                          ? 'bg-[#fef3c7]'
                          : c === 'pink'
                          ? 'bg-[#ffd5dc]'
                          : c === 'cyan'
                          ? 'bg-[#d2f3ec]'
                          : c === 'purple'
                          ? 'bg-[#ebd8ff]'
                          : 'bg-[#ffe4cc]'
                      } ${color === c ? 'scale-120 border-white ring-2 ring-[#eccb76]' : 'border-transparent opacity-80'}`}
                      title={`Màu ${c}`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Tên bạn / Biệt danh *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Hoàng Minh"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                  {formErrors.author && (
                    <span className="text-[11px] text-red-400 mt-1 block">{formErrors.author}</span>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Lớp / Khóa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: 12 Chuyên Toán, K30..."
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                  {formErrors.className && (
                    <span className="text-[11px] text-red-400 mt-1 block">{formErrors.className}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Chủ đề mẩu giấy:
                </label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                >
                  <option value="lời chúc 20/11">🌸 Lời chúc 20/11</option>
                  <option value="cựu học sinh">🎓 Cựu học sinh các khóa</option>
                  <option value="kỷ niệm vui">🎒 Kỷ niệm học trò</option>
                  <option value="thơ văn tri ân">✍️ Thơ & Tản văn tri ân</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Nội dung mẩu giấy *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Viết đôi dòng nhắn gửi tới thầy cô, bạn bè hoặc mái trường thân thương..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3.5 py-2.5 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d] resize-none"
                />
                {formErrors.content && (
                  <span className="text-[11px] text-red-400 mt-1 block">{formErrors.content}</span>
                )}
              </div>

              {/* Live Mini Preview */}
              <div className="pt-1">
                <span className="text-[11px] text-[#b8ad95] block mb-1">Xem trước mẩu giấy:</span>
                <div className={`p-3 rounded-lg border text-xs ${getColorClasses(color)}`}>
                  <div className="flex justify-between text-[10px] opacity-75 mb-1 font-mono">
                    <span>{className || 'Lớp của bạn'}</span>
                    <span>#{tag}</span>
                  </div>
                  <p className="font-serif-vintage italic">
                    &ldquo;{content || 'Nội dung mẩu giấy sẽ xuất hiện tại đây...'}&rdquo;
                  </p>
                  <div className="text-right text-[11px] font-script-calligraphy mt-1">
                    ✍️ {author || 'Tên bạn'}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#2a4332]">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-4 py-2 text-xs font-medium text-[#c0b59b] hover:text-white rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-[#1a160f] bg-[#e4c77d] hover:bg-[#ebd79b] rounded-lg cursor-pointer shadow-md"
                >
                  Dán lên bảng Padlet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Note */}
      {editingNote && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#142318] border border-[#3b5e46] rounded-3xl max-w-lg w-full p-6 text-[#eae3d2] shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#2a4332] mb-4">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#e4c77d]" />
                <h3 className="text-lg font-serif-vintage font-bold text-[#f7eedc]">
                  Chỉnh Sửa Mẩu Giấy Kỷ Niệm
                </h3>
              </div>
              <button
                onClick={() => setEditingNote(null)}
                className="p-1 rounded-lg text-[#a99e87] hover:text-white hover:bg-[#25392b] transition-all cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#cfc5aa] block mb-1">
                    Họ và tên tác giả *
                  </label>
                  <input
                    type="text"
                    required
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    placeholder="VD: Nguyễn Văn An"
                    className="w-full bg-[#0d1710] border border-[#2b4433] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#eccb76]"
                  />
                  {editErrors.author && (
                    <span className="text-[11px] text-red-400 mt-0.5 block">{editErrors.author}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#cfc5aa] block mb-1">
                    Lớp / Niên khóa / Khối *
                  </label>
                  <input
                    type="text"
                    required
                    value={editClassName}
                    onChange={(e) => setEditClassName(e.target.value)}
                    placeholder="VD: 12 Chuyên Toán (K28)"
                    className="w-full bg-[#0d1710] border border-[#2b4433] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#eccb76]"
                  />
                  {editErrors.className && (
                    <span className="text-[11px] text-red-400 mt-0.5 block">{editErrors.className}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#cfc5aa] block mb-1.5">
                  Màu giấy ghi chú
                </label>
                <div className="flex gap-2">
                  {(['yellow', 'pink', 'cyan', 'purple', 'orange'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEditColor(c)}
                      className={`w-9 h-9 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-center ${
                        editColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-80 hover:opacity-100'
                      } ${getColorClasses(c)}`}
                    >
                      {editColor === c && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#cfc5aa] block mb-1">
                  Chủ đề mẩu giấy
                </label>
                <select
                  value={editTag}
                  onChange={(e) => setEditTag(e.target.value)}
                  className="w-full bg-[#0d1710] border border-[#2b4433] rounded-xl px-3 py-2 text-xs text-[#eae3d2] focus:outline-hidden focus:border-[#eccb76]"
                >
                  <option value="lời chúc 20/11">🌸 Lời Chúc 20/11</option>
                  <option value="cựu học sinh">🎓 Cựu Học Sinh Các Khóa</option>
                  <option value="kỷ niệm vui">🎒 Kỷ Niệm Học Trò</option>
                  <option value="thơ văn tri ân">✍️ Thơ & Tản Văn</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#cfc5aa] block mb-1">
                  Nội dung mẩu giấy *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Viết nội dung lời chúc, kỷ niệm hoặc tản văn của bạn..."
                  className="w-full bg-[#0d1710] border border-[#2b4433] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#eccb76] resize-none"
                />
                {editErrors.content && (
                  <span className="text-[11px] text-red-400 mt-0.5 block">{editErrors.content}</span>
                )}
              </div>

              {/* Live Mini Preview */}
              <div className="pt-1">
                <span className="text-[11px] text-[#b8ad95] block mb-1">Xem trước mẩu giấy sau khi chỉnh sửa:</span>
                <div className={`p-3.5 rounded-lg border text-xs shadow-md ${getColorClasses(editColor)}`}>
                  <div className="flex justify-between text-[10px] opacity-75 mb-1 font-mono">
                    <span>{editClassName || 'Lớp của bạn'}</span>
                    <span>#{editTag}</span>
                  </div>
                  <p className="font-serif-vintage italic whitespace-pre-line">
                    &ldquo;{editContent || 'Nội dung mẩu giấy...'}&rdquo;
                  </p>
                  <div className="text-right text-[11px] font-script-calligraphy mt-1">
                    ✍️ {editAuthor || 'Tên bạn'}
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-[#2a4332]">
                {isConfirmingDelete ? (
                  <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/50 px-3 py-1.5 rounded-xl animate-in fade-in">
                    <span className="text-xs text-red-200 font-semibold">Chắc chắn xóa?</span>
                    <button
                      type="button"
                      onClick={() => handleConfirmDelete(editingNote.id)}
                      className="px-3 py-1 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      Xóa ngay
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(false)}
                      className="px-2 py-1 text-xs text-[#cfc5aa] hover:text-white rounded-lg cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg cursor-pointer flex items-center gap-1.5 transition-all"
                    title="Xóa mẩu giấy này khỏi bảng"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa mẩu giấy</span>
                  </button>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingNote(null)}
                    className="px-4 py-2 text-xs font-medium text-[#c0b59b] hover:text-white rounded-lg cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-[#1a160f] bg-[#e4c77d] hover:bg-[#ebd79b] rounded-lg cursor-pointer shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu Thay Đổi</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

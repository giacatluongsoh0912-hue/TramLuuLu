import React, { useState } from 'react';
import { Feather, Heart, Search, Sparkles, Filter, X } from 'lucide-react';
import { TributeMessage, filterTributes, formatTributeDate, validateTributeMessage } from '../utils/tributeRules';

interface GuestbookSectionProps {
  tributes: TributeMessage[];
  onAddTribute: (tribute: TributeMessage) => void;
  isComposerOpen: boolean;
  onCloseComposer: () => void;
  onOpenComposer: () => void;
  preselectedRecipient?: string;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  tributes,
  onAddTribute,
  isComposerOpen,
  onCloseComposer,
  onOpenComposer,
  preselectedRecipient,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [likesState, setLikesState] = useState<Record<string, number>>({});

  // Form State
  const [senderName, setSenderName] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [recipient, setRecipient] = useState(preselectedRecipient || '');
  const [department, setDepartment] = useState('Toàn trường');
  const [content, setContent] = useState('');
  const [paperTheme, setPaperTheme] = useState<'parchment' | 'kraft' | 'blackboard' | 'flower'>('parchment');
  const [gift, setGift] = useState<'ban-flower' | 'sunflower' | 'chalk' | 'candle'>('ban-flower');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Update recipient if changed via props
  React.useEffect(() => {
    if (preselectedRecipient) {
      setRecipient(preselectedRecipient);
    }
  }, [preselectedRecipient]);

  const filtered = filterTributes(tributes, {
    department: selectedDept,
    searchQuery: searchQuery,
  });

  const handleLike = (id: string, initialLikes: number) => {
    setLikesState((prev) => {
      const current = prev[id] !== undefined ? prev[id] : initialLikes;
      return { ...prev, [id]: current + 1 };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateTributeMessage({
      senderName,
      affiliation,
      recipient,
      content,
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    const newTribute: TributeMessage = {
      id: 'trib-' + Date.now(),
      senderName: senderName.trim(),
      affiliation: affiliation.trim(),
      recipient: recipient.trim(),
      department: department.trim(),
      content: content.trim(),
      paperTheme,
      gift,
      createdAt: Date.now(),
      likes: 1,
    };

    onAddTribute(newTribute);
    setFormErrors({});
    setContent('');
    onCloseComposer();
  };

  const getThemeStyle = (theme: string) => {
    switch (theme) {
      case 'kraft':
        return 'bg-[#d6c7b2] text-[#241e16] border-[#baa991]';
      case 'blackboard':
        return 'bg-[#1b2b20] text-[#e8f2ea] border-[#385942]';
      case 'flower':
        return 'bg-[#faf5eb] text-[#2c2217] border-[#e8dcc8]';
      case 'parchment':
      default:
        return 'bg-[#f4ebd9] text-[#251e15] border-[#d8caa8]';
    }
  };

  const renderGiftBadge = (giftType: string) => {
    switch (giftType) {
      case 'ban-flower':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7a5933]">🌸 Cành hoa ban trắng</span>;
      case 'sunflower':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8c6516]">🌻 Hoa hướng dương</span>;
      case 'chalk':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4a6350]">✏️ Viên phấn trắng thân thương</span>;
      case 'candle':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#99551c]">🕯️ Ngọn nến tri ân</span>;
      default:
        return null;
    }
  };

  return (
    <section id="guestbook" className="py-16 bg-[#16221a] relative border-b border-[#25382b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#2b4232]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#eccb76] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sổ tay lưu niệm</span>
            </div>
            <h2 className="font-serif-vintage text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Sổ Lưu Bút Tri Ân Thầy Cô
            </h2>
            <p className="text-sm text-[#b6ab93] mt-2 max-w-2xl font-body">
              Những dòng tâm tình mộc mạc của các thế hệ học sinh Chuyên Sơn La gửi về nơi đã chắp cánh cho bao ước mơ tuổi mười tám.
            </p>
          </div>

          <button
            onClick={onOpenComposer}
            className="px-5 py-3 rounded-full bg-[#cbbaa1] hover:bg-[#d9ccb6] text-[#1c1810] font-semibold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2.5 cursor-pointer shrink-0 border border-[#dfd2be] active:scale-95"
          >
            <Feather className="w-4 h-4 text-[#3a2c1d]" />
            <span>Viết lời tri ân của bạn</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8a998e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm theo tên học sinh, lớp, thầy cô hoặc từ khóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111c15] border border-[#2d4635] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#ede6d4] focus:outline-hidden focus:border-[#e4c77d] placeholder:text-[#6a7c70]"
            />
          </div>

          {/* Department Filter Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#bfa575]" />
            <span className="text-xs text-[#cfc5aa] font-medium hidden sm:inline">Lọc theo:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-[#111c15] border border-[#2d4635] text-[#ede6d4] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#e4c77d] cursor-pointer"
            >
              <option value="all">Tất cả các tổ ({tributes.length})</option>
              <option value="Toán">Tổ Toán - Tin</option>
              <option value="Văn">Tổ Ngữ Văn</option>
              <option value="Lý">Tổ Vật Lý</option>
              <option value="Hóa">Tổ Hóa Học</option>
              <option value="Sinh">Tổ Sinh Học</option>
              <option value="Ngoại Ngữ">Tổ Ngoại Ngữ</option>
              <option value="Sử - Địa">Tổ Sử - Địa</option>
              <option value="Ban Giám Hiệu">Ban Giám Hiệu</option>
              <option value="Toàn trường">Toàn trường</option>
            </select>
          </div>
        </div>

        {/* Tributes List / Wall */}
        {filtered.length === 0 ? (
          <div className="bg-[#121c16] rounded-2xl p-12 text-center border border-[#263c2c]">
            <p className="font-serif-vintage text-base text-[#cfc5aa]">
              Chưa có lời tri ân nào phù hợp với tìm kiếm của bạn.
            </p>
            <p className="text-xs text-[#7e8f82] mt-1">
              Hãy là người đầu tiên để lại những dòng lưu bút gửi thầy cô!
            </p>
            <button
              onClick={onOpenComposer}
              className="mt-4 px-4 py-2 rounded-lg bg-[#27402f] text-xs font-semibold text-[#f5ebd5] hover:bg-[#32523d] transition-colors cursor-pointer"
            >
              Viết lời tri ân ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filtered.map((item) => {
              const likes = likesState[item.id] !== undefined ? likesState[item.id] : item.likes;
              const themeCls = getThemeStyle(item.paperTheme);

              return (
                <div
                  key={item.id}
                  className={`rounded-xl p-6 border shadow-lg relative flex flex-col justify-between transition-all hover:shadow-xl ${themeCls}`}
                >
                  {/* Stamp & Header */}
                  <div>
                    <div className="flex items-start justify-between gap-4 pb-3 border-b border-black/10">
                      <div>
                        <div className="text-[11px] font-mono tracking-wider opacity-75 uppercase">
                          Gửi đến: <span className="font-bold underline">{item.recipient}</span>
                        </div>
                        <span className="text-xs font-semibold block mt-0.5 opacity-90">
                          {item.department !== 'Toàn trường' ? `Tổ ${item.department}` : 'Mái trường Chuyên Sơn La'}
                        </span>
                      </div>

                      {/* Postage Stamp Aesthetic */}
                      <div className="px-2 py-1 rounded-xs border-2 border-dashed border-black/25 text-[10px] font-mono uppercase tracking-widest text-center shrink-0 opacity-80">
                        SON LA · 20/11
                      </div>
                    </div>

                    {/* Tribute Body */}
                    <div className="my-4">
                      <p className="font-serif-vintage text-sm sm:text-base leading-relaxed italic whitespace-pre-line">
                        &ldquo;{item.content}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Sender, Gift & Like */}
                  <div className="pt-3 border-t border-black/10 flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <div className="font-script-calligraphy text-base sm:text-lg font-bold">
                        {item.senderName}
                      </div>
                      <div className="text-[11px] opacity-75">
                        {item.affiliation} · {formatTributeDate(item.createdAt)}
                      </div>
                      <div className="mt-1">
                        {renderGiftBadge(item.gift)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleLike(item.id, item.likes)}
                      className="px-3 py-1.5 rounded-full bg-black/10 hover:bg-black/15 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Thả tim đồng cảm"
                    >
                      <Heart className="w-3.5 h-3.5 fill-[#a83232] text-[#a83232]" />
                      <span className="font-mono">{likes}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Composer Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#1b2c21] border border-[#3b5d44] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={onCloseComposer}
              className="absolute top-5 right-5 text-[#cfc5aa] hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-[#cbbaa1] text-[#1e1a12] flex items-center justify-center font-bold">
                <Feather className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-vintage text-xl sm:text-2xl font-bold text-white">
                  Gửi Lời Tri Ân Thầy Cô
                </h3>
                <p className="text-xs text-[#b8ad95]">
                  Lời nhắn của bạn sẽ được trang trọng lưu giữ trong sổ lưu bút số
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Họ và tên của bạn *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Minh Đức"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                  {formErrors.senderName && (
                    <span className="text-[11px] text-red-400 mt-1 block">{formErrors.senderName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Lớp / Niên khóa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: K30 Chuyên Toán (2021-2024)"
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                  {formErrors.affiliation && (
                    <span className="text-[11px] text-red-400 mt-1 block">{formErrors.affiliation}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Người nhận *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Cô Lan Hương, Thầy Cường..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                  {formErrors.recipient && (
                    <span className="text-[11px] text-red-400 mt-1 block">{formErrors.recipient}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Tổ chuyên môn
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  >
                    <option value="Toàn trường">Toàn trường / Toàn thể Thầy Cô</option>
                    <option value="Toán">Tổ Toán - Tin</option>
                    <option value="Văn">Tổ Ngữ Văn</option>
                    <option value="Lý">Tổ Vật Lý</option>
                    <option value="Hóa">Tổ Hóa Học</option>
                    <option value="Sinh">Tổ Sinh Học</option>
                    <option value="Ngoại Ngữ">Tổ Ngoại Ngữ</option>
                    <option value="Sử - Địa">Tổ Sử - Địa</option>
                    <option value="Ban Giám Hiệu">Ban Giám Hiệu</option>
                  </select>
                </div>
              </div>

              {/* Theme & Gift Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Chất liệu giấy lưu bút
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaperTheme('parchment')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        paperTheme === 'parchment'
                          ? 'border-[#eccb76] bg-[#f4ebd9] text-[#251e15] font-bold'
                          : 'border-[#334e3a] bg-[#142017] text-[#cfc5aa]'
                      }`}
                    >
                      📜 Giấy cổ điển
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperTheme('kraft')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        paperTheme === 'kraft'
                          ? 'border-[#eccb76] bg-[#d6c7b2] text-[#241e16] font-bold'
                          : 'border-[#334e3a] bg-[#142017] text-[#cfc5aa]'
                      }`}
                    >
                      📦 Giấy Kraft
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperTheme('flower')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        paperTheme === 'flower'
                          ? 'border-[#eccb76] bg-[#faf5eb] text-[#2c2217] font-bold'
                          : 'border-[#334e3a] bg-[#142017] text-[#cfc5aa]'
                      }`}
                    >
                      🌸 Hoa ép khô
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperTheme('blackboard')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        paperTheme === 'blackboard'
                          ? 'border-[#eccb76] bg-[#22392b] text-white font-bold'
                          : 'border-[#334e3a] bg-[#142017] text-[#cfc5aa]'
                      }`}
                    >
                      🎓 Bảng phấn
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Gửi kèm món quà tinh thần
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setGift('ban-flower')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        gift === 'ban-flower'
                          ? 'border-[#eccb76] bg-[#283e30] text-[#eccb76] font-bold'
                          : 'border-[#334e3a] bg-[#142017] text-[#cfc5aa]'
                      }`}
                    >
                      🌸 Hoa ban trắng
                    </button>
                    <button
                      type="button"
                      onClick={() => setGift('sunflower')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        gift === 'sunflower'
                          ? 'border-[#eccb76] bg-[#283e30] text-[#eccb76] font-bold'
                          : 'border-[#334e3a] bg-[#142017] text-[#cfc5aa]'
                      }`}
                    >
                      🌻 Hướng dương
                    </button>
                    <button
                      type="button"
                      onClick={() => setGift('chalk')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        gift === 'chalk'
                          ? 'border-[#eccb76] bg-[#283e30] text-[#eccb76] font-bold'
                          : 'border-[#334e3a] bg-[#142017] text-[#cfc5aa]'
                      }`}
                    >
                      ✏️ Viên phấn
                    </button>
                    <button
                      type="button"
                      onClick={() => setGift('candle')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        gift === 'candle'
                          ? 'border-[#eccb76] bg-[#283e30] text-[#eccb76] font-bold'
                          : 'border-[#334e3a] bg-[#142017] text-[#cfc5aa]'
                      }`}
                    >
                      🕯️ Ngọn nến
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Lời tâm tình tri ân gửi thầy cô *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Viết những lời tri ân chân thành, những kỷ niệm khó quên, lời cảm ơn người đã dìu dắt bạn..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3.5 py-2.5 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d] resize-none"
                />
                {formErrors.content && (
                  <span className="text-[11px] text-red-400 mt-1 block">{formErrors.content}</span>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onCloseComposer}
                  className="px-4 py-2 text-xs font-medium text-[#c0b59b] hover:text-white rounded-lg cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-[#1a160f] bg-[#e4c77d] hover:bg-[#ebd79b] rounded-lg cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Feather className="w-4 h-4" />
                  <span>Gửi Lưu Bút</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

import React, { useState } from 'react';
import { Feather, Heart, Search, Sparkles, Filter, X, Edit2, Trash2, Check, Save } from 'lucide-react';
import { TributeMessage, filterTributes, formatTributeDate, validateTributeMessage } from '../utils/tributeRules';

interface GuestbookSectionProps {
  tributes: TributeMessage[];
  onAddTribute: (tribute: TributeMessage) => void;
  onUpdateTribute?: (tribute: TributeMessage) => void;
  onDeleteTribute?: (id: string) => void;
  isComposerOpen: boolean;
  onCloseComposer: () => void;
  onOpenComposer: () => void;
  preselectedRecipient?: string;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  tributes,
  onAddTribute,
  onUpdateTribute,
  onDeleteTribute,
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

  // Edit Tribute State
  const [editingTribute, setEditingTribute] = useState<TributeMessage | null>(null);
  const [editSenderName, setEditSenderName] = useState('');
  const [editAffiliation, setEditAffiliation] = useState('');
  const [editRecipient, setEditRecipient] = useState('');
  const [editDepartment, setEditDepartment] = useState('Toàn trường');
  const [editContent, setEditContent] = useState('');
  const [editPaperTheme, setEditPaperTheme] = useState<'parchment' | 'kraft' | 'blackboard' | 'flower'>('parchment');
  const [editGift, setEditGift] = useState<'ban-flower' | 'sunflower' | 'chalk' | 'candle'>('ban-flower');
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => {
      setToastNotice(null);
    }, 3500);
  };

  const handleOpenEdit = (trib: TributeMessage) => {
    setEditingTribute(trib);
    setEditSenderName(trib.senderName);
    setEditAffiliation(trib.affiliation);
    setEditRecipient(trib.recipient);
    setEditDepartment(trib.department);
    setEditContent(trib.content);
    setEditPaperTheme(trib.paperTheme);
    setEditGift(trib.gift);
    setEditErrors({});
    setIsConfirmingDelete(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTribute) return;
    const validation = validateTributeMessage({
      senderName: editSenderName,
      affiliation: editAffiliation,
      recipient: editRecipient,
      content: editContent,
    });
    if (!validation.isValid) {
      setEditErrors(validation.errors);
      return;
    }

    const updated: TributeMessage = {
      ...editingTribute,
      senderName: editSenderName.trim(),
      affiliation: editAffiliation.trim(),
      recipient: editRecipient.trim(),
      department: editDepartment.trim(),
      content: editContent.trim(),
      paperTheme: editPaperTheme,
      gift: editGift,
    };

    if (onUpdateTribute) {
      onUpdateTribute(updated);
    }
    setEditingTribute(null);
    showToast('Đã lưu thay đổi bức lưu bút.');
  };

  const handleConfirmDelete = (id: string) => {
    if (onDeleteTribute) {
      onDeleteTribute(id);
    }
    setEditingTribute(null);
    setIsConfirmingDelete(false);
    setDeletingCardId(null);
    showToast('Đã xóa bức lưu bút thành công.');
  };

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
    <section id="guestbook" className="py-16 bg-[#0c160f]/80 backdrop-blur-md relative border-b border-[#25382b]/80">
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

        {/* Toast Feedback Notice */}
        {toastNotice && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs text-center font-medium shadow-lg animate-in fade-in duration-300">
            ✨ {toastNotice}
          </div>
        )}

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
              <option value="Ban Giám Hiệu">Ban Giám Hiệu</option>
              <option value="Toán - Tin">Tổ Toán - Tin học</option>
              <option value="Ngữ Văn">Tổ Ngữ Văn</option>
              <option value="Vật lý">Tổ Vật lý</option>
              <option value="Hoá - Thiết bị">Tổ Hoá - Thiết bị</option>
              <option value="Sinh - Công nghệ">Tổ Sinh - Công nghệ</option>
              <option value="Âm nhạc - Ngoại ngữ">Tổ Âm nhạc - Ngoại ngữ</option>
              <option value="Lịch sử địa lí">Tổ Lịch sử địa lí</option>
              <option value="GDTC - GDQPAN">Tổ GDTC - GDQPAN</option>
              <option value="Văn phòng - GDKT và PL">Văn phòng - GDKT và PL</option>
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

                      {/* Postage Stamp Aesthetic, Quick Edit & Delete */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {deletingCardId === item.id ? (
                          <div className="flex items-center gap-1 bg-red-900/90 text-white px-2 py-0.5 rounded text-[11px] font-sans border border-red-500 shadow-md animate-in fade-in">
                            <span className="font-semibold text-red-100">Xóa?</span>
                            <button
                              onClick={() => handleConfirmDelete(item.id)}
                              className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 font-bold rounded cursor-pointer"
                              title="Xác nhận xóa bức này"
                            >
                              Xóa
                            </button>
                            <button
                              onClick={() => setDeletingCardId(null)}
                              className="px-1 py-0.5 text-white/80 hover:text-white cursor-pointer"
                              title="Hủy"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="px-2 py-1 rounded-md bg-black/10 hover:bg-black/20 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer opacity-85 hover:opacity-100"
                              title="Chỉnh sửa tên thầy cô hoặc lời chúc"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Sửa</span>
                            </button>

                            <button
                              onClick={() => setDeletingCardId(item.id)}
                              className="p-1 rounded-md bg-black/10 hover:bg-red-950/40 text-black/60 hover:text-red-500 transition-colors cursor-pointer"
                              title="Xóa bức lưu bút này"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        )}

                        <div className="px-2 py-1 rounded-xs border-2 border-dashed border-black/25 text-[10px] font-mono uppercase tracking-widest text-center shrink-0 opacity-80">
                          SON LA · 20/11
                        </div>
                      </div>
                    </div>

                    {/* Tribute Body */}
                    <div className="my-4">
                      <p className="font-serif-vintage text-sm sm:text-base leading-relaxed italic whitespace-pre-line">
                        &ldquo;{item.content}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Sender, Gift & Actions */}
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

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        title="Chỉnh sửa tên thầy cô, người gửi hoặc lời nhắn"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Chỉnh sửa</span>
                      </button>

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
                    <option value="Ban Giám Hiệu">Ban Giám Hiệu</option>
                    <option value="Toán - Tin">Tổ Toán - Tin học</option>
                    <option value="Ngữ Văn">Tổ Ngữ Văn</option>
                    <option value="Vật lý">Tổ Vật lý</option>
                    <option value="Hoá - Thiết bị">Tổ Hoá - Thiết bị</option>
                    <option value="Sinh - Công nghệ">Tổ Sinh - Công nghệ</option>
                    <option value="Âm nhạc - Ngoại ngữ">Tổ Âm nhạc - Ngoại ngữ</option>
                    <option value="Lịch sử địa lí">Tổ Lịch sử địa lí</option>
                    <option value="GDTC - GDQPAN">Tổ GDTC - GDQPAN</option>
                    <option value="Văn phòng - GDKT và PL">Văn phòng - GDKT và PL</option>
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

      {/* Modal: Edit Tribute */}
      {editingTribute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#18281e] border border-[#3d6248] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-[#ece5d4] animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditingTribute(null)}
              className="absolute top-5 right-5 text-[#cfc5aa] hover:text-white p-1 rounded-lg cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-[#cbbaa1] text-[#1e1a12] flex items-center justify-center font-bold">
                <Edit2 className="w-4 h-4 text-[#1e1a12]" />
              </div>
              <div>
                <h3 className="font-serif-vintage text-xl sm:text-2xl font-bold text-white">
                  Chỉnh Sửa Bức Lưu Bút Tri Ân
                </h3>
                <p className="text-xs text-[#a9b8ad]">
                  Tùy chỉnh tên thầy cô nhận lưu bút, tổ chuyên môn và lời nhắn gửi theo trường của bạn.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Gửi đến Thầy / Cô (hoặc tập thể) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editRecipient}
                    onChange={(e) => setEditRecipient(e.target.value)}
                    placeholder="VD: Cô Nguyễn Thị Hoa / Thầy Hiệu trưởng"
                    className="w-full bg-[#101b13] border border-[#2b4433] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#e4c77d]"
                  />
                  {editErrors.recipient && (
                    <span className="text-[11px] text-red-400 mt-1 block">{editErrors.recipient}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Tổ chuyên môn
                  </label>
                  <select
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full bg-[#101b13] border border-[#2b4433] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  >
                    <option value="Toàn trường">Toàn trường / Toàn thể Thầy Cô</option>
                    <option value="Ban Giám Hiệu">Ban Giám Hiệu</option>
                    <option value="Toán - Tin">Tổ Toán - Tin học</option>
                    <option value="Ngữ Văn">Tổ Ngữ Văn</option>
                    <option value="Vật lý">Tổ Vật lý</option>
                    <option value="Hoá - Thiết bị">Tổ Hoá - Thiết bị</option>
                    <option value="Sinh - Công nghệ">Tổ Sinh - Công nghệ</option>
                    <option value="Âm nhạc - Ngoại ngữ">Tổ Âm nhạc - Ngoại ngữ</option>
                    <option value="Lịch sử địa lí">Tổ Lịch sử địa lí</option>
                    <option value="GDTC - GDQPAN">Tổ GDTC - GDQPAN</option>
                    <option value="Văn phòng - GDKT và PL">Văn phòng - GDKT và PL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Họ và tên của bạn (Tác giả) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editSenderName}
                    onChange={(e) => setEditSenderName(e.target.value)}
                    placeholder="VD: Hoàng Minh Đức"
                    className="w-full bg-[#101b13] border border-[#2b4433] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#e4c77d]"
                  />
                  {editErrors.senderName && (
                    <span className="text-[11px] text-red-400 mt-1 block">{editErrors.senderName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Lớp / Niên khóa / Khối *
                  </label>
                  <input
                    type="text"
                    required
                    value={editAffiliation}
                    onChange={(e) => setEditAffiliation(e.target.value)}
                    placeholder="VD: Chuyên Toán K28 / Cựu học sinh"
                    className="w-full bg-[#101b13] border border-[#2b4433] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#e4c77d]"
                  />
                  {editErrors.affiliation && (
                    <span className="text-[11px] text-red-400 mt-1 block">{editErrors.affiliation}</span>
                  )}
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
                      onClick={() => setEditPaperTheme('parchment')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        editPaperTheme === 'parchment'
                          ? 'border-[#eccb76] bg-[#f4ebd9] text-[#251e15] font-bold'
                          : 'border-[#2c4735] bg-[#101b13] text-[#cfc5aa]'
                      }`}
                    >
                      📜 Giấy cổ điển
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditPaperTheme('flower')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        editPaperTheme === 'flower'
                          ? 'border-[#f4aab7] bg-[#fdf2f4] text-[#421b24] font-bold'
                          : 'border-[#2c4735] bg-[#101b13] text-[#cfc5aa]'
                      }`}
                    >
                      🌸 Cánh hoa ban
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditPaperTheme('kraft')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        editPaperTheme === 'kraft'
                          ? 'border-[#d4a373] bg-[#f3e5d0] text-[#3e2714] font-bold'
                          : 'border-[#2c4735] bg-[#101b13] text-[#cfc5aa]'
                      }`}
                    >
                      🪵 Giấy Kraft mộc
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditPaperTheme('blackboard')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        editPaperTheme === 'blackboard'
                          ? 'border-[#8ea293] bg-[#1d3023] text-white font-bold'
                          : 'border-[#2c4735] bg-[#101b13] text-[#cfc5aa]'
                      }`}
                    >
                      🌱 Bảng xanh phấn trắng
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Món quà tri ân gửi kèm
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setEditGift('ban-flower')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        editGift === 'ban-flower'
                          ? 'border-[#eccb76] bg-[#22392b] text-[#f8ecd2] font-bold'
                          : 'border-[#2c4735] bg-[#101b13] text-[#cfc5aa]'
                      }`}
                    >
                      🌸 Nhành hoa ban
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditGift('sunflower')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        editGift === 'sunflower'
                          ? 'border-[#eccb76] bg-[#22392b] text-[#f8ecd2] font-bold'
                          : 'border-[#2c4735] bg-[#101b13] text-[#cfc5aa]'
                      }`}
                    >
                      🌻 Hướng dương
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditGift('chalk')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        editGift === 'chalk'
                          ? 'border-[#eccb76] bg-[#22392b] text-[#f8ecd2] font-bold'
                          : 'border-[#2c4735] bg-[#101b13] text-[#cfc5aa]'
                      }`}
                    >
                      ✏️ Viên phấn trắng
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditGift('candle')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        editGift === 'candle'
                          ? 'border-[#eccb76] bg-[#22392b] text-[#f8ecd2] font-bold'
                          : 'border-[#2c4735] bg-[#101b13] text-[#cfc5aa]'
                      }`}
                    >
                      🕯️ Ngọn nến ấm
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Nội dung bức lưu bút *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Viết những lời tri ân, kỷ niệm hoặc lời chúc chân thành gửi tới thầy cô..."
                  className="w-full bg-[#101b13] border border-[#2b4433] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#e4c77d] resize-none"
                />
                {editErrors.content && (
                  <span className="text-[11px] text-red-400 mt-1 block">{editErrors.content}</span>
                )}
              </div>

              {/* Live Card Preview */}
              <div className="pt-1">
                <span className="text-[11px] text-[#b8ad95] block mb-1">Xem trước bưu thiếp sau khi sửa:</span>
                <div className={`p-4 rounded-xl border text-xs shadow-md ${getThemeStyle(editPaperTheme)}`}>
                  <div className="flex justify-between pb-2 border-b border-black/10">
                    <div>
                      <div className="text-[10px] font-mono tracking-wider opacity-75 uppercase">
                        Gửi đến: <span className="font-bold underline">{editRecipient || 'Tên Thầy Cô'}</span>
                      </div>
                      <span className="text-[11px] font-semibold block opacity-90">
                        {editDepartment !== 'Toàn trường' ? `Tổ ${editDepartment}` : 'Toàn trường'}
                      </span>
                    </div>
                    <div className="px-1.5 py-0.5 rounded border border-dashed border-black/25 text-[9px] font-mono">
                      SON LA · 20/11
                    </div>
                  </div>
                  <p className="font-serif-vintage italic my-2 leading-relaxed whitespace-pre-line">
                    &ldquo;{editContent || 'Nội dung bức lưu bút...'}&rdquo;
                  </p>
                  <div className="text-right font-script-calligraphy text-sm font-bold">
                    ✍️ {editSenderName || 'Tên bạn'} ({editAffiliation || 'Lớp của bạn'})
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-[#2a4332]">
                {isConfirmingDelete ? (
                  <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/50 px-3 py-1.5 rounded-xl animate-in fade-in">
                    <span className="text-xs text-red-200 font-semibold">Chắc chắn xóa?</span>
                    <button
                      type="button"
                      onClick={() => handleConfirmDelete(editingTribute.id)}
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
                    title="Xóa bức lưu bút này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa lưu bút</span>
                  </button>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTribute(null)}
                    className="px-4 py-2 text-xs font-medium text-[#c0b59b] hover:text-white rounded-lg cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-[#1a160f] bg-[#e4c77d] hover:bg-[#ebd79b] rounded-lg cursor-pointer shadow-md flex items-center gap-1.5"
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

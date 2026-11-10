import React, { useState, useRef } from 'react';
import { Heart, Sparkles, Plus, Image as ImageIcon, X, Camera, Upload, Link, Check, Edit2 } from 'lucide-react';
import { MemoryPhoto } from '../data/memoriesData';

interface MemoryScrapbookProps {
  memories: MemoryPhoto[];
  onAddMemory: (newMemory: MemoryPhoto) => void;
  onUpdateMemory: (updatedMemory: MemoryPhoto) => void;
  onSelectMemory: (memory: MemoryPhoto) => void;
}

export const MemoryScrapbook: React.FC<MemoryScrapbookProps> = ({
  memories,
  onAddMemory,
  onUpdateMemory,
  onSelectMemory,
}) => {
  const [filter, setFilter] = useState<'all' | 'classroom' | 'flower' | 'olympiad' | 'graduation'>('all');
  const [likesState, setLikesState] = useState<Record<string, number>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [editingMemory, setEditingMemory] = useState<MemoryPhoto | null>(null);

  // New memory form state
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('Khóa K31 (2022-2025)');
  const [caption, setCaption] = useState('');
  const [author, setAuthor] = useState('');
  const [newImageSrc, setNewImageSrc] = useState('/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png');
  const [addMethod, setAddMethod] = useState<'upload' | 'url'>('upload');
  const [customUrl, setCustomUrl] = useState('');

  // Editing memory form state
  const [editImageSrc, setEditImageSrc] = useState('');
  const [editMethod, setEditMethod] = useState<'upload' | 'url'>('upload');
  const [editUrl, setEditUrl] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editYear, setEditYear] = useState('');

  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const filteredMemories = memories.filter((m) => {
    if (filter === 'all') return true;
    return m.category === filter;
  });

  const handleToggleLike = (id: string, initialLikes: number) => {
    setLikesState((prev) => {
      const current = prev[id] !== undefined ? prev[id] : initialLikes;
      return { ...prev, [id]: current + 1 };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (isEditing) {
          setEditImageSrc(reader.result);
        } else {
          setNewImageSrc(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenEdit = (mem: MemoryPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMemory(mem);
    setEditImageSrc(mem.imageSrc);
    setEditTitle(mem.title);
    setEditCaption(mem.caption);
    setEditYear(mem.year);
    setEditUrl(mem.imageSrc.startsWith('data:') ? '' : mem.imageSrc);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMemory) return;

    const finalImage = editMethod === 'url' && editUrl.trim() ? editUrl.trim() : editImageSrc;

    const updated: MemoryPhoto = {
      ...editingMemory,
      title: editTitle.trim() || editingMemory.title,
      caption: editCaption.trim() || editingMemory.caption,
      year: editYear.trim() || editingMemory.year,
      imageSrc: finalImage || editingMemory.imageSrc,
    };

    onUpdateMemory(updated);
    setEditingMemory(null);
  };

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !caption.trim() || !author.trim()) return;

    const finalImage = addMethod === 'url' && customUrl.trim() ? customUrl.trim() : newImageSrc;

    const newMem: MemoryPhoto = {
      id: 'mem-' + Date.now(),
      title: title.trim(),
      year: year.trim(),
      category: filter === 'all' ? 'classroom' : filter,
      caption: caption.trim(),
      author: author.trim(),
      imageSrc: finalImage,
      tags: ['Kỷ niệm mới', 'Chuyên Sơn La'],
      likes: 1,
    };

    onAddMemory(newMem);
    setTitle('');
    setCaption('');
    setAuthor('');
    setCustomUrl('');
    setNewImageSrc('/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png');
    setIsAdding(false);
  };

  return (
    <section id="scrapbook" className="py-16 bg-[#16221a] relative border-b border-[#25382b]">
      {/* Decorative Scrapbook Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#2d4434]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#eccb76] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cuốn album thanh xuân</span>
            </div>
            <h2 className="font-serif-vintage text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Lật Giở Ký Ức Chuyên Sơn La
            </h2>
            <p className="text-sm text-[#b6ab93] mt-2 max-w-2xl font-body">
              Từng tấm ảnh polaroid, từng mẩu giấy ố vàng ghi lại những năm tháng thanh xuân rực rỡ nhất dưới chân núi sam si cùng thầy cô và bè bạn.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2.5 rounded-lg bg-[#27402f] hover:bg-[#32523d] text-[#f2edd9] text-xs font-semibold border border-[#3e664b] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#eccb76]" />
              <span>Góp thêm khoảnh khắc</span>
            </button>
          </div>
        </div>

        {/* Interactive Filter Tabs - Clean Segmented Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-medium no-scrollbar">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              filter === 'all'
                ? 'bg-[#cbbaa1] text-[#19150e] font-bold shadow-md'
                : 'bg-[#1e2e23] text-[#cfc8b4] hover:bg-[#25382b]'
            }`}
          >
            Tất Cả Kỷ Niệm ({memories.length})
          </button>
          <button
            onClick={() => setFilter('classroom')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              filter === 'classroom'
                ? 'bg-[#cbbaa1] text-[#19150e] font-bold shadow-md'
                : 'bg-[#1e2e23] text-[#cfc8b4] hover:bg-[#25382b]'
            }`}
          >
            Bục Giảng Thân Thương
          </button>
          <button
            onClick={() => setFilter('flower')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              filter === 'flower'
                ? 'bg-[#cbbaa1] text-[#19150e] font-bold shadow-md'
                : 'bg-[#1e2e23] text-[#cfc8b4] hover:bg-[#25382b]'
            }`}
          >
            Mùa Hoa Ban Nở
          </button>
          <button
            onClick={() => setFilter('olympiad')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              filter === 'olympiad'
                ? 'bg-[#cbbaa1] text-[#19150e] font-bold shadow-md'
                : 'bg-[#1e2e23] text-[#cfc8b4] hover:bg-[#25382b]'
            }`}
          >
            Thao Thức Đội Tuyển HSG
          </button>
          <button
            onClick={() => setFilter('graduation')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              filter === 'graduation'
                ? 'bg-[#cbbaa1] text-[#19150e] font-bold shadow-md'
                : 'bg-[#1e2e23] text-[#cfc8b4] hover:bg-[#25382b]'
            }`}
          >
            Lễ Tri Ân & Trưởng Thành
          </button>
        </div>

        {/* Polaroid Scrapbook Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMemories.map((mem, index) => {
            const rot = index % 3 === 0 ? '-rotate-1' : index % 3 === 1 ? 'rotate-1' : 'rotate-0';
            const likes = likesState[mem.id] !== undefined ? likesState[mem.id] : mem.likes;

            return (
              <div
                key={mem.id}
                className={`group relative bg-[#f6f2e6] rounded-sm p-4 pt-6 pb-5 shadow-xl hover:shadow-2xl transition-all duration-300 transform ${rot} hover:rotate-0 hover:-translate-y-1.5 flex flex-col justify-between`}
              >
                {/* Vintage Washi Tape Top */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#d9c49a]/80 backdrop-blur-xs border-dashed border-t border-b border-[#bfa575] opacity-90 shadow-xs pointer-events-none z-10"
                  aria-hidden="true"
                />

                {/* Edit Photo Quick Button on Card */}
                <button
                  onClick={(e) => handleOpenEdit(mem, e)}
                  title="Thay đổi ảnh hoặc sửa nội dung kỷ niệm"
                  className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-[#1b2b20]/80 hover:bg-[#1b2b20] text-[#f6eedc] hover:text-[#eccb76] transition-all opacity-80 hover:opacity-100 shadow-md cursor-pointer border border-[#eccb76]/40"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>

                <div>
                  {/* Photo Frame Container */}
                  <div
                    onClick={() => onSelectMemory(mem)}
                    className="relative aspect-4/3 bg-[#1e2c22] rounded-xs overflow-hidden cursor-pointer group-hover:opacity-95 transition-opacity"
                  >
                    <img
                      src={mem.imageSrc}
                      alt={mem.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                      <span className="text-[11px] text-[#f7e6a1] font-semibold flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" />
                        Xem trọn vẹn
                      </span>
                      <button
                        onClick={(e) => handleOpenEdit(mem, e)}
                        className="px-2 py-1 rounded bg-[#eccb76] text-[#1a160f] text-[10px] font-bold shadow hover:bg-white transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Đổi ảnh</span>
                      </button>
                    </div>
                  </div>

                  {/* Caption & Story */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] text-[#7d705c] font-mono pb-1 border-b border-[#ded7c3]">
                      <span>{mem.year}</span>
                      <span>Chuyên Sơn La</span>
                    </div>
                    <h3
                      onClick={() => onSelectMemory(mem)}
                      className="font-serif-vintage text-lg font-bold text-[#231e16] mt-2 group-hover:text-[#6a4f1a] transition-colors cursor-pointer"
                    >
                      {mem.title}
                    </h3>
                    <p className="font-body text-xs text-[#4d4233] mt-2 leading-relaxed line-clamp-3">
                      {mem.caption}
                    </p>
                  </div>
                </div>

                {/* Footer of Polaroid: Author & Hearts & Quick Edit */}
                <div className="mt-4 pt-3 border-t border-[#ded7c3] flex items-center justify-between">
                  <span className="font-script-calligraphy text-sm font-bold text-[#5c4a30]">
                    ✍️ {mem.author}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleOpenEdit(mem, e)}
                      className="text-[11px] text-[#7a6a52] hover:text-[#1c1810] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Sửa</span>
                    </button>

                    <button
                      onClick={() => handleToggleLike(mem.id, mem.likes)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#8b3d3d] hover:text-[#b32b2b] bg-[#ede5d0] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                      title="Thả tim cho kỷ niệm"
                    >
                      <Heart className="w-3.5 h-3.5 fill-[#b32b2b] text-[#b32b2b]" />
                      <span className="font-mono">{likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Photo & Memory Modal */}
      {editingMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#1b2b20] border-2 border-[#e4c77d]/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-6 text-[#f6eedc]">
            <button
              onClick={() => setEditingMemory(null)}
              className="absolute top-4 right-4 text-[#cfc5aa] hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#2d4734]">
              <div className="w-9 h-9 rounded-full bg-[#eccb76] text-[#1c1810] flex items-center justify-center font-bold">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-vintage text-xl font-bold text-white">
                  Thay Đổi Ảnh & Kỷ Niệm
                </h3>
                <span className="text-xs text-[#b8ad95]">
                  Tùy chỉnh hình ảnh kỷ niệm của Trường THPT Chuyên Sơn La
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Photo Preview Box */}
              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1.5">
                  Hình ảnh hiển thị hiện tại:
                </label>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[#101b13] border-2 border-[#375a40] flex items-center justify-center">
                  <img
                    src={editMethod === 'url' && editUrl ? editUrl : editImageSrc}
                    alt="Xem trước ảnh"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png';
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] text-[#eccb76]">
                    Xem trước trực tiếp
                  </div>
                </div>
              </div>

              {/* Upload method toggle */}
              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Cách chọn ảnh mới:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditMethod('upload')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border ${
                      editMethod === 'upload'
                        ? 'bg-[#cbbaa1] text-[#1a160f] border-[#cbbaa1]'
                        : 'bg-[#121d15] text-[#cfc5aa] border-[#2b4432]'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải ảnh từ máy / điện thoại</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMethod('url')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border ${
                      editMethod === 'url'
                        ? 'bg-[#cbbaa1] text-[#1a160f] border-[#cbbaa1]'
                        : 'bg-[#121d15] text-[#cfc5aa] border-[#2b4432]'
                    }`}
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>Nhập link ảnh (URL)</span>
                  </button>
                </div>
              </div>

              {/* Method controls */}
              {editMethod === 'upload' ? (
                <div>
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, true)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="w-full py-3 px-4 rounded-lg bg-[#243c2c] hover:bg-[#2d4b37] border-2 border-dashed border-[#477051] text-xs font-semibold text-[#f5ebd7] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-[#eccb76]" />
                    <span>Nhấp để chọn ảnh từ thư viện máy</span>
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    placeholder="https://... hoặc /assets/..."
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                </div>
              )}

              {/* Title & Caption edits */}
              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Tiêu đề kỷ niệm:
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Niên khóa / Lớp:
                  </label>
                  <input
                    type="text"
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Đặt lại ảnh mẫu:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setEditImageSrc('/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png');
                      setEditUrl('');
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-[#142318] hover:bg-[#1f3525] border border-[#2e4a36] text-[11px] text-[#cfc5aa] cursor-pointer"
                  >
                    Dùng ảnh Chuyên Sơn La
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Lời chia sẻ kỷ niệm:
                </label>
                <textarea
                  rows={3}
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#2a4332]">
                <button
                  type="button"
                  onClick={() => setEditingMemory(null)}
                  className="px-4 py-2 text-xs font-medium text-[#c0b59b] hover:text-white rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-[#1a160f] bg-[#e4c77d] hover:bg-[#ebd79b] rounded-lg cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu thay đổi ảnh</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Memory Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#1b2b20] border border-[#3b5c43] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-6">
            <button
              onClick={() => setIsAdding(false)}
              className="absolute top-4 right-4 text-[#cfc5aa] hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📷</span>
              <h3 className="font-serif-vintage text-xl font-bold text-white">
                Góp thêm một trang ký ức
              </h3>
            </div>
            <p className="text-xs text-[#b8ad95] mb-4 font-body">
              Chia sẻ những khoảnh khắc, kỷ niệm đẹp đẽ bên thầy cô và mái trường Chuyên Sơn La để lưu giữ vào cuốn album số.
            </p>

            <form onSubmit={handleCreateMemory} className="space-y-4">
              {/* Photo Upload for New Memory */}
              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Chọn ảnh kỷ niệm:
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setAddMethod('upload')}
                    className={`py-1.5 px-3 rounded text-xs font-medium cursor-pointer border ${
                      addMethod === 'upload' ? 'bg-[#cbbaa1] text-[#1c1810] border-[#cbbaa1]' : 'bg-[#121d15] text-[#cfc5aa] border-[#2b4432]'
                    }`}
                  >
                    Tải từ máy
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddMethod('url')}
                    className={`py-1.5 px-3 rounded text-xs font-medium cursor-pointer border ${
                      addMethod === 'url' ? 'bg-[#cbbaa1] text-[#1c1810] border-[#cbbaa1]' : 'bg-[#121d15] text-[#cfc5aa] border-[#2b4432]'
                    }`}
                  >
                    Nhập link ảnh
                  </button>
                </div>

                {addMethod === 'upload' ? (
                  <div>
                    <input
                      ref={addFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, false)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => addFileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-lg bg-[#22392b] hover:bg-[#2c4937] border border-dashed border-[#446d4d] text-xs font-medium text-[#f5ebd7] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#eccb76]" />
                      <span>{newImageSrc !== '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png' ? 'Đã chọn ảnh mới (Nhấp để đổi)' : 'Tải ảnh từ điện thoại/máy tính'}</span>
                    </button>
                  </div>
                ) : (
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="Nhập đường link ảnh..."
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Tiêu đề kỷ niệm *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lớp Chuyên Toán ngày ấy, Mùa hoa ban K31..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3.5 py-2.5 text-sm text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Niên khóa / Lớp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: K31 Chuyên Văn"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Người đóng góp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tên bạn / Nhóm bạn"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Câu chuyện / Lời tâm tình *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Kể lại một kỷ niệm đáng nhớ bên thầy cô hoặc những tháng ngày học dưới mái trường..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3.5 py-2.5 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-xs font-medium text-[#c0b59b] hover:text-white rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-[#1a160f] bg-[#e4c77d] hover:bg-[#ebd79b] rounded-lg cursor-pointer shadow-md"
                >
                  Dán vào Album ký ức
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

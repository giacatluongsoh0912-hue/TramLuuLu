import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Sparkles,
  Send,
  Feather,
  RotateCcw,
  CheckCircle2,
  Camera,
  Edit2,
  Upload,
  Link as LinkIcon,
  X,
  Check,
  Loader2,
  CloudUpload,
} from 'lucide-react';
import { TributeMessage, validateTributeMessage } from '../utils/tributeRules';
import { DepartmentFaculty } from '../data/memoriesData';
import { SyncedImage } from './SyncedImage';
import { compressImage, formatFileSize, idbGet } from '../utils/imageStorage';
import {
  FilmFrame,
  INITIAL_FILM_FRAMES,
  subscribeFilmFrames,
  syncSaveFilmFrame,
} from '../utils/syncService';

interface CinematicLetterDeskProps {
  departments: DepartmentFaculty[];
  onAddTribute: (tribute: TributeMessage) => void;
  onScrollToGuestbook?: () => void;
}

interface FlyingLetter {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  delay: number;
  icon: string;
}

const OBJECT_POS_CLASS_MAP: Record<string, string> = {
  '50% 50%': 'object-center',
  '50% 20%': 'object-top',
  '20% 40%': 'object-[20%_40%]',
  '80% 65%': 'object-[80%_65%]',
  '15% 15%': 'object-[15%_15%]',
};

function getObjectPositionClass(pos?: string): string {
  return (pos && OBJECT_POS_CLASS_MAP[pos]) || 'object-center';
}

export const CinematicLetterDesk: React.FC<CinematicLetterDeskProps> = ({
  departments,
  onAddTribute,
  onScrollToGuestbook,
}) => {
  const [reelOpen, setReelOpen] = useState(false);
  const [lettersFlown, setLettersFlown] = useState(false);
  const [deskRevealed, setDeskRevealed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [recipient, setRecipient] = useState('');
  const [department, setDepartment] = useState('Toàn trường');
  const [senderName, setSenderName] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [content, setContent] = useState('');
  const [paperTheme, setPaperTheme] = useState<'parchment' | 'kraft' | 'blackboard' | 'flower'>('parchment');
  const [gift, setGift] = useState<'ban-flower' | 'sunflower' | 'chalk' | 'candle'>('ban-flower');
  const [waxSeal, setWaxSeal] = useState<'gold' | 'red' | 'ban' | 'heart'>('gold');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Editable & real-time synced 4 Film Reel Frames
  const [filmFrames, setFilmFrames] = useState<FilmFrame[]>(INITIAL_FILM_FRAMES);
  const cloudFramesReadyRef = useRef(false);
  const [editingFrame, setEditingFrame] = useState<FilmFrame | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editAlt, setEditAlt] = useState('');
  const [editImageSrc, setEditImageSrc] = useState('');
  const [editObjectPos, setEditObjectPos] = useState('50% 50%');
  const [editMethod, setEditMethod] = useState<'upload' | 'url'>('upload');
  const [editUrl, setEditUrl] = useState('');
  const [isSavingFrame, setIsSavingFrame] = useState(false);
  const [frameUploadInfo, setFrameUploadInfo] = useState<string | null>(null);
  const [frameUploadError, setFrameUploadError] = useState<string | null>(null);
  const frameFileInputRef = useRef<HTMLInputElement>(null);

  // Trigger cinematic sequence on button click or scroll
  const triggerCinematicSequence = () => {
    setReelOpen(false);
    setLettersFlown(false);
    setDeskRevealed(false);

    // Step 1: Open film reel
    setTimeout(() => {
      setReelOpen(true);
    }, 200);

    // Step 2: Flying letters burst
    setTimeout(() => {
      setLettersFlown(true);
    }, 1200);

    // Step 3: Reveal the letter writing desk
    setTimeout(() => {
      setDeskRevealed(true);
    }, 2400);
  };

  useEffect(() => {
    // Initial auto-open when component mounts
    triggerCinematicSequence();
  }, []);

  // Hydrate film frames from IndexedDB only before cloud snapshot arrives, then keep real-time synced
  useEffect(() => {
    let active = true;
    idbGet<FilmFrame[]>('csl_film_frames')
      .then((cached) => {
        if (!active || cloudFramesReadyRef.current || !cached || cached.length === 0) return;
        setFilmFrames(cached);
      })
      .catch(() => {});

    const unsubFrames = subscribeFilmFrames((frames) => {
      cloudFramesReadyRef.current = true;
      if (frames && frames.length > 0) {
        setFilmFrames(frames);
      }
    });

    return () => {
      active = false;
      unsubFrames();
    };
  }, []);

  const handleOpenEditFrame = (frame: FilmFrame) => {
    setEditingFrame(frame);
    setEditLabel(frame.label);
    setEditAlt(frame.alt);
    setEditImageSrc(frame.imageSrc);
    setEditObjectPos(frame.objectPosition || '50% 50%');
    setEditMethod('upload');
    setEditUrl(
      frame.imageSrc.startsWith('http') ? frame.imageSrc : ''
    );
    setFrameUploadInfo(null);
    setFrameUploadError(null);
  };

  const handleFrameFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFrameUploadError(null);
    try {
      const dataUrl = await compressImage(file);
      const compressedBytes = Math.round((dataUrl.length * 3) / 4);
      setEditImageSrc(dataUrl);
      setEditObjectPos('50% 50%');
      setFrameUploadInfo(
        `Đã tối ưu ảnh (${formatFileSize(file.size)} → ${formatFileSize(compressedBytes)}) — sẵn sàng đồng bộ`
      );
    } catch {
      setFrameUploadError('Không thể đọc tệp ảnh này. Vui lòng thử lại với ảnh JPEG/PNG.');
    }
  };

  const handleResetDefaultFrame = () => {
    if (!editingFrame) return;
    const seed = INITIAL_FILM_FRAMES.find((f) => f.id === editingFrame.id);
    if (!seed) return;
    setEditImageSrc(seed.imageSrc);
    setEditLabel(seed.label);
    setEditAlt(seed.alt);
    setEditObjectPos(seed.objectPosition || '50% 50%');
    setEditMethod('upload');
    setEditUrl('');
    setFrameUploadInfo('Đã đặt lại về khung hình mặc định (bấm Lưu để đồng bộ)');
    setFrameUploadError(null);
  };

  const handleSaveFrame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFrame || isSavingFrame) return;

    const finalSrc = editMethod === 'url' && editUrl.trim() ? editUrl.trim() : editImageSrc;
    if (!finalSrc) {
      setFrameUploadError('Vui lòng chọn ảnh hoặc nhập đường dẫn ảnh hợp lệ.');
      return;
    }

    const updatedFrame: FilmFrame = {
      ...editingFrame,
      label: editLabel.trim() || editingFrame.label,
      alt: editAlt.trim() || editLabel.trim() || editingFrame.alt,
      imageSrc: finalSrc,
      objectPosition: editObjectPos || '50% 50%',
      updatedAt: Date.now(),
    };

    const previousFrames = filmFrames;
    setFilmFrames((prev) => prev.map((f) => (f.id === updatedFrame.id ? updatedFrame : f)));
    setIsSavingFrame(true);
    setFrameUploadError(null);

    try {
      await syncSaveFilmFrame(updatedFrame);
      setEditingFrame(null);
      setFrameUploadInfo(null);
      setSuccessMessage(`Đã cập nhật & đồng bộ "${updatedFrame.label}" lên toàn hệ thống!`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch {
      setFilmFrames(previousFrames);
      setFrameUploadError('Không thể đồng bộ khung hình lên đám mây. Vui lòng thử lại.');
    } finally {
      setIsSavingFrame(false);
    }
  };

  const samplePrompts = [
    'Thầy cô đã cho em niềm tin vào bản thân khi em lạc lối nhất...',
    'Nhớ những ngày mùa đông Sơn La rét buốt, giọng cô ấm áp sưởi ấm cả lớp...',
    'Bài toán thầy dạy năm ấy là hành trang để em bước vào đời hôm nay...',
    'Cảm ơn mái trường Chuyên Sơn La đã lưu giữ những năm tháng thanh xuân rực rỡ nhất...',
  ];

  const handleApplyPrompt = (p: string) => {
    setContent((prev) => (prev ? prev + '\n\n' + p : p));
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

    setIsSubmitting(true);

    setTimeout(() => {
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
      setIsSubmitting(false);
      setSuccessMessage(`Đã gửi bức thư tri ân thành công tới ${recipient}! Bức thư đã được niêm phong trang trọng.`);

      // Reset form
      setContent('');
      setRecipient('');
      setFormErrors({});

      setTimeout(() => {
        setSuccessMessage(null);
      }, 6000);
    }, 800);
  };

  // Flying letter particle list
  const flyingLetters: FlyingLetter[] = [
    { id: 1, x: -140, y: -90, scale: 1.1, rotate: -22, delay: 0.1, icon: '✉️' },
    { id: 2, x: 130, y: -110, scale: 1.25, rotate: 18, delay: 0.2, icon: '💌' },
    { id: 3, x: -210, y: -40, scale: 0.95, rotate: -35, delay: 0.35, icon: '🕊️' },
    { id: 4, x: 200, y: -30, scale: 1.05, rotate: 28, delay: 0.3, icon: '📜' },
    { id: 5, x: -80, y: -160, scale: 1.15, rotate: -12, delay: 0.45, icon: '🌸' },
    { id: 6, x: 90, y: -170, scale: 1.2, rotate: 15, delay: 0.4, icon: '✉️' },
    { id: 7, x: -260, y: 30, scale: 0.9, rotate: -45, delay: 0.5, icon: '💌' },
    { id: 8, x: 250, y: 40, scale: 0.95, rotate: 42, delay: 0.55, icon: '✨' },
    { id: 9, x: 0, y: -190, scale: 1.3, rotate: 5, delay: 0.25, icon: '🪶' },
  ];

  return (
    <section
      id="letter-desk"
      className="py-20 bg-[#0c160f]/85 backdrop-blur-md relative border-b border-[#253a2a]/80 overflow-hidden"
    >
      {/* Decorative ambient lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#eccb76]/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e3425] border border-[#eccb76]/40 text-[#eccb76] text-xs font-semibold mb-3 shadow-md">
            <Film className="w-3.5 h-3.5" />
            <span>Thước Phim Ký Ức & Không Gian Viết Thư Số</span>
          </div>

          <h2 className="font-serif-vintage text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Cuộn Phim Tri Ân · Nơi Bức Thư Bay Đến Thầy Cô
          </h2>
          <p className="font-body text-xs sm:text-sm text-[#b8ab95] mt-3 leading-relaxed">
            Một cuộn phim ký ức mở ra, những bức thư từ muôn phương tung cánh bay về mái trường Chiềng Sinh, đưa bạn đến chiếc bàn viết bưu thiếp gửi gắm những lời tri ân sâu sắc nhất.
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={triggerCinematicSequence}
              className="px-4 py-1.5 rounded-full bg-[#24392b] hover:bg-[#314e3b] text-[#eccb76] border border-[#3e664b] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Phát lại hiệu ứng cuộn phim mở ra và thư bay"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xem lại hiệu ứng cuộn phim & thư bay</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1. CINEMATIC FILM REEL UNROLLING ANIMATION */}
        {/* ======================================================== */}
        <div className="relative mb-14">
          <div
            className={`w-full transition-all duration-1000 ease-out origin-center ${
              reelOpen
                ? 'opacity-100 scale-100 max-h-[400px]'
                : 'opacity-40 scale-90 max-h-[80px]'
            }`}
          >
            {/* Film Strip Header & Perforations */}
            <div className="bg-[#090f0b] border-y-2 border-[#d4af37] py-2 px-4 shadow-2xl relative rounded-xl overflow-hidden">
              {/* Sprocket Holes Top */}
              <div className="flex justify-between gap-4 mb-2 opacity-70 overflow-hidden">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={`top-${i}`}
                    className="w-3.5 h-2 rounded-xs bg-[#1a2d1f] border border-[#2b4432] shrink-0"
                  />
                ))}
              </div>

              {/* Film Frames Showcase (4 editable & real-time synced frames) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                {filmFrames.map((frame) => {
                  const seedFallback =
                    INITIAL_FILM_FRAMES.find((s) => s.id === frame.id)?.imageSrc ||
                    '/assets/aistudio/image_3c5728ff.png';
                  return (
                    <div
                      key={frame.id}
                      onClick={() => handleOpenEditFrame(frame)}
                      className="relative rounded-lg overflow-hidden border border-[#3c5d46] hover:border-[#eccb76]/80 bg-[#111c14] aspect-4/3 group cursor-pointer transition-colors"
                    >
                      <SyncedImage
                        src={frame.imageSrc}
                        fallbackSrc={seedFallback}
                        alt={frame.alt}
                        className={`w-full h-full object-cover ${getObjectPositionClass(frame.objectPosition)} opacity-90 group-hover:scale-105 transition-transform`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent flex items-end p-2.5 pointer-events-none">
                        <span className="text-[11px] font-serif-vintage font-bold text-[#eccb76] line-clamp-1 pr-6">
                          {frame.label}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditFrame(frame);
                        }}
                        aria-label={`Chỉnh sửa ảnh ${frame.label}`}
                        title="Đổi ảnh & chú thích khung hình"
                        className="absolute top-2 right-2 z-10 px-2 py-1 rounded-md bg-black/75 hover:bg-[#eccb76] text-[#eccb76] hover:text-[#16221a] border border-[#eccb76]/50 text-[10px] font-semibold flex items-center gap-1 shadow-md transition-all cursor-pointer opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Đổi ảnh</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Sprocket Holes Bottom */}
              <div className="flex justify-between gap-4 mt-2 opacity-70 overflow-hidden">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={`bottom-${i}`}
                    className="w-3.5 h-2 rounded-xs bg-[#1a2d1f] border border-[#2b4432] shrink-0"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. BURST OF FLYING LETTERS & ENVELOPES */}
          {/* ======================================================== */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {flyingLetters.map((l) => (
              <div
                key={l.id}
                className="absolute text-2xl sm:text-3xl filter drop-shadow-lg transition-all duration-1000 ease-out"
                style={{
                  transform: lettersFlown
                    ? `translate(${l.x}px, ${l.y}px) scale(${l.scale}) rotate(${l.rotate}deg)`
                    : 'translate(0, 0) scale(0) rotate(0deg)',
                  opacity: lettersFlown ? (deskRevealed ? 0.45 : 0.95) : 0,
                  transitionDelay: `${l.delay}s`,
                }}
              >
                {l.icon}
              </div>
            ))}
          </div>
        </div>

        {/* Toast success message */}
        {successMessage && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-center font-medium shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
            {onScrollToGuestbook && (
              <button
                onClick={onScrollToGuestbook}
                className="mt-2 text-xs text-[#eccb76] underline hover:text-white cursor-pointer"
              >
                Xem bức thư của bạn trong Sổ Lưu Bút Tri Ân ↓
              </button>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. THE REVEALED LETTER WRITING DESK */}
        {/* ======================================================== */}
        <div
          className={`transition-all duration-1000 ease-out ${
            deskRevealed
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8 pointer-events-none'
          }`}
        >
          <div className="bg-[#121f16]/95 border-2 border-[#3b5e46] rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            
            {/* Vintage Desk Ornament Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-[#2a4332] mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#cbbaa1] text-[#1c1810] flex items-center justify-center shadow-md">
                  <Feather className="w-6 h-6 text-[#241a0d]" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#eccb76] font-semibold">
                    BÀN SOẠN THẢO THƯ TRI ÂN TRỰC TUYẾN
                  </span>
                  <h3 className="font-serif-vintage text-2xl sm:text-3xl font-bold text-white mt-0.5">
                    Gửi Gắm Yêu Thương Đến Thầy Cô Kính Mến
                  </h3>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 text-xs text-[#b8ab95] font-serif-vintage italic">
                <span>✒️ Nét chữ nết người · Ơn thầy nghĩa cô</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Recipient & Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1.5">
                    Kính gửi Thầy / Cô (hoặc Tập thể Tổ Chuyên Môn) *
                  </label>
                  <input
                    type="text"
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="VD: Cô giáo chủ nhiệm Hoàng Thu Trang / Thầy Hiệu trưởng"
                    className="w-full bg-[#0a120d] border border-[#2b4433] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-hidden focus:border-[#eccb76]"
                  />
                  {formErrors.recipient && (
                    <span className="text-[11px] text-red-400 mt-1 block">{formErrors.recipient}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1.5">
                    Thuộc Tổ Chuyên Môn / Đơn Vị
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#0a120d] border border-[#2b4433] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#f6eedc] focus:outline-hidden focus:border-[#eccb76]"
                  >
                    <option value="Toàn trường">Toàn trường / Toàn thể Thầy Cô Chuyên Sơn La</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Sender Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1.5">
                    Họ và tên của bạn (Tác giả) *
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="VD: Nguyễn Hoài An"
                    className="w-full bg-[#0a120d] border border-[#2b4433] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-hidden focus:border-[#eccb76]"
                  />
                  {formErrors.senderName && (
                    <span className="text-[11px] text-red-400 mt-1 block">{formErrors.senderName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1.5">
                    Lớp / Chi Đoàn / Cựu học sinh Niên khóa *
                  </label>
                  <input
                    type="text"
                    required
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    placeholder="VD: 12 Chuyên Văn (K31) / Cựu học sinh K28"
                    className="w-full bg-[#0a120d] border border-[#2b4433] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-hidden focus:border-[#eccb76]"
                  />
                  {formErrors.affiliation && (
                    <span className="text-[11px] text-red-400 mt-1 block">{formErrors.affiliation}</span>
                  )}
                </div>
              </div>

              {/* Row 3: Stationery Style & Wax Seal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1.5">
                    Chất liệu giấy thư cổ điển
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaperTheme('parchment')}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        paperTheme === 'parchment'
                          ? 'border-[#eccb76] bg-[#f4ebd9] text-[#251e15] font-bold shadow-md'
                          : 'border-[#2c4735] bg-[#0c140e] text-[#cfc5aa]'
                      }`}
                    >
                      📜 Giấy cổ điển hoàng kim
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperTheme('flower')}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        paperTheme === 'flower'
                          ? 'border-[#f4aab7] bg-[#fdf2f4] text-[#421b24] font-bold shadow-md'
                          : 'border-[#2c4735] bg-[#0c140e] text-[#cfc5aa]'
                      }`}
                    >
                      🌸 Cánh hoa ban Tây Bắc
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperTheme('kraft')}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        paperTheme === 'kraft'
                          ? 'border-[#d4a373] bg-[#f3e5d0] text-[#3e2714] font-bold shadow-md'
                          : 'border-[#2c4735] bg-[#0c140e] text-[#cfc5aa]'
                      }`}
                    >
                      🪵 Giấy Kraft mộc mạc
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperTheme('blackboard')}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        paperTheme === 'blackboard'
                          ? 'border-[#8ea293] bg-[#1d3023] text-white font-bold shadow-md'
                          : 'border-[#2c4735] bg-[#0c140e] text-[#cfc5aa]'
                      }`}
                    >
                      🌱 Bảng xanh phấn trắng
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1.5">
                    Mộc dấu sáp niêm phong (Wax Seal) & Món quà
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setWaxSeal('gold');
                        setGift('ban-flower');
                      }}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        waxSeal === 'gold'
                          ? 'border-[#eccb76] bg-[#22392b] text-[#f8ecd2] font-bold shadow-md'
                          : 'border-[#2c4735] bg-[#0c140e] text-[#cfc5aa]'
                      }`}
                    >
                      🏅 Dấu vàng hoàng gia + Hoa ban
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWaxSeal('red');
                        setGift('candle');
                      }}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        waxSeal === 'red'
                          ? 'border-[#eccb76] bg-[#22392b] text-[#f8ecd2] font-bold shadow-md'
                          : 'border-[#2c4735] bg-[#0c140e] text-[#cfc5aa]'
                      }`}
                    >
                      🔴 Dấu son đỏ + Ngôi sao tri ân
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWaxSeal('ban');
                        setGift('sunflower');
                      }}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        waxSeal === 'ban'
                          ? 'border-[#eccb76] bg-[#22392b] text-[#f8ecd2] font-bold shadow-md'
                          : 'border-[#2c4735] bg-[#0c140e] text-[#cfc5aa]'
                      }`}
                    >
                      🌸 Dấu hoa ban + Hướng dương
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWaxSeal('heart');
                        setGift('chalk');
                      }}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        waxSeal === 'heart'
                          ? 'border-[#eccb76] bg-[#22392b] text-[#f8ecd2] font-bold shadow-md'
                          : 'border-[#2c4735] bg-[#0c140e] text-[#cfc5aa]'
                      }`}
                    >
                      ❤️ Trái tim tri ân + Phấn trắng
                    </button>
                  </div>
                </div>
              </div>

              {/* Inspiring starter prompts */}
              <div>
                <span className="text-[11px] text-[#b8ab95] block mb-1.5 font-medium">
                  💡 Gợi ý câu mở đầu xúc động (bấm để thêm vào thư):
                </span>
                <div className="flex flex-wrap gap-2">
                  {samplePrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPrompt(p)}
                      className="px-2.5 py-1 rounded-lg bg-[#16271c] hover:bg-[#203628] text-[11px] text-[#ded7c3] border border-[#2b4433] transition-all cursor-pointer text-left"
                    >
                      + &ldquo;{p.slice(0, 42)}...&rdquo;
                    </button>
                  ))}
                </div>
              </div>

              {/* Letter Content Textarea */}
              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1.5">
                  Nội dung bức thư tri ân của bạn *
                </label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Kính gửi Thầy Cô kính yêu! Hôm nay con viết bức thư này để bày tỏ lòng biết ơn chân thành nhất..."
                  className="w-full bg-[#0a120d] border border-[#2b4433] rounded-2xl p-4 text-xs sm:text-sm text-white focus:outline-hidden focus:border-[#eccb76] resize-none font-serif-vintage leading-relaxed"
                />
                {formErrors.content && (
                  <span className="text-[11px] text-red-400 mt-1 block">{formErrors.content}</span>
                )}
              </div>

              {/* Live Parchment Letter Preview */}
              <div className="pt-2">
                <span className="text-xs text-[#eccb76] font-semibold block mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Bức thư sau khi hoàn tất sẽ được đóng dấu sáp niêm phong như sau:</span>
                </span>
                
                <div
                  className={`p-6 rounded-2xl border-2 shadow-2xl relative ${
                    paperTheme === 'parchment'
                      ? 'bg-[#f4ebd9] text-[#251e15] border-[#d4af37]'
                      : paperTheme === 'flower'
                      ? 'bg-[#fdf2f4] text-[#421b24] border-[#f4aab7]'
                      : paperTheme === 'kraft'
                      ? 'bg-[#f3e5d0] text-[#3e2714] border-[#d4a373]'
                      : 'bg-[#1a2d21] text-white border-[#8ea293]'
                  }`}
                >
                  {/* Wax Seal Stamp in Top Right */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#8c1d1d] text-[#e4c77d] border-2 border-[#d4af37] flex items-center justify-center font-bold text-xs shadow-xl rotate-12">
                      {waxSeal === 'gold' && '🏅'}
                      {waxSeal === 'red' && '💮'}
                      {waxSeal === 'ban' && '🌸'}
                      {waxSeal === 'heart' && '❤️'}
                    </div>
                  </div>

                  <div className="text-[11px] font-mono tracking-widest opacity-75 uppercase">
                    Kính gửi: <span className="font-bold underline">{recipient || 'Thầy Cô Kính Mến'}</span> ({department})
                  </div>

                  <div className="my-4 font-serif-vintage italic text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    &ldquo;{content || 'Nội dung bức thư của bạn sẽ được thể hiện trang trọng tại đây...'}&rdquo;
                  </div>

                  <div className="pt-3 border-t border-black/15 flex items-center justify-between">
                    <div className="text-xs opacity-75">
                      Chiềng Sinh · 20/11/2026
                    </div>
                    <div className="font-script-calligraphy text-base sm:text-lg font-bold text-right">
                      ✍️ {senderName || 'Học trò của thầy cô'} ({affiliation || 'Lớp của bạn'})
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#2a4332]">
                <div className="text-xs text-[#8c9e90]">
                  Bức thư sau khi gửi sẽ được lưu vào <span className="text-[#eccb76] font-semibold">Sổ Lưu Bút Tri Ân</span> của trường.
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#e4c77d] hover:bg-[#ebd79b] text-[#1c1810] text-sm font-bold shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Đang Đóng Dấu & Gửi Thư...' : 'Đóng Dấu Niêm Phong & Gửi Thư'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

      {/* Edit Film Frame Modal */}
      {editingFrame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#1b2b20] border-2 border-[#e4c77d]/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-6 text-[#f6eedc]">
            <button
              type="button"
              onClick={() => setEditingFrame(null)}
              aria-label="Đóng hộp thoại chỉnh sửa khung hình"
              className="absolute top-4 right-4 text-[#cfc5aa] hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#2d4734]">
              <div className="w-9 h-9 rounded-full bg-[#eccb76] text-[#1c1810] flex items-center justify-center font-bold">
                <Edit2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif-vintage text-xl font-bold text-white">
                  Chỉnh Sửa Khung Hình Cuộn Phim
                </h3>
                <span className="text-xs text-[#b8ad95]">
                  Ảnh và chú thích mới sẽ đồng bộ trực tiếp tới mọi thiết bị
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveFrame} className="space-y-4">
              {frameUploadError && (
                <div className="p-2.5 rounded-lg bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200">
                  {frameUploadError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1.5">
                  Xem trước khung hình:
                </label>
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#101b13] border-2 border-[#375a40]">
                  <SyncedImage
                    src={editMethod === 'url' && editUrl.trim() ? editUrl.trim() : editImageSrc}
                    fallbackSrc="/assets/aistudio/image_3c5728ff.png"
                    alt={editAlt || editLabel}
                    className={`w-full h-full object-cover ${getObjectPositionClass(editObjectPos)}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 pointer-events-none">
                    <span className="text-xs font-serif-vintage font-bold text-[#eccb76]">
                      {editLabel || editingFrame.label}
                    </span>
                  </div>
                </div>
                {frameUploadInfo && (
                  <p className="text-[11px] text-emerald-300 mt-1.5 flex items-center gap-1">
                    <CloudUpload className="w-3.5 h-3.5" />
                    <span>{frameUploadInfo}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Cách thay đổi ảnh:
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
                    <span>Tải ảnh từ máy</span>
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
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Nhập link ảnh (URL)</span>
                  </button>
                </div>
              </div>

              {editMethod === 'upload' ? (
                <div>
                  <input
                    ref={frameFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFrameFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => frameFileInputRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#243d2c] hover:bg-[#2f4f39] border border-dashed border-[#4d7b57] text-xs font-semibold text-[#f5ebd7] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-[#eccb76]" />
                    <span>Chọn ảnh từ máy tính / điện thoại (hỗ trợ ảnh lớn)</span>
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    placeholder="Dán đường dẫn ảnh (https://...)"
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#e4c77d]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Nhãn khung hình *
                  </label>
                  <input
                    type="text"
                    required
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    placeholder="VD: Khung hình 01 · Chiềng Sinh 1995"
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Vị trí trọng tâm ảnh
                  </label>
                  <select
                    value={editObjectPos}
                    onChange={(e) => setEditObjectPos(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  >
                    <option value="50% 50%">Giữa ảnh (Khuyên dùng)</option>
                    <option value="50% 20%">Ưu tiên phần trên / khuôn mặt</option>
                    <option value="20% 40%">Góc trái</option>
                    <option value="80% 65%">Góc phải</option>
                    <option value="15% 15%">Góc trên trái</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Mô tả ảnh (Alt)
                </label>
                <input
                  type="text"
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  placeholder="Mô tả ngắn nội dung bức ảnh..."
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                />
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#2d4734]">
                <button
                  type="button"
                  onClick={handleResetDefaultFrame}
                  className="px-3 py-2 text-xs font-medium text-[#cfc5aa] hover:text-white hover:bg-[#253b2c] rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục gốc</span>
                </button>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setEditingFrame(null)}
                    className="px-4 py-2 text-xs font-medium text-[#c0b59b] hover:text-white rounded-lg cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingFrame}
                    className="px-5 py-2.5 text-xs font-bold text-[#1a160f] bg-[#e4c77d] hover:bg-[#ebd79b] disabled:opacity-60 rounded-lg cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    {isSavingFrame ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang đồng bộ...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Lưu &amp; Đồng Bộ</span>
                      </>
                    )}
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

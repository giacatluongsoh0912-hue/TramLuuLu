import React, { useState, useEffect } from 'react';
import {
  Film,
  Sparkles,
  Send,
  Feather,
  Heart,
  Award,
  Check,
  RotateCcw,
  BookOpen,
  Image as ImageIcon,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { TributeMessage, validateTributeMessage } from '../utils/tributeRules';
import { DepartmentFaculty } from '../data/memoriesData';

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

              {/* Film Frames Showcase */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                <div className="relative rounded-lg overflow-hidden border border-[#3c5d46] bg-[#111c14] aspect-4/3 group">
                  <img
                    src="/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png"
                    alt="Mái trường Chuyên Sơn La"
                    className="w-full h-full object-cover object-[20%_40%] opacity-85 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[11px] font-serif-vintage font-bold text-[#eccb76]">
                      Khung hình 01 · Chiềng Sinh 1995
                    </span>
                  </div>
                </div>

                <div className="relative rounded-lg overflow-hidden border border-[#3c5d46] bg-[#111c14] aspect-4/3 group">
                  <img
                    src="/assets/aistudio/Tr_m_k_t_n_i_s___2__3771c580.png"
                    alt="Hoa ban đại ngàn"
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[11px] font-serif-vintage font-bold text-[#eccb76]">
                      Khung hình 02 · Mùa Hoa Tri Ân
                    </span>
                  </div>
                </div>

                <div className="relative rounded-lg overflow-hidden border border-[#3c5d46] bg-[#111c14] aspect-4/3 group">
                  <img
                    src="/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png"
                    alt="Giờ học say mê"
                    className="w-full h-full object-cover object-[80%_65%] opacity-85 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[11px] font-serif-vintage font-bold text-[#eccb76]">
                      Khung hình 03 · Bụi Phấn Bục Giảng
                    </span>
                  </div>
                </div>

                <div className="relative rounded-lg overflow-hidden border border-[#3c5d46] bg-[#111c14] aspect-4/3 group">
                  <img
                    src="/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png"
                    alt="Thế hệ học trò vươn xa"
                    className="w-full h-full object-cover object-[15%_15%] opacity-85 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[11px] font-serif-vintage font-bold text-[#eccb76]">
                      Khung hình 04 · Khát Vọng Tương Lai
                    </span>
                  </div>
                </div>
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
                      🔴 Dấu son đỏ + Ngọn nến ấm
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
    </section>
  );
};

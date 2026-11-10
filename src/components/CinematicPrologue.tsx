import React, { useState, useEffect } from 'react';
import { Film, Play, Sparkles, X, ChevronRight, Award, Compass, Heart } from 'lucide-react';

interface CinematicPrologueProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExperience: () => void;
}

export const CinematicPrologue: React.FC<CinematicPrologueProps> = ({
  isOpen,
  onClose,
  onStartExperience,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Mái Trường Nơi Đại Ngàn Tây Bắc',
      subtitle: 'Trường THPT Chuyên Sơn La (1995 – 2026)',
      quote: '“Có một nghề bụi phấn bám đầy tay\nNgười ta bảo là nghề trong sạch nhất\nCó một nghề không trồng cây vào đất\nMà cho đời những đóa hoa thơm...”',
      author: '– Đinh Văn Nhã',
      highlight: '30 năm hành trình ươm mầm tài năng đất Sơn La',
      badge: '17/05/1995 – 2026',
    },
    {
      title: 'Các Thế Hệ Người Dẫn Lối',
      subtitle: 'Tâm huyết của những người thầy, người cô',
      quote: '“Từ những ngày đầu gian khó của Trường Năng khiếu đến mái trường khang trang tại Chiềng Sinh hôm nay, từng trang sách, từng bài giảng đều mang trọn tấm lòng tận tụy vì học trò.”',
      author: '– Tri ân các thế hệ Hiệu trưởng & Thầy cô giáo',
      highlight: 'Nền móng tri thức • Tận tụy cống hiến • Chắp cánh tương lai',
      badge: 'Tôn sư trọng đạo',
    },
    {
      title: 'Trạm Kết Nối Số 20/11',
      subtitle: 'Nối dài triệu tấm lòng học sinh muôn phương',
      quote: '“Dù mai này đi bốn phương trời, hình bóng thầy cô và tiếng giảng bài bên bục giảng Chuyên Sơn La sẽ mãi là ngọn hải đăng soi sáng bước đường tương lai của chúng em.”',
      author: '– Toàn thể học sinh & cựu học sinh các khóa',
      highlight: 'Gửi ngàn lời chúc • Sống lại kỷ niệm • Khắc ghi ơn thầy',
      badge: 'Chào mừng 20/11',
    },
  ];

  // Auto advance slide slowly for cinema pacing
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isOpen, slides.length]);

  if (!isOpen) return null;

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/90 backdrop-blur-2xl transition-all duration-700 animate-in fade-in select-none">
      {/* Cinematic Ambient Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 transition-transform duration-10000 ease-out pointer-events-none"
        style={{
          backgroundImage: `url('/assets/aistudio/Tr_m_k_t_n_i_s___2__3771c580.png')`,
        }}
      />

      {/* Cinematic Letterbox Bars */}
      <div className="absolute top-0 left-0 right-0 h-12 md:h-16 bg-stone-950 border-b border-amber-500/20 z-20 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 text-amber-300 text-xs tracking-[0.2em] uppercase font-serif">
          <Film className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Thước Phim Tri Ân • Chuyên Sơn La 20/11</span>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-stone-800 text-xs flex items-center gap-1"
        >
          <span>Đóng</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 bg-stone-950 border-t border-amber-500/20 z-20 flex items-center justify-between px-6 text-stone-400 text-xs">
        <span className="hidden md:inline font-mono">1995 • 2026 — Dấu ấn 30 năm vẻ vang</span>
        <div className="flex items-center gap-1.5 mx-auto md:mx-0">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-stone-700 hover:bg-stone-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Cinematic Card */}
      <div className="relative z-10 max-w-3xl w-full mx-4 py-8 px-6 md:px-12 text-center text-amber-50 rounded-3xl bg-gradient-to-b from-stone-900/80 via-stone-950/90 to-stone-900/80 border border-amber-500/30 shadow-2xl shadow-amber-950/40">
        {/* Crest & Badge */}
        <div className="flex justify-center mb-4">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-500/20 rounded-full blur-md animate-pulse" />
            <img
              src="/assets/aistudio/Logo_THPT_Chuyen_Son_La_bf6a8e06.png"
              alt="Logo THPT Chuyên Sơn La"
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full object-contain p-1 bg-stone-900/90 border border-amber-400/40 shadow-xl"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin [animation-duration:8s]" />
          <span>{slide.badge}</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-yellow-300 mb-2 tracking-wide">
          {slide.title}
        </h2>
        <p className="text-xs md:text-sm text-amber-200/80 uppercase tracking-widest font-mono mb-6">
          {slide.subtitle}
        </p>

        {/* Poetic Quote Box */}
        <div className="relative my-6 px-6 py-5 rounded-2xl bg-stone-900/60 border border-amber-500/20 backdrop-blur-md">
          <span className="text-4xl font-serif text-amber-400/30 absolute top-2 left-4">“</span>
          <p className="text-sm md:text-base leading-relaxed text-stone-200 italic font-serif whitespace-pre-line">
            {slide.quote}
          </p>
          <p className="text-right text-xs md:text-sm text-amber-300 font-medium mt-3">
            {slide.author}
          </p>
        </div>

        <p className="text-xs text-amber-300/80 mb-8 flex items-center justify-center gap-2">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
          <span>{slide.highlight}</span>
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartExperience}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-stone-950 font-semibold text-sm shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            <span>Bước Vào Trạm Kết Nối Số</span>
            <ChevronRight className="w-4 h-4 text-stone-900 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 text-xs font-medium transition-all"
          >
            Đoạn tiếp theo ({currentSlide + 1}/{slides.length})
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Feather, BookOpen, Sparkles, QrCode, Clock, Award, Play } from 'lucide-react';
import { getContestStatus } from '../utils/tributeRules';

interface HeroSectionProps {
  onOpenComposer: () => void;
  onExploreMemories: () => void;
  onInspectHeroPhoto: () => void;
  onOpenQRCode: () => void;
  onOpenContestInfo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenComposer,
  onExploreMemories,
  onInspectHeroPhoto,
  onOpenQRCode,
  onOpenContestInfo,
}) => {
  // Contest dates: 26/10/2026 to 21/11/2026
  const contestEnd = new Date('2026-11-21T23:59:59').getTime();
  const contestStatus = getContestStatus(Date.now(), contestEnd);

  return (
    <section id="hero" className="relative w-full bg-[#0b140e]/75 backdrop-blur-md overflow-hidden">
      {/* Contest Campaign Banner Strip */}
      <div className="bg-[#18291f] border-b border-[#2d4735] py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[#dcd4be]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#eccb76] animate-pulse" />
            <span className="font-semibold text-white">Đợt thi đua cao điểm 20/11:</span>
            <span>26/10 - 21/11/2026</span>
            <span className="hidden sm:inline text-[#94a899]">· Còn {contestStatus.daysRemaining} ngày</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenContestInfo}
              className="text-[#eccb76] hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Xem Thể Lệ Cuộc Thi</span>
            </button>
            <span className="text-[#3a5241] hidden sm:inline">|</span>
            <button
              onClick={onOpenQRCode}
              className="px-2.5 py-1 rounded bg-[#253e2e] hover:bg-[#2e4d39] text-[#f8ecd2] text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-[#3e664b] transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-[#eccb76]" />
              <span>Mã QR Góc Tri Ân Lớp Học</span>
            </button>
          </div>
        </div>
      </div>

      {/* 35mm Film Sprocket Border Top */}
      <div className="w-full h-7 bg-[#080d09] border-b border-[#1b2b1f] flex items-center justify-around px-4 overflow-hidden" aria-hidden="true">
        <div className="flex gap-5 w-full justify-around opacity-60">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="w-3.5 h-2.5 rounded-xs bg-[#16241a] border border-[#273d2d] shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Main Full-Fidelity Artwork Showcase */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#2b4433] bg-[#0c130d] group">
          
          {/* The User's Exact High-Res Master Artwork (4269 x 2400) */}
          <div className="relative w-full aspect-16/9 sm:aspect-16/9 overflow-hidden">
            <img
              src="/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png"
              alt="Trạm kết nối số: Tri ân người dẫn lối - Trường THPT Chuyên Sơn La"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover sm:object-contain select-none"
              loading="eager"
            />

            {/* Subtle atmospheric vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Interactive Overlay Hotspots directly on the artwork */}
            {/* 1. Hotspot on Button 'Gửi lời tri ân' - Perfectly aligned to printed pill button */}
            <div
              className="absolute left-[32.6%] bottom-[6.8%] w-[17.4%] h-[9.8%] cursor-pointer group/btn z-10"
              onClick={onOpenComposer}
              title="Nhấp để Gửi lời tri ân thầy cô"
            >
              <div className="w-full h-full rounded-full transition-all duration-200 group-hover/btn:ring-2 group-hover/btn:ring-[#eccb76]/80 group-hover/btn:bg-[#eccb76]/15 flex items-center justify-center">
                <span className="sr-only">Gửi lời tri ân</span>
              </div>
            </div>

            {/* 2. Hotspot on Button 'Lật giở ký ức' - Perfectly aligned to printed pill button */}
            <div
              className="absolute left-[50.4%] bottom-[6.8%] w-[17.4%] h-[9.8%] cursor-pointer group/btn2 z-10"
              onClick={onExploreMemories}
              title="Nhấp để Lật giở cuốn album ký ức"
            >
              <div className="w-full h-full rounded-full transition-all duration-200 group-hover/btn2:ring-2 group-hover/btn2:ring-[#eccb76]/80 group-hover/btn2:bg-[#eccb76]/15 flex items-center justify-center">
                <span className="sr-only">Lật giở ký ức</span>
              </div>
            </div>

            {/* 3. Hotspot on the Kodak Portra 400 Slide (Chuyên Sơn La Building) */}
            <div
              className="absolute left-[52%] top-[25%] w-[30%] h-[35%] cursor-pointer group/slide"
              onClick={onInspectHeroPhoto}
              title="Nhấp để xem ảnh toà nhà Chuyên Sơn La độ phân giải cao"
            >
              <div className="w-full h-full rounded-lg transition-all duration-300 group-hover/slide:ring-4 group-hover/slide:ring-[#eccb76]/80 group-hover/slide:bg-[#eccb76]/10 flex items-center justify-center">
                <div className="opacity-0 group-hover/slide:opacity-100 transition-opacity bg-black/70 backdrop-blur-xs text-[#f6eedc] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-[#eccb76]/40">
                  <Sparkles className="w-3.5 h-3.5 text-[#eccb76]" />
                  <span>Phóng to mái trường</span>
                </div>
              </div>
            </div>

            {/* 4. Hotspot on the left Polaroid memories */}
            <div
              className="absolute left-[0.5%] top-[2%] w-[15%] h-[55%] cursor-pointer group/polaroid"
              onClick={onExploreMemories}
              title="Xem ảnh kỷ niệm học trò K31 & đêm lửa trại"
            >
              <div className="w-full h-full rounded-lg transition-all duration-200 group-hover/polaroid:ring-2 group-hover/polaroid:ring-[#eccb76]/50">
                <span className="sr-only">Kỷ niệm học trò</span>
              </div>
            </div>

            {/* 5. Hotspot on the right Polaroids (Classroom memories) */}
            <div
              className="absolute right-[7%] bottom-[5%] w-[20%] h-[45%] cursor-pointer group/polaroid2"
              onClick={onExploreMemories}
              title="Xem ảnh lớp học và kỷ niệm thầy cô"
            >
              <div className="w-full h-full rounded-lg transition-all duration-200 group-hover/polaroid2:ring-2 group-hover/polaroid2:ring-[#eccb76]/50">
                <span className="sr-only">Lớp học Chuyên Sơn La</span>
              </div>
            </div>

          </div>

          {/* Quick interactive action bar underneath the artwork for easy mobile access */}
          <div className="p-4 sm:p-5 bg-[#121f17] border-t border-[#25392b] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌿</span>
              <p className="text-xs text-[#d1c6b0] font-serif-vintage italic">
                Chào mừng bạn bước lên chuyến tàu khứ hồi trở về với mái trường Chuyên Sơn La của những ngày trong trẻo nhất.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                onClick={onOpenComposer}
                className="px-5 py-2.5 rounded-full bg-[#cbbaa1] hover:bg-[#dbccb5] text-[#1c1810] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-[#dfd2be]"
              >
                <Feather className="w-4 h-4 text-[#3d2f1f]" />
                <span>Gửi lời tri ân</span>
              </button>

              <button
                onClick={onExploreMemories}
                className="px-5 py-2.5 rounded-full bg-[#1e3426] hover:bg-[#284432] text-[#f4eedb] font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer border border-[#3b5e46]"
              >
                <BookOpen className="w-4 h-4 text-[#eccb76]" />
                <span>Lật giở ký ức</span>
              </button>

              <button
                onClick={onInspectHeroPhoto}
                className="p-2.5 rounded-full bg-[#16251b] hover:bg-[#1f3527] text-[#cfc5aa] border border-[#2b4432] transition-colors cursor-pointer"
                title="Phóng to tác phẩm nghệ thuật"
              >
                <Sparkles className="w-4 h-4 text-[#eccb76]" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 35mm Film Sprocket Border Bottom */}
      <div className="w-full h-7 bg-[#080d09] border-t border-[#1b2b1f] flex items-center justify-around px-4 overflow-hidden" aria-hidden="true">
        <div className="flex gap-5 w-full justify-around opacity-60">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="w-3.5 h-2.5 rounded-xs bg-[#16241a] border border-[#273d2d] shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

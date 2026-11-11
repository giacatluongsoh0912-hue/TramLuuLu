import React from 'react';
import { Sparkles, Feather, Film } from 'lucide-react';
import { audioPlayer } from '../utils/audioPlayer';

interface NavbarProps {
  onOpenComposer: () => void;
  onOpenCardMaker: () => void;
  onOpenPrologue?: () => void;
  petalsEnabled: boolean;
  onTogglePetals: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenComposer,
  onOpenCardMaker,
  onOpenPrologue,
  petalsEnabled,
  onTogglePetals,
}) => {

  const handlePlayBell = () => {
    audioPlayer.playSchoolBell();
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#131f18]/90 border-b border-[#2d4334] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title with Official School Logo */}
        <a
          href="#hero"
          className="flex items-center gap-3 text-lg font-bold tracking-tight text-[#f8f4e6] hover:text-[#e4c77d] transition-colors whitespace-nowrap shrink-0 group"
        >
          <img
            src="/assets/aistudio/Logo_THPT_Chuyen_Son_La_bf6a8e06.png"
            alt="Logo Trường THPT Chuyên Sơn La"
            className="w-10 h-10 object-contain drop-shadow transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-serif-vintage text-base sm:text-lg leading-tight">THPT Chuyên Sơn La</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#eccb76] font-mono tracking-wider uppercase">Trạm Kết Nối Số · 20/11</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-600/40 text-[9px] text-emerald-300 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Sync</span>
              </span>
            </div>
          </div>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-[#d1cbb9]" aria-label="Main navigation">
          <a
            href="#contest-framework"
            className="hover:text-[#f8f4e6] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 text-[#eccb76]"
          >
            Khung 4 Phần 20/11
          </a>
          <a
            href="#scrapbook"
            className="hover:text-[#f8f4e6] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8"
          >
            Lật Giở Ký Ức
          </a>
          <a
            href="#teachers"
            className="hover:text-[#f8f4e6] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8"
          >
            Tri Ân Thầy Cô
          </a>
          <a
            href="#padlet"
            className="hover:text-[#f8f4e6] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 flex items-center gap-1 text-[#f3d085]"
          >
            <span>📌 Bảng Padlet Kỷ Niệm</span>
          </a>
          <a
            href="#guestbook"
            className="hover:text-[#f8f4e6] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8"
          >
            Hòm Thư Số
          </a>
          <button
            onClick={onOpenCardMaker}
            className="hover:text-[#f8f4e6] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 cursor-pointer"
          >
            Tạo Thiệp
          </button>
          <a
            href="https://www.facebook.com/chuyensonlaofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-md bg-[#1877f2]/20 hover:bg-[#1877f2]/30 text-[#60a5fa] border border-[#1877f2]/40 transition-colors flex items-center gap-1.5"
            title="Fanpage Facebook chính thức THPT Chuyên Sơn La"
          >
            <span>Facebook</span>
            <span className="text-[10px]">↗</span>
          </a>
        </nav>

        {/* Zone 3: 1 primary action + audio/petal toggles */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Cinematic Prologue Button */}
          {onOpenPrologue && (
            <button
              onClick={onOpenPrologue}
              title="Xem thước phim điện ảnh mở màn tri ân"
              className="p-2 rounded-lg bg-[#273a2d] border border-[#e4c77d]/40 text-[#eccb76] hover:bg-[#344d3d] transition-all cursor-pointer text-xs flex items-center gap-1.5 shadow-sm"
              aria-label="Thước phim tri ân"
            >
              <Film className="w-4 h-4 text-[#eccb76] animate-pulse" />
              <span className="hidden sm:inline font-semibold text-xs">Thước phim 🎬</span>
            </button>
          )}

          {/* Bell Chime Sound Button */}
          <button
            onClick={handlePlayBell}
            title="Nghe tiếng chuông trường thân thương"
            className="p-2 rounded-lg bg-[#1a2d21] border border-[#344d3d] text-[#e4c77d] hover:bg-[#223a2b] transition-colors cursor-pointer text-xs flex items-center gap-1.5"
            aria-label="Tiếng chuông trường"
          >
            <span className="text-sm">🔔</span>
            <span className="hidden sm:inline font-mono text-xs">Chuông trường</span>
          </button>


          {/* Petals toggle */}
          <button
            onClick={onTogglePetals}
            title={petalsEnabled ? 'Tắt hiệu ứng hoa ban rơi' : 'Bật hiệu ứng hoa ban rơi'}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              petalsEnabled
                ? 'bg-[#1a2d21] border-[#e4c77d]/50 text-[#e4c77d]'
                : 'bg-[#1a2d21] border-[#344d3d] text-slate-500'
            }`}
            aria-label="Hiệu ứng hoa ban"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Primary CTA button */}
          <button
            onClick={onOpenComposer}
            className="px-4 py-2 text-xs font-semibold text-[#18261d] bg-[#e4c77d] hover:bg-[#edd797] rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Gửi lời tri ân</span>
          </button>
        </div>
      </div>
    </header>
  );
};

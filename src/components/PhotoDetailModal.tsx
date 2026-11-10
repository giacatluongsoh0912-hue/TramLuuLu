import React from 'react';
import { X, Heart, Sparkles, MapPin, Calendar, Award } from 'lucide-react';
import { MemoryPhoto } from '../data/memoriesData';

interface PhotoDetailModalProps {
  memory: MemoryPhoto | null;
  onClose: () => void;
  onOpenComposer: () => void;
}

export const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  memory,
  onClose,
  onOpenComposer,
}) => {
  if (!memory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#15231a] border border-[#35533e] rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-6 text-[#f5ebd7]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#bfaea0] hover:text-white p-1 rounded-lg cursor-pointer transition-colors z-20 bg-black/40"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Photo on left / top */}
          <div className="lg:col-span-7">
            <div className="relative rounded-xl overflow-hidden bg-[#0d1610] border-2 border-[#2b4432] shadow-2xl">
              <img
                src={memory.imageSrc}
                alt={memory.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[70vh] object-contain mx-auto"
              />
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/20 text-xs flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#eccb76]" />
                <span>Trường THPT Chuyên Tỉnh Sơn La</span>
              </div>
            </div>
          </div>

          {/* Details on right */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#eccb76] uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{memory.year}</span>
              </div>

              <h3 className="font-serif-vintage text-2xl sm:text-3xl font-bold text-white leading-tight">
                {memory.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-[#b8ad95] mt-2">
                <span>Đóng góp bởi:</span>
                <span className="font-script-calligraphy text-base font-bold text-[#eccb76]">
                  {memory.author}
                </span>
              </div>

              <div className="mt-5 p-4 rounded-xl bg-[#101b13] border border-[#273e2e]">
                <p className="font-body text-xs sm:text-sm text-[#ded7c3] leading-relaxed italic">
                  &ldquo;{memory.caption}&rdquo;
                </p>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {memory.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-[#1e3425] border border-[#30523b] text-[#d6cdb7]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#2a4332] flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenComposer();
                }}
                className="flex-1 py-3 px-4 rounded-lg bg-[#e4c77d] hover:bg-[#edd79b] text-[#1a160e] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>Viết lưu bút cho khoảnh khắc này</span>
              </button>

              <button
                onClick={onClose}
                className="py-3 px-4 rounded-lg bg-[#22382b] hover:bg-[#2c4837] text-white text-xs font-semibold transition-colors cursor-pointer border border-[#3b5e46]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

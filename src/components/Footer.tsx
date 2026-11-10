import React from 'react';
import { ArrowUp, Heart, MapPin, Phone, Mail, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0b120d] text-[#b8ab91] border-t border-[#1e3023] pt-14 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#1b2b20]">
          
          {/* Col 1: School Identity */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/Logo_THPT_Chuyen_Son_La_bf6a8e06.png"
                alt="Logo Trường THPT Chuyên Sơn La"
                className="w-12 h-12 object-contain drop-shadow"
              />
              <div>
                <h4 className="font-serif-vintage text-base font-bold text-white uppercase tracking-wider">
                  Trường THPT Chuyên Tỉnh Sơn La
                </h4>
                <span className="text-xs text-[#8c9e90]">
                  Trạm Kết Nối Số · Tri Ân Người Dẫn Lối 20/11
                </span>
              </div>
            </div>

            <p className="font-body text-xs text-[#9aa99c] leading-relaxed max-w-sm">
              Nơi lưu giữ những ký ức trong trẻo nhất của tuổi học trò, nơi kết nối các thế hệ học sinh trở về với cội nguồn yêu thương và tri ân những người thầy, người cô cần mẫn.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="text-xs text-[#cfc5aa] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#eccb76]" />
                <span>Cái nôi ươm mầm tài năng Tây Bắc</span>
              </div>
              <a
                href="https://www.facebook.com/chuyensonlaofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1877f2]/20 hover:bg-[#1877f2]/30 text-[#60a5fa] border border-[#1877f2]/40 text-xs transition-colors"
              >
                <span>Fanpage: chuyensonlaofficial</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* Col 2: School Contact & Location */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="font-serif-vintage text-sm font-semibold text-white uppercase tracking-wider">
              Thông Tin Mái Trường
            </h5>
            <ul className="space-y-2.5 text-xs text-[#9aa99c]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#eccb76] shrink-0 mt-0.5" />
                <span>Tổ 3, Phường Chiềng Sinh, Thành phố Sơn La, Tỉnh Sơn La</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#eccb76] shrink-0" />
                <span>Điện thoại: 0212 3874 123</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#eccb76] shrink-0" />
                <span>Email: thptchuyen.sonla@moet.edu.vn</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links & Back to Top */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="font-serif-vintage text-sm font-semibold text-white uppercase tracking-wider">
              Hành Trình Ký Ức
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Trạm đón khách
                </a>
              </li>
              <li>
                <a href="#scrapbook" className="hover:text-white transition-colors">
                  Lật giở ký ức Chuyên Sơn La
                </a>
              </li>
              <li>
                <a href="#teachers" className="hover:text-white transition-colors">
                  Người dẫn lối & Thắp nến tri ân
                </a>
              </li>
              <li>
                <a href="#guestbook" className="hover:text-white transition-colors">
                  Sổ lưu bút của cựu học sinh
                </a>
              </li>
              <li>
                <a href="#quiz" className="hover:text-white transition-colors">
                  Trắc nghiệm góc kỷ niệm
                </a>
              </li>
            </ul>

            <button
              onClick={scrollToTop}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#162319] hover:bg-[#203325] text-xs text-[#ded4be] border border-[#283e2e] transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#eccb76]" />
              <span>Về đầu trang</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7d8c80]">
          <div>
            © {new Date().getFullYear()} Trường THPT Chuyên Tỉnh Sơn La. Dự án số hóa kỷ niệm tri ân thầy cô.
          </div>
          <div className="flex items-center gap-1.5 text-[#a89c84]">
            <span>Được thực hiện với</span>
            <Heart className="w-3.5 h-3.5 fill-[#a83232] text-[#a83232]" />
            <span>bởi các thế hệ học trò Chuyên Sơn La</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { X, Award, Calendar, CheckCircle2, QrCode } from 'lucide-react';

interface ContestRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQRCode: () => void;
}

export const ContestRulesModal: React.FC<ContestRulesModalProps> = ({
  isOpen,
  onClose,
  onOpenQRCode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#16251b] border border-[#3b5d44] rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-6 text-[#f5ebd7]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#bfaea0] hover:text-white p-1 rounded-lg cursor-pointer transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#2b4433]">
          <img
            src="/assets/aistudio/Logo_THPT_Chuyen_Son_La_bf6a8e06.png"
            alt="Logo THPT Chuyên Sơn La"
            className="w-12 h-12 object-contain drop-shadow"
          />
          <div>
            <span className="text-[10px] font-mono uppercase text-[#eccb76] tracking-wider">
              TRƯỜNG THPT CHUYÊN TỈNH SƠN LA · ĐOÀN THANH NIÊN
            </span>
            <h3 className="font-serif-vintage text-2xl font-bold text-white">
              Kế Hoạch & Thể Lệ Cuộc Thi Sáng Tạo Số 20/11
            </h3>
          </div>
        </div>

        {/* Modal Content */}
        <div className="space-y-6 text-xs sm:text-sm text-[#ded4bf] leading-relaxed max-h-[65vh] overflow-y-auto pr-2">
          
          {/* Section 1: Mục đích, Yêu cầu */}
          <div className="bg-[#111c15] p-5 rounded-xl border border-[#273d2d]">
            <h4 className="font-serif-vintage text-base font-bold text-white mb-2 text-[#eccb76]">
              I. MỤC ĐÍCH, YÊU CẦU
            </h4>
            <div className="space-y-2">
              <p>
                <strong>1. Mục đích:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-[#b8ad95]">
                <li>Phát huy truyền thống “Tôn sư trọng đạo”, uống nước nhớ nguồn của dân tộc; bày tỏ lòng tri ân sâu sắc đối với sự cống hiến của thầy cô giáo Trường THPT Chuyên Sơn La.</li>
                <li>Tạo môi trường thực hành kỹ năng số thực tiễn; phát huy năng lực sáng tạo của học sinh chuyên thông qua việc số hóa không gian tri ân, kết nối bền chặt giữa cựu học sinh và học sinh đang theo học.</li>
                <li>Tạo phong trào thi đua học tốt, giành nhiều hoa điểm 9, điểm 10, phấn đấu xây dựng các giờ học tốt, ngày học tốt chào mừng 20/11.</li>
              </ul>

              <p className="pt-1">
                <strong>2. Yêu cầu:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-[#b8ad95]">
                <li>100% các Chi đoàn và đoàn viên, học sinh tham gia với tinh thần trách nhiệm, tích cực và chủ động.</li>
                <li>Hoạt động tổ chức thiết thực, sáng tạo, tiết kiệm, liêm chính học thuật và giữ vững an toàn thông tin mạng.</li>
              </ul>
            </div>
          </div>

          {/* Section 2: Thời gian, Đối tượng */}
          <div className="bg-[#111c15] p-5 rounded-xl border border-[#273d2d]">
            <h4 className="font-serif-vintage text-base font-bold text-white mb-2 text-[#eccb76]">
              II. THỜI GIAN, ĐỐI TƯỢNG VÀ NỘI DUNG THỰC HIỆN
            </h4>
            <div className="space-y-2 text-xs">
              <p>
                <strong>1. Thời gian & Đối tượng:</strong>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
                <div className="p-2.5 rounded-lg bg-[#18281e] border border-[#2d4635]">
                  <span className="font-semibold text-white block">Thời gian triển khai:</span>
                  <span className="text-[#eccb76]">26/10/2026 - 21/11/2026 (4 tuần cao điểm)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#18281e] border border-[#2d4635]">
                  <span className="font-semibold text-white block">Tổng kết & Trao thưởng:</span>
                  <span className="text-[#eccb76]">Ngày 30/11/2026</span>
                </div>
              </div>
              <p>
                <strong>Đối tượng tham gia:</strong> Toàn thể học sinh thuộc các khối lớp 10, 11, 12 Trường THPT Chuyên Sơn La.
              </p>
            </div>
          </div>

          {/* Section 3: Khung 4 nội dung */}
          <div className="bg-[#111c15] p-5 rounded-xl border border-[#273d2d]">
            <h4 className="font-serif-vintage text-base font-bold text-white mb-2 text-[#eccb76]">
              III. KHUNG 4 NỘI DUNG BẮT BUỘC CỦA SẢN PHẨM SỐ
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-[#18281e]">
                <strong className="text-white">Phần 1 - Thông điệp tri ân:</strong> Lời tựa, thư ngỏ hoặc video ngắn bày tỏ lòng biết ơn của tập thể lớp gửi đến thầy cô.
              </div>
              <div className="p-2.5 rounded-lg bg-[#18281e]">
                <strong className="text-white">Phần 2 - Thầy trò Chuyên Sơn La:</strong> Ghi lại khoảnh khắc đời thường, ấn tượng trong tiết học, hoạt động ngoại khóa gắn liền với thầy cô chủ nhiệm và bộ môn.
              </div>
              <div className="p-2.5 rounded-lg bg-[#18281e] border-l-2 border-[#eccb76]">
                <strong className="text-[#eccb76]">Phần 3 - Hòm thư số kết nối cựu học sinh (Trọng tâm):</strong> Tích hợp biểu mẫu mở để cựu học sinh các khóa K28 - K32 gửi lời chúc, tâm sự và kỷ niệm xưa.
              </div>
              <div className="p-2.5 rounded-lg bg-[#18281e]">
                <strong className="text-white">Phần 4 - Sản phẩm sáng tạo mở rộng:</strong> Tích hợp Podcast Radio học đường, Infographic tri ân, truyện tranh kỷ niệm hoặc sáng tác văn thơ học sinh.
              </div>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-[#2b4433] flex justify-between items-center">
          <button
            onClick={() => {
              onClose();
              onOpenQRCode();
            }}
            className="px-4 py-2 rounded-lg bg-[#cbbaa1] hover:bg-[#dbccb5] text-[#1c1810] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            <span>Tạo Mã QR Góc Tri Ân Lớp Học</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#22392b] hover:bg-[#2c4a37] text-white text-xs font-medium cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

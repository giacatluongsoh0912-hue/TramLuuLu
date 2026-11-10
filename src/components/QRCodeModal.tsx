import React, { useState, useEffect, useRef } from 'react';
import { X, Printer, QrCode, Download, Copy, Check, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const [className, setClassName] = useState('Chi đoàn 12 Chuyên Toán');
  const [academicYear, setAcademicYear] = useState('Niên khóa 2024 - 2027');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const currentUrl = window.location.href;
    QRCode.toDataURL(currentUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#142b1d',
        light: '#fbf7ee',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#17271e] border border-[#375a42] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-6 text-[#f6eedb]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#bfaea0] hover:text-white p-1 rounded-lg cursor-pointer transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#2b4433]">
          <div className="w-10 h-10 rounded-full bg-[#cbbaa1] text-[#1c1810] flex items-center justify-center font-bold">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-vintage text-2xl font-bold text-white">
              Mã QR Góc Tri Ân Lớp Học
            </h3>
            <p className="text-xs text-[#b8ad95]">
              In và đóng khung trang trọng đặt tại Bảng tin phụ của Chi đoàn theo quy định cuộc thi
            </p>
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
              Tên Chi đoàn / Lớp học:
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Ví dụ: Chi đoàn 12 Chuyên Toán"
              className="w-full bg-[#111c15] border border-[#2d4635] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
              Niên khóa:
            </label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="Ví dụ: Niên khóa 2024 - 2027"
              className="w-full bg-[#111c15] border border-[#2d4635] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
            />
          </div>
        </div>

        {/* Printable Poster Frame Preview */}
        <div
          ref={printRef}
          className="bg-[#fbf7ee] text-[#1c2b20] p-6 sm:p-8 rounded-xl border-4 border-[#2b4432] shadow-xl text-center relative overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(#ebd9bd 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        >
          {/* Top Decorative Border */}
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#7a6d55] pb-2 border-b border-[#d8c8ab]">
            TRƯỜNG THPT CHUYÊN TỈNH SƠN LA · CUỘC THI SÁNG TẠO SỐ 20/11
          </div>

          {/* School Badge */}
          <div className="my-3 flex items-center justify-center gap-2">
            <img
              src="/assets/aistudio/Logo_THPT_Chuyen_Son_La_bf6a8e06.png"
              alt="Logo THPT Chuyên Sơn La"
              className="w-14 h-14 object-contain drop-shadow"
            />
          </div>

          <h4 className="font-serif-vintage text-xl sm:text-2xl font-bold text-[#1a2d21] tracking-tight">
            TRẠM KẾT NỐI SỐ: TRI ÂN NGƯỜI DẪN LỐI
          </h4>
          <div className="text-sm font-semibold text-[#8a6829] mt-0.5 font-script-calligraphy text-base">
            Góc tri ân của {className} · {academicYear}
          </div>

          {/* QR Code Graphic */}
          <div className="my-4 inline-block p-3 bg-white border-2 border-[#1a2d21] rounded-xl shadow-md">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Mã QR Tri ân" className="w-48 h-48 sm:w-52 sm:h-52 mx-auto" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                Đang tạo mã QR...
              </div>
            )}
          </div>

          <p className="text-xs text-[#4d402f] max-w-md mx-auto leading-relaxed italic font-serif-vintage">
            &ldquo;Quét mã QR bằng điện thoại thông minh để xem toàn bộ thông điệp tri ân, video, khoảnh khắc lớp học và gửi lời chúc vào hòm thư số.&rdquo;
          </p>

          <div className="mt-4 pt-3 border-t border-[#d8c8ab] text-[10px] font-mono text-[#7a6d55] flex justify-between items-center">
            <span>Chiềng Sinh, Sơn La</span>
            <span>Chào mừng Ngày Nhà giáo Việt Nam 20/11</span>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2.5 rounded-lg bg-[#22392b] hover:bg-[#2c4a37] text-xs font-semibold text-[#f5ebd5] transition-colors flex items-center gap-2 cursor-pointer border border-[#3b5e46]"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép link!' : 'Sao chép đường dẫn'}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-xs font-medium text-[#bfaea0] hover:text-white cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-lg bg-[#cbbaa1] hover:bg-[#dbccb5] text-[#1c1810] font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>In Khung QR Bảng Tin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

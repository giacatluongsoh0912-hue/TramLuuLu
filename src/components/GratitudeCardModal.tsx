import React, { useState } from 'react';
import { X, Copy, Check, Printer, Sparkles, RefreshCw } from 'lucide-react';
import { generateCardId } from '../utils/tributeRules';

interface GratitudeCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PREMADE_TEMPLATES = [
  {
    title: 'Người Lái Đò Thầm Lặng',
    content: 'Kính gửi Thầy/Cô! Dòng sông thời gian cứ mải miết trôi, nhưng bến đỗ Chuyên Sơn La và bóng hình cần mẫn của thầy cô vẫn luôn vẹn nguyên trong ký ức của em. Cảm ơn thầy cô đã trao cho em đôi cánh tri thức và một trái tim biết yêu thương.',
  },
  {
    title: 'Mùa Hoa Ban Năm Ấy',
    content: 'Tháng ba về, hoa ban lại phủ trắng sườn đồi Sam Si. Dù đã đi thật xa, em vẫn nhớ như in những bài học sâu sắc, những ánh mắt trìu mến của thầy cô trong lớp học ngày ấy. Kính chúc thầy cô luôn dồi dào sức khỏe và bình an!',
  },
  {
    title: 'Tri Ân Người Dẫn Lối',
    content: 'Có những bài toán cuộc đời khó hơn bất kỳ đề thi nào em từng gặp, nhưng chính ngọn lửa kiên định mà thầy cô đã thắp lên trong em năm xưa đã giúp em vững vàng vượt qua. Em xin cúi đầu cảm tạ ơn sâu!',
  },
  {
    title: 'Lời Xin Lỗi & Cảm Ơn Muộn Màng',
    content: 'Cảm ơn thầy cô vì đã luôn bao dung cho những lần em bướng bỉnh, lười học năm xưa. Giờ đây khi đã bước vào đời, em mới thấu hiểu từng giọt mồ hôi và tâm huyết mà thầy cô đã dành trọn cho chúng em.',
  },
];

export const GratitudeCardModal: React.FC<GratitudeCardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [recipient, setRecipient] = useState('Cô giáo kính yêu');
  const [sender, setSender] = useState('Học trò cũ');
  const [batch, setBatch] = useState('Chuyên Sơn La');
  const [content, setContent] = useState(PREMADE_TEMPLATES[0].content);
  const [cardId, setCardId] = useState(() => generateCardId());
  const [copied, setCopied] = useState(false);
  const [sealStyle, setSealStyle] = useState<'gold' | 'red' | 'ban'>('gold');

  if (!isOpen) return null;

  const handleCopyText = () => {
    const fullText = `[THIỆP TRI ÂN CHUYÊN SƠN LA - ${cardId}]\n\nKính gửi: ${recipient}\n\n"${content}"\n\nNgười gửi: ${sender} (${batch})\nTrường THPT Chuyên Sơn La · Tri ân người dẫn lối`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRegenerateId = () => {
    setCardId(generateCardId());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#18271e] border border-[#3b5e46] rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-6 text-[#f5ebd7]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#bfaea0] hover:text-white p-1 rounded-lg cursor-pointer transition-colors"
          aria-label="Đóng thiệp"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#2d4734]">
          <div className="w-9 h-9 rounded-full bg-[#cbbaa1] text-[#221c13] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-vintage text-2xl font-bold text-white">
              Tạo Thiệp Tri Ân Vintage
            </h3>
            <p className="text-xs text-[#b8ad95]">
              Tùy biến tấm thiệp lưu niệm trang trọng để gửi tặng thầy cô qua Zalo, Messenger hoặc in làm quà
            </p>
          </div>
        </div>

        {/* Two Column Layout: Editor on Left, Live Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                Kính gửi Thầy/Cô:
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Ví dụ: Thầy Trần Văn Cường"
                className="w-full bg-[#121c16] border border-[#304d39] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Người gửi:
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="Tên bạn"
                  className="w-full bg-[#121c16] border border-[#304d39] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Lớp / Khóa:
                </label>
                <input
                  type="text"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="Ví dụ: K31 Chuyên Tin"
                  className="w-full bg-[#121c16] border border-[#304d39] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                />
              </div>
            </div>

            {/* Template Buttons */}
            <div>
              <label className="block text-xs font-semibold text-[#ded5c0] mb-1.5">
                Chọn mẫu lời chúc ý nghĩa:
              </label>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {PREMADE_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setContent(tmpl.content)}
                    className="p-2 rounded-lg bg-[#142218] hover:bg-[#1e3425] border border-[#304d39] text-[#cfc5aa] text-left cursor-pointer transition-colors"
                  >
                    💌 {tmpl.title}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                Lời nhắn tùy chỉnh:
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-[#121c16] border border-[#304d39] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d] resize-none"
              />
            </div>

            {/* Seal style */}
            <div>
              <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                Dấu niêm phong vintage:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSealStyle('gold')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs cursor-pointer border ${
                    sealStyle === 'gold' ? 'bg-[#e4c77d] text-[#1c160e] font-bold border-[#e4c77d]' : 'bg-[#121c16] border-[#304d39] text-[#cfc5aa]'
                  }`}
                >
                  ⚜️ Hoàng kim
                </button>
                <button
                  type="button"
                  onClick={() => setSealStyle('red')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs cursor-pointer border ${
                    sealStyle === 'red' ? 'bg-[#992525] text-white font-bold border-[#992525]' : 'bg-[#121c16] border-[#304d39] text-[#cfc5aa]'
                  }`}
                >
                  🏮 Sáp đỏ
                </button>
                <button
                  type="button"
                  onClick={() => setSealStyle('ban')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs cursor-pointer border ${
                    sealStyle === 'ban' ? 'bg-[#294232] text-[#eccb76] font-bold border-[#eccb76]' : 'bg-[#121c16] border-[#304d39] text-[#cfc5aa]'
                  }`}
                >
                  🌸 Hoa ban
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopyText}
                className="flex-1 py-2.5 px-3 rounded-lg bg-[#cbbaa1] hover:bg-[#d9ccb6] text-[#1e1a12] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã sao chép!' : 'Sao chép nội dung'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-lg bg-[#243c2c] hover:bg-[#2d4b37] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-[#3b5e46]"
                title="In thiệp kỷ niệm"
              >
                <Printer className="w-4 h-4" />
                <span>In thiệp</span>
              </button>
            </div>
          </div>

          {/* Live Card Preview Column */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div
              id="printable-card"
              className="w-full bg-[#f6eedb] text-[#241d14] rounded-xl p-6 sm:p-8 border-4 border-[#334e3a] shadow-2xl relative overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(#e5dac1 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            >
              {/* Ornate Vintage Corners */}
              <div className="absolute top-2 left-2 text-[#b09e7c] text-lg select-none">╔</div>
              <div className="absolute top-2 right-2 text-[#b09e7c] text-lg select-none">╗</div>
              <div className="absolute bottom-2 left-2 text-[#b09e7c] text-lg select-none">╚</div>
              <div className="absolute bottom-2 right-2 text-[#b09e7c] text-lg select-none">╝</div>

              {/* School Crest & Header Lockup */}
              <div className="text-center pb-4 border-b border-[#c9b794] relative">
                <div className="inline-flex items-center justify-center mb-2">
                  <img
                    src="/assets/aistudio/Logo_THPT_Chuyen_Son_La_bf6a8e06.png"
                    alt="Logo THPT Chuyên Sơn La"
                    className="w-14 h-14 object-contain drop-shadow"
                  />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#786a51]">
                  TRƯỜNG THPT CHUYÊN TỈNH SƠN LA
                </div>
                <h4 className="font-serif-vintage text-xl sm:text-2xl font-bold text-[#1f2922] mt-1">
                  THƯ TRI ÂN NGƯỜI DẪN LỐI
                </h4>
                <div className="text-[10px] font-mono text-[#8a7b62] mt-1">
                  Mã lưu niệm: <span className="font-bold">{cardId}</span>
                </div>
              </div>

              {/* Salutation */}
              <div className="mt-6 mb-3">
                <span className="font-script-calligraphy text-lg sm:text-xl font-bold text-[#5c4a30]">
                  Kính gửi: {recipient}
                </span>
              </div>

              {/* Body Content */}
              <p className="font-serif-vintage text-sm sm:text-base leading-relaxed text-[#2c2419] italic whitespace-pre-line min-h-[90px]">
                &ldquo;{content}&rdquo;
              </p>

              {/* Card Footer: Signature & Vintage Seal */}
              <div className="mt-8 pt-4 border-t border-[#c9b794] flex items-end justify-between">
                <div>
                  <div className="text-[11px] font-mono text-[#786a51]">
                    Núi Sam Si · Chiềng Sinh, Sơn La
                  </div>
                  <div className="text-xs font-semibold text-[#3d3222] mt-0.5">
                    Trọng ơn Thầy Cô suốt một đời
                  </div>
                </div>

                {/* Wax seal sticker */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-full flex flex-col items-center justify-center text-center shadow-lg border-2 ${
                      sealStyle === 'gold'
                        ? 'bg-[#d4af37] border-[#fff2b2] text-[#33250b]'
                        : sealStyle === 'red'
                        ? 'bg-[#a32222] border-[#f08585] text-white'
                        : 'bg-[#1b3b28] border-[#a0d2af] text-[#eed797]'
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-tight leading-none">TRI ÂN</span>
                    <span className="text-xs">✦</span>
                    <span className="text-[8px] font-mono leading-none">20/11</span>
                  </div>
                  <span className="font-script-calligraphy text-sm font-bold text-[#453725] mt-1.5">
                    {sender} ({batch})
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between w-full text-xs text-[#b8ad95]">
              <span>Gợi ý: Nhấn &ldquo;Sao chép&rdquo; để dán vào tin nhắn gửi thầy cô!</span>
              <button
                type="button"
                onClick={handleRegenerateId}
                className="text-[#eccb76] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Đổi mã số</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

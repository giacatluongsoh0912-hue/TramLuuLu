import React, { useState } from 'react';
import { Sparkles, RotateCcw, Heart, CheckCircle2 } from 'lucide-react';
import { NOSTALGIA_QUIZ } from '../data/memoriesData';

interface QuizNostalgiaProps {
  onOpenCardMaker: () => void;
}

export const QuizNostalgia: React.FC<QuizNostalgiaProps> = ({ onOpenCardMaker }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleSelectOption = (optionIndex: number) => {
    const nextAnswers = [...selectedAnswers, optionIndex];
    setSelectedAnswers(nextAnswers);

    if (currentQuestion + 1 < NOSTALGIA_QUIZ.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
  };

  const getResultArchetype = () => {
    const first = selectedAnswers[0] || 0;
    switch (first) {
      case 0:
        return {
          title: 'Người Bạn Tri Kỷ Của Góc Thư Viện',
          quote: 'Bạn là người thích sự tĩnh lặng, tìm kiếm sự an yên giữa những trang sách và ánh nắng vàng vọt buông qua khung cửa kính tầng 3.',
          icon: '📚',
          advice: 'Những ngày tháng miệt mài bên trang sách cùng thầy cô chính là nền móng vững chắc nhất cho bạn ngày hôm nay.',
        };
      case 1:
        return {
          title: 'Tâm Hồn Hoa Ban Sam Si Dịu Dàng',
          quote: 'Thanh xuân của bạn gắn liền với những mùa hoa ban bung nở trắng sân trường, tiếng chim ríu rít và những nụ cười trong veo.',
          icon: '🌸',
          advice: 'Bạn luôn giữ được sự trong sáng, hồn hậu và tình cảm ấm áp hướng về những người đã dạy dỗ mình.',
        };
      case 2:
        return {
          title: 'Ngọn Lửa Đam Mê Nghiên Cứu & Đội Tuyển',
          quote: 'Bạn không bao giờ chịu lùi bước trước bất kỳ đề bài hóc búa nào, sẵn sàng thức thâu đêm cùng thầy cô tìm ra lời giải đẹp nhất.',
          icon: '🔬',
          advice: 'Ý chí kiên định và lòng quả cảm được tôi luyện ở Chuyên Sơn La sẽ luôn dẫn đường cho bạn chạm tới đỉnh cao.',
        };
      case 3:
      default:
        return {
          title: 'Trái Tim Rộn Rã Của Sân Trường Tuổi Trẻ',
          quote: 'Tiếng cười của bạn vang khắp hành lang, những buổi tập văn nghệ và giải bóng đá trường là những thước phim đẹp nhất.',
          icon: '⚽',
          advice: 'Sự nhiệt huyết và năng lượng tích cực của bạn luôn là niềm tự hào và niềm vui của thầy cô mỗi khi nhớ về.',
        };
    }
  };

  const q = NOSTALGIA_QUIZ[currentQuestion];
  const archetype = getResultArchetype();

  return (
    <section id="quiz" className="py-16 bg-[#0c160f]/80 backdrop-blur-md relative border-b border-[#24392a]/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#eccb76] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trắc nghiệm hoài niệm</span>
          </div>
          <h2 className="font-serif-vintage text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Góc Kỷ Niệm Của Bạn Ở Chuyên Sơn La
          </h2>
          <p className="text-sm text-[#b6ab93] mt-2 font-body">
            4 câu hỏi ngắn giúp bạn quay ngược thời gian, tìm lại góc nhỏ giữ trọn thanh xuân của mình
          </p>
        </div>

        {/* Quiz Card */}
        <div className="bg-[#18271e] border border-[#2d4734] rounded-2xl p-6 sm:p-10 shadow-2xl relative">
          {!showResult ? (
            <div>
              {/* Progress bar */}
              <div className="flex items-center justify-between text-xs text-[#b8ad95] mb-4 pb-2 border-b border-[#253d2c]">
                <span>Câu hỏi {currentQuestion + 1} / {NOSTALGIA_QUIZ.length}</span>
                <span className="font-mono">{Math.round(((currentQuestion + 1) / NOSTALGIA_QUIZ.length) * 100)}%</span>
              </div>

              {/* Question */}
              <h3 className="font-serif-vintage text-xl sm:text-2xl font-bold text-white mb-6 leading-snug">
                {q.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className="w-full text-left p-4 rounded-xl bg-[#121f17] hover:bg-[#1e3425] border border-[#2d4734] hover:border-[#eccb76]/60 transition-all text-xs sm:text-sm text-[#ede7d5] flex items-center justify-between group cursor-pointer"
                  >
                    <span className="leading-relaxed">{opt.label}</span>
                    <span className="w-6 h-6 rounded-full border border-[#43644d] flex items-center justify-center text-[10px] text-[#b8ad95] group-hover:border-[#eccb76] group-hover:text-[#eccb76] shrink-0 ml-3">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-[#243e2e] border-2 border-[#eccb76] flex items-center justify-center text-4xl mx-auto shadow-lg mb-4">
                {archetype.icon}
              </div>

              <div className="text-xs font-mono uppercase tracking-widest text-[#eccb76]">
                Kết Quả Chuyến Tàu Ký Ức
              </div>

              <h3 className="font-serif-vintage text-2xl sm:text-3xl font-bold text-white mt-2 mb-3">
                {archetype.title}
              </h3>

              <p className="font-serif-vintage italic text-base sm:text-lg text-[#ede4cf] max-w-xl mx-auto leading-relaxed mb-4">
                &ldquo;{archetype.quote}&rdquo;
              </p>

              <div className="bg-[#121c16] rounded-xl p-4 max-w-lg mx-auto border border-[#273e2e] mb-8 text-xs text-[#b8ad95]">
                <p>{archetype.advice}</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 rounded-lg bg-[#22392b] hover:bg-[#2d4c38] text-xs font-semibold text-[#f5ebd7] transition-colors flex items-center gap-2 cursor-pointer border border-[#3b5e46]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm lại trắc nghiệm</span>
                </button>

                <button
                  onClick={onOpenCardMaker}
                  className="px-6 py-2.5 rounded-lg bg-[#e4c77d] hover:bg-[#edd79b] text-xs font-bold text-[#1a160e] transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Viết thiệp tri ân kỷ niệm</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

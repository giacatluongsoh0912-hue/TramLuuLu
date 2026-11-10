import React, { useState } from 'react';
import { Flame, Send, Sparkles, Award } from 'lucide-react';
import { DepartmentFaculty } from '../data/memoriesData';

interface TeacherTributesProps {
  departments: DepartmentFaculty[];
  onSelectDepartmentForLetter: (deptName: string) => void;
}

export const TeacherTributes: React.FC<TeacherTributesProps> = ({
  departments,
  onSelectDepartmentForLetter,
}) => {
  const [candles, setCandles] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    departments.forEach((d) => {
      map[d.id] = d.candleCount;
    });
    return map;
  });

  const [recentlyLit, setRecentlyLit] = useState<string | null>(null);

  const handleLightCandle = (deptId: string, deptName: string, initialCandles: number) => {
    setCandles((prev) => ({
      ...prev,
      [deptId]: (prev[deptId] !== undefined ? prev[deptId] : initialCandles) + 1,
    }));
    setRecentlyLit(deptName);
    setTimeout(() => {
      setRecentlyLit(null);
    }, 3000);
  };

  const totalCandles = departments.reduce(
    (sum, d) => sum + (candles[d.id] !== undefined ? candles[d.id] : d.candleCount),
    0
  );

  return (
    <section id="teachers" className="py-16 bg-[#0d1710]/80 backdrop-blur-md relative border-b border-[#24392b]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#eccb76] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kính dâng thầy cô Chuyên Sơn La</span>
          </div>
          <h2 className="font-serif-vintage text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Người Dẫn Lối Thầm Lặng
          </h2>
          <p className="font-body text-sm sm:text-base text-[#b6ab93] mt-3 leading-relaxed">
            Mỗi bài giảng là một chuyến đò, mỗi lời khuyên là một ngọn hải đăng soi sáng con đường tuổi trẻ. Hãy cùng thắp sáng những ngọn nến tri ân gửi đến từng tổ chuyên môn kính mến.
          </p>

          {/* Aggregate Stat Banner */}
          <div className="mt-6 inline-flex items-center gap-3 bg-[#1e3325] border border-[#34533d] px-5 py-2.5 rounded-full shadow-inner">
            <Flame className="w-5 h-5 text-[#f59e0b] fill-[#f59e0b] animate-bounce" />
            <span className="text-xs sm:text-sm font-medium text-[#f5ecd5]">
              Đã có <span className="font-bold text-[#eccb76] font-mono">{totalCandles.toLocaleString()}</span> ngọn nến tri ân được thắp sáng
            </span>
          </div>

          {recentlyLit && (
            <div className="mt-3 text-xs font-semibold text-[#86efac] animate-fade-in">
              ✨ Cảm ơn bạn! Ngọn nến tri ân đã được thắp sáng gửi tới {recentlyLit}.
            </div>
          )}
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => {
            const candleCount = candles[dept.id] || dept.candleCount;

            return (
              <div
                key={dept.id}
                className="bg-[#18271e] border border-[#2a4332] rounded-xl p-5 flex flex-col justify-between hover:border-[#426b4f] transition-all duration-300 shadow-lg group hover:-translate-y-1"
              >
                <div>
                  {/* Department Badge and Code */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#243a2b]">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#eccb76] font-semibold">
                      {dept.code}
                    </span>
                    <span className="text-[11px] text-[#8fa293] font-body flex items-center gap-1">
                      <Award className="w-3 h-3 text-[#eccb76]" />
                      {dept.teacherCount} Thầy Cô
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-serif-vintage text-lg font-bold text-white group-hover:text-[#eccb76] transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-[#b8ad95] mt-1.5 font-body leading-relaxed">
                    {dept.tagline}
                  </p>

                  {/* Teacher Quote */}
                  <div className="mt-4 p-3 rounded-lg bg-[#111c15] border border-[#233529] relative">
                    <p className="font-serif-vintage italic text-xs text-[#ded7c3] leading-relaxed">
                      &ldquo;{dept.featuredQuote}&rdquo;
                    </p>
                    <span className="block mt-2 text-[10px] text-[#86998b] font-medium">
                      — {dept.headTeacher}
                    </span>
                  </div>
                </div>

                {/* Card Actions: Light Candle & Send Letter */}
                <div className="mt-5 pt-3 border-t border-[#243a2b] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleLightCandle(dept.id, dept.name, dept.candleCount)}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#22392b] hover:bg-[#2c4a37] text-xs font-semibold text-[#f8edd2] transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#3b5e47] active:scale-95"
                    title="Thắp sáng một ngọn nến tri ân"
                  >
                    <Flame className="w-3.5 h-3.5 text-[#f59e0b] fill-[#f59e0b]" />
                    <span>Thắp nến</span>
                    <span className="font-mono text-[11px] text-[#eccb76] ml-1">
                      ({candleCount})
                    </span>
                  </button>

                  <button
                    onClick={() => onSelectDepartmentForLetter(dept.name)}
                    className="p-2 rounded-lg bg-[#1a2d21] hover:bg-[#26412f] text-[#cfc5aa] hover:text-[#eccb76] border border-[#334e3b] transition-colors cursor-pointer"
                    title="Gửi thư tri ân đến tổ này"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

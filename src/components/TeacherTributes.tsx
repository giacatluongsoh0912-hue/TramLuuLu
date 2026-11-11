import React, { useState } from 'react';
import { Flame, Send, Sparkles, Award, Edit2, X, Check } from 'lucide-react';
import { DepartmentFaculty } from '../data/memoriesData';

interface TeacherTributesProps {
  departments: DepartmentFaculty[];
  onSelectDepartmentForLetter: (deptName: string) => void;
  onUpdateDepartment?: (dept: DepartmentFaculty) => void;
}

export const TeacherTributes: React.FC<TeacherTributesProps> = ({
  departments,
  onSelectDepartmentForLetter,
  onUpdateDepartment,
}) => {
  const [candles, setCandles] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    departments.forEach((d) => {
      map[d.id] = d.candleCount;
    });
    return map;
  });

  const [recentlyLit, setRecentlyLit] = useState<string | null>(null);

  // Edit Department State
  const [editingDept, setEditingDept] = useState<DepartmentFaculty | null>(null);
  const [editTeacherCount, setEditTeacherCount] = useState<number>(10);
  const [editName, setEditName] = useState<string>('');
  const [editCode, setEditCode] = useState<string>('');
  const [editTagline, setEditTagline] = useState<string>('');
  const [editQuote, setEditQuote] = useState<string>('');
  const [editHeadTeacher, setEditHeadTeacher] = useState<string>('');

  const handleOpenEditDept = (dept: DepartmentFaculty) => {
    setEditingDept(dept);
    setEditTeacherCount(dept.teacherCount);
    setEditName(dept.name);
    setEditCode(dept.code);
    setEditTagline(dept.tagline);
    setEditQuote(dept.featuredQuote);
    setEditHeadTeacher(dept.headTeacher);
  };

  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept || !onUpdateDepartment) return;

    const updated: DepartmentFaculty = {
      ...editingDept,
      teacherCount: Number(editTeacherCount) || 1,
      name: editName.trim() || editingDept.name,
      code: editCode.trim() || editingDept.code,
      tagline: editTagline.trim() || editingDept.tagline,
      featuredQuote: editQuote.trim() || editingDept.featuredQuote,
      headTeacher: editHeadTeacher.trim() || editingDept.headTeacher,
    };

    onUpdateDepartment(updated);
    setEditingDept(null);
  };

  const handleLightCandle = (deptId: string, deptName: string, initialCandles: number) => {
    const nextCount = (candles[deptId] !== undefined ? candles[deptId] : initialCandles) + 1;
    setCandles((prev) => ({
      ...prev,
      [deptId]: nextCount,
    }));
    setRecentlyLit(deptName);
    setTimeout(() => {
      setRecentlyLit(null);
    }, 3000);

    if (onUpdateDepartment) {
      const dept = departments.find((d) => d.id === deptId);
      if (dept) {
        onUpdateDepartment({ ...dept, candleCount: nextCount });
      }
    }
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
                className="bg-[#18271e] border border-[#2a4332] rounded-xl p-5 flex flex-col justify-between hover:border-[#426b4f] transition-all duration-300 shadow-lg group hover:-translate-y-1 relative"
              >
                <div>
                  {/* Department Badge, Teacher Count and Quick Edit */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#243a2b]">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#eccb76] font-semibold">
                      {dept.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-[#cfc5aa] font-body flex items-center gap-1 font-medium bg-[#121f16] px-2 py-0.5 rounded-md border border-[#2b4432]">
                        <Award className="w-3 h-3 text-[#eccb76]" />
                        {dept.teacherCount} Thầy Cô
                      </span>
                      {onUpdateDepartment && (
                        <button
                          type="button"
                          onClick={() => handleOpenEditDept(dept)}
                          title={`Chỉnh sửa số thầy cô hoặc thông tin của ${dept.name}`}
                          className="p-1 rounded-md bg-[#132017] hover:bg-[#eccb76] text-[#b8ab95] hover:text-[#1a160f] transition-colors cursor-pointer border border-[#2e4c36]"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
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

      {/* Edit Department Modal */}
      {editingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#1b2b20] border-2 border-[#e4c77d]/60 rounded-2xl max-w-md w-full p-6 shadow-2xl relative my-6 text-[#f6eedc]">
            <button
              onClick={() => setEditingDept(null)}
              className="absolute top-4 right-4 text-[#cfc5aa] hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2d4734]">
              <div className="w-8 h-8 rounded-full bg-[#eccb76] text-[#1c1810] flex items-center justify-center font-bold">
                <Edit2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif-vintage text-lg font-bold text-white">
                  Chỉnh Sửa Tổ Chuyên Môn
                </h3>
                <span className="text-xs text-[#b8ad95]">
                  Cập nhật số lượng thầy cô và thông tin hiển thị
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveDept} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Tên tổ chuyên môn *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Số thầy cô *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    required
                    value={editTeacherCount}
                    onChange={(e) => setEditTeacherCount(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Ký hiệu / Viết tắt (Code):
                </label>
                <input
                  type="text"
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Lời giới thiệu / Tôn chỉ:
                </label>
                <input
                  type="text"
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Câu nói tâm đắc / Châm ngôn tổ:
                </label>
                <textarea
                  rows={2}
                  value={editQuote}
                  onChange={(e) => setEditQuote(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Đại diện ký tên:
                </label>
                <input
                  type="text"
                  value={editHeadTeacher}
                  onChange={(e) => setEditHeadTeacher(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#2a4332]">
                <button
                  type="button"
                  onClick={() => setEditingDept(null)}
                  className="px-4 py-2 text-xs font-medium text-[#c0b59b] hover:text-white rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-[#1a160f] bg-[#e4c77d] hover:bg-[#ebd79b] rounded-lg cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

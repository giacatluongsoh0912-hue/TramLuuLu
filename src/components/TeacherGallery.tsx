import React, { useState, useRef } from 'react';
import {
  Heart,
  Sparkles,
  Search,
  Plus,
  Camera,
  Upload,
  Link as LinkIcon,
  Check,
  Feather,
  Award,
  BookOpen,
  X,
  Flame,
  Calendar,
  Clock,
  Compass,
  ChevronRight,
  Trash2,
  Edit2,
  AlertTriangle,
} from 'lucide-react';
import { TeacherProfile, LEADERSHIP_TIMELINE_DATA, LeadershipMilestone } from '../data/memoriesData';
import { compressImage } from '../utils/imageStorage';

interface TeacherGalleryProps {
  teachers: TeacherProfile[];
  onAddTeacher: (teacher: TeacherProfile) => void;
  onUpdateTeacher: (teacher: TeacherProfile) => void;
  onDeleteTeacher?: (id: string) => void;
  onSendTributeToTeacher: (teacherName: string, department: string) => void;
}

export const TeacherGallery: React.FC<TeacherGalleryProps> = ({
  teachers,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onSendTributeToTeacher,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'faculty'>('timeline');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [likesState, setLikesState] = useState<Record<string, number>>({});
  const [editingTeacher, setEditingTeacher] = useState<TeacherProfile | null>(null);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [deletingTeacherId, setDeletingTeacherId] = useState<string | null>(null);

  // Edit teacher state
  const [editAvatar, setEditAvatar] = useState('');
  const [editMethod, setEditMethod] = useState<'upload' | 'url'>('upload');
  const [editUrl, setEditUrl] = useState('');
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editDept, setEditDept] = useState('toan-tin');
  const [editCustomDept, setEditCustomDept] = useState('');
  const [editYearsOfService, setEditYearsOfService] = useState('');
  const [editAchievements, setEditAchievements] = useState('');
  const [editQuote, setEditQuote] = useState('');
  const [editBio, setEditBio] = useState('');
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // New teacher state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Giáo viên Bộ môn');
  const [newDept, setNewDept] = useState('toan-tin');
  const [newCustomDept, setNewCustomDept] = useState('');
  const [newYearsOfService, setNewYearsOfService] = useState('Nhiều năm cống hiến');
  const [newAchievements, setNewAchievements] = useState('Giáo viên tận tâm, Tri ân 20/11');
  const [newQuote, setNewQuote] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newAvatar, setNewAvatar] = useState('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80');
  const [addMethod, setAddMethod] = useState<'upload' | 'url'>('upload');
  const [addUrl, setAddUrl] = useState('');
  const addFileInputRef = useRef<HTMLInputElement>(null);

  const departments = [
    { id: 'all', label: 'Tất Cả Thầy Cô' },
    { id: 'bgh', label: 'Ban Giám Hiệu' },
    { id: 'toan-tin', label: 'Tổ Toán - Tin học' },
    { id: 'ngu-van', label: 'Tổ Ngữ Văn' },
    { id: 'vat-ly', label: 'Tổ Vật lý - Thiết bị' },
    { id: 'hoa-hoc', label: 'Tổ Hoá - Thiết bị' },
    { id: 'sinh-hoc', label: 'Tổ Sinh - Công nghệ' },
    { id: 'ngoai-ngu', label: 'Tổ Âm nhạc - Ngoại ngữ' },
    { id: 'su-dia', label: 'Tổ Lịch Sử - Địa Lý' },
    { id: 'gdtc-gdqpan', label: 'Tổ GDTC - GDQPAN' },
    { id: 'van-phong', label: 'Văn phòng - GDKT và PL' },
    { id: 'custom', label: 'Tổ Chuyên Môn Khác' },
  ];

  const filteredTeachers = teachers.filter((t) => {
    if (selectedDept !== 'all' && t.department !== selectedDept) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchRole = t.role.toLowerCase().includes(q);
      const matchDept = t.departmentName.toLowerCase().includes(q);
      const matchQuote = t.quote.toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchDept && !matchQuote) return false;
    }
    return true;
  });

  const handleToggleLike = (id: string, initialLikes: number) => {
    const current = likesState[id] !== undefined ? likesState[id] : initialLikes;
    const nextLikes = current + 1;
    setLikesState((prev) => ({ ...prev, [id]: nextLikes }));
    const teacher = teachers.find((t) => t.id === id);
    if (teacher) {
      onUpdateTeacher({ ...teacher, likes: nextLikes });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 800, 800, 0.8);
      if (isEditing) {
        setEditAvatar(compressed);
      } else {
        setNewAvatar(compressed);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (isEditing) {
            setEditAvatar(reader.result);
          } else {
            setNewAvatar(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenEdit = (t: TeacherProfile) => {
    setEditingTeacher(t);
    setEditAvatar(t.avatar);
    setEditName(t.name);
    setEditRole(t.role);
    // If t.department is one of standard ids, use it; otherwise 'custom'
    const matchDept = departments.some((d) => d.id === t.department && d.id !== 'all' && d.id !== 'custom');
    if (matchDept) {
      setEditDept(t.department);
      setEditCustomDept('');
    } else {
      setEditDept('custom');
      setEditCustomDept(t.departmentName);
    }
    setEditYearsOfService(t.yearsOfService || 'Nhiều năm cống hiến');
    setEditAchievements(Array.isArray(t.achievements) ? t.achievements.join(', ') : '');
    setEditQuote(t.quote);
    setEditBio(t.bio);
    setEditUrl(t.avatar.startsWith('data:') ? '' : t.avatar);
    setDeletingTeacherId(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;

    const finalAvatar = editMethod === 'url' && editUrl.trim() ? editUrl.trim() : editAvatar;
    const deptObj = departments.find((d) => d.id === editDept);
    const finalDeptName =
      editDept === 'custom' && editCustomDept.trim()
        ? editCustomDept.trim()
        : deptObj
        ? deptObj.label
        : editingTeacher.departmentName;

    const updated: TeacherProfile = {
      ...editingTeacher,
      name: editName.trim() || editingTeacher.name,
      role: editRole.trim() || editingTeacher.role,
      department: editDept === 'custom' ? 'custom' : editDept,
      departmentName: finalDeptName,
      yearsOfService: editYearsOfService.trim() || editingTeacher.yearsOfService,
      achievements: editAchievements.trim()
        ? editAchievements.split(',').map((s) => s.trim()).filter(Boolean)
        : editingTeacher.achievements,
      quote: editQuote.trim() || editingTeacher.quote,
      bio: editBio.trim() || editingTeacher.bio,
      avatar: finalAvatar || editingTeacher.avatar,
    };

    onUpdateTeacher(updated);
    setEditingTeacher(null);
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newQuote.trim()) return;

    const finalAvatar = addMethod === 'url' && addUrl.trim() ? addUrl.trim() : newAvatar;
    const deptObj = departments.find((d) => d.id === newDept);
    const finalDeptName =
      newDept === 'custom' && newCustomDept.trim()
        ? newCustomDept.trim()
        : deptObj
        ? deptObj.label
        : 'Tổ Chuyên Môn';

    const newT: TeacherProfile = {
      id: 'tch-' + Date.now(),
      name: newName.trim(),
      role: newRole.trim(),
      department: newDept === 'custom' ? 'custom' : newDept,
      departmentName: finalDeptName,
      avatar: finalAvatar,
      quote: newQuote.trim(),
      achievements: newAchievements.trim()
        ? newAchievements.split(',').map((s) => s.trim()).filter(Boolean)
        : ['Giáo viên tận tâm', 'Tri ân 20/11'],
      bio: newBio.trim() || 'Thầy cô luôn là tấm gương sáng dìu dắt bao thế hệ học sinh Chuyên Sơn La khôn lớn và trưởng thành.',
      yearsOfService: newYearsOfService.trim() || 'Nhiều năm cống hiến',
      likes: 1,
    };

    onAddTeacher(newT);
    setNewName('');
    setNewRole('Giáo viên Bộ môn');
    setNewQuote('');
    setNewBio('');
    setNewCustomDept('');
    setNewAchievements('Giáo viên tận tâm, Tri ân 20/11');
    setNewYearsOfService('Nhiều năm cống hiến');
    setAddUrl('');
    setNewAvatar('/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png');
    setIsAddingTeacher(false);
  };

  return (
    <section id="teachers" className="py-16 bg-[#0c160f]/80 backdrop-blur-md relative border-b border-[#25392c]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#2b4433]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b2f21] border border-[#eccb76]/40 text-[#eccb76] text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Gương Mặt Người Dẫn Lối · THPT Chuyên Sơn La (1995 – 2026)</span>
            </div>
            <h2 className="font-serif-vintage text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Các Thế Hệ Thầy Cô & Lãnh Đạo Nhà Trường
            </h2>
            <p className="text-sm text-[#b8ad95] mt-2 max-w-2xl font-body leading-relaxed">
              Dữ liệu chuẩn từ tư liệu 30 năm Trường THPT Chuyên Sơn La (<a href="https://edu.viettel.vn/sla-thptchuyensonla/tin-tuc-su-kien/cac-the-he-ht-pht-qua-cac-thoi-ky" target="_blank" rel="noopener noreferrer" className="text-[#eccb76] underline hover:text-white">Cổng thông tin điện tử trường</a>). Bày tỏ lòng tri ân sâu sắc tới các thế hệ Hiệu trưởng, Phó Hiệu trưởng và thầy cô giáo.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAddingTeacher(true)}
              className="px-4 py-2.5 rounded-lg bg-[#253e2d] hover:bg-[#32523d] text-[#f5ebd7] text-xs font-semibold border border-[#3e664b] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#eccb76]" />
              <span>Thêm Thầy Cô Của Bạn</span>
            </button>
          </div>
        </div>

        {/* Dual Tab Mode Switcher: Dòng thời gian 30 năm & Lưới chân dung */}
        <div className="flex items-center justify-between gap-4 mb-8 bg-[#142318] p-1.5 rounded-2xl border border-[#27402f] max-w-xl mx-auto shadow-inner">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-gradient-to-r from-[#eccb76] to-[#dfbc60] text-[#1c1810] shadow-md shadow-amber-900/30'
                : 'text-[#d6cdb7] hover:text-white hover:bg-[#1a2d20]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Dòng Thời Gian Lãnh Đạo (1995 – 2026)</span>
          </button>

          <button
            onClick={() => setActiveTab('faculty')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'faculty'
                ? 'bg-gradient-to-r from-[#eccb76] to-[#dfbc60] text-[#1c1810] shadow-md shadow-amber-900/30'
                : 'text-[#d6cdb7] hover:text-white hover:bg-[#1a2d20]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Thẻ Chân Dung Vinh Danh Toàn Trường</span>
          </button>
        </div>

        {/* View 1: Timeline Mode (Các thế hệ HT - PHT qua các thời kỳ) */}
        {activeTab === 'timeline' && (
          <div className="mb-14 space-y-6">
            <div className="p-4 rounded-2xl bg-[#17271c] border border-[#2e4c36] text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs text-[#eccb76] font-semibold uppercase tracking-widest block mb-1">
                Lịch Sử 30 Năm Vẻ Vang (17/05/1995 – 2026)
              </span>
              <p className="text-xs text-[#cfc5aa]">
                Từ Trường Phổ thông Năng khiếu tỉnh Sơn La ban sơ đến ngôi trường khang trang hiện đại tại Chiềng Sinh hôm nay, mỗi chặng đường đều in đậm dấu ấn cống hiến của các thế hệ Hiệu trưởng và Phó Hiệu trưởng.
              </p>
            </div>

            <div className="relative border-l-2 border-[#eccb76]/40 ml-4 md:ml-32 space-y-8 pl-6 md:pl-10">
              {LEADERSHIP_TIMELINE_DATA.map((item, idx) => (
                <div key={item.id} className="relative group">
                  {/* Timeline Node Icon */}
                  <div className="absolute -left-[35px] md:-left-[51px] top-1.5 w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#eccb76] border-4 border-[#0f1912] shadow-lg flex items-center justify-center text-[#1c1810] font-bold text-xs">
                    {idx + 1}
                  </div>

                  {/* Year Tag on Desktop */}
                  <div className="hidden md:block absolute -left-36 top-2 text-right w-24">
                    <span className="text-xs font-mono font-bold text-[#eccb76]">
                      {item.period.split(' ')[0]}
                    </span>
                  </div>

                  {/* Timeline Card */}
                  <div className="p-6 rounded-2xl bg-[#15241b] border border-[#2b4433] hover:border-[#eccb76]/60 shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            item.roleType === 'principal'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            {item.title}
                          </span>
                          <span className="text-xs font-mono text-[#eccb76]">
                            {item.period}
                          </span>
                        </div>
                        <h3 className="font-serif-vintage text-xl md:text-2xl font-bold text-white mt-1 group-hover:text-[#eccb76] transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#eccb76] font-medium mt-0.5">
                          ✦ {item.milestoneTitle}
                        </p>
                      </div>

                      <button
                        onClick={() => onSendTributeToTeacher(item.name, 'Ban Giám Hiệu')}
                        className="py-2 px-4 rounded-xl bg-[#cbbaa1] hover:bg-[#e4d4bd] text-[#1c1810] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer shrink-0"
                      >
                        <Feather className="w-3.5 h-3.5" />
                        <span>Gửi tri ân thầy/cô</span>
                      </button>
                    </div>

                    <p className="text-xs text-[#cfc5aa] leading-relaxed font-body mb-4">
                      {item.contributions}
                    </p>

                    <div className="p-3.5 rounded-xl bg-[#0e1711] border border-[#223628] flex items-center gap-3">
                      <span className="text-2xl text-[#eccb76]/40 font-serif leading-none">“</span>
                      <p className="text-xs text-[#eccb76] font-serif-vintage italic">
                        {item.quote}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View 2: All Faculty Cards Grid with Filter & Search */}
        {activeTab === 'faculty' && (
          <div>
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              {/* Department Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 text-xs font-semibold no-scrollbar">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDept(dept.id)}
                    className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      selectedDept === dept.id
                        ? 'bg-[#cbbaa1] text-[#1c1810] font-bold shadow-md'
                        : 'bg-[#18271e] text-[#cfc5aa] hover:bg-[#203325]'
                    }`}
                  >
                    {dept.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-[#8a9f90] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm tên thầy cô, môn học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#142218] border border-[#2d4734] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#eccb76]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Teachers Cards Grid (Faculty Tab) */}
        {activeTab === 'faculty' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTeachers.map((tch) => {
              const likes = likesState[tch.id] !== undefined ? likesState[tch.id] : tch.likes;

              return (
                <div
                  key={tch.id}
                  className="bg-[#15241b] rounded-2xl border border-[#2b4433] hover:border-[#eccb76]/60 shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
                >
                  {/* Top Photo & Role */}
                  <div>
                    <div className="relative aspect-4/3 bg-[#0d1710] overflow-hidden">
                      <img
                        src={tch.avatar}
                        alt={tch.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#15241b] via-transparent to-transparent opacity-90" />

                      {/* Department Tag Pill */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs border border-[#eccb76]/40 text-[#eccb76] text-[10px] font-semibold">
                        {tch.departmentName}
                      </div>

                      {/* Quick Edit and Delete Action Buttons */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          onClick={() => handleOpenEdit(tch)}
                          title="Chỉnh sửa thông tin thầy cô"
                          className="p-1.5 rounded-full bg-black/60 hover:bg-[#eccb76] text-white hover:text-[#1a160f] transition-all cursor-pointer shadow-md"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteTeacher && (
                          <button
                            onClick={() => setDeletingTeacherId(tch.id)}
                            title="Xóa thầy cô này (nếu không có trong trường)"
                            className="p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white transition-all cursor-pointer shadow-md"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Delete Confirmation Overlay */}
                      {deletingTeacherId === tch.id && (
                        <div className="absolute inset-0 bg-[#0d1610]/95 backdrop-blur-xs z-20 p-4 flex flex-col items-center justify-center text-center animate-fade-in border-2 border-rose-500/60">
                          <AlertTriangle className="w-7 h-7 text-rose-400 mb-1.5" />
                          <h4 className="font-serif-vintage text-xs font-bold text-white mb-1">
                            Xác nhận xóa thầy/cô?
                          </h4>
                          <p className="text-[11px] text-[#cfc5aa] mb-3 leading-tight line-clamp-2">
                            Bạn có chắc muốn xóa <span className="font-bold text-rose-300">{tch.name}</span> khỏi danh sách không?
                          </p>
                          <div className="flex items-center gap-2 w-full">
                            <button
                              type="button"
                              onClick={() => {
                                if (onDeleteTeacher) onDeleteTeacher(tch.id);
                                setDeletingTeacherId(null);
                              }}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer transition-colors shadow-sm"
                            >
                              Xóa ngay
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingTeacherId(null)}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-[#253f2e] hover:bg-[#32523d] text-[#cfc5aa] text-[11px] font-medium cursor-pointer transition-colors"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Body Content */}
                    <div className="p-5 pt-2">
                      <h3 className="font-serif-vintage text-lg font-bold text-white group-hover:text-[#eccb76] transition-colors">
                        {tch.name}
                      </h3>
                      <div className="text-xs text-[#b8ad95] font-medium mt-0.5">
                        {tch.role} · <span className="text-[#eccb76]">{tch.yearsOfService}</span>
                      </div>

                      {/* Inspiring Quote */}
                      <div className="my-3.5 p-3 rounded-xl bg-[#0f1a13] border border-[#233829] relative">
                        <span className="text-[#eccb76] text-xs font-serif-vintage italic leading-relaxed block">
                          &ldquo;{tch.quote}&rdquo;
                        </span>
                      </div>

                      {/* Achievements tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {tch.achievements.slice(0, 2).map((ach, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] bg-[#1c3022] text-[#d6cdb7] border border-[#2b4432]"
                          >
                            ✦ {ach}
                          </span>
                        ))}
                      </div>

                      <p className="font-body text-xs text-[#9aa99c] leading-relaxed line-clamp-2">
                        {tch.bio}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="p-5 pt-0 border-t border-[#223528] mt-3 pt-3 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSendTributeToTeacher(tch.name, tch.departmentName)}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#cbbaa1] hover:bg-[#d9ccb6] text-[#1c1810] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                      title={`Gửi lời tri ân trực tiếp tới ${tch.name}`}
                    >
                      <Feather className="w-3.5 h-3.5" />
                      <span>Gửi tri ân</span>
                    </button>

                    <button
                      onClick={() => handleToggleLike(tch.id, tch.likes)}
                      className="py-2 px-3 rounded-lg bg-[#1c3022] hover:bg-[#253e2d] text-xs font-semibold text-[#f87171] border border-[#2e4c36] transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Thắp nến & Thả tim tri ân"
                    >
                      <Flame className="w-3.5 h-3.5 text-[#f59e0b] fill-[#f59e0b]" />
                      <span className="font-mono text-[#f6eedc] text-xs">{likes}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Teacher Modal */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#1b2b20] border-2 border-[#e4c77d]/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-6 text-[#f6eedc]">
            <button
              onClick={() => setEditingTeacher(null)}
              className="absolute top-4 right-4 text-[#cfc5aa] hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#2d4734]">
              <div className="w-9 h-9 rounded-full bg-[#eccb76] text-[#1c1810] flex items-center justify-center font-bold">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-vintage text-xl font-bold text-white">
                  Đổi Ảnh & Thông Tin Thầy Cô
                </h3>
                <span className="text-xs text-[#b8ad95]">
                  Cập nhật ảnh chân dung và lời nhắn gửi của {editingTeacher.name}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Photo Preview Box */}
              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1.5">
                  Ảnh chân dung hiện tại:
                </label>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[#101b13] border-2 border-[#375a40] flex items-center justify-center">
                  <img
                    src={editMethod === 'url' && editUrl ? editUrl : editAvatar}
                    alt="Xem trước ảnh thầy cô"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png';
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] text-[#eccb76]">
                    Xem trước trực tiếp
                  </div>
                </div>
              </div>

              {/* Upload method toggle */}
              <div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditMethod('upload')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border ${
                      editMethod === 'upload'
                        ? 'bg-[#cbbaa1] text-[#1a160f] border-[#cbbaa1]'
                        : 'bg-[#121d15] text-[#cfc5aa] border-[#2b4432]'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải ảnh từ máy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMethod('url')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border ${
                      editMethod === 'url'
                        ? 'bg-[#cbbaa1] text-[#1a160f] border-[#cbbaa1]'
                        : 'bg-[#121d15] text-[#cfc5aa] border-[#2b4432]'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Nhập link ảnh (URL)</span>
                  </button>
                </div>
              </div>

              {editMethod === 'upload' ? (
                <div>
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, true)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-lg bg-[#22392b] hover:bg-[#2c4937] border border-dashed border-[#446d4d] text-xs font-medium text-[#f5ebd7] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#eccb76]" />
                    <span>Tải ảnh chân dung từ máy/điện thoại</span>
                  </button>
                </div>
              ) : (
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="https://... hoặc /assets/..."
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                />
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Họ và tên:
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Chức vụ / Bộ môn:
                  </label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Thuộc Tổ chuyên môn:
                </label>
                <select
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                >
                  {departments
                    .filter((d) => d.id !== 'all')
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                </select>
                {editDept === 'custom' && (
                  <input
                    type="text"
                    required
                    placeholder="Nhập tên tổ chuyên môn tùy chỉnh..."
                    value={editCustomDept}
                    onChange={(e) => setEditCustomDept(e.target.value)}
                    className="w-full mt-2 bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Thâm niên cống hiến:
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 18 năm cống hiến"
                    value={editYearsOfService}
                    onChange={(e) => setEditYearsOfService(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Thành tích (phân cách bằng dấu phẩy):
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Giáo viên dạy giỏi, Bồi dưỡng HSG"
                    value={editAchievements}
                    onChange={(e) => setEditAchievements(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Câu nói ghi dấu ấn / Châm ngôn:
                </label>
                <input
                  type="text"
                  value={editQuote}
                  onChange={(e) => setEditQuote(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Đôi nét giới thiệu:
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#2a4332]">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2 text-xs font-medium text-[#c0b59b] hover:text-white rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-[#1a160f] bg-[#e4c77d] hover:bg-[#ebd79b] rounded-lg cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu thông tin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {isAddingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#1b2b20] border border-[#3b5c43] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-6 text-[#f6eedc]">
            <button
              onClick={() => setIsAddingTeacher(false)}
              className="absolute top-4 right-4 text-[#cfc5aa] hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">👩‍🏫</span>
              <h3 className="font-serif-vintage text-xl font-bold text-white">
                Thêm Thầy Cô Vào Bảng Tri Ân
              </h3>
            </div>
            <p className="text-xs text-[#b8ad95] mb-4 font-body">
              Thêm thầy cô chủ nhiệm hoặc bộ môn của lớp bạn vào danh sách để tập thể cùng gửi lời chúc 20/11.
            </p>

            <form onSubmit={handleCreateTeacher} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Tên thầy cô *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Cô Trần Thu Hà"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Chức vụ / Bộ môn *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: GVCN 12 Văn"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Thuộc Tổ chuyên môn:
                </label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                >
                  {departments
                    .filter((d) => d.id !== 'all')
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                </select>
                {newDept === 'custom' && (
                  <input
                    type="text"
                    required
                    placeholder="Nhập tên tổ chuyên môn tùy chỉnh..."
                    value={newCustomDept}
                    onChange={(e) => setNewCustomDept(e.target.value)}
                    className="w-full mt-2 bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Thâm niên cống hiến:
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 15 năm cống hiến"
                    value={newYearsOfService}
                    onChange={(e) => setNewYearsOfService(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Thành tích nổi bật:
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Giáo viên dạy giỏi cấp Tỉnh"
                    value={newAchievements}
                    onChange={(e) => setNewAchievements(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                </div>
              </div>

              {/* Photo Input */}
              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Ảnh chân dung:
                </label>
                <input
                  ref={addFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, false)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => addFileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-lg bg-[#22392b] hover:bg-[#2c4937] border border-dashed border-[#446d4d] text-xs font-medium text-[#f5ebd7] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#eccb76]" />
                  <span>{newAvatar !== '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png' ? 'Đã tải ảnh lên (Nhấp để đổi)' : 'Tải ảnh từ máy / điện thoại'}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Câu nói hay / Châm ngôn của thầy cô *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ráng học để làm người tử tế nghe các trò!"
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Lời tâm tình của học trò:
                </label>
                <textarea
                  rows={2}
                  placeholder="Những kỷ niệm đáng nhớ của lớp với thầy cô..."
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#2a4332]">
                <button
                  type="button"
                  onClick={() => setIsAddingTeacher(false)}
                  className="px-4 py-2 text-xs font-medium text-[#c0b59b] hover:text-white rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-[#1a160f] bg-[#e4c77d] hover:bg-[#ebd79b] rounded-lg cursor-pointer shadow-md"
                >
                  Thêm vào danh sách
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

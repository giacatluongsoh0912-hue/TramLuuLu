import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  Radio,
  FileText,
  Award,
  Video,
  Heart,
  Calendar,
  CheckCircle2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  QrCode,
  Flame,
  Edit3,
  Save,
  RotateCcw,
  PlusCircle,
  X,
  Check,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Camera,
  AlertTriangle,
  Link as LinkIcon,
} from 'lucide-react';
import { audioPlayer } from '../utils/audioPlayer';
import { compressImage, idbGet, idbSet } from '../utils/imageStorage';

export interface TeacherStudentMoment {
  id: string;
  tag: string;
  title: string;
  description: string;
  imageSrc: string;
}

const DEFAULT_PART2_MOMENTS: TeacherStudentMoment[] = [
  {
    id: 'p2-1',
    tag: 'KHỐI 12',
    title: 'Những Tiết Sinh Hoạt Ấm Áp Của K31',
    description: 'Lời dặn dò ân cần trước kỳ thi đại học, những cái ôm siết chặt và sự quan tâm như của người cha, người mẹ thứ hai.',
    imageSrc: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
  },
  {
    id: 'p2-2',
    tag: 'NGOẠI KHÓA',
    title: 'Vòng Xòe Đoàn Kết & Hội Trại Sam Si',
    description: 'Nơi thầy trò cùng hòa chung một điệu múa xòe, đốt lên ngọn lửa trại bập bùng thắp sáng ước mơ tuổi trẻ.',
    imageSrc: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
  },
  {
    id: 'p2-3',
    tag: 'GIỜ HỌC TỐT',
    title: 'Say Mê Từng Giờ Học Đổi Mới Sáng Tạo',
    description: 'Các tiết thực hành STEM, dự án trải nghiệm văn học và những giờ học không khoảng cách giữa thầy và trò.',
    imageSrc: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
  },
];

interface ContestFrameworkProps {
  onOpenComposer: () => void;
  onOpenQRCode: () => void;
}

export const ContestFramework: React.FC<ContestFrameworkProps> = ({
  onOpenComposer,
  onOpenQRCode,
}) => {
  const [activeTab, setActiveTab] = useState<'part1' | 'part2' | 'part3' | 'part4' | 'thi-dua'>('part1');
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);
  const [selectedPodcastEpisode, setSelectedPodcastEpisode] = useState(0);

  // Editable Flower Competition Statistics
  const [flowerStats, setFlowerStats] = useState(() => {
    try {
      const saved = localStorage.getItem('csl_flower_competition_stats');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      flower9: 1280,
      flower10: 895,
      participationRate: 100,
      lastUpdated: 'Cập nhật tuần cao điểm 20/11',
    };
  });

  const [isEditingStats, setIsEditingStats] = useState(false);
  const [editFlower9, setEditFlower9] = useState(flowerStats.flower9);
  const [editFlower10, setEditFlower10] = useState(flowerStats.flower10);
  const [editRate, setEditRate] = useState(flowerStats.participationRate);
  const [editNote, setEditNote] = useState(flowerStats.lastUpdated);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('csl_flower_competition_stats', JSON.stringify(flowerStats));
    } catch {
      // ignore
    }
  }, [flowerStats]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddFlower9 = (amount: number) => {
    setFlowerStats((prev: typeof flowerStats) => ({ ...prev, flower9: prev.flower9 + amount }));
    showToast(`Đã thêm +${amount} Hoa Điểm 9 dâng thầy cô!`);
  };

  const handleAddFlower10 = (amount: number) => {
    setFlowerStats((prev: typeof flowerStats) => ({ ...prev, flower10: prev.flower10 + amount }));
    showToast(`Đã thêm +${amount} Hoa Điểm 10 xuất sắc!`);
  };

  const handleOpenEditStats = () => {
    setEditFlower9(flowerStats.flower9);
    setEditFlower10(flowerStats.flower10);
    setEditRate(flowerStats.participationRate);
    setEditNote(flowerStats.lastUpdated);
    setIsEditingStats(true);
  };

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    setFlowerStats({
      flower9: Math.max(0, Number(editFlower9) || 0),
      flower10: Math.max(0, Number(editFlower10) || 0),
      participationRate: Math.min(100, Math.max(0, Number(editRate) || 0)),
      lastUpdated: editNote.trim() || 'Vừa cập nhật hôm nay',
    });
    setIsEditingStats(false);
    showToast('Đã lưu cập nhật số liệu Bảng Hoa Điểm 9 & 10!');
  };

  const handleResetDefaultStats = () => {
    setFlowerStats({
      flower9: 1280,
      flower10: 895,
      participationRate: 100,
      lastUpdated: 'Cập nhật tuần cao điểm 20/11',
    });
    setIsEditingStats(false);
    showToast('Đã khôi phục số liệu mặc định ban đầu.');
  };

  // Part 2: Dynamic Teacher-Student Moments State
  const [moments, setMoments] = useState<TeacherStudentMoment[]>(() => {
    try {
      const saved = localStorage.getItem('csl_contest_part2_moments');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_PART2_MOMENTS;
  });

  // IndexedDB Hydration for moments
  useEffect(() => {
    (async () => {
      try {
        const idbMoments = await idbGet<TeacherStudentMoment[]>('csl_contest_part2_moments');
        if (idbMoments && Array.isArray(idbMoments) && idbMoments.length > 0) {
          setMoments(idbMoments);
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  // Persist moments
  useEffect(() => {
    try {
      localStorage.setItem('csl_contest_part2_moments', JSON.stringify(moments));
    } catch {
      // fallback
    }
    idbSet('csl_contest_part2_moments', moments);
  }, [moments]);

  // Modal states for Part 2 moments
  const [isAddingMoment, setIsAddingMoment] = useState(false);
  const [editingMoment, setEditingMoment] = useState<TeacherStudentMoment | null>(null);
  const [deletingMomentId, setDeletingMomentId] = useState<string | null>(null);

  // Form states for Part 2
  const [momentTitle, setMomentTitle] = useState('');
  const [momentTag, setMomentTag] = useState('Khối 10');
  const [momentCustomTag, setMomentCustomTag] = useState('');
  const [momentDesc, setMomentDesc] = useState('');
  const [momentImage, setMomentImage] = useState('/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png');
  const [momentMethod, setMomentMethod] = useState<'upload' | 'url'>('upload');
  const [momentUrl, setMomentUrl] = useState('');
  const momentFileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAddMoment = () => {
    setMomentTitle('');
    setMomentTag('Khối 10');
    setMomentCustomTag('');
    setMomentDesc('');
    setMomentImage('/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png');
    setMomentMethod('upload');
    setMomentUrl('');
    setEditingMoment(null);
    setIsAddingMoment(true);
  };

  const handleOpenEditMoment = (m: TeacherStudentMoment) => {
    setEditingMoment(m);
    setMomentTitle(m.title);
    setMomentTag(m.tag);
    setMomentCustomTag('');
    setMomentDesc(m.description);
    setMomentImage(m.imageSrc);
    setMomentMethod('upload');
    setMomentUrl(m.imageSrc.startsWith('data:') ? '' : m.imageSrc);
    setIsAddingMoment(true);
  };

  const handleSaveMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!momentTitle.trim() || !momentDesc.trim()) return;

    const finalImage = momentMethod === 'url' && momentUrl.trim() ? momentUrl.trim() : momentImage;
    const finalTag = momentTag === 'custom' && momentCustomTag.trim() ? momentCustomTag.trim() : momentTag;

    if (editingMoment) {
      setMoments((prev) =>
        prev.map((m) =>
          m.id === editingMoment.id
            ? { ...m, title: momentTitle.trim(), tag: finalTag, description: momentDesc.trim(), imageSrc: finalImage }
            : m
        )
      );
      showToast('Đã cập nhật khoảnh khắc thành công!');
    } else {
      const newM: TeacherStudentMoment = {
        id: 'p2-' + Date.now(),
        tag: finalTag,
        title: momentTitle.trim(),
        description: momentDesc.trim(),
        imageSrc: finalImage,
      };
      setMoments((prev) => [newM, ...prev]);
      showToast('Đã đăng khoảnh khắc mới thành công!');
    }
    setIsAddingMoment(false);
    setEditingMoment(null);
  };

  const handleDeleteMoment = (id: string) => {
    setMoments((prev) => prev.filter((m) => m.id !== id));
    setDeletingMomentId(null);
    showToast('Đã xóa khoảnh khắc!');
  };

  const handleMomentFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 900, 900, 0.82);
      setMomentImage(compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setMomentImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const podcastEpisodes = [
    {
      title: 'Tập 1: Bụi Phấn Vương Tóc Thầy & Ký Ức Mùa Đông Sơn La',
      narrator: 'Chi đoàn 12 Chuyên Văn & CLB Radio CSL',
      duration: '04:15',
      summary: 'Gửi những ngày đông rét buốt ở Chiềng Sinh, ấm trà gừng của thầy chủ nhiệm và bài giảng văn sưởi ấm tâm hồn học trò vùng cao.',
    },
    {
      title: 'Tập 2: Những Đêm Thao Thức Cùng Đội Tuyển Quốc Gia',
      narrator: 'Đội tuyển HSG Quốc gia K31',
      duration: '05:30',
      summary: 'Lời tâm sự chân thành của những cô cậu học trò chuyên Toán, Lý, Hóa khi miệt mài bên trang giấy dưới ánh đèn khu thí nghiệm.',
    },
    {
      title: 'Tập 3: Mùa Hoa Ban Năm Ấy - Lời Cảm Ơn Muộn Màng',
      narrator: 'Cựu học sinh K28 gửi về mái trường',
      duration: '04:45',
      summary: 'Tâm sự của những người con Chuyên Sơn La đang học tập và làm việc tại Hà Nội, TP.HCM và nước ngoài hướng về thầy cô.',
    },
  ];

  const handleTogglePodcast = (index: number) => {
    setSelectedPodcastEpisode(index);
    audioPlayer.togglePlay((playing) => {
      setIsPlayingPodcast(playing);
    });
  };

  return (
    <section id="contest-framework" className="py-16 bg-[#0c160f]/80 backdrop-blur-md relative border-b border-[#223528]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contest Header Badge */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b2f21] border border-[#eccb76]/40 text-[#eccb76] text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Kế hoạch thi đua 26/10 - 21/11/2026 · Trường THPT Chuyên Sơn La</span>
          </div>

          <h2 className="font-serif-vintage text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Khung Nội Dung Sản Phẩm Số Tri Ân 20/11
          </h2>
          <p className="font-body text-xs sm:text-sm text-[#b8ab95] mt-2 leading-relaxed">
            Số hóa không gian tri ân theo 4 phần quy định chính thức: Thông điệp tri ân, Khoảnh khắc thầy trò, Hòm thư số cựu học sinh và Sản phẩm sáng tạo mở rộng.
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={onOpenQRCode}
              className="px-4 py-2 rounded-lg bg-[#27402f] hover:bg-[#34553f] text-[#f5ebd7] text-xs font-semibold border border-[#3e664b] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <QrCode className="w-4 h-4 text-[#eccb76]" />
              <span>In Mã QR Góc Tri Ân Lớp Học</span>
            </button>
          </div>
        </div>

        {/* 4 Parts Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-semibold no-scrollbar">
          <button
            onClick={() => setActiveTab('part1')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'part1'
                ? 'bg-[#cbbaa1] text-[#1c1810] font-bold shadow-md'
                : 'bg-[#18281d] text-[#cfc5aa] hover:bg-[#203325]'
            }`}
          >
            <span>Phần 1: Thông Điệp Tri Ân</span>
          </button>

          <button
            onClick={() => setActiveTab('part2')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'part2'
                ? 'bg-[#cbbaa1] text-[#1c1810] font-bold shadow-md'
                : 'bg-[#18281d] text-[#cfc5aa] hover:bg-[#203325]'
            }`}
          >
            <span>Phần 2: Thầy Trò Chuyên Sơn La</span>
          </button>

          <button
            onClick={() => setActiveTab('part3')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'part3'
                ? 'bg-[#cbbaa1] text-[#1c1810] font-bold shadow-md'
                : 'bg-[#18281d] text-[#cfc5aa] hover:bg-[#203325]'
            }`}
          >
            <span className="text-[#842e2e]">★</span>
            <span>Phần 3: Hòm Thư Số (Trọng Tâm)</span>
          </button>

          <button
            onClick={() => setActiveTab('part4')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'part4'
                ? 'bg-[#cbbaa1] text-[#1c1810] font-bold shadow-md'
                : 'bg-[#18281d] text-[#cfc5aa] hover:bg-[#203325]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-[#eccb76]" />
            <span>Phần 4: Sản Phẩm Sáng Tạo Mở Rộng</span>
          </button>

          <button
            onClick={() => setActiveTab('thi-dua')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'thi-dua'
                ? 'bg-[#cbbaa1] text-[#1c1810] font-bold shadow-md'
                : 'bg-[#18281d] text-[#cfc5aa] hover:bg-[#203325]'
            }`}
          >
            <span>🌸 Vườn Hoa Điểm 9 & 10</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="bg-[#142319] border border-[#2b4432] rounded-2xl p-6 sm:p-8 shadow-xl">
          
          {/* PHẦN 1: THÔNG ĐIỆP TRI ÂN */}
          {activeTab === 'part1' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#253d2c] pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#eccb76] font-semibold">
                    PHẦN 1 · THÔNG ĐIỆP TRI ÂN CHI ĐOÀN
                  </span>
                  <h3 className="font-serif-vintage text-2xl font-bold text-white mt-1">
                    Thư Ngỏ & Lời Tựa 20/11 Gửi Thầy Cô Kính Yêu
                  </h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#1b2f21] border border-[#3b5e46] text-xs text-[#cfc5aa] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Đã kiểm duyệt</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Letter Body */}
                <div className="lg:col-span-7 bg-[#f6eedb] text-[#241d14] p-6 sm:p-7 rounded-xl border border-[#d6c7b0] shadow-md relative">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#7a6a4d]">
                    THƯ TRI ÂN · THÁNG 11 NĂM 2026
                  </span>
                  <h4 className="font-serif-vintage text-xl font-bold text-[#1a2d21] mt-2 mb-4">
                    Kính gửi: Các Thầy Cô giáo Trường THPT Chuyên Tỉnh Sơn La
                  </h4>
                  <p className="font-body text-xs sm:text-sm leading-relaxed text-[#3b3021] italic mb-3">
                    &ldquo;Tháng 11 về mang theo những đợt gió mùa đông bắc se lạnh trên triền đồi Chiềng Sinh, nhưng trong từng phòng học của trường Chuyên Sơn La, hơi ấm của tình thầy trò vẫn luôn đong đầy. Chúng em xin kính dâng lên thầy cô những đóa hoa tươi thắm nhất, sự biết ơn vô bờ bến vì những tháng ngày cần mẫn bên bục giảng...&rdquo;
                  </p>
                  <p className="font-body text-xs sm:text-sm leading-relaxed text-[#3b3021] italic mb-4">
                    &ldquo;Thầy cô không chỉ dạy chúng em những công thức toán học, những định luật vật lý hay những trang văn rung động, mà còn gieo vào tâm hồn chúng em lòng nhân ái, sự tự hào về quê hương Tây Bắc và khát vọng vươn ra biển lớn.&rdquo;
                  </p>
                  <div className="pt-3 border-t border-[#c9b794] flex justify-between items-center text-xs">
                    <span className="font-mono text-[#7a6a4d]">Chiềng Sinh, 20/11/2026</span>
                    <span className="font-script-calligraphy text-base font-bold text-[#5c4a30]">
                      Tập thể Đoàn viên Học sinh Chuyên Sơn La
                    </span>
                  </div>
                </div>

                {/* Video / Multimedia Showcase Box with Google Drive Link */}
                <div className="lg:col-span-5 bg-[#0f1912] p-5 rounded-xl border border-[#273d2d] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-[#eccb76] mb-2">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        <span>Kho Video Tri Ân 20/11 Của Học Sinh</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#183522] text-[#eccb76] border border-[#2b5937]">Google Drive</span>
                    </div>

                    <a
                      href="https://drive.google.com/drive/folders/1KkfttXMujKCQ3FMgEuT9Q7OWLOIo9jAP?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative aspect-video rounded-lg overflow-hidden bg-[#18271e] border-2 border-[#3b6146] flex items-center justify-center group cursor-pointer shadow-lg hover:border-[#eccb76] transition-all"
                      title="Mở thư mục Video Tri Ân trên Google Drive"
                    >
                      <img
                        src="/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png"
                        alt="Kho Video Tri Ân Chuyên Sơn La"
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 flex flex-col items-center justify-center p-4">
                        <div className="w-13 h-13 rounded-full bg-[#eccb76] text-[#1c1810] flex items-center justify-center shadow-xl group-hover:scale-115 transition-transform">
                          <Play className="w-6 h-6 fill-[#1c1810] ml-0.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-white mt-2.5 drop-shadow text-center">
                          Xem Toàn Bộ Video Tri Ân 20/11
                        </span>
                        <span className="text-[11px] text-[#eccb76] font-medium flex items-center gap-1 mt-1">
                          <span>Mở Google Drive</span>
                          <span>↗</span>
                        </span>
                      </div>
                    </a>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#253a2a] flex items-center justify-between text-xs text-[#a3957a]">
                    <span>Thư mục Drive lưu trữ video các Chi đoàn</span>
                    <a
                      href="https://drive.google.com/drive/folders/1KkfttXMujKCQ3FMgEuT9Q7OWLOIo9jAP?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#eccb76] hover:underline font-semibold"
                    >
                      Xem ngay ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PHẦN 2: THẦY TRÒ CHUYÊN SƠN LA */}
          {activeTab === 'part2' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#253d2c] pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#eccb76] font-semibold">
                    PHẦN 2 · THẦY TRÒ CHUYÊN SƠN LA
                  </span>
                  <h3 className="font-serif-vintage text-2xl font-bold text-white mt-1">
                    Khoảnh Khắc Đời Thường & Kỷ Niệm Tiết Học
                  </h3>
                  <p className="text-xs text-[#b8ad95] mt-1 font-body">
                    Góc lưu giữ những hình ảnh vui tươi, ấm áp giữa thầy và trò các thế hệ Chuyên Sơn La.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleOpenAddMoment}
                    className="px-3.5 py-2 rounded-lg bg-[#27422f] hover:bg-[#34583f] text-[#eccb76] hover:text-white border border-[#3e664b] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Đăng thêm hình ảnh và khoảnh khắc thầy trò vui tươi"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Đăng khoảnh khắc mới</span>
                  </button>
                </div>
              </div>

              {moments.length === 0 ? (
                <div className="text-center py-12 bg-[#121e16] rounded-xl border border-dashed border-[#2d4635] p-6">
                  <Camera className="w-8 h-8 text-[#eccb76]/60 mx-auto mb-2" />
                  <p className="text-sm font-serif-vintage text-white">Chưa có khoảnh khắc nào</p>
                  <p className="text-xs text-[#b8ad95] mt-1">Hãy là người đầu tiên đăng khoảnh khắc thầy trò vui tươi!</p>
                  <button
                    onClick={handleOpenAddMoment}
                    className="mt-4 px-4 py-2 rounded-lg bg-[#eccb76] text-[#1c1810] text-xs font-bold cursor-pointer"
                  >
                    Đăng ngay
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {moments.map((m) => (
                    <div
                      key={m.id}
                      className="bg-[#18281e] p-4 rounded-xl border border-[#2a4332] shadow-md hover:border-[#436e4f] transition-all flex flex-col justify-between group relative overflow-hidden"
                    >
                      <div>
                        <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#101a13] mb-3 relative">
                          <img
                            src={m.imageSrc}
                            alt={m.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png';
                            }}
                          />
                          {/* Quick action buttons on photo */}
                          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity z-10">
                            <button
                              type="button"
                              onClick={() => handleOpenEditMoment(m)}
                              title="Chỉnh sửa khoảnh khắc này"
                              className="p-1.5 rounded-full bg-black/60 hover:bg-[#eccb76] text-white hover:text-[#1a160f] transition-all cursor-pointer shadow-md"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingMomentId(m.id)}
                              title="Xóa khoảnh khắc này"
                              className="p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white transition-all cursor-pointer shadow-md"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Delete Confirmation Overlay on card */}
                          {deletingMomentId === m.id && (
                            <div className="absolute inset-0 bg-[#0d1610]/95 backdrop-blur-xs z-20 p-3 flex flex-col items-center justify-center text-center animate-fade-in border-2 border-rose-500/60">
                              <AlertTriangle className="w-6 h-6 text-rose-400 mb-1" />
                              <h4 className="font-serif-vintage text-xs font-bold text-white mb-1">
                                Xác nhận xóa?
                              </h4>
                              <p className="text-[11px] text-[#cfc5aa] mb-2 leading-tight line-clamp-2">
                                Bạn muốn xóa bài đăng này?
                              </p>
                              <div className="flex items-center gap-2 w-full">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMoment(m.id)}
                                  className="flex-1 py-1 px-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer"
                                >
                                  Xóa
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingMomentId(null)}
                                  className="flex-1 py-1 px-2 rounded-lg bg-[#253f2e] text-[#cfc5aa] text-[11px] font-medium cursor-pointer"
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <span className="text-[11px] font-mono text-[#eccb76] font-semibold uppercase tracking-wider">
                          {m.tag}
                        </span>
                        <h4 className="font-serif-vintage text-base font-bold text-white mt-1 group-hover:text-[#eccb76] transition-colors">
                          {m.title}
                        </h4>
                        <p className="font-body text-xs text-[#b8ab95] mt-1.5 leading-relaxed">
                          {m.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#253a2b] flex items-center justify-between text-[11px] text-[#86998b]">
                        <span>Chuyên Sơn La</span>
                        <button
                          type="button"
                          onClick={() => handleOpenEditMoment(m)}
                          className="text-[#eccb76] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Chỉnh sửa</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PHẦN 3: HÒM THƯ SỐ KẾT NỐI CỰU HỌC SINH (TRỌNG TÂM) */}
          {activeTab === 'part3' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#253d2c] pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#f59e0b] font-semibold flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#f59e0b] fill-[#f59e0b]" />
                    PHẦN 3 · TRỌNG TÂM CUỘC THI: HÒM THƯ SỐ CỰU HỌC SINH
                  </span>
                  <h3 className="font-serif-vintage text-2xl font-bold text-white mt-1">
                    Nhịp Cầu Nối Cựu Học Sinh Các Khóa K28 - K32
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://forms.gle/4c98L5pQeyBAnte9A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-[#cbbaa1] hover:bg-[#dbccb5] text-[#1c1810] text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5 active:scale-95"
                    title="Mở Google Forms Hòm Thư Số Tri Ân 20/11"
                  >
                    <span>Gửi thư vào Hòm thư số</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => {
                      const el = document.getElementById('letter-desk');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        onOpenComposer();
                      }
                    }}
                    className="px-3 py-2 rounded-lg bg-[#1a2d21] hover:bg-[#253f2e] text-[#eccb76] hover:text-white text-xs font-semibold border border-[#30523a] transition-all cursor-pointer flex items-center gap-1.5"
                    title="Cuộn tới Bàn Viết Thư & Cuộn Phim Ký Ức trên trang web"
                  >
                    Viết trên web ✍️
                  </button>
                </div>
              </div>

              <div className="bg-[#111c15] p-6 rounded-xl border border-[#2a4332]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#233527]">
                  <p className="font-body text-xs sm:text-sm text-[#ded7c3] leading-relaxed">
                    Hòm thư số kết nối cựu học sinh được mở trực tiếp qua biểu mẫu Google Forms hoặc viết trực tiếp trên trang web, cho phép cựu học sinh Chuyên Sơn La khắp mọi miền Tổ quốc và quốc tế gửi lời chúc, tâm sự, ảnh kỷ niệm xưa và lời tri ân trực tiếp tới thầy cô giảng dạy.
                  </p>
                </div>
                <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#9fb3a4]">Biểu mẫu chính thức:</span>
                  <a
                    href="https://forms.gle/4c98L5pQeyBAnte9A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#eccb76] hover:underline font-mono"
                  >
                    <span>forms.gle/4c98L5pQeyBAnte9A</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="bg-[#18281e] p-3 rounded-lg border border-[#2d4635]">
                    <div className="font-mono text-xl font-bold text-[#eccb76]">150+</div>
                    <span className="text-[11px] text-[#9fb3a4]">Lưu bút cựu học sinh</span>
                  </div>
                  <div className="bg-[#18281e] p-3 rounded-lg border border-[#2d4635]">
                    <div className="font-mono text-xl font-bold text-[#eccb76]">5 Khóa</div>
                    <span className="text-[11px] text-[#9fb3a4]">Từ K28 đến K32</span>
                  </div>
                  <div className="bg-[#18281e] p-3 rounded-lg border border-[#2d4635]">
                    <div className="font-mono text-xl font-bold text-[#eccb76]">8 Tổ</div>
                    <span className="text-[11px] text-[#9fb3a4]">Nhận thư tri ân</span>
                  </div>
                  <div className="bg-[#18281e] p-3 rounded-lg border border-[#2d4635]">
                    <div className="font-mono text-xl font-bold text-[#eccb76]">100%</div>
                    <span className="text-[11px] text-[#9fb3a4]">Lưu trữ số vĩnh viễn</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <a
                  href="#guestbook"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#eccb76] hover:underline"
                >
                  <span>Xem toàn bộ danh sách lưu bút đã gửi trong Sổ Lưu Bút Tri Ân</span>
                  <span>↓</span>
                </a>
              </div>
            </div>
          )}

          {/* PHẦN 4: SẢN PHẨM SÁNG TẠO MỞ RỘNG (PODCAST RADIO & TRUYỆN TRANH) */}
          {activeTab === 'part4' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#253d2c] pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#eccb76] font-semibold">
                    PHẦN 4 · SẢN PHẨM SÁNG TẠO MỞ RỘNG
                  </span>
                  <h3 className="font-serif-vintage text-2xl font-bold text-white mt-1">
                    Podcast Radio Học Đường & Tạp Chí Số E-Magazine
                  </h3>
                </div>
                <span className="text-xs text-[#b8ad95]">Sáng tạo của học sinh chuyên</span>
              </div>

              {/* Podcast Player Cassette Widget */}
              <div className="bg-[#0e1711] border-2 border-[#2b4432] rounded-xl p-5 sm:p-6 shadow-inner">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#223528]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#eccb76] text-[#1c1810] flex items-center justify-center font-bold">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif-vintage text-base font-bold text-white">
                        Radio Chuyên Sơn La: Thanh Âm Tri Ân Người Dẫn Lối
                      </h4>
                      <span className="text-[11px] text-[#8ea293]">
                        Phát thanh thanh xuân học trò · Số đặc biệt chào mừng 20/11
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePodcast(selectedPodcastEpisode)}
                    className="px-4 py-2 rounded-lg bg-[#cbbaa1] hover:bg-[#dbccb5] text-[#1c1810] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    {isPlayingPodcast ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-[#1c1810]" />}
                    <span>{isPlayingPodcast ? 'Tạm dừng radio' : 'Phát số radio'}</span>
                  </button>
                </div>

                {/* Playlist Episodes */}
                <div className="space-y-3">
                  {podcastEpisodes.map((ep, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleTogglePodcast(idx)}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        selectedPodcastEpisode === idx
                          ? 'bg-[#1e3425] border-[#eccb76] text-white'
                          : 'bg-[#131f17] border-[#273d2d] text-[#cfc5aa] hover:bg-[#1a2d20]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[#eccb76] font-bold">
                          0{idx + 1}
                        </span>
                        <div>
                          <h5 className="font-medium text-xs sm:text-sm text-white">
                            {ep.title}
                          </h5>
                          <span className="text-[11px] text-[#93a698] block mt-0.5">
                            {ep.narrator} · {ep.summary}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs text-[#eccb76]">{ep.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* E-Magazine & Infographic showcase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#18281e] p-4 rounded-xl border border-[#2b4432]">
                  <span className="text-[10px] font-mono uppercase text-[#eccb76]">BÁO TƯỜNG SỐ</span>
                  <h5 className="font-serif-vintage text-sm font-bold text-white mt-1">
                    Infographic: Hành Trình 30 Năm THPT Chuyên Sơn La
                  </h5>
                  <p className="text-xs text-[#b8ad95] mt-1 leading-relaxed">
                    Số liệu và thành tích học sinh giỏi quốc gia qua các thời kỳ, truyền thống hiếu học của đất và người Tây Bắc.
                  </p>
                </div>

                <div className="bg-[#18281e] p-4 rounded-xl border border-[#2b4432]">
                  <span className="text-[10px] font-mono uppercase text-[#eccb76]">TRUYỆN TRANH KỶ NIỆM</span>
                  <h5 className="font-serif-vintage text-sm font-bold text-white mt-1">
                    Mẩu Chuyện Học Trò: Chiếc Cặp Cũ Của Thầy
                  </h5>
                  <p className="text-xs text-[#b8ad95] mt-1 leading-relaxed">
                    Sáng tác truyện tranh ngắn của học sinh Chuyên Sơn La về hình ảnh người thầy giản dị và tận tụy.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VƯỜN HOA ĐIỂM 9 & 10 CHÀO MỪNG 20/11 (EDITABLE) */}
          {activeTab === 'thi-dua' && (
            <div className="space-y-6">
              {/* Header with Edit Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#253d2c] pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#eccb76] font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#eccb76]" />
                    <span>PHONG TRÀO THI ĐUA HỌC TỐT</span>
                  </span>
                  <h3 className="font-serif-vintage text-2xl font-bold text-white mt-1">
                    Bảng Hoa Điểm 9, Điểm 10 Dâng Tặng Thầy Cô
                  </h3>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-[#b8ad95] hidden md:inline">
                    {flowerStats.lastUpdated}
                  </span>
                  <button
                    onClick={handleOpenEditStats}
                    className="px-3.5 py-2 rounded-lg bg-[#24392b] hover:bg-[#314e3b] text-[#eccb76] border border-[#3e664b] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Chỉnh sửa số liệu hoa điểm 9, điểm 10"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Cập Nhật Số Liệu</span>
                  </button>
                </div>
              </div>

              {/* Toast Feedback */}
              {toastMessage && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs text-center font-medium animate-in fade-in duration-300">
                  ✨ {toastMessage}
                </div>
              )}

              {/* Numbers Grid with Quick Add Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Hoa Điểm 9 */}
                <div className="bg-[#18281e] p-5 rounded-2xl border border-[#2b4432] hover:border-[#eccb76]/40 transition-all text-center flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🌸</div>
                    <div className="text-3xl font-bold font-mono text-[#eccb76] tracking-tight">
                      {flowerStats.flower9.toLocaleString('vi-VN')}
                    </div>
                    <div className="text-xs font-semibold text-white mt-1">
                      Hoa Điểm 9 Dâng Thầy Cô
                    </div>
                    <p className="text-[11px] text-[#8ea293] mt-1">
                      Ghi nhận từ các chi đoàn khối 10, 11, 12
                    </p>
                  </div>

                  {/* Quick Increment Buttons */}
                  <div className="mt-4 pt-3 border-t border-[#233829] flex items-center justify-center gap-2">
                    <span className="text-[10px] text-[#b8ad95]">Góp thêm:</span>
                    <button
                      onClick={() => handleAddFlower9(1)}
                      className="px-2 py-1 rounded bg-[#203526] hover:bg-[#2c4936] text-[11px] font-mono text-[#eccb76] font-bold border border-[#31523b] cursor-pointer"
                      title="Thêm 1 bông hoa điểm 9"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleAddFlower9(5)}
                      className="px-2 py-1 rounded bg-[#203526] hover:bg-[#2c4936] text-[11px] font-mono text-[#eccb76] font-bold border border-[#31523b] cursor-pointer"
                      title="Thêm 5 bông hoa điểm 9"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => handleAddFlower9(10)}
                      className="px-2.5 py-1 rounded bg-[#2a4533] hover:bg-[#365942] text-[11px] font-mono text-white font-bold border border-[#3d694b] cursor-pointer"
                      title="Thêm 10 bông hoa điểm 9"
                    >
                      +10
                    </button>
                  </div>
                </div>

                {/* Hoa Điểm 10 */}
                <div className="bg-[#18281e] p-5 rounded-2xl border border-[#2b4432] hover:border-[#eccb76]/40 transition-all text-center flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🌺</div>
                    <div className="text-3xl font-bold font-mono text-[#eccb76] tracking-tight">
                      {flowerStats.flower10.toLocaleString('vi-VN')}
                    </div>
                    <div className="text-xs font-semibold text-white mt-1">
                      Hoa Điểm 10 Xuất Sắc
                    </div>
                    <p className="text-[11px] text-[#8ea293] mt-1">
                      Những giờ học tốt, ngày học tốt chào mừng 20/11
                    </p>
                  </div>

                  {/* Quick Increment Buttons */}
                  <div className="mt-4 pt-3 border-t border-[#233829] flex items-center justify-center gap-2">
                    <span className="text-[10px] text-[#b8ad95]">Góp thêm:</span>
                    <button
                      onClick={() => handleAddFlower10(1)}
                      className="px-2 py-1 rounded bg-[#203526] hover:bg-[#2c4936] text-[11px] font-mono text-[#eccb76] font-bold border border-[#31523b] cursor-pointer"
                      title="Thêm 1 bông hoa điểm 10"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleAddFlower10(5)}
                      className="px-2 py-1 rounded bg-[#203526] hover:bg-[#2c4936] text-[11px] font-mono text-[#eccb76] font-bold border border-[#31523b] cursor-pointer"
                      title="Thêm 5 bông hoa điểm 10"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => handleAddFlower10(10)}
                      className="px-2.5 py-1 rounded bg-[#2a4533] hover:bg-[#365942] text-[11px] font-mono text-white font-bold border border-[#3d694b] cursor-pointer"
                      title="Thêm 10 bông hoa điểm 10"
                    >
                      +10
                    </button>
                  </div>
                </div>

                {/* Tỷ Lệ Chi Đoàn */}
                <div className="bg-[#18281e] p-5 rounded-2xl border border-[#2b4432] hover:border-[#eccb76]/40 transition-all text-center flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏆</div>
                    <div className="text-3xl font-bold font-mono text-[#eccb76] tracking-tight">
                      {flowerStats.participationRate}%
                    </div>
                    <div className="text-xs font-semibold text-white mt-1">
                      Chi Đoàn Tham Gia Thi Đua
                    </div>
                    <p className="text-[11px] text-[#8ea293] mt-1">
                      Ý thức trách nhiệm và tinh thần tôn sư trọng đạo
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#233829]">
                    <button
                      onClick={handleOpenEditStats}
                      className="text-xs text-[#b8ad95] hover:text-[#eccb76] transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Nhấp để sửa tỷ lệ %</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Edit Modal */}
              {isEditingStats && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
                  <div className="bg-[#1b2b20] border-2 border-[#eccb76]/60 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-[#f6eedc]">
                    <button
                      onClick={() => setIsEditingStats(false)}
                      className="absolute top-4 right-4 text-[#cfc5aa] hover:text-white p-1 rounded-lg cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2d4734]">
                      <div className="w-8 h-8 rounded-full bg-[#eccb76] text-[#1c1810] flex items-center justify-center font-bold">
                        <Edit3 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-serif-vintage text-lg font-bold text-white">
                          Cập Nhật Số Liệu Thi Đua
                        </h4>
                        <span className="text-xs text-[#b8ad95]">
                          Chỉnh sửa số hoa điểm 9, điểm 10 và tỷ lệ tham gia
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleSaveStats} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                          🌸 Số Hoa Điểm 9 Dâng Thầy Cô:
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={editFlower9}
                          onChange={(e) => setEditFlower9(Number(e.target.value))}
                          className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-sm text-[#eccb76] font-mono font-bold focus:outline-hidden focus:border-[#eccb76]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                          🌺 Số Hoa Điểm 10 Xuất Sắc:
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={editFlower10}
                          onChange={(e) => setEditFlower10(Number(e.target.value))}
                          className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-sm text-[#eccb76] font-mono font-bold focus:outline-hidden focus:border-[#eccb76]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                          🏆 Tỷ Lệ Chi Đoàn Tham Gia (%):
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          required
                          value={editRate}
                          onChange={(e) => setEditRate(Number(e.target.value))}
                          className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-sm text-[#eccb76] font-mono font-bold focus:outline-hidden focus:border-[#eccb76]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                          Thời gian / Ghi chú cập nhật:
                        </label>
                        <input
                          type="text"
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          placeholder="Ví dụ: Cập nhật tuần 4 cao điểm 20/11"
                          className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#eccb76]"
                        />
                      </div>

                      <div className="pt-3 flex items-center justify-between border-t border-[#2a4332]">
                        <button
                          type="button"
                          onClick={handleResetDefaultStats}
                          className="px-3 py-1.5 text-xs text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer"
                          title="Khôi phục số liệu gốc ban đầu"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Đặt lại mặc định</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsEditingStats(false)}
                            className="px-3 py-1.5 text-xs text-[#b8ad95] hover:text-white cursor-pointer"
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 text-xs font-bold text-[#1c1810] bg-[#eccb76] hover:bg-[#fad886] rounded-lg cursor-pointer shadow-md flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Lưu Số Liệu</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
      {/* Modal Add / Edit Part 2 Moment */}
      {isAddingMoment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#1b2b20] border-2 border-[#e4c77d]/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-6 text-[#f6eedc]">
            <button
              onClick={() => {
                setIsAddingMoment(false);
                setEditingMoment(null);
              }}
              className="absolute top-4 right-4 text-[#cfc5aa] hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2d4734]">
              <div className="w-8 h-8 rounded-full bg-[#eccb76] text-[#1c1810] flex items-center justify-center font-bold">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif-vintage text-lg font-bold text-white">
                  {editingMoment ? 'Chỉnh Sửa Khoảnh Khắc Thầy Trò' : 'Đăng Khoảnh Khắc Thầy Trò Mới'}
                </h3>
                <span className="text-xs text-[#b8ad95]">
                  Chia sẻ những hình ảnh vui tươi, kỷ niệm tiết học và ngoại khóa
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveMoment} className="space-y-4">
              {/* Photo Preview & Method */}
              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1.5">
                  Hình ảnh khoảnh khắc:
                </label>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[#101b13] border-2 border-[#375a40] flex items-center justify-center mb-3">
                  <img
                    src={momentMethod === 'url' && momentUrl ? momentUrl : momentImage}
                    alt="Xem trước hình ảnh"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png';
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] text-[#eccb76]">
                    Xem trước trực tiếp
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setMomentMethod('upload')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border ${
                      momentMethod === 'upload'
                        ? 'bg-[#cbbaa1] text-[#1a160f] border-[#cbbaa1]'
                        : 'bg-[#121d15] text-[#cfc5aa] border-[#2b4432]'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải ảnh từ máy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMomentMethod('url')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border ${
                      momentMethod === 'url'
                        ? 'bg-[#cbbaa1] text-[#1a160f] border-[#cbbaa1]'
                        : 'bg-[#121d15] text-[#cfc5aa] border-[#2b4432]'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Nhập URL ảnh</span>
                  </button>
                </div>

                {momentMethod === 'upload' ? (
                  <div>
                    <input
                      ref={momentFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleMomentFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => momentFileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-lg bg-[#22392b] hover:bg-[#2c4937] border border-dashed border-[#446d4d] text-xs font-medium text-[#f5ebd7] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#eccb76]" />
                      <span>Chọn ảnh từ điện thoại / máy tính</span>
                    </button>
                  </div>
                ) : (
                  <input
                    type="url"
                    value={momentUrl}
                    onChange={(e) => setMomentUrl(e.target.value)}
                    placeholder="https://... hoặc /assets/..."
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                    Phân loại / Khối lớp:
                  </label>
                  <select
                    value={momentTag}
                    onChange={(e) => setMomentTag(e.target.value)}
                    className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                  >
                    <option value="KHỐI 10">KHỐI 10</option>
                    <option value="KHỐI 11">KHỐI 11</option>
                    <option value="KHỐI 12">KHỐI 12</option>
                    <option value="NGOẠI KHÓA">NGOẠI KHÓA</option>
                    <option value="GIỜ HỌC TỐT">GIỜ HỌC TỐT</option>
                    <option value="KỶ NIỆM VUI">KỶ NIỆM VUI</option>
                    <option value="custom">Tùy chỉnh khác</option>
                  </select>
                </div>
                {momentTag === 'custom' ? (
                  <div>
                    <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                      Nhập thẻ tự chọn:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: CLB ÂM NHẠC"
                      value={momentCustomTag}
                      onChange={(e) => setMomentCustomTag(e.target.value)}
                      className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                    />
                  </div>
                ) : (
                  <div className="flex items-end text-[11px] text-[#b8ad95] pb-2">
                    Gắn thẻ để phân loại khoảnh khắc
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Tiêu đề khoảnh khắc *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Giờ thực hành thí nghiệm hoá học vui nhộn"
                  value={momentTitle}
                  onChange={(e) => setMomentTitle(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded5c0] mb-1">
                  Nội dung kỷ niệm / Lời tựa *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Chia sẻ đôi dòng cảm xúc về khoảnh khắc này..."
                  value={momentDesc}
                  onChange={(e) => setMomentDesc(e.target.value)}
                  className="w-full bg-[#131f17] border border-[#334e3a] rounded-lg px-3 py-2 text-xs text-[#f6eedc] focus:outline-hidden focus:border-[#e4c77d] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#2a4332]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingMoment(false);
                    setEditingMoment(null);
                  }}
                  className="px-4 py-2 text-xs font-medium text-[#c0b59b] hover:text-white rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-[#1a160f] bg-[#e4c77d] hover:bg-[#ebd79b] rounded-lg cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingMoment ? 'Cập nhật khoảnh khắc' : 'Đăng khoảnh khắc'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

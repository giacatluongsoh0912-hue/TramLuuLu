import React, { useState } from 'react';
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
} from 'lucide-react';
import { audioPlayer } from '../utils/audioPlayer';

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
    <section id="contest-framework" className="py-16 bg-[#101a13] relative border-b border-[#223528]">
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
              <div className="flex items-center justify-between border-b border-[#253d2c] pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#eccb76] font-semibold">
                    PHẦN 2 · THẦY TRÒ CHUYÊN SƠN LA
                  </span>
                  <h3 className="font-serif-vintage text-2xl font-bold text-white mt-1">
                    Khoảnh Khắc Đời Thường & Kỷ Niệm Tiết Học
                  </h3>
                </div>
                <span className="text-xs text-[#b8ad95]">Khối 10 · Khối 11 · Khối 12</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#18281e] p-4 rounded-xl border border-[#2a4332] shadow-md">
                  <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#101a13] mb-3">
                    <img
                      src="/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png"
                      alt="Giờ sinh hoạt chủ nhiệm"
                      className="w-full h-full object-cover object-[88%_72%]"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-[#eccb76]">KHỐI 12</span>
                  <h4 className="font-serif-vintage text-base font-bold text-white mt-1">
                    Những Tiết Sinh Hoạt Ấm Áp Của K31
                  </h4>
                  <p className="font-body text-xs text-[#b8ab95] mt-1.5 leading-relaxed">
                    Lời dặn dò ân cần trước kỳ thi đại học, những cái ôm siết chặt và sự quan tâm như của người cha, người mẹ thứ hai.
                  </p>
                </div>

                <div className="bg-[#18281e] p-4 rounded-xl border border-[#2a4332] shadow-md">
                  <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#101a13] mb-3">
                    <img
                      src="/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png"
                      alt="Hoạt động ngoại khóa & Thể thao"
                      className="w-full h-full object-cover object-[10%_10%]"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-[#eccb76]">NGOẠI KHÓA</span>
                  <h4 className="font-serif-vintage text-base font-bold text-white mt-1">
                    Vòng Xòe Đoàn Kết & Hội Trại Sam Si
                  </h4>
                  <p className="font-body text-xs text-[#b8ab95] mt-1.5 leading-relaxed">
                    Nơi thầy trò cùng hòa chung một điệu múa xòe, đốt lên ngọn lửa trại bập bùng thắp sáng ước mơ tuổi trẻ.
                  </p>
                </div>

                <div className="bg-[#18281e] p-4 rounded-xl border border-[#2a4332] shadow-md">
                  <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#101a13] mb-3">
                    <img
                      src="/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png"
                      alt="Tiết học say mê bên bục giảng"
                      className="w-full h-full object-cover object-[62%_35%]"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-[#eccb76]">GIỜ HỌC TỐT</span>
                  <h4 className="font-serif-vintage text-base font-bold text-white mt-1">
                    Say Mê Từng Giờ Học Đổi Mới Sáng Tạo
                  </h4>
                  <p className="font-body text-xs text-[#b8ab95] mt-1.5 leading-relaxed">
                    Các tiết thực hành STEM, dự án trải nghiệm văn học và những giờ học không khoảng cách giữa thầy và trò.
                  </p>
                </div>
              </div>
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
                <button
                  onClick={onOpenComposer}
                  className="px-4 py-2 rounded-lg bg-[#cbbaa1] hover:bg-[#dbccb5] text-[#1c1810] text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Gửi thư vào Hòm thư số
                </button>
              </div>

              <div className="bg-[#111c15] p-6 rounded-xl border border-[#2a4332]">
                <p className="font-body text-xs sm:text-sm text-[#ded7c3] leading-relaxed mb-4">
                  Hòm thư số kết nối cựu học sinh được tích hợp mở, cho phép cựu học sinh chuyên Sơn La khắp mọi miền Tổ quốc và quốc tế gửi lời chúc, tâm sự, ảnh kỷ niệm xưa và lời tri ân trực tiếp tới thầy cô giảng dạy.
                </p>
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

          {/* VƯỜN HOA ĐIỂM 9 & 10 CHÀO MỪNG 20/11 */}
          {activeTab === 'thi-dua' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#253d2c] pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#eccb76] font-semibold">
                    PHONG TRÀO THI ĐUA HỌC TỐT
                  </span>
                  <h3 className="font-serif-vintage text-2xl font-bold text-white mt-1">
                    Bảng Hoa Điểm 9, Điểm 10 Dâng Tặng Thầy Cô
                  </h3>
                </div>
                <span className="text-xs text-[#b8ad95]">Cập nhật tuần cao điểm 20/11</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#18281e] p-5 rounded-xl border border-[#2b4432] text-center">
                  <div className="text-3xl mb-2">🌸</div>
                  <div className="text-2xl font-bold font-mono text-[#eccb76]">1,280</div>
                  <div className="text-xs font-semibold text-white mt-1">Hoa Điểm 9 Dâng Thầy Cô</div>
                  <p className="text-[11px] text-[#8ea293] mt-1">Ghi nhận từ các chi đoàn khối 10, 11, 12</p>
                </div>

                <div className="bg-[#18281e] p-5 rounded-xl border border-[#2b4432] text-center">
                  <div className="text-3xl mb-2">🌺</div>
                  <div className="text-2xl font-bold font-mono text-[#eccb76]">895</div>
                  <div className="text-xs font-semibold text-white mt-1">Hoa Điểm 10 Xuất Sắc</div>
                  <p className="text-[11px] text-[#8ea293] mt-1">Những giờ học tốt, ngày học tốt chào mừng 20/11</p>
                </div>

                <div className="bg-[#18281e] p-5 rounded-xl border border-[#2b4432] text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-2xl font-bold font-mono text-[#eccb76]">100%</div>
                  <div className="text-xs font-semibold text-white mt-1">Chi Đoàn Tham Gia Thi Đua</div>
                  <p className="text-[11px] text-[#8ea293] mt-1">Ý thức trách nhiệm và tinh thần tôn sư trọng đạo</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

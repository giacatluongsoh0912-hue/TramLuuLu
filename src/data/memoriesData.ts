import { TributeMessage } from '../utils/tributeRules';

export interface MemoryPhoto {
  id: string;
  title: string;
  year: string;
  category: 'classroom' | 'flower' | 'olympiad' | 'graduation';
  caption: string;
  author: string;
  imageSrc: string;
  tags: string[];
  likes: number;
}

export interface DepartmentFaculty {
  id: string;
  name: string;
  code: string;
  tagline: string;
  teacherCount: number;
  featuredQuote: string;
  headTeacher: string;
  candleCount: number;
}

export interface TeacherProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  departmentName: string;
  avatar: string;
  quote: string;
  achievements: string[];
  bio: string;
  yearsOfService: string;
  likes: number;
}

export interface LeadershipMilestone {
  id: string;
  name: string;
  title: string;
  roleType: 'principal' | 'vice_principal';
  period: string;
  milestoneTitle: string;
  contributions: string;
  quote: string;
  avatar: string;
}

export const LEADERSHIP_TIMELINE_DATA: LeadershipMilestone[] = [
  {
    id: 'lead-1',
    name: 'Thầy Trần Hữu Chiến',
    title: 'Hiệu trưởng đầu tiên',
    roleType: 'principal',
    period: '1995 – 2010 (15 năm)',
    milestoneTitle: 'Đặt Nền Móng Kiến Thiết Mái Trường Năng Khiếu',
    contributions: 'Thuyền trưởng tiên phong từ ngày đầu thành lập trường (17/5/1995). Vượt qua muôn vàn thiếu thốn về cơ sở vật chất, thầy cùng tập thể sư phạm đặt nền móng vững chắc cho sự nghiệp bồi dưỡng nhân tài vùng cao Sơn La.',
    quote: 'Mỗi viên gạch đặt xuống hôm nay là một bệ phóng cho tương lai của những thế hệ học trò vùng cao.',
    avatar: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
  },
  {
    id: 'lead-2',
    name: 'Thầy Cầm Duy Thịnh',
    title: 'Hiệu trưởng',
    roleType: 'principal',
    period: '2010 – 2015',
    milestoneTitle: 'Chuyển Mình & Khởi Công Xây Dựng Cơ Sở Mới',
    contributions: 'Lãnh đạo nhà trường trong giai đoạn mở rộng quy mô, chỉ đạo chuẩn bị và thực hiện dự án xây dựng cơ sở vật chất mới hiện đại tại phường Chiềng Sinh, thành phố Sơn La.',
    quote: 'Mở rộng không gian học tập là mở ra chân trời mới để học trò Chuyên Sơn La tự tin sải cánh.',
    avatar: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
  },
  {
    id: 'lead-3',
    name: 'NGƯT. Trần La Giang',
    title: 'Nhà giáo Ưu tú · Nguyên Hiệu trưởng',
    roleType: 'principal',
    period: '12/2015 – 09/2023 (8 năm)',
    milestoneTitle: 'Bứt Phá Giáo Dục Mũi Nhọn Tại Ngôi Trường Mới',
    contributions: 'Nguyên Phó Hiệu trưởng và Hiệu trưởng suốt 8 năm tại cơ sở mới khang trang. Đưa giáo dục mũi nhọn Chuyên Sơn La vươn tầm cao mới với bảng vàng thành tích HSG Quốc gia rực rỡ, để lại dấu ấn sâu đậm trong lòng nhiều thế hệ học trò.',
    quote: 'Giáo dục bắt đầu từ tình yêu thương và khát vọng cống hiến không ngừng nghỉ vì học sinh thân yêu.',
    avatar: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
  },
  {
    id: 'lead-4',
    name: 'ThS. Phạm Thị Thuận',
    title: 'Bí thư Đảng ủy · Hiệu trưởng đương nhiệm',
    roleType: 'principal',
    period: '09/2023 – Nay',
    milestoneTitle: 'Kỷ Nguyên Số Hóa & Hội Nhập Quốc Tế',
    contributions: 'Đương kim Bí thư Đảng ủy, Hiệu trưởng nhà trường, người chèo lái con thuyền Chuyên Sơn La bước vào chặng đường kỷ niệm 30 năm vẻ vang (1995–2025/2026), thúc đẩy chuyển đổi số toàn diện và hội nhập toàn cầu.',
    quote: 'Chuyên Sơn La tiếp tục thắp sáng ngọn lửa trí tuệ, bản lĩnh và lòng nhân ái trong kỷ nguyên số.',
    avatar: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
  },
  {
    id: 'lead-5',
    name: 'TS. Nguyễn Bình Long',
    title: 'Tiến sĩ · Phó Hiệu trưởng',
    roleType: 'vice_principal',
    period: '2014 – Nay',
    milestoneTitle: 'Chỉ Đạo Chuyên Môn & Tiên Phong Chuyển Đổi Số',
    contributions: 'Phụ trách công tác chuyên môn mũi nhọn của nhà trường, người đi đầu trong ứng dụng công nghệ thông tin, chuyển đổi số phương pháp giảng dạy và nghiên cứu khoa học kỹ thuật.',
    quote: 'Công nghệ là công cụ đắc lực, nhưng trái tim người thầy mới là cội nguồn của sự truyền cảm hứng.',
    avatar: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
  },
  {
    id: 'lead-6',
    name: 'Thầy Trần Doãn Quyết',
    title: 'Phó Hiệu trưởng',
    roleType: 'vice_principal',
    period: '2019 – Nay',
    milestoneTitle: 'Nề Nếp Kỷ Cương & Phong Trào Thanh Niên Xung Kích',
    contributions: 'Nhiều năm giữ trọng trách Bí thư Đoàn trường (2011–2019) trước khi đảm nhiệm cương vị Phó Hiệu trưởng. Thầy luôn đồng hành cùng nề nếp, kỷ cương học đường và các phong trào tuổi trẻ Chuyên Sơn La sôi nổi.',
    quote: 'Tuổi trẻ Chuyên Sơn La: Đoàn kết, kỷ cương, sáng tạo và luôn mang trong mình khát khao cống hiến.',
    avatar: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
  },
];

export const INITIAL_TEACHERS: TeacherProfile[] = [
  {
    id: 'tch-ht-1',
    name: 'Cô Phạm Thị Thuận',
    role: 'Bí thư Đảng ủy - Hiệu trưởng đương nhiệm',
    department: 'bgh',
    departmentName: 'Ban Giám Hiệu',
    avatar: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    quote: 'Chuyên Sơn La không chỉ trao cho các em tri thức, mà rèn giũa bản lĩnh, tâm hồn và lòng biết ơn cuộc đời.',
    achievements: ['Hiệu trưởng đương nhiệm (từ 09/2023)', 'Bí thư Đảng ủy Nhà trường', 'Chiến sĩ thi đua cấp Tỉnh'],
    bio: 'Người thuyền trưởng đương nhiệm dẫn dắt trường THPT Chuyên Sơn La vững bước vào kỷ nguyên chuyển đổi số, hướng tới dấu mốc 30 năm vẻ vang 1995 – 2025/2026.',
    yearsOfService: 'Lãnh đạo đương nhiệm',
    likes: 542,
  },
  {
    id: 'tch-ht-2',
    name: 'NGƯT. Trần La Giang',
    role: 'Nhà giáo Ưu tú · Nguyên Hiệu trưởng (2015-2023)',
    department: 'bgh',
    departmentName: 'Ban Giám Hiệu',
    avatar: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    quote: 'Thành công của các em học sinh là phần thưởng vô giá và niềm hạnh phúc lớn nhất của đời người thầy.',
    achievements: ['Nhà giáo Ưu tú', 'Hiệu trưởng 8 năm (2015-2023)', 'Nhiều Huân chương & Bằng khen'],
    bio: 'Nguyên Phó Hiệu trưởng và Hiệu trưởng gắn bó trọn vẹn với chặng đường phát triển rực rỡ tại cơ sở mới Chiềng Sinh, dẫn dắt bao thế hệ học trò đạt giải Quốc gia.',
    yearsOfService: 'Giai đoạn 2015 – 2023',
    likes: 618,
  },
  {
    id: 'tch-ht-3',
    name: 'Thầy Trần Hữu Chiến',
    role: 'Hiệu trưởng đầu tiên (1995-2010)',
    department: 'bgh',
    departmentName: 'Ban Giám Hiệu',
    avatar: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    quote: 'Từng viên gạch đặt xuống thuở ban sơ là nền tảng cho sự vươn mình của bao nhân tài Tây Bắc.',
    achievements: ['Hiệu trưởng sáng lập (1995-2010)', '15 năm đặt nền móng kiến thiết', 'Kỷ niệm chương Vì sự nghiệp giáo dục'],
    bio: 'Người thầy của những ngày đầu thành lập Trường Phổ thông Năng khiếu Sơn La, vượt bao khó khăn để tạo dựng nên mái trường Chuyên danh tiếng ngày nay.',
    yearsOfService: '15 năm sáng lập',
    likes: 495,
  },
  {
    id: 'tch-pht-1',
    name: 'TS. Nguyễn Bình Long',
    role: 'Tiến sĩ · Phó Hiệu trưởng',
    department: 'bgh',
    departmentName: 'Ban Giám Hiệu',
    avatar: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    quote: 'Chuyển đổi số và tư duy sáng tạo là đôi cánh để học sinh Chuyên Sơn La vươn tới tầm cao mới.',
    achievements: ['Phó Hiệu trưởng từ 2014', 'Tiên phong Chuyển đổi số', 'Bồi dưỡng HSG Quốc gia'],
    bio: 'Phụ trách công tác chuyên môn mũi nhọn, người luôn thúc đẩy học trò tiếp cận tri thức hiện đại và các phương pháp học tập tiên tiến.',
    yearsOfService: 'Từ 2014 đến nay',
    likes: 412,
  },
  {
    id: 'tch-pht-2',
    name: 'Thầy Trần Doãn Quyết',
    role: 'Phó Hiệu trưởng',
    department: 'bgh',
    departmentName: 'Ban Giám Hiệu',
    avatar: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    quote: 'Kỷ cương là sức mạnh, nề nếp là nền tảng của nhân cách và thành công.',
    achievements: ['Phó Hiệu trưởng từ 2019', 'Nguyên Bí thư Đoàn trường (2011-2019)', 'Bằng khen Trung ương Đoàn'],
    bio: 'Gần gũi với học sinh, người truyền cảm hứng cho tinh thần xung kích, kỷ luật học đường và các hoạt động tình nguyện của thanh niên Chuyên Sơn La.',
    yearsOfService: 'Từ 2019 đến nay',
    likes: 476,
  },
  {
    id: 'tch-3',
    name: 'Thầy Trần Văn Cường',
    role: 'Tổ trưởng Tổ Toán - Tin học',
    department: 'toan-tin',
    departmentName: 'Tổ Toán - Tin học',
    avatar: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    quote: 'Toán học không khô khan nếu các em nhìn thấy sự hài hòa của quy luật tự nhiên và logic của cuộc sống.',
    achievements: ['Bồi dưỡng 18 giải HSG Quốc gia môn Toán', 'Bằng khen của Bộ GD&ĐT'],
    bio: 'Người thầy của những công thức kỳ diệu và những giờ phụ đạo không tính giờ. Thầy luôn kiên nhẫn vẽ từng hình học không gian phức tạp và chỉ dẫn từng bài toán hóc búa.',
    yearsOfService: '20 năm cống hiến',
    likes: 412,
  },
  {
    id: 'tch-4',
    name: 'Cô Nguyễn Thị Lan Hương',
    role: 'Tổ trưởng Tổ Ngữ Văn',
    department: 'ngu-van',
    departmentName: 'Tổ Ngữ Văn',
    avatar: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    quote: 'Văn học là nhân học. Học văn trước hết là học cách biết thương mình và thấu cảm với tha nhân.',
    achievements: ['Giáo viên dạy giỏi cấp Quốc gia', 'Chủ nhiệm nhiều khóa chuyên Văn đạt giải Nhất Tỉnh'],
    bio: 'Giọng đọc văn trầm ấm và giàu xúc cảm của cô là kỷ niệm không thể nào quên của mọi thế hệ chuyên Văn. Những bài học về Tây Tiến, về sông Mã dưới góc nhìn của cô luôn đọng mãi.',
    yearsOfService: '19 năm cống hiến',
    likes: 475,
  },
  {
    id: 'tch-5',
    name: 'Thầy Lê Anh Tuấn',
    role: 'Giáo viên phụ trách Đội tuyển Tin học',
    department: 'toan-tin',
    departmentName: 'Tổ Toán - Tin học',
    avatar: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    quote: 'Mỗi dòng mã code đều phản ánh tư duy ngăn nắp và lòng kiên trì gỡ lỗi đến tận cùng.',
    achievements: ['Huấn luyện viên Tin học trẻ xuất sắc', 'Giải Nhì Sáng tạo Kỹ thuật'],
    bio: 'Luôn thức khuya cùng học trò trong phòng máy tính. Những gói mì tôm đêm muộn và những lời giải thuật toán thông minh của thầy đã chắp cánh cho bao kỹ sư phần mềm tương lai.',
    yearsOfService: '14 năm cống hiến',
    likes: 310,
  },
  {
    id: 'tch-6',
    name: 'Cô Hoàng Thu Trang',
    role: 'Tổ trưởng Tổ Ngoại Ngữ',
    department: 'ngoai-ngu',
    departmentName: 'Tổ Âm nhạc - Ngoại ngữ',
    avatar: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    quote: 'Never stop learning, because life never stops teaching. Hãy tự tin đưa văn hóa Sơn La ra thế giới!',
    achievements: ['IELTS 8.5', 'Bồi dưỡng học sinh đạt giải Nhì HSG Quốc gia môn Tiếng Anh'],
    bio: 'Năng động, truyền cảm hứng và luôn tổ chức các hoạt động tranh biện tiếng Anh sôi nổi. Cô giúp học trò xóa tan nỗi sợ ngoại ngữ và tự tin hội nhập toàn cầu.',
    yearsOfService: '16 năm cống hiến',
    likes: 388,
  },
  {
    id: 'tch-7',
    name: 'Thầy Hoàng Văn Minh',
    role: 'Giáo viên Chuyên Vật Lý',
    department: 'vat-ly',
    departmentName: 'Tổ Vật lý',
    avatar: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    quote: 'Vũ trụ vận hành theo những định luật tuyệt đối, nhưng tình thầy trò là hằng số bất biến của thời gian.',
    achievements: ['Chủ nhiệm dự án STEM cấp Tỉnh', 'Bồi dưỡng nhiều thế hệ học sinh Chuyên Lý'],
    bio: 'Những thí nghiệm quang học huyền ảo và những câu chuyện về các nhà bác học vĩ đại luôn khiến các tiết học Vật lý của thầy trở nên say mê, cuốn hút lạ kỳ.',
    yearsOfService: '17 năm cống hiến',
    likes: 270,
  },
  {
    id: 'tch-8',
    name: 'Cô Lò Thị Thu Thủy',
    role: 'Giáo viên Chuyên Lịch Sử',
    department: 'su-dia',
    departmentName: 'Tổ Lịch sử địa lí',
    avatar: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    quote: 'Lịch sử không phải là những con số vô hồn, đó là hơi thở và máu xương của cha ông để lại cho chúng ta.',
    achievements: ['Chiến sĩ thi đua cơ sở', 'Bồi dưỡng giải Ba Quốc gia môn Lịch Sử'],
    bio: 'Gợi mở niềm say mê tự hào cội nguồn bằng những chuyến đi thực tế tới Nhà tù Sơn La, Ngã ba Cò Nòi, thắp sáng tình yêu quê hương cho biết bao lứa học trò.',
    yearsOfService: '15 năm cống hiến',
    likes: 315,
  },
];

export const INITIAL_PADLET_NOTES = [
  {
    id: 'pdl-1',
    author: 'Cựu học sinh K28 Chuyên Toán',
    className: 'K28 Toán (2019-2022)',
    content: 'Kính chúc các thầy cô Chuyên Sơn La luôn mạnh khỏe và hạnh phúc! 4 năm ở giảng đường đại học Hà Nội, em mới thấy trân quý những tháng ngày được học dưới mái trường Chiềng Sinh.',
    color: 'yellow' as const,
    tag: 'cựu học sinh',
    likes: 24,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
  },
  {
    id: 'pdl-2',
    author: 'Hà Linh & Quỳnh Chi',
    className: '12 Chuyên Anh K31',
    content: 'Cảm ơn cô Trang vì đã luôn kiên nhẫn sửa từng lỗi phát âm và truyền cho chúng em sự tự tin! Chúc cô 20/11 ngập tràn niềm vui và hoa tươi!',
    color: 'pink' as const,
    tag: 'lời chúc 20/11',
    likes: 18,
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
  },
  {
    id: 'pdl-3',
    author: 'Tập thể 11 Chuyên Lý',
    className: 'Khóa K32',
    content: 'Nhớ những buổi chiều thí nghiệm đo gia tốc trọng trường rơi cả quả cân mà thầy Minh vẫn cười bảo: "Làm lại đi các nhà bác học nhí!". Yêu thầy nhiều lắm ạ!',
    color: 'cyan' as const,
    tag: 'kỷ niệm vui',
    likes: 32,
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: 'pdl-4',
    author: 'Đặng Tuấn Kiệt',
    className: 'Chuyên Tin K30',
    content: 'Thầy Tuấn ơi! Thuật toán Dijkstra thầy dạy năm xưa giờ em dùng mỗi ngày khi đi làm lập trình. Em cảm ơn thầy vì đã khơi nguồn đam mê công nghệ trong em!',
    color: 'purple' as const,
    tag: 'cựu học sinh',
    likes: 41,
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: 'pdl-5',
    author: 'Chi đoàn 10 Chuyên Văn',
    className: 'Tân binh K33',
    content: 'Mới vào trường được 3 tháng nhưng chúng em đã cảm nhận trọn vẹn sự ấm áp của gia đình Chuyên Sơn La. Kính dâng thầy cô ngàn bông hoa ban điểm 10 rực rỡ!',
    color: 'orange' as const,
    tag: 'lời chúc 20/11',
    likes: 27,
    createdAt: Date.now() - 1000 * 60 * 60 * 1,
  },
  {
    id: 'pdl-6',
    author: 'Nguyễn Hoàng Nam',
    className: 'Cựu học sinh Du học sinh',
    content: 'Cách xa Sơn La hơn 10.000 cây số nhưng trong tim em vẫn luôn hướng về thầy cô và gốc hoa ban thân thương sân trường. Chúc Chuyên Sơn La mãi là niềm tự hào của vùng cao Tây Bắc!',
    color: 'yellow' as const,
    tag: 'cựu học sinh',
    likes: 53,
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
  },
];

export const INITIAL_DEPARTMENTS: DepartmentFaculty[] = [
  {
    id: 'bgh',
    name: 'Ban Giám Hiệu',
    code: 'BGH',
    tagline: 'Định hướng tầm nhìn, chắp cánh cho bao thế hệ học sinh vùng cao vươn xa.',
    teacherCount: 5,
    featuredQuote: 'Mỗi học trò Chuyên Sơn La khi bước ra thế giới đều mang theo niềm tự hào và cốt cách núi rừng Tây Bắc.',
    headTeacher: 'Thầy Hiệu trưởng & Các Thầy Cô Phó Hiệu trưởng',
    candleCount: 382,
  },
  {
    id: 'toan-tin',
    name: 'Tổ Toán - Tin học',
    code: 'Toán - Tin',
    tagline: 'Những phương trình vô định, những thuật toán logic mở lối tư duy sắc sảo.',
    teacherCount: 16,
    featuredQuote: 'Bài toán khó có thể mất nhiều ngày để giải, nhưng sự kiên định của các em sẽ là lời giải cho cả cuộc đời.',
    headTeacher: 'Tập thể Thầy Cô Tổ Toán - Tin',
    candleCount: 456,
  },
  {
    id: 'ngu-van',
    name: 'Tổ Ngữ Văn',
    code: 'Ngữ Văn',
    tagline: 'Gieo hạt mầm nhân văn, dạy học trò biết yêu thương đồng bào và trân quý cuộc đời.',
    teacherCount: 14,
    featuredQuote: 'Văn chương không chỉ là những trang giấy, mà là tấm lòng để thấu cảm nhân sinh.',
    headTeacher: 'Tập thể Thầy Cô Tổ Ngữ Văn',
    candleCount: 521,
  },
  {
    id: 'vat-ly',
    name: 'Tổ Vật lý',
    code: 'Vật lý',
    tagline: 'Khám phá quy luật tự nhiên, truyền ngọn lửa đam mê khoa học thực nghiệm.',
    teacherCount: 10,
    featuredQuote: 'Ánh sáng luôn tìm đường đi ngắn nhất, cũng như các em luôn hướng về chân lý khoa học.',
    headTeacher: 'Tập thể Thầy Cô Tổ Vật lý',
    candleCount: 329,
  },
  {
    id: 'hoa-hoc',
    name: 'Tổ Hoá - Thiết bị',
    code: 'Hoá - TB',
    tagline: 'Phản ứng của nhiệt huyết, kết tủa của sự kiên trì và bảo đảm phòng thí nghiệm chuẩn mực.',
    teacherCount: 12,
    featuredQuote: 'Tình cảm thầy trò chúng ta bền chặt như liên kết cộng hóa trị vững bền qua năm tháng.',
    headTeacher: 'Tập thể Thầy Cô Tổ Hoá - Thiết bị',
    candleCount: 398,
  },
  {
    id: 'sinh-hoc',
    name: 'Tổ Sinh - Công nghệ',
    code: 'Sinh - CN',
    tagline: 'Hiểu về sự sống kỳ diệu của từng tế bào, kết nối khoa học sự sống và công nghệ hiện đại.',
    teacherCount: 11,
    featuredQuote: 'Mỗi mầm cây cần ánh sáng, mỗi học trò cần tình yêu thương và kỹ năng công nghệ để vươn cao.',
    headTeacher: 'Tập thể Thầy Cô Tổ Sinh - Công nghệ',
    candleCount: 375,
  },
  {
    id: 'ngoai-ngu',
    name: 'Tổ Âm nhạc - Ngoại ngữ',
    code: 'Âm nhạc - NN',
    tagline: 'Cây cầu ngôn ngữ hội nhập năm châu hòa cùng giai điệu nghệ thuật thăng hoa tâm hồn.',
    teacherCount: 16,
    featuredQuote: 'Ngôn ngữ mở lối ra thế giới, âm nhạc kết nối mọi trái tim và nuôi dưỡng tâm hồn cao đẹp.',
    headTeacher: 'Tập thể Thầy Cô Tổ Âm nhạc - Ngoại ngữ',
    candleCount: 462,
  },
  {
    id: 'su-dia',
    name: 'Tổ Lịch sử địa lí',
    code: 'Sử - Địa',
    tagline: 'Khắc ghi trang sử hào hùng dân tộc, thấu hiểu non sông gấm vóc và bản sắc quê hương.',
    teacherCount: 12,
    featuredQuote: 'Dưới chân núi Sam Si, lịch sử rạng ngời của mái trường do chính tuổi trẻ các em viết tiếp.',
    headTeacher: 'Tập thể Thầy Cô Tổ Lịch sử địa lí',
    candleCount: 380,
  },
  {
    id: 'gdtc-gdqpan',
    name: 'Tổ GDTC - GDQPAN',
    code: 'GDTC - QPAN',
    tagline: 'Rèn luyện thể chất dẻo dai, hun đúc tinh thần kỷ luật và ý chí bảo vệ non sông Tổ quốc.',
    teacherCount: 8,
    featuredQuote: 'Thân thể khỏe mạnh, ý chí kiên cường, sẵn sàng cống hiến trọn vẹn cho quê hương Sơn La và đất nước.',
    headTeacher: 'Tập thể Thầy Cô Tổ GDTC - GDQPAN',
    candleCount: 345,
  },
  {
    id: 'van-phong',
    name: 'Văn phòng - GDKT và PL',
    code: 'VP - GDKT & PL',
    tagline: 'Thầm lặng phía sau từng trang giáo án, xây dựng nền tảng pháp luật và công tác hành chính chỉn chu.',
    teacherCount: 10,
    featuredQuote: 'Tận tâm phục vụ, cống hiến thầm lặng vì một ngôi trường Chuyên Sơn La kỷ cương, văn minh và ấm áp.',
    headTeacher: 'Tập thể Cán bộ Văn phòng & Giáo viên GDKT và PL',
    candleCount: 360,
  },
];

export const INITIAL_MEMORIES: MemoryPhoto[] = [
  {
    id: 'mem-1',
    title: 'Mái trường Chuyên Sơn La ngày nắng mới',
    year: '2023 - 2026',
    category: 'classroom',
    caption: 'Kiến trúc mái vòm tam giác kiêu hãnh giữa nền trời Chiềng Sinh xanh biếc. Nơi lưu giữ tiếng trống khai trường rộn rã và những giờ tự học yên bình.',
    author: 'K30 Niên khóa 2021-2024',
    imageSrc: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    tags: ['Mái trường', 'Chiềng Sinh', 'Tự hào'],
    likes: 245,
  },
  {
    id: 'mem-2',
    title: 'Mùa hoa ban nở trắng sân trường',
    year: 'Mùa xuân Chuyên Sơn La',
    category: 'flower',
    caption: 'Tháng ba về, hoa ban trắng bung nở khắp các lối đi, vương trên tà áo dài trắng của các bạn nữ sinh và bậu cửa sổ phòng học.',
    author: 'Lưu bút K31',
    imageSrc: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    tags: ['Hoa ban', 'Mùa xuân', 'Kỷ niệm'],
    likes: 198,
  },
  {
    id: 'mem-3',
    title: 'Những đêm thao thức ôn thi Đội tuyển Quốc gia',
    year: 'Mùa đông các khóa',
    category: 'olympiad',
    caption: 'Góc phòng ôn thi sáng đèn đến 10 giờ đêm. Thầy mang cho gói xôi nóng, cô pha vội ấm trà gừng ấm bụng xua tan cái rét vùng cao.',
    author: 'Cựu học sinh Đội tuyển',
    imageSrc: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    tags: ['Đội tuyển HSG', 'Thầy cô', 'Nhiệt huyết'],
    likes: 312,
  },
  {
    id: 'mem-4',
    title: 'Lễ Tri ân và Trưởng thành: Khi tiếng ve gọi hè',
    year: 'Lễ bế giảng K31',
    category: 'graduation',
    caption: 'Những cái ôm siết chặt, những giọt nước mắt lăn trên má và dòng lưu bút vội vã trên lưng áo đồng phục: Cảm ơn Thầy Cô vì tất cả!',
    author: 'Khối 12 niên khóa K31',
    imageSrc: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    tags: ['Trưởng thành', 'Lưu bút', 'K31'],
    likes: 420,
  },
  {
    id: 'mem-5',
    title: 'Đêm lửa trại truyền thống và vòng xòe đoàn kết',
    year: 'Hội trại 26/3',
    category: 'classroom',
    caption: 'Ánh lửa bập bùng soi rọi những nụ cười trong veo. Cả thầy và trò cùng nắm tay nhau bước vào điệu xòe Tây Bắc rộn ràng.',
    author: 'Đoàn trường Chuyên Sơn La',
    imageSrc: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    tags: ['Lửa trại', 'Vòng xòe', 'Tuổi trẻ'],
    likes: 276,
  },
  {
    id: 'mem-6',
    title: 'Tiết học đặc biệt bên bảng đen phấn trắng',
    year: 'Mọi thế hệ học trò',
    category: 'classroom',
    caption: 'Bàn tay thầy vương bụi phấn trắng, giọng cô ân cần từng bài giảng. Giờ đây đi khắp phương trời, mới hiểu bụi phấn năm xưa hóa thành hành trang quý giá.',
    author: 'Cựu học sinh K28',
    imageSrc: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    tags: ['Bụi phấn', 'Bục giảng', 'Ân tình'],
    likes: 389,
  },
];

export const INITIAL_TRIBUTES: TributeMessage[] = [
  {
    id: 'trib-1',
    senderName: 'Hoàng Minh Đức',
    affiliation: 'Cựu học sinh Chuyên Toán K28 (2019-2022)',
    recipient: 'Thầy Trần Văn Cường & Tổ Toán',
    department: 'Toán',
    content: 'Đã 4 năm kể từ ngày rời xa mái trường Chuyên Sơn La, em vẫn nhớ như in hình ảnh thầy đứng trên bục giảng phòng 302, kiên nhẫn giảng từng bài hình học không gian phức tạp. Nhờ sự khích lệ của thầy, em mới dám theo đuổi đam mê Khoa học Dữ liệu tại Hà Nội hôm nay. Kính chúc thầy luôn mạnh khỏe và tràn đầy nhiệt huyết!',
    paperTheme: 'parchment',
    gift: 'chalk',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    likes: 42,
  },
  {
    id: 'trib-2',
    senderName: 'Lò Thị Phương Thảo',
    affiliation: 'Chuyên Văn K30 (2021-2024)',
    recipient: 'Cô Nguyễn Thị Lan Hương',
    department: 'Văn',
    content: 'Gửi cô kính yêu! Mỗi mùa hoa ban nở, em lại nhớ giọng cô trầm ấm đọc từng câu thơ Tây Tiến. Cô đã dạy chúng em không chỉ cách làm bài văn đạt điểm cao, mà dạy chúng em cách sống chân thành, giàu lòng trắc ẩn. Chúng em yêu cô nhiều lắm!',
    paperTheme: 'flower',
    gift: 'ban-flower',
    createdAt: Date.now() - 1000 * 60 * 60 * 18,
    likes: 56,
  },
  {
    id: 'trib-3',
    senderName: 'Vũ Hải Đăng',
    affiliation: 'Chuyên Tin K31 (2022-2025)',
    recipient: 'Thầy Vũ Đình Tuấn',
    department: 'Toán',
    content: 'Cảm ơn thầy đã thức cùng đội tuyển chúng em những đêm ôn thi quốc gia, mua cho từng đứa cốc trà sữa ấm áp giữa đêm mùa đông Sơn La. Thầy không chỉ là một người thầy giỏi mà còn như một người cha thứ hai của chúng em!',
    paperTheme: 'kraft',
    gift: 'candle',
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    likes: 31,
  },
  {
    id: 'trib-4',
    senderName: 'Nguyễn Diệu Linh',
    affiliation: 'Chuyên Anh K31 (2022-2025)',
    recipient: 'Tập thể Thầy Cô giáo Trường THPT Chuyên Sơn La',
    department: 'Ngoại Ngữ',
    content: 'Mái trường Chuyên Sơn La là thanh xuân đẹp đẽ nhất của em. Cảm ơn các thầy cô đã luôn bao dung cho những lần chúng em nghịch ngợm, chưa thuộc bài. Chúc các thầy cô luôn giữ vững ngọn lửa nghề và luôn tự hào về chúng em!',
    paperTheme: 'blackboard',
    gift: 'sunflower',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    likes: 68,
  },
];

export const NOSTALGIA_QUIZ = [
  {
    id: 'q1',
    question: 'Địa điểm nào ở Chuyên Sơn La gắn liền với kỷ niệm khó quên nhất của bạn?',
    options: [
      { label: 'Khu thư viện tầng 3 yên tĩnh ngập tràn ánh nắng', spot: 'Thư viện Tri thức' },
      { label: 'Hàng ghế đá dưới gốc hoa ban trắng sân trường', spot: 'Góc Hoa Ban Dịu Êm' },
      { label: 'Phòng thực hành, nơi những thí nghiệm cháy hết mình', spot: 'Phòng Thí Nghiệm Đam Mê' },
      { label: 'Căn-tin và bãi cỏ sau nhà đa năng đầy ắp tiếng cười', spot: 'Góc Căn-tin Tuổi Trẻ' },
    ],
  },
  {
    id: 'q2',
    question: 'Điều gì ở thầy cô Chuyên Sơn La khiến bạn xúc động nhất mỗi khi nhớ lại?',
    options: [
      { label: 'Sự kiên nhẫn giảng lại từng bài khó ngoài giờ', trait: 'Tâm huyết không mỏi mệt' },
      { label: 'Những lời động viên chân tình khi em nản lòng', trait: 'Vòng tay bao dung ấm áp' },
      { label: 'Những mẩu chuyện đời sâu sắc xen lẫn tiếng cười', trait: 'Triết lý sống giản dị' },
      { label: 'Ấm trà gừng và hộp bánh tiếp sức mùa thi rét buốt', trait: 'Sự chăm sóc như người thân' },
    ],
  },
  {
    id: 'q3',
    question: 'Âm thanh nào làm bạn bồi hồi nhất khi bước vào chuyến tàu trở về ký ức?',
    options: [
      { label: 'Tiếng trống trường điểm giờ vào lớp vang vọng sân trường', sound: 'Tiếng trống rộn rã' },
      { label: 'Tiếng phấn gõ nhịp lách cách trên bảng đen', sound: 'Tiếng phấn dịu êm' },
      { label: 'Tiếng cười giòn tan của bè bạn giờ ra chơi', sound: 'Tiếng cười thanh xuân' },
      { label: 'Giai điệu bài hát truyền thống trong lễ bế giảng', sound: 'Giai điệu tri ân' },
    ],
  },
  {
    id: 'q4',
    question: 'Món quà tinh thần ý nghĩa nhất bạn muốn dâng tặng thầy cô hôm nay là gì?',
    options: [
      { label: 'Một lá thư dài viết bằng tất cả tấm lòng biết ơn', gift: 'Lá thư từ đáy lòng' },
      { label: 'Một cành hoa ban tươi thắm từ núi rừng Tây Bắc', gift: 'Sắc hoa ban tri ân' },
      { label: 'Sự trưởng thành, sống tử tế và có ích cho xã hội', gift: 'Sự trưởng thành vững vàng' },
      { label: 'Một ngày trở lại trường, ôm thầy cô thật chặt', gift: 'Cái ôm ngày hội ngộ' },
    ],
  },
];

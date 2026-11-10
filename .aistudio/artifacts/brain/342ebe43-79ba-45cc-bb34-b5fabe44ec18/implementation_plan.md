# Kế Hoạch Triển Khai: Nâng Cấp Không Gian Điện Ảnh & Vinh Danh Thầy Cô Trường THPT Chuyên Sơn La

Dựa trên yêu cầu và lựa chọn của bạn, hệ thống sẽ thực hiện các nâng cấp trọng tâm sau:

---

## 1. Hình Nền Toàn Trang Mới & Hiệu Ứng Điện Ảnh (Cinematic Mood)
- **Hình nền thiên nhiên rừng hoa vàng**: 
  - Đặt ảnh `/assets/aistudio/Tr_m_k_t_n_i_s___2__3771c580.png` làm nền cố định toàn bộ website (`fixed background`).
  - Phủ lớp kính mờ mộc mạc và gradient chiều sâu điện ảnh (`vignette` + `backdrop-blur`) giúp chữ luôn sắc nét và tương phản tuyệt đối trên mọi màn hình.
- **Thước phim tóm tắt chuyển động chậm (Cinematic Opening Prologue)**:
  - Khi người dùng vừa mở trang web, hiển thị màn chào chuyển động chậm (slow-motion cinematic curtain) với câu đề từ tri ân giàu cảm xúc, hiệu ứng ánh sáng hoàng kim lướt qua logo Trường THPT Chuyên Sơn La, lời dẫn tự động gõ chữ và nút *"Bắt đầu hành trình tri ân"* hoặc *"Bỏ qua"*.
  - Có thể mở lại bất cứ lúc nào qua nút bấm *"Thước phim mở đầu"* trên thanh menu.
- **Hạt sáng và cánh hoa bồ công anh bay**:
  - Tối ưu hiệu ứng canvas nhẹ nhàng với các hạt phấn hoa vàng, cánh hoa và bụi sáng bồng bềnh tự nhiên theo hướng gió.

---

## 2. Vinh Danh Các Thế Hệ Hiệu Trưởng & Phó Hiệu Trưởng Qua Các Thời Kỳ (1995 - 2026)
*(Dữ liệu chuẩn từ Cổng thông tin Trường THPT Chuyên Sơn La: `edu.viettel.vn/sla-thptchuyensonla`)*
- **Tích hợp kép: Dòng thời gian lịch sử 30 năm + Lưới thẻ chân dung vinh danh trang trọng**:
  - **1995 – 2010**: **Nhà giáo Trần Hữu Chiến** (Hiệu trưởng đầu tiên, người "thuyền trưởng" đặt nền móng xây dựng Trường Phổ thông Năng khiếu – Chuyên Sơn La).
  - **2010 – 2015**: **Thầy giáo Cầm Duy Thịnh** (Hiệu trưởng giai đoạn chuẩn bị và thực hiện đề án chuyển trường sang cơ sở mới khang trang tại Chiềng Sinh).
  - **2015 – 2023**: **NGƯT. Trần La Giang** (Nguyên Phó Hiệu trưởng, Hiệu trưởng suốt 8 năm, đưa giáo dục mũi nhọn Chuyên Sơn La bứt phá toàn diện).
  - **2023 – Nay**: **ThS. Phạm Thị Thuận** (Bí thư Đảng ủy, Hiệu trưởng đương nhiệm dẫn dắt trường trong kỷ nguyên số và hội nhập).
  - **Phó Hiệu trưởng qua các thời kỳ**:
    - **TS. Nguyễn Bình Long** (Phó Hiệu trưởng từ 2014 – Phụ trách chuyên môn mũi nhọn, người tiên phong ứng dụng CNTT và chuyển đổi số).
    - **Thầy giáo Trần Doãn Quyết** (Phó Hiệu trưởng từ 2019 đến nay – Nguyên Bí thư Đoàn trường, phụ trách nề nếp, kỷ cương và phong trào thanh niên).
  - Lời đề từ tri ân sâu sắc, trích dẫn danh ngôn giáo dục, dấu mốc cống hiến và nút *"Gửi lời tri ân trực tiếp"* tới từng thầy cô.
  - Vẫn giữ nguyên khả năng **tự do đổi ảnh / sửa thông tin** từng thầy cô.

---

## 3. Trình Phát Nhạc Nền Mini Góc Màn Hình (Subtle Corner Audio Player)
- **Vị trí & Giao diện**:
  - Đặt gọn gàng, tinh tế ở góc dưới màn hình (thu nhỏ / mở rộng bằng 1 chạm), không che khuất nội dung trang web.
  - Hiệu ứng đĩa than mini xoay chầm chậm khi phát nhạc và thanh sóng âm thanh (soundwave bars) chuyển động sống động.
- **Tính năng phát nhạc linh hoạt**:
  - **Tải lên file MP3 tùy ý**: Người dùng có thể bấm nút tải lên để chọn bất kỳ bài hát MP3 nào từ máy tính/điện thoại (ví dụ: *Người gieo mầm xanh*, *Bụi phấn*, *Bài học đầu tiên*...).
  - **Danh sách bài mẫu có sẵn**: Tích hợp các bản hòa tấu piano/acoustic tri ân dịu êm để có thể nghe ngay lập tức khi mở web mà không cần mạng ngoài.
  - Điều chỉnh âm lượng, phát/tạm dừng, lặp lại và hiển thị tên bài hát đang phát.

---

## 4. Tối Ưu Tương Tác & Thẩm Mỹ Đồng Bộ
- Bổ sung thanh điều hướng nhanh chuyển giữa các mốc thời gian lịch sử và các tổ chuyên môn.
- Kiểm tra tính tương thích và mượt mà trên cả máy tính, máy tính bảng và điện thoại di động.
- Xác thực toàn bộ bản dựng với lệnh kiểm tra mã nguồn và biên dịch.

---

## 5. Cập Nhật Số Liệu Phong Trào & Chỉnh Sửa Bảng Padlet Kỷ Niệm
- **Cập nhật số Bảng Hoa Điểm 9 & Điểm 10**:
  - Thêm nút *"Cập Nhật Số Liệu"* và các nút tăng nhanh (+1, +5, +10) cho mỗi mục hoa điểm.
  - Hộp thoại tùy chỉnh số hoa điểm 9, điểm 10, tỷ lệ chi đoàn và ghi chú thời gian, lưu tự động vào `localStorage`.
- **Chỉnh sửa mẩu giấy Padlet & Kỷ niệm**:
  - Thêm nút *"Sửa"* và biểu tượng bút chì trên từng thẻ sticky note.
  - Hộp thoại chỉnh sửa chi tiết tên tác giả, lớp/niên khóa, 5 màu giấy ghi chú, chủ đề phân loại, nội dung kèm khung xem trước và nút xóa mẩu giấy an toàn.


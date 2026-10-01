


![Diagram: media/image1.jpeg](D:/Project/DAPM/docs/extracted_srs/word/media/image1.jpeg)


FPT Project – ReLoop
Tài Liệu Đặc Tả Yêu Cầu
Dành cho ReLoop
Phiên bản: 0.0.5
Huế, tháng 10 2026
Lịch sử chỉnh sửa

| Ngày | Phiên bản | Tác giả | Mô tả thay đổi |
| --- | --- | --- | --- |
| 24/09/2026 | 0.0.5 | TruongNQ | Thêm bìa, định dạng, dàn bài |
|  |  |  |  |
|  |  |  |  |


Mục lục
TOC \o "1-3" \h \z \u 1. Giới thiệu PAGEREF _Toc241147157 \h 3
1.1. Mục đích PAGEREF _Toc241147158 \h 3
1.2. Tổng quan PAGEREF _Toc241147159 \h 3
1.3. Đối tượng hướng đến PAGEREF _Toc241147160 \h 3
1.4. Danh mục viết tắt PAGEREF _Toc241147161 \h 3
1.5. Tài liệu tham khảo PAGEREF _Toc241147162 \h 3
2. Giới thiệu PAGEREF _Toc241147163 \h 4
2.1. Biểu đồ Mô hình-Thực thể PAGEREF _Toc241147164 \h 4
2.2. Luồng hoạt động PAGEREF _Toc241147165 \h 4
2.2.1. PAGEREF _Toc241147166 \h 4
2.2.2. PAGEREF _Toc241147167 \h 4
2.2.3. PAGEREF _Toc241147168 \h 4
2.3. Biểu đồ trạng thái PAGEREF _Toc241147169 \h 4
2.2.1. PAGEREF _Toc241147170 \h 4
2.2.2. PAGEREF _Toc241147171 \h 4
2.2.3. PAGEREF _Toc241147172 \h 4
2.4. Biểu đồ Use Case PAGEREF _Toc241147173 \h 4
2.2.1. PAGEREF _Toc241147174 \h 4
2.2.2. PAGEREF _Toc241147175 \h 4
2.2.3. PAGEREF _Toc241147176 \h 5
3. Tài liệu Use Case PAGEREF _Toc241147177 \h 6
3.1. PAGEREF _Toc241147178 \h 6
3.1.1. UC: PAGEREF _Toc241147179 \h 6
3.1.2. UC: PAGEREF _Toc241147180 \h 6
3.1.3. UC: PAGEREF _Toc241147181 \h 6
4. Màn hình giả lập PAGEREF _Toc241147182 \h 7
4.1. PAGEREF _Toc241147183 \h 7
4.1.1. PAGEREF _Toc241147184 \h 7
4.1.2. PAGEREF _Toc241147185 \h 7
4.2. PAGEREF _Toc241147186 \h 7
4.2.1. PAGEREF _Toc241147187 \h 7
4.2.2. PAGEREF _Toc241147188 \h 7
4.3. PAGEREF _Toc241147189 \h 7
4.3.1. PAGEREF _Toc241147190 \h 7
4.3.2. PAGEREF _Toc241147191 \h 7
5. Phụ lục PAGEREF _Toc241147192 \h 8
5.1. Danh sách thông báo PAGEREF _Toc241147193 \h 8
6. Các yêu cầu phi chức năng khác PAGEREF _Toc241147194 \h 9
# 1. Giới thiệu

## 1.1. Mục đích

Tài liệu SRS được xây dựng nhằm xác định và mô tả đầy đủ các yêu cầu đối với hệ thống ReLoop. Tài liệu có các mục đích chính:
Xác định phạm vi, mục tiêu nghiệp vụ, đối tượng sử dụng và các chức năng mà hệ thống cung cấp
Tạo sự thống nhất về yêu cầu giữa các thành viên tham gia dự án, bao gồm nhóm phân tích, phát triển, thiết kế giao diện, kiểm thử và người đánh giá
Làm cơ sở cho việc thiết kế CSDL, giao diện, phát triển API, triển khai hệ thống và xây dựng các trường hợp kiểm thử
Làm cơ sở xác định các bài kiểm thử nghiệm thu, nhằm kiểm tra hệ thống có đáp ứng đúng các yêu cầu nghiệp vụ đã xác định hay không
Tài liệu này được sử dụng làm cơ sở chung trong toàn bộ quá trình phát triển hệ thống, từ phân tích yêu cầu, thiết kế, lập trình, kiểm thử đến nghiệm thu sản phẩm.
## 1.2. Tổng quan

ReLoop là nền tảng kết nối người dùng có nhu cầu mua bán hoặc trao đổi các sản phẩm đã qua sử dụng theo mô hình gặp mặt trực tiếp.
Hệ thống hỗ trợ hai hình thức giao dịch chính:
Mua bán: người mua gửi đề nghị mua sản phẩm trên bài đăng, người bán xem xét và chấp nhận hoặc từ chối đề nghị
Trao đổi: người mua gửi đề nghị trao đổi một sản phẩm của mình với sản phẩm được đăng trên hệ thống, đồng thời có thể đề xuất khoản tiền bù trừ nếu giá trị hai sản phẩm chênh lệch
Các tác nhân và vai trò:

| Tác nhân | Các vai trò |
| --- | --- |
| Người mua (Users) | Tìm kiếm và lọc sản phẩmXem thông tin sản phẩm và hồ sơ người đăngGửi đề nghị mua hoặc đề nghị trao đổiTheo dõi trạng thái đề nghị và lịch hẹnXác nhận hoàn tất giao dịchĐánh giá người bán sau khi giao dịch thành công |
| Người bán (Users) | Đăng và quản lý sản phẩmLựa chọn hình thức giao dịchThiết lập khu vực giao dịch đề xuấtTiếp nhận và xử lý đề nghị mua/trao đổiXác nhận lịch hẹn và giao dịchĐánh giá người mua sau khi giao dịch hoàn tất |
| Quản trị viên (Admin) | Quản lý tài khoản người dùngKiểm duyệt bài đăngQuản lý danh mục ngành hàngGiám sát đề nghị và giao dịchTiếp nhận và xử lý báo cáo, khiếu nạiQuản lý đánh giá và theo dõi thống kê hệ thống |


Biểu đồ SEQ Biểu_đồ \* ARABIC 1: Tác nhân và vai trò trong hệ thống
## 1.3. Đối tượng đọc

Tài liệu SRS được xây dựng dành cho các thành viên tham gia quá trình phân tích, thiết kế, phát triển, kiểm thử và đánh giá hệ thống:
Nhóm phân tích: sử dụng tài liệu để xác định và kiểm tra các yêu cầu của hệ thống
Nhóm phát triển: sử dụng tài liệu làm cơ sở xây dựng chức năng và xử lý nghiệp vụ
Nhóm thiết kế: sử dụng các yêu cầu và mô tả giao diện để xây dựng các màn hình
Nhóm kiểm thử: sử dụng các ca sử dụng và quy tắc nghiệp vụ để xây dựng trường hợp kiểm thử
Nhóm đánh giá: sử dụng tài liệu để hiểu phạm vi, chức năng và cách hoạt động của hệ thống
## 1.4. Danh mục viết tắt


| Từ viết tắt | Giải nghĩa |
| --- | --- |
| SRS | Software Requirements Specification |
| UC | Use Case |
| BR | Business Rule |
| JWT | JSON Web Token |
| UI/UX | User Interface / User Experience |
| UAT | User Acceptance Testing |
| API | Application Programming Interface |
| REST | Representational State Transfer |
| RBAC | Role-Based Access Control |
| OTP | One-Time Password |
| CDN | Content Delivery Network |
| ORM | Object-Relational Mapping |
| JPA | Jakarta Persistence API |


## 1.5. Tài liệu tham khảo

N/A
# 2. Yêu cầu mức độ tổng thể

Phần này mô tả tổng quan về các chức năng của hệ thống hoặc các quy trình nghiệp vụ được thể hiện trong những sơ đồ khác nhau. Nó cho biết các loại người dùng, các quyền hạn được cấp để thực hiện những chức năng hệ thống cụ thể, và trình tự cần thiết để hoàn thành một quy trình công việc (nếu có). Đây là mô tả ở mức độ tổng quan, và để xem đặc tả yêu cầu chi tiết, vui lòng tham khảo phần bên dưới.
## 2.1. Biểu đồ Mô hình-Thực thể

Biểu đồ này mô tả các thực thể hệ thống và mối quan hệ giữa chúng.


![Diagram: media/image2.png](D:/Project/DAPM/docs/extracted_srs/word/media/image2.png)


Biểu đồ SEQ Biểu_đồ \* ARABIC 2: Biểu đồ Mô hình-Thực thể của ReLoop
## 2.2. Luồng hoạt động

### 2.2.1. Đăng sản phẩm



![Diagram: media/image3.png](D:/Project/DAPM/docs/extracted_srs/word/media/image3.png)


Biểu đồ SEQ Biểu_đồ \* ARABIC 3: Luồng đăng sản phẩm
### 2.2.2. Trao đổi sản phẩm



![Diagram: media/image4.png](D:/Project/DAPM/docs/extracted_srs/word/media/image4.png)


Biểu đồ SEQ Biểu_đồ \* ARABIC 4: Luồng trao đổi sản phẩm
### 2.2.3. Mua sản phẩm



![Diagram: media/image5.png](D:/Project/DAPM/docs/extracted_srs/word/media/image5.png)


Biểu đồ SEQ Biểu_đồ \* ARABIC 5: Luồng mua sản phẩm
## 2.3. Biểu đồ trạng thái

### 2.3.1. Bài đăng sản phẩm



![Diagram: media/image6.png](D:/Project/DAPM/docs/extracted_srs/word/media/image6.png)


Biểu đồ SEQ Biểu_đồ \* ARABIC 6: Trạng thái bài đăng sản phẩm
### 2.3.2. Đề nghị mua, trao đổi



![Diagram: media/image7.png](D:/Project/DAPM/docs/extracted_srs/word/media/image7.png)


Biểu đồ SEQ Biểu_đồ \* ARABIC 7: Trạng thái đề nghị mua, trao đổi
### 2.3.3. Giao dịch sản phẩm



![Diagram: media/image8.png](D:/Project/DAPM/docs/extracted_srs/word/media/image8.png)


Biểu đồ SEQ Biểu_đồ \* ARABIC 8: Trạng thái giao dịch sản phẩm
## 2.4. Biểu đồ Use Case

Biểu đồ Use Case thể hiện mục đích cụ thể và cách người dùng tương tác với hệ thống. Hình bầu dục nằm trong hệ thống đại diện cho các chức năng, hình người là dành cho các tác nhân. Đường thẳng kết nối cho thấy tác nhân có thể thực hiện chức năng cụ thể trong hệ thống để đạt được một mục tiêu nào đó.


![Diagram: media/image9.png](D:/Project/DAPM/docs/extracted_srs/word/media/image9.png)


Biểu đồ SEQ Biểu_đồ \* ARABIC 9: Use Case Tổng quát
### 2.4.1. Quản lý tài khoản



![Diagram: media/image10.png](D:/Project/DAPM/docs/extracted_srs/word/media/image10.png)


Biểu đồ SEQ Biểu_đồ \* ARABIC 10: Use Case Quản lý tài khoản

| # | Tên UC | Mô tả |
| --- | --- | --- |
| 1 | Đăng ký | Tạo tài khoản bằng Email/SĐT và thông tin cơ bản |
| 2 | Xác thực OTP | Nhập OTP để kích hoạt/xác thực tài khoản |
| 3 | Đăng nhập / Đăng xuất | Xác thực bằng JWT và kết thúc phiên hoạt động |
| 4 | Quản lý hồ sơ cá nhân | Xem/Cập nhật họ tên, avatar, SĐT, khu vực, liên kết mạng xã hội |
| 5 | Đổi mật khẩu | Thay đổi mật khẩu khi đã đăng nhập |
| 6 | Khôi phục mật khẩu | Khôi phục mật khẩu qua Email (OTP) |
| 7 | Chặn / Bỏ chặn người dùng | Quản lý các tài khoản bị chặn và bỏ chặn |


### 2.4.2. Quản lý bài đăng



![Diagram: media/image11.png](D:/Project/DAPM/docs/extracted_srs/word/media/image11.png)


Biểu đồ SEQ Biểu_đồ \* ARABIC 11: Use Case Quản lý bài đăng

| # | Tên UC | Mô tả |
| --- | --- | --- |
| 1 | Đăng bài sản phẩm | Đăng sản phẩm đã qua sử dụng với hình ảnh, mô tả, danh mục, giá, tình trạng và khu vực |
| 2 | Cập nhật bài đăng | Chỉnh sửa nội dung bài đăng khi cần và chưa giao dịch |
| 3 | Quản lý trạng thái bài đăng | Quản lý các trạng thái Còn hàng, Đang hẹn gặp/Tạm giữ, Đã giao dịch, Đã ẩn |
| 4 | Ẩn / Hiện bài đăng | Tạm ẩn hoặc hiển thị lại bài đăng |
| 5 | Quản lý kho đồ cá nhân | Xem sản phẩm cá nhân và lịch sử giao dịch liên quan |


### 2.4.3. Quản lý đề nghị



![Diagram: media/image12.png](D:/Project/DAPM/docs/extracted_srs/word/media/image12.png)


Biểu đồ SEQ Biểu_đồ \* ARABIC 12: Use Case Quản lý đề nghị

| # | Tên UC | Mô tả |
| --- | --- | --- |
| 1 | Gửi đề nghị mua | Gửi yêu cầu mua đối với bài đăng cho phép mua |
| 2 | Gửi đề nghị trao đổi | Chọn sản phẩm từ kho cá nhân, nhập đề nghị và tiền bù trừ nếu có |
| 3 | Xem đề nghị nhận được | Chủ bài đăng xem nhiều đề nghị từ các người dùng khác nhau |
| 4 | Chấp nhận đề nghị | Chấp nhận một đề nghị phù hợp và tạo giao dịch tương ứng |
| 5 | Từ chối đề nghị | Từ chối đề nghị chưa phù hợp |
| 6 | Hủy đề nghị | Người gửi hủy đề nghị trước khi được chấp nhận |
| 7 | Xử lý nhiều đề nghị | Khi một đề nghị được chấp nhận, các đề nghị của các người dùng khác được chuyển sang hết hiệu lực/từ chối |


### 2.4.4. Tìm kiếm, khám phá và yêu thích



![Diagram: media/image13.png](D:/Project/DAPM/docs/extracted_srs/word/media/image13.png)


Biểu đồ SEQ Biểu_đồ \* ARABIC 13: Use Case Tìm kiếm, khám phá và yêu thích

| # | Tên UC | Mô tả |
| --- | --- | --- |
| 1 | Tìm kiếm và lọc sản phẩm | Tìm theo từ khóa; lọc khu vực, danh mục, giá, hình thức và tình trạng |
| 2 | Xem chi tiết sản phẩm | Xem hình ảnh, mô tả, giá, tình trạng, khu vực và hồ sơ người đăng |
| 3 | Thêm vào yêu thích | Lưu bài đăng vào danh sách yêu thích |
| 4 | Xóa khỏi yêu thích | Xóa bài đăng khỏi danh sách yêu thích |
| 5 | Xem danh sách yêu thích | Xem lại danh sách bài đăng yêu thích đã lưu |


### 2.4.5. Lịch hẹn và giao dịch



![Diagram: media/image14.png](D:/Project/DAPM/docs/extracted_srs/word/media/image14.png)


Biểu đồ SEQ Biểu_đồ \* ARABIC 14: Use Case Lịch hẹn và giao dịch

| # | Tên UC | Mô tả |
| --- | --- | --- |
| 1 | Kích hoạt thông tin liên hệ | Mở liên hệ (Zalo) sau khi đề nghị được chấp thuận |
| 2 | Tạo / Xác nhận lịch hẹn | Thống nhất ngày, giờ và khu vực/địa điểm gặp |
| 3 | Thay đổi lịch hẹn | Đề xuất thay đổi thời gian hoặc địa điểm |
| 4 | Hủy lịch hẹn | Hủy lịch hẹn và cập nhật trạng thái liên quan |
| 5 | Theo dõi giao dịch | Theo dõi trạng thái: Chờ xác nhận, Đã xác nhận, Đã hẹn gặp, Hoàn tất, Đã hủy |
| 6 | Xác nhận hoàn tất giao dịch | Hai bên cùng xác nhận sau khi hoàn tất trao đổi thực tế |
| 7 | Hoàn tất giao dịch | Chuyển giao dịch sang Hoàn tất khi đủ xác nhận hai chiều và mở quyền đánh giá |


### 2.4.6. Đánh giá, uy tín, báo cáo và khiếu nại



![Diagram: media/image15.png](D:/Project/DAPM/docs/extracted_srs/word/media/image15.png)


Biểu đồ SEQ Biểu_đồ \* ARABIC 15: Use Case Đánh giá, uy tín, báo cáo và khiếu nại

| # | Tên UC | Mô tả |
| --- | --- | --- |
| 1 | Đánh giá thành viên | Đánh giá 1–5 sao và nhận xét sau khi giao dịch hoàn tất |
| 2 | Xem hồ sơ uy tín | Xem điểm trung bình, số giao dịch hoàn tất và nhận xét được phép công khai |
| 3 | Khiếu nại đánh giá | Gửi khiếu nại đối với đánh giá vi phạm |
| 4 | Báo cáo vi phạm | Báo cáo bài đăng/người dùng có dấu hiệu vi phạm |
| 5 | Xử lý báo cáo | Xem báo cáo, bằng chứng và đưa ra biện pháp xử lý |
| 6 | Xử lý khiếu nại | Tiếp nhận và xử lý khiếu nại liên quan đến đánh giá hoặc quyết định xử lý |


### 2.4.7. Quản trị hệ thống



![Diagram: media/image16.png](D:/Project/DAPM/docs/extracted_srs/word/media/image16.png)


Biểu đồ SEQ Biểu_đồ \* ARABIC 16: Use Case Quản trị hệ thống

| # | Tên UC | Mô tả |
| --- | --- | --- |
| 1 | Xem Dashboard và thống kê | Theo dõi tổng số người dùng, bài đăng, đề nghị, giao dịch, báo cáo và các chỉ số hoạt động |
| 2 | Quản lý người dùng | Xem, tìm kiếm, lọc và xem lịch sử người dùng |
| 3 | Khóa / Mở khóa tài khoản | Khóa hoặc mở khóa tài khoản theo quy định |
| 4 | Kiểm duyệt bài đăng | Kiểm tra và xử lý bài đăng vi phạm |
| 5 | Xóa / Gỡ bài | Gỡ/xóa bài đăng vi phạm chính sách |
| 6 | Quản lý danh mục | Thêm, sửa, ẩn/hiện danh mục |
| 7 | Quản lý đề nghị và giao dịch | Theo dõi và hỗ trợ xử lý trường hợp tranh chấp/gian lận |
| 8 | Quản lý đánh giá | Xem và xử lý đánh giá vi phạm, spam hoặc trả đũa |
| 9 | Quản lý báo cáo và khiếu nại | Tiếp nhận, kiểm tra bằng chứng và xử lý báo cáo/khiếu nại |


## 2.5. Ma trận phân quyền

Ma trận phân quyền các chức năng và vai trò của người dùng trong hệ thống ReLoop:
Ghi chú:

| X | Người dùng có toàn quyền thực hiện chức năng |
| --- | --- |
| X* | Người dùng chỉ có quyền thực hiện đối với bản ghi / dữ liệu do chính mình tạo ra hoặc liên quan trực tiếp tới mình |
|  | Không có quyền thực hiện |



|  | Khách | Người dùng | Quản trị viên |
| --- | --- | --- | --- |
| Quản lý tài khoản | X (đăng ký) | X* | X |
| Quản lý bài đăng | X (xem) | X* | X |
| Tìm kiếm và khám phá | X | X | X |
| Yêu thích |  | X* |  |
| Gửi đề nghị mua, trao đổi |  | X* |  |
| Xử lý đề nghị nhận được |  | X* | X |
| Lịch hẹn |  | X* | X |
| Giao dịch |  | X* | X |
| Đánh giá |  | X* | X |
| Xem hồ sơ uy tín | X | X | X |
| Báo cáo vi phạm |  | X* | X |
| Quản lý người dùng |  |  | X |
| Kiểm duyệt bài đăng |  |  | X |
| Quản lý danh mục |  |  | X |
| Dashboard / Thống kê |  |  | X |
| Quản lý đánh giá |  |  | X |
| Xử lý báo cáo / khiếu nại |  |  | X |


# 3. Tài liệu Use Case

Phần này thể hiện các yêu cầu chức năng của hệ thống, nô tả chi tiết những gì hệ thống phải thực hiện về mặt dữ liệu đầu vào, hành vi và kết quả đầu ra dự kiến. Nó thể hiện sự tương tác giữa các tác nhân, hành vi hệ thống và các kết quả của các tương tác đó.
## 3.1. Quản lý tài khoản

### 3.1.1. UC: Đăng ký


| Tổng quan | Khách đăng ký tài khoản mới bằng Email hoặc SĐTcùng thông tin cơ bản |
| --- | --- |
| Tác nhân | Khách |
| Tác nhân kích hoạt | [Khách] chọn chức năng 'Đăng ký' trên giao diện. |
| Điều kiện trước | Người dùng chưa có tài khoản hoặc chưa đăng nhập vào hệ thốngNgười dùng truy cập chức năng Đăng ký tài khoản |
| Điều kiện sau | - Thành công: Tài khoản mới được tạo ở trạng thái "Chờ xác thực", sinh mã OTP và gửi về Email/SĐT.- Thất bại: Hiển thị thông báo lỗi tương ứng và yêu cầu nhập lại. |


Luồng hoạt động
Yêu cầu chức năng
### 3.1.2. UC:

Luồng hoạt động
Yêu cầu chức năng
### 3.1.3. UC:

Luồng hoạt động
Yêu cầu chức năng
# 4. Màn hình giả lập

## 4.1. Khách

### 4.1.1. Trang chủ

### 4.1.2. Khám phá

### 4.1.3. Chi tiết

### 4.1.4. Đổi đồ

### 4.1.5. Danh mục

### 4.1.6. Đăng nhập

### 4.1.7. Đăng ký

## 4.2. Người dùng

### 4.2.1.

### 4.2.2.

## 4.3. Quản trị viên

### 4.3.1.

### 4.3.2.

# 5. Phụ lục

## 5.1. Danh sách thông báo


| # | Mã MSG | Thông báo | Mô tả |
| --- | --- | --- | --- |
| 1. | MSG 1 | Xin lỗi, mật khẩu hoặc tên đăng nhập không đúng. Vui lòng thử lại! | Loại = Thông báo lỗiHiển thị khi tên đăng nhập hoặc mật khẩu người dùng nhập không đúng với thông tin tài khoản trong hệ thống |
| 2. | MSG 2 | Tên đăng nhập không được để trống! | Loại = Thông báo lỗiHiển thị khi người dùng không nhập tên đăng nhập |
| 3. | MSG 3 | Mật khẩu không được để trống! | Loại = Thông báo lỗiHiển thị khi người dùng không nhập mật khẩu |
| 4. | MSG 4 | Mật khẩu không trùng khớp! | Loại = Thông báo lỗiHiển thị khi mật khẩu và mật khẩu xác nhận không giống nhau |
| 5. | MSG 5 | Mật khẩu phải có ít nhất 6 ký tự! | Loại = Thông báo lỗiHiển thị khi mật khẩu có ít hơn 6 ký tự |
| 6. | MSG 6 | Phải là số và lớn hơn số 0! | Loại = Thông báo lỗiHiển thị khi giá trị nhập không phải là số hoặc nhỏ hơn hoặc bằng 0 |
| 7. | MSG 7 | Phải nhập hết tất cả trường bắt buộc! | Loại = Thông báo lỗiHiển thị khi người dùng chưa nhập đầy đủ các trường bắt buộc |
| 8. | MSG 8 | Sai định dạng! | Loại = Thông báo lỗiHiển thị khi dữ liệu nhập vào không đúng định dạng yêu cầu |
| 9. | MSG 9 | Vui lòng nhập chỉ nhập số! | Loại = Thông báo lỗiHiển thị khi người dùng nhập ký tự khác số vào trường chỉ cho phép nhập số |
| 10. | MSG 10 | Chỉ chấp nhận định dạng hình ảnh | Loại = Thông báo lỗiHiển thị khi người dùng tải lên tệp không phải định dạng hình ảnh |


# 6. Các yêu cầu phi chức năng khác

Hiệu năng

| STT | Yêu cầu |
| --- | --- |
| 1. | Hệ thống đáp ứng đồng thời tối thiểu từ 10 đến 20 người dùng truy cập cùng lúc trong môi trường thử nghiệm |
| 2. | Thời gian tải trang và phản hồi API trung bình dưới 2 giây trong điều kiện mạng ổn định |


Khả năng mở rộng

| STT | Yêu cầu |
| --- | --- |
| 1. | Cấu trúc cơ sở dữ liệu cho phép mở rộng thêm các danh mục sản phẩm và module chức năng mới mà không làm thay đổi các bảng hiện tại |


Bảo mật

| STT | Yêu cầu |
| --- | --- |
| 1. | Mật khẩu tài khoản người dùng phải được mã hóa một trước khi lưu vào CSDL; tuyệt đối không lưu văn bản thuần |
| 2. | Phân quyền truy cập rõ ràng giữa Quản trị viên và Người dùng; chặn truy cập trái phép vào các API nội bộ qua cơ chế xác thực phiên |


Môi trường & Hạ tầng

| STT | Yêu cầu |
| --- | --- |
| 1. | Máy chủ triển khai thử nghiệm trên môi trường cục bộ |
| 2. | Hệ quản trị CSDL: MySQL phiên bản 8.0 trở lên |


Trình duyệt

| STT | Yêu cầu |
| --- | --- |
| 1. | Tương thích và hiển thị chuẩn xác trên các trình duyệt web hiện đại phổ biến: Google Chrome, Microsoft Edge, Safari và Mozilla Firefox |


Độ tin cậy

| STT | Yêu cầu |
| --- | --- |
| 1. | Hệ thống có cơ chế xử lý ngoại lệ để hiển thị thông báo lỗi rõ ràng khi người dùng nhập sai dữ liệu, tránh tình trạng ứng dụng bị sập đột ngột |


Thành phần Mua ngoài

| STT | Yêu cầu |
| --- | --- |
| 1. | Hệ thống không sử dụng phần mềm thương mại trả phí; toàn bộ thành phần dựa trên các thư viện mã nguồn mở miễn phí |


Giao diện & Tương thích

| STT | Yêu cầu |
| --- | --- |
| 1. | Giao diện hiển thị trực quan, hỗ trợ hiển thị tốt trên màn hình máy tính để bàn và laptop phổ thông |
| 2. | Sử dụng font chữ tiêu chuẩn, rõ ràng, hỗ trợ đầy đủ bộ gõ tiếng Việt có dấu |


Khả năng Mở rộng Tính năng

| STT | Yêu cầu |
| --- | --- |
| 1. | Mã nguồn được phân chia tầng rõ ràng theo mô hình chuẩn giúp thuận tiện cho việc bổ sung tính năng mới sau này |


Giả định Triển khai

| STT | Yêu cầu |
| --- | --- |
| 1. | Người dùng thao tác qua thiết bị có kết nối Internet ổn định và trình duyệt được cập nhật phiên bản tiêu chuẩn |


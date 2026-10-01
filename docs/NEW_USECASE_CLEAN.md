
# 3. Tài liệu Use Case

Phần này thể hiện các yêu cầu chức năng của hệ thống, nô tả chi tiết những gì hệ thống phải thực hiện về mặt dữ liệu đầu vào, hành vi và kết quả đầu ra dự kiến. Nó thể hiện sự tương tác giữa các tác nhân, hành vi hệ thống và các kết quả của các tương tác đó.
## 3.1. Quản lý tài khoản

### 3.1.1. UC: Đăng kí tài khoảng


| Mô tả tổng quan | Khách đăng ký tài khoản mới bằng Email hoặc số điện thoại cùng thông tin cơ bản. |
| --- | --- |
| Tác nhân (Actors) | Khách. |
| Tác nhân kích hoạt | [Khách] chọn chức năng 'Đăng ký' trên giao diện. |
| Điều kiện trước | - Người dùng chưa có tài khoản hoặc chưa đăng nhập vào hệ thống.- Người dùng truy cập chức năng Đăng ký tài khoản. |
| Điều kiện sau | - Thành công: Tài khoản mới được tạo ở trạng thái "Chờ xác thực", sinh mã OTP và gửi về Email/SĐT.- Thất bại: Hiển thị thông báo lỗi tương ứng và yêu cầu nhập lại. |


Luồng hoạt động


![Diagram: media/image1.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image1.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (1) | BR-01 | (Duy nhất): Email và Số điện thoại đăng ký phải là duy nhất trên toàn hệ thống. |
| (1) | BR-02 | (Định dạng & Bảo mật): Mật khẩu phải có độ dài tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số. |
| (5) | BR-03 | (Trạng thái ban đầu): Tài khoản sau khi đăng ký thành công mặc định ở trạng thái Chờ xác thực (UNVERIFIED) và bị giới hạn tính năng đăng bài/gửi đề nghị cho đến khi xác thực xong. |


### 3.1.2. UC: Xác thực Email / SĐT


| Mô tả tổng quan | Người dùng nhập mã OTP gửi về Email/SĐT để kích hoạt tài khoản. |
| --- | --- |
| Tác nhân (Actors) | Khách / Người dùng mới. |
| Tác nhân kích hoạt | [Người dùng] Nhập mã OTP => Nhấn "Xác nhận OTP" |
| Điều kiện trước | - Tài khoản đã được khởi tạo ở trạng thái Chờ xác thực (UC01.1). - Mã OTP đã được gửi và còn trong thời gian hiệu lực. |
| Điều kiện sau | - Trạng thái tài khoản được cập nhật thành Đã xác thực / Hoạt động. - Người dùng có thể dùng thông tin này để đăng nhập vào hệ thống. |


Luồng hoạt động


![Diagram: media/image2.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image2.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (3) | BR-04 | (Thời hạn OTP): Mã OTP có thời hạn hiệu lực tối đa 3 phút kể từ khi khởi tạo. |
| (4) | BR-05 | (Giới hạn thử lại): Nếu nhập sai OTP quá 5 lần liên tiếp, mã OTP đó sẽ bị vô hiệu hóa và người dùng phải yêu cầu gửi lại mã mới. |
| (5) | BR-06 | (Giới hạn gửi lại): Mỗi tài khoản chỉ được gửi lại mã OTP tối đa 3 lần trong vòng 15 phút. |


### 3.1.3. UC: Đăng nhập / Đăng xuất


| Mô tả tổng quan | Xác thực người dùng thông qua Spring Security/JWT và kết thúc phiên làm việc. |
| --- | --- |
| Tác nhân (Actors) | Người dùng (Thành viên / Admin). |
| Tác nhân kích hoạt | [Người dùng] Nhập Email/SĐT và Mật khẩu => Nhấn "Đăng nhập" |
| Điều kiện trước | - Tài khoản đã được đăng ký và xác thực kích hoạt thành công. - Tài khoản không ở trong trạng thái bị Quản trị viên (Admin) khóa. |
| Điều kiện sau | - Khi Đăng nhập: Hệ thống tạo và trả về chuỗi JWT Token hợp lệ; phiên làm việc của người dùng được khởi tạo. - Khi Đăng xuất: Chuỗi JWT Token bị hủy/vô hiệu hóa trên phía Client, kết thúc phiên làm việc. |


Luồng hoạt động


![Diagram: media/image3.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image3.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (5) | BR-07 | (Chặn đăng nhập): Tài khoản có trạng thái Bị khóa (LOCKED) không thể đăng nhập và hệ thống phải trả về lý do bị khóa cụ thể từ Admin. |
| (7) | BR-08 | (Thời hạn Token): Phiên đăng nhập sử dụng JWT Token có thời hạn hết hạn (Expiration) xác định; khi hết hạn phải refresh token hoặc đăng nhập lại. |


### 3.1.4. UC: Quản lý hồ sơ cá nhân


| Mô tả tổng quan | Xác thực người dùng thông qua Spring Security/JWT và kết thúc phiên làm việc. |
| --- | --- |
| Tác nhân (Actors) | Người dùng |
| Tác nhân kích hoạt | [Người dùng] Nhập Email/SĐT và Mật khẩu => Nhấn "Đăng nhập" |
| Điều kiện trước | - Người dùng đã đăng nhập thành công vào hệ thống. |
| Điều kiện sau | - Thông tin hồ sơ (Họ tên, Avatar, Khu vực giao dịch, liên kết MXH) được cập nhật mới nhất trong CSDL. - Thông tin mới hiển thị chính xác trên giao diện cá nhân và các bài đăng liên quan. |


Luồng hoạt động


![Diagram: media/image4.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image4.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (3) | BR-09 | (Giới hạn Avatar): Định dạng ảnh đại diện chỉ chấp nhận PNG/JPEG/JPG, dung lượng tối đa 5MB. |
| (4) | BR-10 | (Ràng buộc SĐT): Khi thay đổi Số điện thoại trong hồ sơ, người dùng bắt buộc phải xác thực lại mã OTP gửi về SĐT mới. |


### 3.1.5. UC: Đổi mật khẩu


| Mô tả tổng quan | Người dùng thay đổi mật khẩu khi đang ở trong phiên đăng nhập. |
| --- | --- |
| Tác nhân (Actors) | Người dùng |
| Tác nhân kích hoạt | [Người dùng] Nhập Mật khẩu hiện tại, Mật khẩu mới => Nhấn "Đổi mật khẩu" |
| Điều kiện trước | - Người dùng đã đăng nhập vào hệ thống. - Người dùng nhớ và nhập đúng mật khẩu hiện tại. |
| Điều kiện sau | - Mật khẩu mới được mã hóa và cập nhật thành công vào CSDL.- Phiên đăng nhập hiện tại giữ nguyên hoặc yêu cầu đăng nhập lại bằng mật khẩu mới tùy theo cấu hình bảo mật. |


Luồng hoạt động


![Diagram: media/image5.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image5.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (1) | BR-11 | (Mật khẩu mới): Mật khẩu mới không được trùng với mật khẩu hiện tại. |


### 3.1.6. UC: Khôi phục mật khẩu


| Mô tả tổng quan | Cho phép người dùng lấy lại mật khẩu qua Email/SĐT khi bị quên |
| --- | --- |
| Tác nhân (Actors) | Người dùng |
| Tác nhân kích hoạt | [Người dùng] Nhập Email/SĐT đăng ký => Nhấn "Gửi OTP" |
| Điều kiện trước | - Tài khoản Email/SĐT đã tồn tại trên hệ thống. - Người dùng chọn chức năng "Quên mật khẩu" khi chưa đăng nhập. |
| Điều kiện sau | - Mật khẩu mới được cập nhật trong CSDL sau khi xác thực thành công mã OTP khôi phục. - Người dùng có thể đăng nhập bằng mật khẩu mới vừa tạo. |


Luồng hoạt động


![Diagram: media/image6.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image6.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (2) | BR-12 | (Xác minh khôi phục): Yêu cầu khôi phục mật khẩu bắt buộc phải xác thực thành công OTP gửi về Email/SĐT đã đăng ký. |


### 3.1.7. UC: Chặn / Bỏ chặn người dùng


| Mô tả tổng quan | Người dùng ngăn chặn đối phương liên hệ hoặc xem bài đăng của mình. |
| --- | --- |
| Tác nhân (Actors) | Người dùng |
| Tác nhân kích hoạt | [Người dùng] Vào trang cá nhân tài khoản khác => Nhấn "Chặn". |
| Điều kiện trước | - Người dùng đã đăng nhập vào hệ thống. - Đối tượng thao tác phải là một tài khoản người dùng khác (không tự chặn chính mình) |
| Điều kiện sau | - Bản ghi chặn được lưu vào CSDL (danh sách đen - Blacklist). - Hai người dùng bị chặn sẽ không thể thấy bài đăng, gửi đề nghị hoặc liên hệ với nhau trên hệ thống. |


Luồng hoạt động


![Diagram: media/image7.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image7.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (2) | BR-13 | (Triệt tiêu tương tác): Khi A chặn B:B không thể xem các bài đăng của A. B không thể gửi đề nghị mua/trao đổi cho A. B không thể xem thông tin SĐT/Zalo của A kể cả khi có giao dịch cũ. |


## 3.2. Quản lý bài đăng và sản phẩm

### 3.2.1. UC: Đăng tin sản phẩm


| Mô tả tổng quan | Đăng bài sản phẩm đồ cũ với thông tin chi tiết, hình ảnh, hình thức giao dịch (Mua/Trao đổi). |
| --- | --- |
| Tác nhân (Actors) | Người bán. |
| Tác nhân kích hoạt | Người bán điền thông tin, tải ảnh lên, chọn hình thức giao dịch và click chọn “Đăng tin” |
| Điều kiện trước | - Người dùng đã đăng nhập và tài khoản ở trạng thái Hoạt động.- Thông tin hồ sơ cơ bản (SĐT, Khu vực) đã được cập nhật. |
| Điều kiện sau | - Hình ảnh sản phẩm được tải lên thành công trên CDN (Cloudinary).- Bài đăng mới được tạo trong CSDL với trạng thái mặc định là Còn hàng.- Bài đăng xuất hiện trên giao diện trang chủ và danh sách tìm kiếm. |


Luồng hoạt động


![Diagram: media/image8.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image8.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (1) | BR-14 | (Yêu cầu tài khoản): Người dùng phải hoàn tất Xác thực Email/SĐT mới có quyền đăng tin. |
| (2) | BR-15 | (Hình thức giao dịch):Nếu chọn hình thức Mua bán: Bắt buộc nhập Giá bán > 0. Nếu chọn hình thức Trao đổi: Bắt buộc ghi rõ nhu cầu muốn đổi lấy sản phẩm gì. |
| (3) | BR-16 | (Hình ảnh bắt buộc): Bài đăng phải có ít nhất 1 hình ảnh thực tế của sản phẩm và tối đa 10 hình ảnh. |
| (4) | BR-17 | (Trạng thái mặc định): Bài đăng mới tạo có trạng thái Còn hàng (AVAILABLE). |


### 3.2.2. UC: Cập nhật bài đăng


| Mô tả tổng quan | Chỉnh sửa thông tin bài đăng khi chưa diễn ra giao dịch chính thức. |
| --- | --- |
| Tác nhân (Actors) | Người bán. |
| Tác nhân kích hoạt | Người bán chọn bài đăng cần chỉnh sửa → Chọn “Chỉnh sửa” → Thay đổi nội dung bài đăng → Click “Cập nhật”. |
| Điều kiện trước | - Người dùng đã đăng nhập và là chủ sở hữu của bài đăng.- Bài đăng đang ở trạng thái Còn hàng (chưa nhận/chấp nhận giao dịch chính thức). |
| Điều kiện sau | - Thông tin bài đăng (giá, mô tả, hình ảnh, tình trạng) được cập nhật mới trong CSDL.- Giao diện hiển thị bài đăng công khai được làm mới theo thông tin chỉnh sửa. |


Luồng hoạt động


![Diagram: media/image9.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image9.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (2) | BR-18 | (Quyền sở hữu): Chỉ chính chủ bài đăng mới có quyền chỉnh sửa thông tin bài đăng đó. |
| (4) | BR-19 | (Khóa chỉnh sửa): Bài đăng không thể chỉnh sửa nếu đã chấp nhận một đề nghị giao dịch và đang ở trạng thái Đang hẹn gặp hoặc Đã giao dịch. |


### 3.2.3. UC: Quản lý trạng thái & Ẩn / Hiện bài đăng


| Mô tả tổng quan | Tạm ẩn bài đăng khỏi trang tìm kiếm hoặc thay đổi trạng thái (Còn hàng, Đang hẹn gặp, Đã bán, Ẩn). |
| --- | --- |
| Tác nhân (Actors) | Người bán / Admin. |
| Tác nhân kích hoạt | Người bán chọn “Ẩn bài đăng”. |
| Điều kiện trước | - Người dùng là chủ bài đăng hoặc Quản trị viên (Admin).- Bài đăng đã tồn tại trong CSDL. |
| Điều kiện sau | - Trạng thái bài đăng chuyển đổi chính xác giữa các trạng thái (Còn hàng, Đang hẹn gặp/Tạm giữ, Đã giao dịch, Đã ẩn).- Khả năng tương tác (gửi đề nghị, hiển thị tìm kiếm) của bài đăng được cập nhật tương ứng với trạng thái mới. |


Luồng hoạt động


![Diagram: media/image10.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image10.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (2) | BR-20 | (Quyền ẩn bài): Chủ bài đăng có thể ẩn bài đăng bất kỳ lúc nào nếu chưa có giao dịch đang diễn ra. |
| (3) | BR-21 | (Chuyển trạng thái tự động):Khi bài đăng chuyển sang Đang hẹn gặp: Tạm ẩn khỏi danh sách tìm kiếm công khai. Khi giao dịch hoàn tất: Chuyển vĩnh viễn sang Đã giao dịch. |


### 3.2.4. UC: Quản lý kho đồ cá nhân


| Mô tả tổng quan | Cho phép người dùng xem tất cả danh sách sản phẩm mình đã đăng và lịch sử giao dịch liên quan. |
| --- | --- |
| Tác nhân (Actors) | Người dùng |
| Tác nhân kích hoạt | Người bán mở trang Kho đồ cá nhân. |
| Điều kiện trước | Người dùng đã đăng nhập vào hệ thống. |
| Điều kiện sau | Danh sách tất cả các bài đăng do chính người dùng tạo được phân loại và hiển thị đầy đủ theo trạng thái. |


Luồng hoạt động


![Diagram: media/image11.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image11.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (3) | BR-22 | (Phân loại hiển thị): Kho đồ cá nhân phải phân tách rõ các sản phẩm theo đúng trạng thái: Dang bán, Đang hẹn gặp, Đã giao dịch, Đã ẩn. |


## 3.3. Tìm kiếm, khám phá và quản lý yêu thích

### 3.3.1. UC: Khám phá, tìm kiếm và lọc sản phẩm


| Mô tả tổng quan | Khách/Người dùng tìm kiếm sản phẩm theo từ khóa, lọc theo vị trí, khoảng giá, danh mục, và xem chi tiết bài đăng. |
| --- | --- |
| Tác nhân (Actors) | Khách / Người dùng. |
| Tác nhân kích hoạt | [Người dùng] Nhập từ khóa & chọn bộ lọc => Nhấn "Tìm kiếm". |
| Điều kiện trước | - Hệ thống có các bài đăng ở trạng thái Còn hàng. |
| Điều kiện sau | - Danh sách sản phẩm khớp với từ khóa và tiêu chí lọc (giá, danh mục, khu vực, tình trạng) được trả về và hiển thị cho người dùng. |


Luồng hoạt động


![Diagram: media/image12.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image12.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (2), (3) | BR-23 | Quy tắc truy vấn và hiển thị bản tin:Hệ thống mặc định chỉ truy vấn các bài đăng có trạng thái CÒN HÀNG.Hệ thống phân chia bản tin thành 2 tab: Mới nhất và Nổi bật.Hệ thống tự động ưu tiên hiển thị các bài đăng thuộc cùng Tỉnh/Thành phố với vị trí của người dùng. Nếu người dùng chưa cấp quyền truy cập vị trí, hệ thống hiển thị dữ liệu mặc định trên toàn sàn. |
| (4), (5) | BR-24 | Quy tắc tìm kiếm và lọc:Từ khóa tìm kiếm: Không phân biệt chữ hoa và chữ thường; hệ thống tìm kiếm chuỗi phù hợp trong Tiêu đề bài đăng, Nội dung mô tả và Tên danh mục ngành hàng.Bộ lọc vị trí: Cung cấp danh sách lựa chọn Tỉnh/Thành phố và Quận/Huyện phụ thuộc. Người dùng phải chọn Tỉnh/Thành phố trước, sau đó hệ thống mới hiển thị danh sách Quận/Huyện tương ứng.Bộ lọc giá: Giá phải là số nguyên lớn hơn hoặc bằng 0. Nếu người dùng nhập cả Giá từ và Giá đến, giá từ phải nhỏ hơn hoặc bằng giá đến. |


### 3.3.2. UC: Xem chi tiết sản phẩm & Hồ sơ người dùng


| Mô tả tổng quan | Cho phép người dùng xem đầy đủ thông tin chi tiết của một bài đăng (album ảnh thực tế phóng to, mô tả, tình trạng, khu vực hẹn gặp đề xuất) và kiểm tra hồ sơ uy tín, nhận xét của người bán trước khi quyết định liên hệ hoặc đề nghị giao dịch. |
| --- | --- |
| Tác nhân (Actors) | Khách / Người dùng. |
| Tác nhân kích hoạt | [Người dùng] Nhấn vào 1 sản phẩm => [Hệ thống] Hiển thị trang Chi tiết sản phẩm |
| Điều kiện trước | - Bài đăng sản phẩm đang tồn tại trong cơ sở dữ liệu hệ thống. |
| Điều kiện sau | - Màn hình Chi tiết sản phẩm hiển thị đầy đủ thông tin bài đăng, hồ sơ người bán và các nút điều hướng chức năng liên quan. |


Luồng hoạt động


![Diagram: media/image13.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image13.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (2), (3) | BR-25 | Quy tắc trạng thái và tình trạng khả dụng:Nếu bài đăng bị Quản trị viên khóa hoặc xóa, hệ thống hiển thị thông báo: "Bài đăng không tồn tại hoặc đã bị gỡ bỏ!" và chuyển hướng người dùng về Trang chủ.Nếu bài đăng đang ở trạng thái ĐANG GIỮ CHỖ, hệ thống hiển thị nhãn cảnh báo "Đang có hẹn giao dịch", đồng thời tạm khóa các nút thực hiện giao dịch.Nếu bài đăng đang ở trạng thái ĐÃ HOÀN TẤT, hệ thống hiển thị nhãn "Đã giao dịch thành công". |
| (4), (5) | BR-26 | Quy tắc hiển thị và quyền riêng tư:Cho phép người dùng nhấn vào hình ảnh để phóng to và xem ảnh ở kích thước đầy đủ.Không hiển thị công khai số điện thoại và liên kết Zalo của người bán. Chỉ hiển thị Tỉnh/Thành phố, Quận/Huyện và địa điểm công cộng được đề xuất để hẹn gặp.Hồ sơ người bán hiển thị các thông tin: Ảnh đại diện, Tên người bán, Điểm đánh giá trung bình (1–5 sao), Số lượt giao dịch thành công và danh sách nhận xét công khai từ các giao dịch trước. |
| (6), (7) | BR-27 | Quy tắc phân quyền nút thao tác:Nếu người xem là Chủ sở hữu bài đăng, hệ thống ẩn các nút "Liên hệ", "Đề nghị đổi đồ", "Yêu thích" và hiển thị nút "Chỉnh sửa bài đăng".Nếu người xem là Khách vãng lai (chưa đăng nhập), khi nhấn "Đề nghị đổi đồ" hoặc "Thêm vào yêu thích", hệ thống hiển thị cửa sổ thông báo yêu cầu người dùng đăng nhập tài khoản. |


### 3.3.3. UC: Quản lý danh sách yêu thích (Wishlist)


| Mô tả tổng quan | Cho phép người dùng đã đăng nhập lưu các bài đăng quan tâm vào Danh sách yêu thích (Wishlist) để theo dõi nhanh, xóa khỏi danh sách khi không còn nhu cầu, và theo dõi trạng thái giao dịch hoặc biến động giá của món đồ. |
| --- | --- |
| Tác nhân (Actors) | Người dùng đã đăng nhập. |
| Tác nhân kích hoạt | [Người dùng] Nhấn biểu tượng Yêu thích trên sản phẩm. |
| Điều kiện trước | - Người dùng đã đăng nhập vào hệ thống. |
| Điều kiện sau | - Bản ghi Wishlist được thêm/xóa trong CSDL; Người dùng quản lý được danh sách bài đã lưu; Nhận được thông tin trạng thái cập nhật kịp thời. |


Luồng hoạt động


![Diagram: media/image14.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image14.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (2) | BR-28 | Quy tắc xác thực:Chức năng yêu cầu người dùng phải đăng nhập tài khoản.Nếu người dùng chưa đăng nhập và nhấn biểu tượng Trái tim, hệ thống hiển thị thông báo"Vui lòng đăng nhập để lưu sản phẩm vào danh sách yêu thích!" kèm nút chuyển hướng đến trang Đăng nhập. |
| (3), (4), (5) | BR-29 | Quy tắc thêm và xóa khỏi danh sách yêu thích:Hệ thống kiểm tra cặp khóa [Mã người dùng, Mã sản phẩm].Nếu chưa tồn tại trong cơ sở dữ liệu: Hệ thống thêm bản ghi mới, đổi biểu tượng thành Trái tim đỏ tô đậm và hiển thị thông báo "Đã thêm vào danh sách yêu thích."Nếu đã tồn tại trong cơ sở dữ liệu: Hệ thống xóa bản ghi, đổi biểu tượng thành Trái tim viền rỗng và hiển thị thông báo MSG 11B_3: "Đã xóa khỏi danh sách yêu thích." |
| (7) | BR-30 | Quy tắc hiển thị danh sách yêu thích:Trang "Danh sách yêu thích" liệt kê toàn bộ bài đăng mà người dùng đã lưu, sắp xếp theo thời gian lưu mới nhất lên đầu.• Mỗi thẻ sản phẩm hiển thị trạng thái được cập nhật theo thời gian thực, gồm: Còn hàng, Tạm giữ đồ (Đang hẹn gặp) hoặc Đã bán.Cung cấp biểu tượng "Thùng rác / Bỏ thích" trên từng thẻ để người dùng có thể xóa nhanh sản phẩm khỏi danh sách yêu thích. |
| (8) | BR-31 | Quy tắc thông báo và cảnh báo trạng thái:Khi giá thay đổi: Nếu người bán cập nhật giảm giá, hệ thống tự động gửi thông báo: "Sản phẩm [Tên sản phẩm] trong danh sách yêu thích của bạn vừa giảm giá xuống còn [Giá mới] VNĐ!".Khi trạng thái thay đổi: Khi bài đăng chuyển sang trạng thái Tạm giữ đồ hoặc Đã bán, hệ thống gửi thông báo: "Sản phẩm [Tên sản phẩm] bạn quan tâm đã có người hẹn gặp / đã giao dịch!". |


## 3.4. Quản lý đề nghị

### 3.4.1. UC: Gửi đề nghị mua


| Mô tả tổng quan | Người mua gửi đề nghị mua cho bài đăng cho phép mua. |
| --- | --- |
| Tác nhân (Actors) | Người mua. |
| Tác nhân kích hoạt | [Người mua] Chọn "Gửi đề nghị mua"=> Nhập thông tin/giá => Nhấn "Gửi". |
| Điều kiện trước | - Người mua đã đăng nhập.- Bài đăng mục tiêu ở trạng thái Còn hàng và hỗ trợ hình thức Mua bán.- Người mua không phải là chủ của bài đăng đó. |
| Điều kiện sau | - Một đề nghị mua mới được khởi tạo ở trạng thái Chờ xử lý- Thông báo được gửi tới Chủ bài đăng |


Luồng hoạt động


![Diagram: media/image15.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image15.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (2) | BR-32 | (Không tự gửi đề nghị): Người dùng không được gửi đề nghị mua/trao đổi trên bài đăng của chính mình. |
| (2) | BR-33 | (Chống spam đề nghị): Mỗi người dùng chỉ được duy nhất 1 đề nghị đang ở trạng thái Chờ xử lý trên cùng một bài đăng tại một thời điểm. |


### 3.4.2. UC: Gửi đề nghị trao đổi


| Mô tả tổng quan | Người dùng đề xuất đổi sản phẩm từ kho cá nhân của mình lấy sản phẩm trong bài đăng (kèm tiền bù trừ nếu có). |
| --- | --- |
| Tác nhân (Actors) | Người dùng (Người trao đổi). |
| Tác nhân kích hoạt | [Người dùng] Nhấn "Gửi đề nghị trao đổi". |
| Điều kiện trước | - Người dùng đã đăng nhập. - Bài đăng mục tiêu ở trạng thái Còn hàng và hỗ trợ hình thức Trao đổi. - Người dùng có ít nhất 1 sản phẩm hợp lệ trong Kho đồ cá nhân để mang đi đổi. |
| Điều kiện sau | - Một đề nghị trao đổi (kèm liên kết sản phẩm đổi + số tiền bù trừ nếu có) được tạo ở trạng thái Chờ xử lý. - Thông báo được gửi tới Chủ bài đăng. |


Luồng hoạt động


![Diagram: media/image16.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image16.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (2) | BR-34 | (Ràng buộc kho đồ trao đổi): Sản phẩm được chọn để trao đổi bắt buộc phải nằm trong Kho đồ cá nhân của người gửi và đang ở trạng thái Còn hàng. |


### 3.4.3. UC: Chấp nhận đề nghị & Xử lý nhiều đề nghị


| Mô tả tổng quan | Chủ bài đăng duyệt chấp nhận 1 đề nghị. Hệ thống tự động vô hiệu hóa các đề nghị khác cùng bài đăng và kích hoạt tính năng giao dịch/liên hệ. |
| --- | --- |
| Tác nhân (Actors) | Người bán (Chủ bài đăng). |
| Tác nhân kích hoạt | [Chủ bài đăng] Xem danh sách đề nghị => Chọn 1 đề nghị => Nhấn "Chấp nhận". |
| Điều kiện trước | - Người bán đã đăng nhập và là chủ sở hữu bài đăng. - Đề nghị được chọn đang ở trạng thái Chờ xử lý. |
| Điều kiện sau | - Đề nghị được chọn chuyển sang trạng thái Đã chấp nhận. - Tất cả các đề nghị khác cùng bài đăng tự động chuyển sang trạng thái Hết hiệu lực / Từ chối. - Trạng thái bài đăng chuyển thành Đang hẹn gặp / Tạm giữ. - Một bản ghi Giao dịch mới được tạo ra và thông tin liên hệ (SĐT/Zalo) giữa 2 bên được kích hoạt. |


Luồng hoạt động


![Diagram: media/image17.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image17.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (2) | BR-35 | (Tính độc quyền chấp nhận): Một bài đăng tại một thời điểm chỉ được phép Chấp nhận duy nhất 1 đề nghị. |
| (4) | BR-36 | (Tự động vô hiệu hóa các đề nghị khác): Ngay khi chủ bài đăng nhấn Chấp nhận đề nghị X:Đề nghị X chuyển sang trạng thái Đã chấp nhận. Tất cả các đề nghị Y, Z khác trên bài đăng đó tự động chuyển sang trạng thái Hết hiệu lực / Từ chối. Trạng thái bài đăng chuyển ngay sang Đang hẹn gặp / Tạm giữ. Kích hoạt mở thông tin liên hệ (SĐT/Zalo) cho 2 bên. |


## 3.5. Lịch hẹn & giao dịch

### 3.5.1. UC: Quản lý Lịch hẹn (Tạo / Xác nhận / Thay đổi / Hủy)


| Mô tả tổng quan | Hai bên hẹn thời gian, địa điểm gặp mặt trực tiếp để xem/giao dịch hàng. |
| --- | --- |
| Tác nhân (Actors) | Người mua & Người bán. |
| Tác nhân kích hoạt | [Bên A] Nhập Thời gian, Địa điểm => Nhấn "Tạo lịch hẹn".[Bên B] Xem đề xuất => Chọn "Đồng ý". |
| Điều kiện trước | - Đề nghị đã được chấp thuận.- Lịch hẹn đã được tạo nhưng chưa diễn ra.- Lịch hẹn tồn tại trong hệ thống và chưa quá thời gian gặp mặt. |
| Điều kiện sau | - Số điện thoại hoặc đường dẫn Zalo của hai bên được phép hiển thị trên màn hình chi tiết giao dịch.- Lịch hẹn được cập nhật thông tin thời gian/địa điểm mới và quay lại trạng thái Chờ đối phương xác nhận.- Lịch hẹn bị hủy và cập nhật trạng thái Đã hủy. |


Luồng hoạt động


![Diagram: media/image18.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image18.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (2) | BR-37 | (Ràng buộc thời gian hẹn): Lịch hẹn gặp phải được thiết lập ở mốc thời gian trong tương lai (tối thiểu sau 1 giờ kể từ thời điểm tạo). |


### 3.5.2. UC: Đăng tin sản phẩm


| Mô tả tổng quan | Cơ chế hai bên cùng nhấn xác nhận đã giao dịch thành công sau khi gặp mặt trao đổi/thanh toán trực tiếp. |
| --- | --- |
| Tác nhân (Actors) | Người mua & Người bán. |
| Tác nhân kích hoạt | [Người dùng A/B] Nhấn "Xác nhận hoàn tất giao dịch". |
| Điều kiện trước | - Giao dịch đang ở trạng thái Đã hẹn gặp hoặc Đã xác nhận. - Hai bên đã gặp mặt trực tiếp để nhận hàng/thanh toán/trao đổi xong. |
| Điều kiện sau | - Khi 1 bên bấm: Giao dịch ghi nhận xác nhận 1 chiều, đổi trạng thái sang Chờ bên còn lại xác nhận. - Khi cả 2 bên cùng bấm xác nhận:Trạng thái giao dịch chuyển sang Hoàn tất. Trạng thái bài đăng tương ứng chuyển sang Đã giao dịch. Hệ thống tự động Mở quyền đánh giá uy tín cho cả hai bên. |


Luồng hoạt động


![Diagram: media/image19.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image19.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (8) | BR-38 | (Mở quyền đánh giá): Quyền Đánh giá thành viên chỉ được kích hoạt ngay sau khi trạng thái giao dịch đã chuyển sang Hoàn tất. |
| (9) | BR-39 | (Nguyên tắc hai chiều): Giao dịch chỉ chuyển sang trạng thái HOÀN TẤT khi và chỉ khi CẢ HAI BÊN (Người mua và Người bán) cùng nhấn xác nhận thành công trên ứng dụng. |


## 3.6. Đánh giá uy tín, báo cáo & khiếu nại

### 3.6.1. UC: Đánh giá thành viên & Hồ sơ uy tín

Đánh giá thành viên

| Mô tả tổng quan | Cho phép người dùng đánh giá đối phương (1-5 sao + lời nhắn) sau khi giao dịch hoàn tất. |
| --- | --- |
| Tác nhân (Actors) | Người mua & Người bán. |
| Tác nhân kích hoạt | Người dùng chọn số sao, nhập nội dung và nhấn “Gửi đánh giá” |
| Điều kiện trước | - Giao dịch giữa hai bên đã chuyển sang trạng thái Hoàn tất - Người dùng chưa từng gửi đánh giá cho giao dịch này trước đó. |
| Điều kiện sau | - Nội dung đánh giá (số sao 1–5, lời nhận xét) được lưu vào CSDL.- Điểm uy tín trung bình của người được đánh giá được hệ thống tính toán và cập nhật lại ngay lập tức. |


Xem hồ sơ uy tín

| Mô tả tổng quan | Cho phép người dùng xem hồ sơ uy tín của một thành viên, bao gồm điểm đánh giá trung bình, số lượt đánh giá và các nhận xét từ những người dùng đã giao dịch. |
| --- | --- |
| Tác nhân (Actors) | Người mua, Người bán. |
| Tác nhân kích hoạt | Người dùng chọn hồ sơ của một thành viên. |
| Điều kiện trước | Hồ sơ người dùng tồn tại trên hệ thống. |
| Điều kiện sau | Màn hình hiển thị công khai: Điểm uy tín trung bình, tổng số giao dịch thành công, và danh sách các nhận xét công khai. |


Khiếu nại đánh giá

| Mô tả tổng quan | Cho phép thành viên khiếu nại một đánh giá mà họ cho rằng vi phạm quy định. |
| --- | --- |
| Tác nhân (Actors) | Người mua, Người bán. |
| Tác nhân kích hoạt | Người dùng chọn chức năng “Khiếu nại đánh giá” trên một đánh giá của mình. |
| Điều kiện trước | Người dùng nhận được đánh giá có dấu hiệu vi phạm (spam, xúc phạm, trả đũa). |
| Điều kiện sau | Đơn khiếu nại được khởi tạo và chuyển sang cho Quản trị viên (Admin) xem xét xử lý. |


Luồng hoạt động
0424180

![Diagram: media/image20.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image20.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (4) | BR-40 | (Một lượt đánh giá): Mỗi bên chỉ được gửi duy nhất 1 lượt đánh giá cho mỗi giao dịch đã Hoàn tất.. |
| (2) | BR-41 | (Thời hạn đánh giá): Quyền đánh giá có hiệu lực trong vòng 7 ngày kể từ khi giao dịch hoàn tất; quá 7 ngày quyền đánh giá tự động đóng. |
| (8) | BR-42 | (Công thức Điểm uy tín): Điểm uy tín của người dùng được tính bằng trung bình cộng số sao của tất cả các đánh giá hợp lệ mà người đó nhận được. |


### 3.6.2. UC: Báo cáo vi phạm & Đính kèm bằng chứng


| Mô tả tổng quan | Cho phép thành viên báo cáo bài đăng hoặc người dùng khác khi phát hiện hành vi vi phạm quy định của hệ thống, đồng thời có thể đính kèm hình ảnh hoặc tài liệu làm bằng chứng. |
| --- | --- |
| Tác nhân (Actors) | Người mua, Người bán. |
| Tác nhân kích hoạt | Người dùng chọn chức năng “Báo cáo vi phạm” trên bài đăng hoặc hồ sơ thành viên và chọn “Đính kèm bằng chứng” trong biểu mẫu báo cáo. |
| Điều kiện trước | - Người dùng đã đăng nhập vào hệ thống.- Phát hiện bài đăng hoặc người dùng khác có hành vi vi phạm chính sách. |
| Điều kiện sau | - Báo cáo vi phạm kèm các hình ảnh/tài liệu bằng chứng được lưu ở trạng thái Chờ xử lý.- Thông báo được phát tới hệ thống quản trị của Admin. |


Luồng hoạt động
0423545

![Diagram: media/image21.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image21.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (2) | BR-43 | (Yêu cầu bằng chứng): Mọi báo cáo vi phạm liên quan đến lừa đảo/tranh chấp bắt buộc phải có ít nhất 1 hình ảnh hoặc tài liệu bằng chứng đính kèm. |
| (7), (8) | BR-44 | (Thẩm quyền Admin): Chỉ có tài khoản Quản trị viên (Admin) mới có quyền bác bỏ hoặc duyệt báo cáo để gỡ bài / khóa tài khoản. |


## 3.7. Quản trị hệ thống

### 3.7.1. UC: Khóa / Mở khóa tài khoản


| Mô tả tổng quan | Cho phép Quản trị viên (Admin) khóa hoặc mở khóa tài khoản người dùng dựa trên trạng thái và tình hình vi phạm. |
| --- | --- |
| Tác nhân (Actors) | Quản trị viên (Admin). |
| Tác nhân kích hoạt | Quản trị viên (Admin) chọn tài khoản và thực hiện chức năng “Khóa tài khoản” hoặc “Mở khóa tài khoản”. |
| Điều kiện trước | Admin đã đăng nhập và chọn được tài khoản người dùng mục tiêu. |
| Điều kiện sau | - Khi Khóa: Trường trạng thái tài khoản cập nhật thành Locked, toàn bộ Token JWT của tài khoản đó lập tức bị thu hồi.- Khi Mở khóa: Tài khoản khôi phục về trạng thái Hoạt động và có thể đăng nhập bình thường. |


Luồng hoạt động
0424180

![Diagram: media/image22.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image22.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (5) | BR-45 | (Thu hồi phiên ngay lập tức): Ngay khi Admin thực hiện Khóa tài khoản, toàn bộ JWT Token active của tài khoản đó phải bị hủy lập tức, buộc đăng xuất khỏi tất cả thiết bị. |
| (5) | BR-46 | (Xử lý bài đăng liên quan): Khi một tài khoản bị khóa, tất cả các bài đăng đang ở trạng thái Còn hàng của tài khoản đó tự động chuyển sang Bị ẩn. |


### 3.7.2. UC: Kiểm duyệt bài đăng & Xóa / Gỡ bài


| Mô tả tổng quan | Cho phép Quản trị viên (Admin) quản lý các danh mục được sử dụng để phân loại bài đăng trong hệ thống. |
| --- | --- |
| Tác nhân (Actors) | Quản trị viên (Admin). |
| Tác nhân kích hoạt | Admin nhập tên danh mục mới và icon của danh mục, sau đó nhấn “Lưu”. |
| Điều kiện trước | Admin đã đăng nhập phân hệ Quản trị. |
| Điều kiện sau | - Danh mục mới được thêm hoặc danh mục cũ được chỉnh sửa/tạm ẩn trong CSDL.- Giao diện đăng bài và tìm kiếm của người dùng cập nhật theo cây danh mục mới. |


Luồng hoạt động
0424180

![Diagram: media/image23.png](D:/Project/DAPM/docs/extracted_usecase/word/media/image23.png)


Yêu cầu chức năng

| Bước | BR Code | Mô tả |
| --- | --- | --- |
| (1) | BR-47 | (Ràng buộc xóa danh mục): Không được xóa danh mục nếu đang có bài đăng thuộc danh mục đó ở trạng thái Còn hàng hoặc Đang hẹn gặp. Admin chỉ được phép chọn ẩn danh mục. |


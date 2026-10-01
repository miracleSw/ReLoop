# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS) - DỰ ÁN RELOOP
**Mã đề tài**: HUSC-33  
**Tên hệ thống**: ReLoop - Nền tảng kết nối trao đổi và mua bán đồ đã qua sử dụng  
**Chuẩn tài liệu**: Dựa trên cấu trúc chuẩn [SRS_Template.docx](file:///d:/Doc/DOAN/SRS_Template.docx)

---

# MỤC LỤC
- [1. Giới thiệu (Introduction)](#1-giới-thiệu-introduction)
  - [1.1 Mục đích tài liệu (Purpose)](#11-mục-đích-tài-liệu-purpose)
  - [1.2 Tổng quan hệ thống (Overview)](#12-tổng-quan-hệ-thống-overview)
  - [1.3 Đối tượng đọc tài liệu (Intended Audience)](#13-đối-tượng-đọc-tài-liệu-intended-audience)
  - [1.4 Thuật ngữ và từ viết tắt (Abbreviations)](#14-thuật-ngữ-và-từ-viết-tắt-abbreviations)
  - [1.5 Tài liệu tham khảo (References)](#15-tài-liệu-tham-khảo-references)
- [2. Yêu cầu cấp cao (High-Level Requirements)](#2-yêu-cầu-cấp-cao-high-level-requirements)
  - [2.1 Sơ đồ thực thể liên kết (Entity Relationship Diagram - ERD)](#21-sơ-đồ-thực-thể-liên-kết-entity-relationship-diagram---erd)
  - [2.2 Sơ đồ luồng công việc (Workflows / Activity Diagrams)](#22-sơ-đồ-luồng-công-việc-workflows--activity-diagrams)
  - [2.3 Sơ đồ chuyển trạng thái (State Transition Diagrams)](#23-sơ-đồ-chuyển-trạng-thái-state-transition-diagrams)
  - [2.4 Sơ đồ Use Case tổng quan & phân hệ (Use Case Diagrams)](#24-sơ-đồ-use-case-tổng-quan--phân-hệ-use-case-diagrams)
  - [2.5 Ma trận phân quyền (Permission Matrix)](#25-ma-trận-phân-quyền-permission-matrix)
- [3. Đặc tả chi tiết 28 Use Cases (Use Case Specifications)](#3-đặc-tả-chi-tiết-28-use-cases-use-case-specifications)
- [4. Thiết kế giao diện mẫu (Screen Mockups & Wireframes)](#4-thiết-kế-giao-diện-mẫu-screen-mockups--wireframes)
- [5. Yêu cầu phi chức năng (Non-Functional Requirements)](#5-yêu-cầu-phi-chức-năng-non-functional-requirements)

---

# 1. Giới thiệu (Introduction)

## 1.1 Mục đích tài liệu (Purpose)
Tài liệu này đặc tả chi tiết toàn bộ các yêu cầu chức năng, yêu cầu phi chức năng, mô hình dữ liệu, luồng nghiệp vụ và giao diện cho hệ thống **ReLoop - Nền tảng kết nối trao đổi và mua bán đồ đã qua sử dụng**.  
Tài liệu đóng vai trò là kim chỉ nam chính thức phục vụ các mục tiêu:
* Làm căn cứ nghiệm thu và đánh giá đồ án môn học.
* Cung cấp thông số chuẩn xác cho quá trình thiết kế cơ sở dữ liệu và kịch bản kiểm thử (Testcase).
* Cung cấp kiến thức nghiệp vụ nền tảng phục vụ kỳ thi Final cuối môn (trên máy tính ngắt mạng).

## 1.2 Tổng quan hệ thống (Overview)
**ReLoop** là nền tảng thương mại C2C (Customer to Customer) kết nối những người dùng có nhu cầu thanh lý, mua bán hoặc trao đổi các món đồ cũ/đã qua sử dụng tại địa phương.
* **Mô hình trọng tâm**: **Gặp mặt trực tiếp (In-person Meetup)**. Khác với các sàn thương mại điện tử giao hàng qua bên thứ 3 và thanh toán trung gian phức tạp, ReLoop hỗ trợ người dùng tìm kiếm sản phẩm gần mình nhất theo khu vực địa phương (Tỉnh/Thành phố, Quận/Huyện), kết nối trực tiếp qua số điện thoại/Zalo, thỏa thuận gặp mặt ngoài đời thực để kiểm tra đồ và giao dịch, sau đó hoàn tất tiến trình trên hệ thống để tích lũy điểm uy tín cộng đồng.
* **Hai hình thức giao dịch chính**:
  1. *Mua bán*: Đăng sản phẩm kèm mức giá bán cố định.
  2. *Trao đổi (Barter)*: Người mua đề xuất một món đồ từ kho đồ cá nhân của mình để đổi lấy sản phẩm của người bán (có thể kèm ghi chú bù trừ tiền mặt).

## 1.3 Đối tượng đọc tài liệu (Intended Audience)
* **Thành viên nhóm dự án**: Nắm vững luồng nghiệp vụ và ranh giới hệ thống để thiết kế Testcase và trả lời vấn đáp/thi Final.
* **Nhóm sinh viên review chéo**: Dùng để đối chiếu, kiểm tra tính đúng đắn, nhất quán và độ bao phủ của yêu cầu.
* **Giảng viên hướng dẫn & chấm thi**: Đánh giá mức độ hoàn thiện về mặt phân tích và thiết kế phần mềm.

## 1.4 Thuật ngữ và từ viết tắt (Abbreviations)
| Viết tắt | Thuật ngữ đầy đủ | Ý nghĩa tiếng Việt |
| :--- | :--- | :--- |
| **SRS** | Software Requirements Specification | Tài liệu đặc tả yêu cầu phần mềm |
| **UC** | Use Case | Ca sử dụng |
| **ERD** | Entity Relationship Diagram | Sơ đồ thực thể liên kết |
| **BR** | Business Rule | Quy tắc nghiệp vụ |
| **C2C** | Customer to Customer | Khách hàng giao dịch với khách hàng |
| **Barter** | Barter / Item Exchange | Hình thức trao đổi vật phẩm lấy vật phẩm |
| **Meetup** | In-person Meetup | Cuộc gặp mặt trực tiếp để giao dịch |
| **JWT** | JSON Web Token | Chuỗi mã hóa dùng để xác thực người dùng |
| **BVA** | Boundary Value Analysis | Kỹ thuật phân tích giá trị biên (Kiểm thử) |
| **EP** | Equivalence Partitioning | Kỹ thuật phân vùng tương đương (Kiểm thử) |

## 1.5 Tài liệu tham khảo (References)
1. *HUSC-33_Requirement Outline.xlsx* - Đề cương yêu cầu dự án ReLoop.
2. *SRS_Template.docx* - Mẫu tài liệu đặc tả yêu cầu chuẩn.
3. *UseCase-SRS.docx* - Danh mục 28 Use Cases và Ma trận phân quyền.

---

# 2. Yêu cầu cấp cao (High-Level Requirements)

## 2.1 Sơ đồ thực thể liên kết (Entity Relationship Diagram - ERD)

```mermaid
erDiagram
    USERS ||--o{ PRODUCTS : "đăng bán/trao đổi"
    USERS ||--o{ BARTER_REQUESTS : "gửi đề nghị (sender)"
    USERS ||--o{ BARTER_REQUESTS : "nhận đề nghị (receiver)"
    USERS ||--o{ MEETUP_TRANSACTIONS : "tham gia giao dịch (buyer/seller)"
    USERS ||--o{ REVIEWS : "được đánh giá / viết đánh giá"
    USERS ||--o{ REPORTS : "gửi báo cáo / bị báo cáo"
    
    CATEGORIES ||--o{ PRODUCTS : "phân loại"
    PRODUCTS ||--o{ PRODUCT_IMAGES : "chứa hình ảnh"
    PRODUCTS ||--o{ BARTER_REQUESTS : "sản phẩm mục tiêu (target)"
    PRODUCTS ||--o{ BARTER_REQUESTS : "sản phẩm đề xuất (offered)"
    PRODUCTS ||--o{ MEETUP_TRANSACTIONS : "sản phẩm giao dịch"
    
    BARTER_REQUESTS ||--o| MEETUP_TRANSACTIONS : "chuyển thành"
    MEETUP_TRANSACTIONS ||--o{ REVIEWS : "sinh ra sau khi hoàn tất"
    REPORTS ||--o{ REPORT_EVIDENCES : "đính kèm bằng chứng"

    USERS {
        bigint id PK
        varchar email UK
        varchar password_hash
        varchar full_name
        varchar phone_number
        varchar zalo_phone
        varchar avatar_url
        varchar province_city
        varchar district
        varchar address_detail
        decimal reputation_score
        int total_transactions
        varchar role "ROLE_USER, ROLE_ADMIN"
        varchar status "ACTIVE, BLOCKED"
        datetime created_at
    }

    CATEGORIES {
        bigint id PK
        varchar name
        varchar slug UK
        varchar description
        boolean is_active
        datetime created_at
    }

    PRODUCTS {
        bigint id PK
        bigint user_id FK
        bigint category_id FK
        varchar title
        text description
        varchar transaction_type "FOR_SALE, FOR_EXCHANGE, BOTH"
        decimal price "nullable"
        varchar wanted_exchange_item "nullable"
        varchar item_condition "NEW_99, LIKE_NEW, WELL_USED, NEED_REPAIR"
        varchar meetup_province
        varchar meetup_district
        varchar meetup_location_detail
        varchar status "AVAILABLE, RESERVED, COMPLETED, HIDDEN"
        datetime created_at
        datetime updated_at
    }

    PRODUCT_IMAGES {
        bigint id PK
        bigint product_id FK
        varchar image_url
        boolean is_thumbnail
        datetime created_at
    }

    BARTER_REQUESTS {
        bigint id PK
        bigint sender_id FK
        bigint receiver_id FK
        bigint target_product_id FK
        bigint offered_product_id FK
        decimal money_adjustment "tiền bù trừ nếu có"
        text note
        varchar sender_phone
        varchar status "PENDING, ACCEPTED, REJECTED, CANCELLED"
        datetime created_at
        datetime updated_at
    }

    MEETUP_TRANSACTIONS {
        bigint id PK
        bigint barter_request_id FK "nullable"
        bigint product_id FK
        bigint seller_id FK
        bigint buyer_id FK
        varchar transaction_type "SALE, EXCHANGE"
        decimal agreed_amount "giá hoặc tiền bù"
        varchar meetup_location
        datetime meetup_time
        varchar status "WAITING_CONFIRMATION, APPOINTED, COMPLETED, CANCELLED"
        boolean seller_confirmed
        boolean buyer_confirmed
        varchar cancellation_reason "nullable"
        datetime created_at
        datetime updated_at
    }

    REVIEWS {
        bigint id PK
        bigint transaction_id FK
        bigint reviewer_id FK
        bigint reviewee_id FK
        int rating_stars "1 to 5"
        boolean is_honest_description
        boolean is_punctual
        text comment
        datetime created_at
    }

    REPORTS {
        bigint id PK
        bigint reporter_id FK
        bigint reported_user_id FK "nullable"
        bigint reported_product_id FK "nullable"
        varchar report_type "PRODUCT_VIOLATION, USER_VIOLATION"
        text reason
        varchar status "PENDING, RESOLVED, REJECTED"
        text admin_note "nullable"
        bigint resolved_by FK "nullable"
        datetime created_at
        datetime updated_at
    }

    REPORT_EVIDENCES {
        bigint id PK
        bigint report_id FK
        varchar image_url
        varchar description "nullable"
        datetime created_at
    }
```

---

## 2.2 Sơ đồ luồng công việc (Workflows / Activity Diagrams)

### 2.2.1 Luồng Đăng tin & Quản lý sản phẩm cá nhân
```mermaid
flowchart TD
    Start([Bắt đầu]) --> InputInfo[Nhập thông tin sản phẩm: Tiêu đề, Danh mục, Mô tả, Tình trạng, Khu vực hẹn gặp]
    InputInfo --> SelectType{Chọn hình thức giao dịch}
    SelectType -->|Cần bán| InputPrice[Nhập giá bán VNĐ]
    SelectType -->|Đổi đồ| InputExchange[Nhập mô tả món đồ muốn đổi]
    SelectType -->|Cả hai| InputBoth[Nhập cả giá bán & mô tả đồ muốn đổi]
    InputPrice --> UploadImg[Tải lên bộ ảnh thực tế 1-6 ảnh]
    InputExchange --> UploadImg
    InputBoth --> UploadImg
    UploadImg --> Validate{Kiểm tra dữ liệu hợp lệ?}
    Validate -->|Lỗi| ShowError[Hiển thị cảnh báo lỗi nhập liệu]
    ShowError --> InputInfo
    Validate -->|Hợp lệ| SaveProduct[Lưu bài đăng vào CSDL với trạng thái 'AVAILABLE']
    SaveProduct --> ShowSuccess[Thông báo đăng tin thành công & hiển thị trên trang cá nhân]
    ShowSuccess --> End([Kết thúc])
```

### 2.2.2 Luồng Đề nghị trao đổi sản phẩm (Barter Flow)
```mermaid
flowchart TD
    Start([Người mua xem bài đăng]) --> CheckType{Bài đăng có cho Đổi đồ?}
    CheckType -->|Không| EndFail([Chỉ cho phép mua bán trực tiếp])
    CheckType -->|Có| ClickBarter[Bấm 'Gửi đề nghị trao đổi']
    ClickBarter --> CheckLogin{Đã đăng nhập?}
    CheckLogin -->|Chưa| RedirectLogin[Chuyển hướng trang Đăng nhập]
    CheckLogin -->|Đã đăng nhập| LoadInventory[Tải danh sách món đồ 'AVAILABLE' trong kho của Người mua]
    LoadInventory --> SelectItem[Chọn 1 món đồ từ kho để đem đổi]
    SelectItem --> InputAdjust[Nhập số tiền bù trừ nếu có & ghi chú trao đổi]
    InputAdjust --> SubmitProposal[Bấm gửi đề nghị]
    SubmitProposal --> NotifySeller[Hệ thống lưu BarterRequest trạng thái 'PENDING' & hiển thị cho Người bán]
    NotifySeller --> SellerDecision{Người bán phản hồi}
    SellerDecision -->|Từ chối| RejectFlow[Chuyển trạng thái 'REJECTED' - Thông báo cho người mua]
    SellerDecision -->|Chấp nhận| AcceptFlow[Chuyển trạng thái 'ACCEPTED' - Chuyển bài đăng sang 'RESERVED' - Tạo Transaction 'APPOINTED']
    RejectFlow --> End([Kết thúc])
    AcceptFlow --> End([Kết thúc])
```

### 2.2.3 Luồng Vòng đời Giao dịch gặp mặt trực tiếp (Meetup Transaction Lifecycle)
```mermaid
flowchart TD
    Start([Tạo giao dịch gặp mặt]) --> StateAppointed[Trạng thái: ĐÃ HẸN GẶP / TẠM GIỮ ĐỒ]
    StateAppointed --> NoteSafe[Cung cấp cẩm nang hẹn gặp an toàn & Số điện thoại / Zalo]
    NoteSafe --> MeetOffline[Hai bên gặp mặt trực tiếp ngoài đời thực: Kiểm tra hàng, thanh toán / đổi đồ]
    MeetOffline --> CheckResult{Kết quả gặp mặt thực tế}
    CheckResult -->|Giao dịch thất bại / Bùng hẹn| CancelClick[Một bên bấm 'Hủy giao dịch' & nhập lý do]
    CancelClick --> StateCancelled[Trạng thái: ĐÃ HỦY - Mở lại bài đăng về 'AVAILABLE']
    CheckResult -->|Giao dịch thành công| BothConfirm[Cả 2 bên lần lượt bấm 'Xác nhận hoàn tất']
    BothConfirm --> CheckBoth{Cả 2 đã xác nhận?}
    CheckBoth -->|Chờ bên còn lại| StateWaiting[Trạng thái: Chờ đối phương bấm xác nhận]
    CheckBoth -->|Đủ cả 2 bên| StateCompleted[Trạng thái: HOÀN TẤT THÀNH CÔNG]
    StateCompleted --> UpdateProduct[Chuyển trạng thái sản phẩm sang 'COMPLETED']
    UpdateProduct --> OpenReview[Mở quyền đánh giá 1-5 sao và cập nhật điểm uy tín]
    StateCancelled --> End([Kết thúc])
    OpenReview --> End([Kết thúc])
```

---

## 2.3 Sơ đồ chuyển trạng thái (State Transition Diagrams)

### 2.3.1 Sơ đồ chuyển trạng thái Sản phẩm (Product Status)
```mermaid
stateDiagram-v2
    [*] --> AVAILABLE : Người dùng đăng tin thành công
    AVAILABLE --> RESERVED : Người bán chốt hẹn gặp (Mua bán hoặc Chấp nhận trao đổi)
    AVAILABLE --> HIDDEN : Người bán chủ động ẩn tin
    HIDDEN --> AVAILABLE : Người bán hiển thị lại tin
    RESERVED --> AVAILABLE : Hủy lịch hẹn gặp / Hủy giao dịch
    RESERVED --> COMPLETED : Cả hai bên xác nhận giao dịch thành công
    AVAILABLE --> [*] : Quản trị viên xóa bài vi phạm
    RESERVED --> [*] : Quản trị viên xóa bài vi phạm
    COMPLETED --> [*] : Lưu trữ lịch sử giao dịch
```

### 2.3.2 Sơ đồ chuyển trạng thái Giao dịch gặp mặt (Meetup Transaction Status)
```mermaid
stateDiagram-v2
    [*] --> WAITING_CONFIRMATION : Tạo yêu cầu hẹn gặp mới
    WAITING_CONFIRMATION --> APPOINTED : Người bán đồng ý lịch hẹn gặp (Tạm giữ đồ)
    WAITING_CONFIRMATION --> CANCELLED : Người mua hủy yêu cầu / Người bán từ chối
    APPOINTED --> COMPLETED : Cả Người mua và Người bán đều bấm Xác nhận hoàn tất
    APPOINTED --> CANCELLED : Một trong hai bên bấm Hủy hẹn (bùng hẹn, hàng không như mô tả)
    COMPLETED --> [*] : Mở khóa chức năng Đánh giá uy tín
    CANCELLED --> [*] : Mở khóa chức năng Báo cáo vi phạm (nếu có hành vi lừa đảo/bùng hẹn)
```

---

## 2.4 Sơ đồ Use Case tổng quan & phân hệ (Use Case Diagrams)

### 2.4.1 Nhóm 1: Quản lý tài khoản & hồ sơ cá nhân
```mermaid
flowchart LR
    Guest((Khách))
    User((Người dùng))
    
    Guest --> UC1([UC1: Đăng ký tài khoản])
    Guest --> UC2([UC2: Đăng nhập])
    User --> UC2
    User --> UC2_1([Đăng xuất])
    User --> UC3([UC3: Quản lý trang cá nhân])
    User --> UC4([UC4: Đổi / Khôi phục mật khẩu])
```

### 2.4.2 Nhóm 2: Quản lý bài đăng & sản phẩm
```mermaid
flowchart LR
    User((Người dùng))
    
    User --> UC5([UC5: Đăng tin sản phẩm])
    User --> UC6([UC6: Cập nhật bài đăng])
    User --> UC7([UC7: Chuyển trạng thái bài đăng])
    User --> UC8([UC8: Ẩn bài đăng])
    User --> UC9([UC9: Quản lý kho đồ cá nhân])
```

### 2.4.3 Nhóm 3: Tìm kiếm và khám phá
```mermaid
flowchart LR
    Guest((Khách))
    User((Người dùng))
    
    Guest --> UC10([UC10: Tìm kiếm và lọc sản phẩm])
    Guest --> UC11([UC11: Xem chi tiết sản phẩm])
    User --> UC10
    User --> UC11
```

### 2.4.4 Nhóm 4: Trao đổi và giao dịch gặp mặt trực tiếp
```mermaid
flowchart LR
    Buyer((Người mua))
    Seller((Người bán))
    
    Buyer --> UC12([UC12: Liên hệ và thỏa thuận gặp mặt])
    Buyer --> UC13([UC13: Gửi đề nghị trao đổi])
    Buyer --> UC16([UC16: Từ chối / Hủy đề nghị trao đổi])
    Buyer --> UC17([UC17: Theo dõi và xác nhận giao dịch])
    
    Seller --> UC14([UC14: Xử lý đề nghị trao đổi])
    Seller --> UC15([UC15: Chấp nhận đề nghị trao đổi])
    Seller --> UC16
    Seller --> UC17
```

### 2.4.5 Nhóm 5: Đánh giá và báo cáo vi phạm
```mermaid
flowchart LR
    User((Người dùng))
    
    User --> UC18([UC18: Đánh giá thành viên sau giao dịch])
    User --> UC19([UC19: Xem hồ sơ uy tín])
    User --> UC20([UC20: Báo cáo vi phạm])
    User --> UC21([UC21: Đính kèm hình ảnh bằng chứng])
```

### 2.4.6 Nhóm 6: Phân hệ Quản trị viên (Admin)
```mermaid
flowchart LR
    Admin((Quản trị viên))
    
    Admin --> UC22([UC22: Xem thống kê hệ thống])
    Admin --> UC23([UC23: Quản lý người dùng])
    Admin --> UC24([UC24: Kiểm duyệt & quản lý bài đăng])
    Admin --> UC25([UC25: Khóa / Mở khóa tài khoản])
    Admin --> UC26([UC26: Xóa / Gỡ bài vi phạm])
    Admin --> UC27([UC27: Quản lý đánh giá và phản hồi])
    Admin --> UC28([UC28: Xử lý báo cáo và khiếu nại])
```

---

## 2.5 Ma trận phân quyền (Permission Matrix)

**Ký hiệu quy ước**:
* **X**: Toàn quyền thực hiện chức năng.
* **X\***: Chỉ có quyền thao tác trên dữ liệu/bản ghi do chính mình tạo ra hoặc liên quan trực tiếp đến mình.
* *(Trống)*: Không có quyền truy cập/thực hiện.

| Phân hệ / Ca sử dụng (Use Case) | Khách (Guest) | Người dùng (User) | Quản trị viên (Admin) |
| :--- | :---: | :---: | :---: |
| **Nhóm 1: Quản lý tài khoản & hồ sơ** | | | |
| UC 01: Đăng ký tài khoản | X | | |
| UC 02: Đăng nhập / Đăng xuất | X | X | X |
| UC 03: Quản lý trang cá nhân | | X\* | X |
| UC 04: Đổi / Khôi phục mật khẩu | X | X\* | X\* |
| **Nhóm 2: Quản lý bài đăng & sản phẩm** | | | |
| UC 05: Đăng tin sản phẩm mới | | X | |
| UC 06: Cập nhật thông tin bài đăng | | X\* | X |
| UC 07: Chuyển trạng thái bài đăng | | X\* | X |
| UC 08: Ẩn / Hiện bài đăng | | X\* | |
| UC 09: Quản lý kho đồ cá nhân | | X\* | |
| **Nhóm 3: Tìm kiếm & khám phá** | | | |
| UC 10: Tìm kiếm và lọc sản phẩm | X | X | X |
| UC 11: Xem chi tiết sản phẩm | X | X | X |
| **Nhóm 4: Trao đổi & giao dịch** | | | |
| UC 12: Liên hệ & thỏa thuận gặp mặt | | X | |
| UC 13: Gửi đề nghị trao đổi | | X | |
| UC 14: Xử lý đề nghị trao đổi | | X\* | |
| UC 15: Chấp nhận đề nghị trao đổi | | X\* | |
| UC 16: Từ chối / Hủy đề nghị trao đổi | | X\* | |
| UC 17: Theo dõi & xác nhận hoàn tất giao dịch | | X\* | X |
| **Nhóm 5: Đánh giá & báo cáo** | | | |
| UC 18: Đánh giá thành viên | | X\* | |
| UC 19: Xem hồ sơ uy tín công khai | X | X | X |
| UC 20: Báo cáo vi phạm (bài đăng / người dùng) | | X | |
| UC 21: Đính kèm bằng chứng báo cáo | | X | |
| **Nhóm 6: Quản trị viên (Admin)** | | | |
| UC 22: Xem thống kê & báo cáo hệ thống | | | X |
| UC 23: Quản lý danh sách người dùng | | | X |
| UC 24: Kiểm duyệt bài đăng & danh mục | | | X |
| UC 25: Khóa / Mở khóa tài khoản | | | X |
| UC 26: Xóa / Gỡ bài viết vi phạm | | | X |
| UC 27: Quản lý đánh giá & phản hồi | | | X |
| UC 28: Tiếp nhận & xử lý báo cáo, khiếu nại | | | X |

---

*(Nội dung phần 3: Đặc tả chi tiết 28 Use Cases và phần 4: Mockup Layouts tiếp tục được triển khai chi tiết ở tài liệu này)*

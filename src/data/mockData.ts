import {
  User,
  Category,
  Product,
  BarterRequest,
  BuyRequest,
  MeetupTransaction,
  Message,
  Review,
  Report,
  Notification,
  SystemStats
} from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    fullName: 'Hoàng Nam',
    email: 'hoangnam.eco@gmail.com',
    phone: '0903124589',
    zaloPhone: '0903124589',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    province: 'Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    trustScore: 98,
    totalTransactions: 26,
    rating: 4.9,
    reviewCount: 22,
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2023-04-12T08:30:00Z',
    blockedUserIds: [],
    bio: 'Yêu thích lối sống tối giản, nâng niu đồ cũ & đồ thủ công. Luôn sẵn sàng trao đổi các thiết bị công nghệ & phụ kiện làm việc.',
  },
  {
    id: 'user-2',
    fullName: 'Minh Anh',
    email: 'minhanh.greenlife@gmail.com',
    phone: '0918765432',
    zaloPhone: '0918765432',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    province: 'Hồ Chí Minh',
    district: 'Quận 3',
    ward: 'Phường Võ Thị Sáu',
    trustScore: 95,
    totalTransactions: 17,
    rating: 4.8,
    reviewCount: 14,
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2023-08-19T14:15:00Z',
    blockedUserIds: [],
    bio: 'Thiết kế đồ họa tự do. Thích trao đổi máy ảnh film, sách nghệ thuật và các món đồ decor gỗ tự nhiên.',
  },
  {
    id: 'user-3',
    fullName: 'Quốc Huy',
    email: 'quochuy.tech@gmail.com',
    phone: '0982345671',
    zaloPhone: '0982345671',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    province: 'Hà Nội',
    district: 'Quận Cầu Giấy',
    ward: 'Phường Dịch Vọng Hậu',
    trustScore: 92,
    totalTransactions: 11,
    rating: 4.7,
    reviewCount: 9,
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2024-01-10T10:00:00Z',
    blockedUserIds: [],
    bio: 'Sinh viên năm cuối ĐHQG. Tìm kiếm đồ công nghệ bền bỉ, trao đổi phụ kiện laptop và sách chuyên ngành.',
  },
  {
    id: 'user-4',
    fullName: 'Lan Chi',
    email: 'lanchi.vintage@gmail.com',
    phone: '0935123987',
    zaloPhone: '0935123987',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    province: 'Thừa Thiên Huế',
    district: 'Thành phố Huế',
    ward: 'Phường Vĩnh Ninh',
    trustScore: 96,
    totalTransactions: 19,
    rating: 5.0,
    reviewCount: 18,
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2023-11-05T09:20:00Z',
    blockedUserIds: [],
    bio: 'Sưu tầm thời trang vintage vải đũi, linen tự nhiên. Lan tỏa tinh thần tiêu dùng tuần hoàn tại Cố đô.',
  },
  {
    id: 'user-5',
    fullName: 'Văn Kiệt',
    email: 'vankiet.baduser@gmail.com',
    phone: '0945999888',
    zaloPhone: '0945999888',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    province: 'Hồ Chí Minh',
    district: 'Quận Bình Thạnh',
    ward: 'Phường 25',
    trustScore: 68,
    totalTransactions: 4,
    rating: 3.2,
    reviewCount: 3,
    role: 'USER',
    status: 'LOCKED',
    lockedUntil: '2026-10-28T00:00:00Z',
    lockReason: 'Nhận 2 báo cáo bùng hẹn liên tiếp tại điểm hẹn công cộng mà không báo trước.',
    createdAt: '2024-05-18T16:00:00Z',
    blockedUserIds: [],
    bio: 'Tài khoản đang bị tạm khóa 30 ngày.',
  },
  {
    id: 'user-admin',
    fullName: 'Nguyễn Trọng Nghĩa',
    email: 'admin@reloop.vn',
    phone: '0909000111',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    province: 'Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    trustScore: 100,
    totalTransactions: 0,
    rating: 5.0,
    reviewCount: 0,
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2023-01-01T00:00:00Z',
    blockedUserIds: [],
    bio: 'Quản trị viên Hệ thống ReLoop Việt Nam.',
  }
];

export const mockCategories: Category[] = [
  {
    id: 'cat-tech',
    name: 'Đồ điện tử & Công nghệ',
    slug: 'do-dien-tu-cong-nghe',
    icon: 'Laptop',
    description: 'Máy tính, bàn phím cơ, máy ảnh, tai nghe và phụ kiện kỹ thuật số chất lượng tốt.',
    displayOrder: 1,
    isHidden: false,
    productCount: 42,
  },
  {
    id: 'cat-fashion',
    name: 'Thời trang & Vải sợi bền vững',
    slug: 'thoi-trang-ben-vung',
    icon: 'Shirt',
    description: 'Quần áo linen, đồ jean tái chế, áo khoác dạ vintage và túi vải organic canvas.',
    displayOrder: 2,
    isHidden: false,
    productCount: 56,
  },
  {
    id: 'cat-home',
    name: 'Nhà cửa & Nội thất xanh',
    slug: 'nha-cua-noi-that-xanh',
    icon: 'Home',
    description: 'Bàn ghế gỗ mộc, đèn trang trí mây tre đan, chậu gốm mộc và cây cảnh nội thất.',
    displayOrder: 3,
    isHidden: false,
    productCount: 38,
  },
  {
    id: 'cat-books',
    name: 'Sách & Tri thức tuần hoàn',
    slug: 'sach-tri-thuc-tuan-hoan',
    icon: 'BookOpen',
    description: 'Sách nghệ thuật, thiết kế, lối sống tối giản, văn học kinh điển và tạp chí lưu trữ.',
    displayOrder: 4,
    isHidden: false,
    productCount: 65,
  },
  {
    id: 'cat-sports',
    name: 'Thể thao & Dã ngoại Eco',
    slug: 'the-thao-da-ngoai-eco',
    icon: 'Bike',
    description: 'Xe đạp đường phố, lều trại dã ngoại, thảm yoga cao su tự nhiên và dụng cụ leo núi.',
    displayOrder: 5,
    isHidden: false,
    productCount: 29,
  },
  {
    id: 'cat-lifestyle',
    name: 'Đồ thủ công & Nghệ thuật',
    slug: 'do-thu-cong-nghe-thuat',
    icon: 'Palette',
    description: 'Đồ gốm nung mộc, tranh vẽ tái bản, đĩa than vinyl cổ điển và đồ trang trí thủ công.',
    displayOrder: 6,
    isHidden: false,
    productCount: 24,
  },
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Máy ảnh Mirrorless Fujifilm X-T20 kèm Lens 18-55mm F2.8-4 R LM OIS',
    description: 'Máy ảnh còn rất mới do mình chỉ dùng chụp vài chuyến đi thực địa. Cảm biến X-Trans CMOS III 24.3MP cho màu film Classic Chrome cực kỳ đẹp. Ngoại hình 98%, lens sạch không mốc rễ tre, đầy đủ pin sạc zin, dây đeo da thật và thẻ nhớ 64GB. Ưu tiên đổi lấy bàn phím cơ gõ văn phòng hoặc lens fix 35mm f2.',
    categoryId: 'cat-tech',
    condition: 'Còn tốt',
    type: 'BOTH',
    price: 13500000,
    originalPrice: 21000000,
    wantedExchangeItems: 'Bàn phím cơ Custom / Keychron Q series hoặc Lens Fujinon 35mm F2 (bù trừ thỏa thuận)',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80'
    ],
    location: {
      province: 'Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',
    },
    sellerId: 'user-1',
    status: 'AVAILABLE',
    views: 480,
    favoritesCount: 38,
    createdAt: '2026-09-20T09:00:00Z',
    updatedAt: '2026-09-20T09:00:00Z',
  },
  {
    id: 'prod-2',
    title: 'Bàn phím cơ không dây Keychron K2 V2 (Bản nhôm Led RGB - Hot-swap)',
    description: 'Bản khung nhôm cứng cáp, switch Gateron G Pro Brown êm ái thích hợp gõ code và văn phòng. Đầy đủ phụ kiện keycap cho cả MacOS và Windows, cáp bện Type-C, hộp nguyên vẹn. Máy dùng kỹ không tì vết, pin dùng liên tục hơn 2 tuần.',
    categoryId: 'cat-tech',
    condition: 'Mới 99%',
    type: 'BOTH',
    price: 1450000,
    originalPrice: 2250000,
    wantedExchangeItems: 'Đổi máy ảnh du lịch compact, loa di động Marshall hoặc tai nghe chống ồn Sony.',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80'
    ],
    location: {
      province: 'Hồ Chí Minh',
      district: 'Quận 3',
      ward: 'Phường Võ Thị Sáu',
    },
    sellerId: 'user-2',
    status: 'AVAILABLE',
    views: 295,
    favoritesCount: 27,
    createdAt: '2026-09-22T14:30:00Z',
    updatedAt: '2026-09-22T14:30:00Z',
  },
  {
    id: 'prod-3',
    title: 'Xe đạp Touring đường phố Giant Escape R3 Nhật bãi size M màu xanh rêu',
    description: 'Khung nhôm Aluxx siêu nhẹ và bền bỉ, bộ truyền động Shimano Altus 3x8 tốc độ chuyển số mượt mà. Đã bảo dưỡng tra dầu đầy đủ, lên cặp lốp chống đinh Kenda 700x28c và baga sau chở đồ picnic dã ngoại. Xe chạy êm ru, rất phù hợp đi làm hàng ngày hoặc phượt nhẹ cuối tuần.',
    categoryId: 'cat-sports',
    condition: 'Còn tốt',
    type: 'SELL',
    price: 4900000,
    originalPrice: 8500000,
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1000&q=80'
    ],
    location: {
      province: 'Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',
    },
    sellerId: 'user-1',
    status: 'AVAILABLE',
    views: 610,
    favoritesCount: 52,
    createdAt: '2026-09-18T11:15:00Z',
    updatedAt: '2026-09-18T11:15:00Z',
  },
  {
    id: 'prod-4',
    title: 'Áo khoác Blazer đũi Linen dáng suông thủ công phong cách Minimalist',
    description: 'Chất liệu 100% sợi đũi linen tự nhiên dệt tay thoáng khí, màu be cát tự nhiên không qua tẩy nhuộm công nghiệp hóa chất. Form suông oversize phù hợp cả nam và nữ (ngực 110cm, dài áo 74cm). Mới mặc 2 lần đi sự kiện triển lãm nghệ thuật.',
    categoryId: 'cat-fashion',
    condition: 'Mới 99%',
    type: 'EXCHANGE',
    wantedExchangeItems: 'Muốn đổi túi tote da vintage, khăn quàng lụa tơ tằm hoặc ấm trà gốm mộc Bát Tràng.',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=80'
    ],
    location: {
      province: 'Thừa Thiên Huế',
      district: 'Thành phố Huế',
      ward: 'Phường Vĩnh Ninh',
    },
    sellerId: 'user-4',
    status: 'AVAILABLE',
    views: 184,
    favoritesCount: 19,
    createdAt: '2026-09-24T08:00:00Z',
    updatedAt: '2026-09-24T08:00:00Z',
  },
  {
    id: 'prod-5',
    title: 'Ghế công thái học Ergonomic Sihoo M57 khung nhôm đệm lưới thoáng khí',
    description: 'Ghế ngồi làm việc chống gù lưng, bảo vệ cột sống cực tốt cho người ngồi máy tính nhiều. Đệm lưới nguyên khối đàn hồi cao cấp, kê tay 3D, piston class 4 nâng hạ mượt mà. Hàng mua chính hãng DANDIHOME còn nguyên tem và lục giác căn chỉnh.',
    categoryId: 'cat-home',
    condition: 'Còn tốt',
    type: 'BOTH',
    price: 2600000,
    originalPrice: 4200000,
    wantedExchangeItems: 'Đổi màn hình phụ di động 15.6 inch hoặc bàn nâng hạ chân kim loại.',
    images: [
      'https://images.unsplash.com/photo-1580481077191-c3be7662c114?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=1000&q=80'
    ],
    location: {
      province: 'Hà Nội',
      district: 'Quận Cầu Giấy',
      ward: 'Phường Dịch Vọng Hậu',
    },
    sellerId: 'user-3',
    status: 'AVAILABLE',
    views: 420,
    favoritesCount: 31,
    createdAt: '2026-09-21T16:20:00Z',
    updatedAt: '2026-09-21T16:20:00Z',
  },
  {
    id: 'prod-6',
    title: 'Combo 5 cuốn sách Lối Sống Tối Giản, Thiết Kế Bắc Âu & Nông Nghiệp Tự Nhiên',
    description: 'Bộ sách quý gồm: "Lối sống tối giản của người Nhật", "Cuộc cách mạng một cọng rơm - Masanobu Fukuoka", "Design of Everyday Things", "Wabi Sabi - Thương những điều không hoàn hảo", "Walden - Một mình sống trong rừng". Sách bìa mềm giữ gìn cẩn thận, không quăn mép hay gạch bút nhớ.',
    categoryId: 'cat-books',
    condition: 'Còn tốt',
    type: 'BOTH',
    price: 380000,
    originalPrice: 650000,
    wantedExchangeItems: 'Đổi lấy sách nhiếp ảnh, tiểu thuyết Haruki Murakami hoặc sổ tay giấy kraft tái chế.',
    images: [
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80'
    ],
    location: {
      province: 'Thừa Thiên Huế',
      district: 'Thành phố Huế',
      ward: 'Phường Vĩnh Ninh',
    },
    sellerId: 'user-4',
    status: 'AVAILABLE',
    views: 340,
    favoritesCount: 45,
    createdAt: '2026-09-19T10:40:00Z',
    updatedAt: '2026-09-19T10:40:00Z',
  },
  {
    id: 'prod-7',
    title: 'Loa Bluetooth Marshall Emberton II Chính Hãng Ash & Brass (Âm thanh đa hướng)',
    description: 'Loa nghe nhạc acoustic, jazz cực ấm. Chuẩn chống nước bụi IP67, pin trâu trên 30 tiếng liên tục. Bản kỷ niệm viền kim loại vàng đồng rất đẹp, có hộp cáp zin.',
    categoryId: 'cat-tech',
    condition: 'Mới 99%',
    type: 'SELL',
    price: 2850000,
    originalPrice: 4490000,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80'
    ],
    location: {
      province: 'Hồ Chí Minh',
      district: 'Quận 3',
      ward: 'Phường Võ Thị Sáu',
    },
    sellerId: 'user-2',
    status: 'RESERVED', // Currently on meetup appointment!
    views: 590,
    favoritesCount: 61,
    createdAt: '2026-09-15T15:00:00Z',
    updatedAt: '2026-09-25T10:00:00Z',
  },
  {
    id: 'prod-8',
    title: 'Cây Bàng Singapore nội thất cao 1.4m trồng chậu gốm mộc đất nung mộc',
    description: 'Cây đã thuần dưỡng rễ khỏe mạnh gần 2 năm trong nhà, lá to xanh mướt lọc không khí rất tốt. Tặng kèm đĩa lót gốm chống tràn nước sàn gỗ. Do chuyển nhà nên cần nhượng lại cho bạn nào yêu thiên nhiên.',
    categoryId: 'cat-home',
    condition: 'Còn tốt',
    type: 'SELL',
    price: 450000,
    originalPrice: 850000,
    images: [
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1000&q=80'
    ],
    location: {
      province: 'Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',
    },
    sellerId: 'user-1',
    status: 'COMPLETED', // Successfully exchanged/sold!
    views: 312,
    favoritesCount: 15,
    createdAt: '2026-09-10T09:00:00Z',
    updatedAt: '2026-09-17T18:00:00Z',
  },
  {
    id: 'prod-9',
    title: 'Đàn Guitar Acoustic Enya EGA X0 gỗ HPL chống nước kèm bao da dầy',
    description: 'Chất liệu sợi carbon composite và gỗ HPL chống va đập, không sợ ẩm mốc thời tiết nồm ẩm Việt Nam. Action thấp bấm êm tay không đau ngón, âm thanh vang sáng rõ ràng.',
    categoryId: 'cat-lifestyle',
    condition: 'Còn tốt',
    type: 'BOTH',
    price: 1950000,
    originalPrice: 3100000,
    wantedExchangeItems: 'Đổi máy chơi game Nintendo Switch Lite hoặc ống nhòm dã ngoại thiên văn.',
    images: [
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=1000&q=80'
    ],
    location: {
      province: 'Hà Nội',
      district: 'Quận Cầu Giấy',
      ward: 'Phường Dịch Vọng Hậu',
    },
    sellerId: 'user-3',
    status: 'AVAILABLE',
    views: 245,
    favoritesCount: 22,
    createdAt: '2026-09-23T11:00:00Z',
    updatedAt: '2026-09-23T11:00:00Z',
  },
  {
    id: 'prod-10',
    title: 'Rượu ngâm đặc sản thảo dược núi rừng hạ thổ 10 năm (Bài đăng có dấu hiệu vi phạm)',
    description: 'Bình rượu thuốc ngâm các loại củ rừng gia truyền, nồng độ cồn cao, giao lưu nhanh với anh em.',
    categoryId: 'cat-lifestyle',
    condition: 'Đã sử dụng nhiều',
    type: 'SELL',
    price: 800000,
    images: [
      'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1000&q=80'
    ],
    location: {
      province: 'Hồ Chí Minh',
      district: 'Quận Bình Thạnh',
      ward: 'Phường 25',
    },
    sellerId: 'user-5',
    status: 'LOCKED', // Flagged and locked by Admin due to prohibited item policy!
    views: 45,
    favoritesCount: 1,
    createdAt: '2026-09-24T14:00:00Z',
    updatedAt: '2026-09-25T08:30:00Z',
    flagProhibited: true,
    prohibitedKeywordFound: 'rượu cồn nồng độ cao',
  },
  {
    id: 'prod-11',
    title: 'Túi đeo chéo Canvas Vintage vải bạt tái chế dệt từ bao bì nông nghiệp sạch',
    description: 'Sản phẩm thủ công từ dự án tái chế vật liệu bền vững tại Hội An. Khóa đồng nguyên khối, ngăn chống sốc đựng vừa iPad Pro 11 inch và sổ tay. Càng dùng lâu vải càng lên vân patina cổ điển rất đẹp.',
    categoryId: 'cat-fashion',
    condition: 'Mới 99%',
    type: 'BOTH',
    price: 420000,
    originalPrice: 750000,
    wantedExchangeItems: 'Đổi lấy ví đựng thẻ da thảo mộc veg-tan hoặc bình giữ nhiệt Stanley.',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80'
    ],
    location: {
      province: 'Thừa Thiên Huế',
      district: 'Thành phố Huế',
      ward: 'Phường Vĩnh Ninh',
    },
    sellerId: 'user-4',
    status: 'HIDDEN', // Temporarily hidden by user
    views: 98,
    favoritesCount: 12,
    createdAt: '2026-09-12T13:00:00Z',
    updatedAt: '2026-09-22T09:00:00Z',
  }
];

export const mockBarterRequests: BarterRequest[] = [
  {
    id: 'barter-1',
    targetProductId: 'prod-1', // Hoang Nam's Fujifilm camera
    offeredProductId: 'prod-2', // Minh Anh's Keychron keyboard
    senderId: 'user-2', // Minh Anh
    receiverId: 'user-1', // Hoang Nam
    compensationAmount: 11500000, // Cash top-up
    note: 'Chào bạn Nam, mình rất thích chiếc Fuji X-T20 này. Mình gửi đề nghị đổi phím Keychron K2 V2 nhôm đẹp như mới kèm bù 11.500.000đ tiền mặt nhé. Rất mong được giao lưu trực tiếp tại cafe Quận 1!',
    status: 'ACCEPTED',
    createdAt: '2026-09-24T10:15:00Z',
    updatedAt: '2026-09-24T14:30:00Z',
  },
  {
    id: 'barter-2',
    targetProductId: 'prod-4', // Lan Chi's Linen Blazer
    offeredProductId: 'prod-6', // Combo 5 Books
    senderId: 'user-3', // Quoc Huy
    receiverId: 'user-4', // Lan Chi
    compensationAmount: 150000,
    note: 'Chào chị Lan Chi, em có combo sách tri thức xanh muốn đổi lấy chiếc áo blazer này. Em xin bù thêm 150k cho cân đối giá trị ạ.',
    status: 'PENDING',
    createdAt: '2026-09-25T09:00:00Z',
    updatedAt: '2026-09-25T09:00:00Z',
  },
  {
    id: 'barter-3',
    targetProductId: 'prod-1', // Hoang Nam's Fuji camera
    offeredProductId: 'prod-9', // Enya Guitar
    senderId: 'user-3', // Quoc Huy
    receiverId: 'user-1', // Hoang Nam
    compensationAmount: 10000000,
    note: 'Chào anh Nam, em gửi cây đàn guitar acoustic Enya bù 10 triệu để đổi máy ảnh được không anh?',
    status: 'ON_HOLD', // Another request accepted, so this is on hold!
    createdAt: '2026-09-24T11:00:00Z',
    updatedAt: '2026-09-24T14:30:00Z',
  }
];

export const mockBuyRequests: BuyRequest[] = [
  {
    id: 'buy-1',
    targetProductId: 'prod-3', // Giant Touring Bike
    senderId: 'user-2', // Minh Anh
    receiverId: 'user-1', // Hoang Nam
    offeredPrice: 4700000, // Offered lower than 4.9m
    note: 'Chào anh Nam, em bớt chút đỉnh 200k tiền xăng xe em qua tận nơi lấy luôn chiều nay được không anh?',
    meetupLocationPreference: 'Sảnh Diamond Plaza, Quận 1',
    status: 'PENDING',
    createdAt: '2026-09-25T11:20:00Z',
  }
];

export const mockTransactions: MeetupTransaction[] = [
  {
    id: 'tx-1',
    requestId: 'barter-1',
    requestType: 'BARTER',
    buyerId: 'user-2', // Minh Anh (initiator)
    sellerId: 'user-1', // Hoang Nam (listing owner)
    productId: 'prod-1',
    offeredProductId: 'prod-2',
    compensationAmount: 11500000,
    appointmentTime: '2026-09-30T14:30:00Z',
    appointmentLocation: 'The Coffee House, số 45 Lê Duẩn, Phường Bến Nghé, Quận 1, TP.HCM',
    buyerConfirmed: true, // Minh Anh has pressed confirm!
    sellerConfirmed: false, // Waiting for Hoang Nam to confirm
    status: 'APPOINTED',
    createdAt: '2026-09-24T14:30:00Z',
    updatedAt: '2026-09-25T15:00:00Z',
  },
  {
    id: 'tx-2',
    requestId: 'prev-tx-2',
    requestType: 'BARTER',
    buyerId: 'user-4',
    sellerId: 'user-1',
    productId: 'prod-8', // Cây bàng Singapore
    appointmentTime: '2026-09-17T15:00:00Z',
    appointmentLocation: 'Cổng trường Đại học Khoa học Tự nhiên, 227 Nguyễn Văn Cừ, Quận 5',
    buyerConfirmed: true,
    sellerConfirmed: true,
    status: 'COMPLETED',
    createdAt: '2026-09-16T10:00:00Z',
    updatedAt: '2026-09-17T16:30:00Z',
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    transactionId: 'tx-1',
    senderId: 'user-2',
    receiverId: 'user-1',
    content: 'Chào anh Nam, mình vừa gửi đề nghị đổi phím Keychron K2 kèm bù 11.5tr lấy chiếc máy ảnh Fuji X-T20 ạ.',
    timestamp: '2026-09-24T10:16:00Z',
    isRead: true,
  },
  {
    id: 'msg-2',
    transactionId: 'tx-1',
    senderId: 'user-1',
    receiverId: 'user-2',
    content: 'Chào bạn Minh Anh, chiếc bàn phím của bạn còn đầy đủ phụ kiện cap gắp phím và hộp không bạn?',
    timestamp: '2026-09-24T11:05:00Z',
    isRead: true,
  },
  {
    id: 'msg-3',
    transactionId: 'tx-1',
    senderId: 'user-2',
    receiverId: 'user-1',
    content: 'Dạ còn nguyên vẹn cả hộp và cáp bọc dù chính hãng anh nhé. Mình dùng văn phòng nên giữ rất kỹ ạ.',
    timestamp: '2026-09-24T11:15:00Z',
    isRead: true,
  },
  {
    id: 'msg-4',
    transactionId: 'tx-1',
    senderId: 'user-1',
    receiverId: 'user-2',
    content: 'Tuyệt vời. Mình đã bấm chấp nhận đề nghị. Mình hẹn gặp vào thứ Tư lúc 14:30 ở The Coffee House số 45 Lê Duẩn Quận 1 nhé, quán rộng và nhiều ánh sáng để test máy thoải mái.',
    timestamp: '2026-09-24T14:32:00Z',
    isRead: true,
  },
  {
    id: 'msg-5',
    transactionId: 'tx-1',
    senderId: 'user-2',
    receiverId: 'user-1',
    content: 'Dạ nhất trí anh, số Zalo mình là 0918765432, tới quán mình nhắn anh liền nhé!',
    timestamp: '2026-09-24T14:40:00Z',
    isRead: true,
  }
];

export const mockReviews: Review[] = [
  {
    id: 'rev-1',
    transactionId: 'tx-2',
    reviewerId: 'user-4',
    targetUserId: 'user-1',
    rating: 5,
    criteria: {
      punctuality: 5,
      courtesy: 5,
      accuracy: 5,
    },
    comment: 'Anh Nam rất đúng giờ và nhiệt tình! Cây bàng Singapore xanh tốt đúng y như hình đăng tải, anh còn chu đáo bọc bìa carton bảo vệ chậu gốm khi vận chuyển. Rất mong có dịp trao đổi thêm với anh!',
    createdAt: '2026-09-18T08:15:00Z',
  },
  {
    id: 'rev-2',
    transactionId: 'tx-2',
    reviewerId: 'user-1',
    targetUserId: 'user-4',
    rating: 5,
    criteria: {
      punctuality: 5,
      courtesy: 5,
      accuracy: 5,
    },
    comment: 'Bạn Lan Chi giao tiếp cực kỳ lịch sự, thanh toán nhanh gọn và trân trọng đồ cây xanh. 10/10 điểm uy tín!',
    createdAt: '2026-09-18T09:00:00Z',
  }
];

export const mockReports: Report[] = [
  {
    id: 'rep-1',
    reporterId: 'user-1',
    targetType: 'POST',
    targetId: 'prod-10',
    reason: 'Hàng cấm / Vi phạm pháp luật',
    description: 'Bài đăng rao bán rượu cồn nồng độ cao ngâm thảo dược không rõ tem mác nguồn gốc, vi phạm nghiêm trọng Điều 1 Danh mục hàng cấm của ReLoop.',
    evidenceImages: [
      'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'PROCESSED',
    createdAt: '2026-09-24T15:00:00Z',
    resolvedAt: '2026-09-25T08:30:00Z',
    resolutionNote: 'Đã khóa bài đăng prod-10 vĩnh viễn và khóa tài khoản người bán 30 ngày theo quy chế xử lý vi phạm.',
    actionTaken: 'LOCK_USER',
  },
  {
    id: 'rep-2',
    reporterId: 'user-2',
    targetType: 'USER',
    targetId: 'user-5',
    reason: 'Bùng hẹn / Không đến điểm hẹn',
    description: 'Thành viên Văn Kiệt hẹn gặp tại Highlands Coffee lúc 15h để đổi tai nghe nhưng không đến, gọi điện không bắt máy và chặn tin nhắn Zalo gây mất thời gian của đối tác.',
    evidenceImages: [
      'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'PENDING',
    createdAt: '2026-09-25T16:20:00Z',
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'OFFER',
    title: 'Đề nghị đổi đồ mới!',
    message: 'Minh Anh vừa gửi đề nghị đổi bàn phím Keychron K2 lấy máy ảnh Fujifilm X-T20 của bạn.',
    link: '/user/exchanges',
    isRead: false,
    createdAt: '2026-09-24T10:15:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'TRANSACTION',
    title: 'Nhắc nhở lịch hẹn gặp an toàn',
    message: 'Bạn có lịch hẹn gặp mặt tại The Coffee House (45 Lê Duẩn, Q.1) vào ngày 30/09 lúc 14:30.',
    link: '/user/transactions/tx-1',
    isRead: false,
    createdAt: '2026-09-25T08:00:00Z',
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'REVIEW',
    title: 'Nhận đánh giá 5 sao mới',
    message: 'Lan Chi đã gửi đánh giá 5 sao kèm nhận xét uy tín cho bạn sau giao dịch cây bàng.',
    link: '/user/reviews',
    isRead: true,
    createdAt: '2026-09-18T08:15:00Z',
  },
  {
    id: 'notif-4',
    userId: 'user-1',
    type: 'SYSTEM',
    title: 'Chào mừng đến với ReLoop!',
    message: 'Chúc mừng bạn đã hoàn thiện hồ sơ sinh thái và nhận 100 điểm uy tín khởi đầu.',
    link: '/user/profile',
    isRead: true,
    createdAt: '2026-09-01T00:00:00Z',
  }
];

export const mockSystemStats: SystemStats = {
  totalUsers: 1248,
  totalPosts: 3820,
  totalTransactions: 946,
  totalReports: 28,
  activeUsers: 890,
  successRate: 94.2,
  categoryDistribution: [
    { name: 'Đồ điện tử & Công nghệ', count: 1240, percentage: 32.5 },
    { name: 'Thời trang & Vải sợi', count: 980, percentage: 25.6 },
    { name: 'Sách & Tri thức', count: 650, percentage: 17.0 },
    { name: 'Nhà cửa & Nội thất xanh', count: 520, percentage: 13.6 },
    { name: 'Thể thao & Dã ngoại', count: 280, percentage: 7.3 },
    { name: 'Đồ thủ công & Nghệ thuật', count: 150, percentage: 4.0 },
  ],
  monthlyTrend: [
    { month: 'T4/2026', posts: 410, transactions: 110, users: 140 },
    { month: 'T5/2026', posts: 530, transactions: 145, users: 185 },
    { month: 'T6/2026', posts: 680, transactions: 190, users: 220 },
    { month: 'T7/2026', posts: 820, transactions: 240, users: 310 },
    { month: 'T8/2026', posts: 1150, transactions: 320, users: 430 },
    { month: 'T9/2026', posts: 1420, transactions: 410, users: 560 },
  ]
};

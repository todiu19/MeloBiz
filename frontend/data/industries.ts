export interface Industry {
  slug: string;
  number: string;
  name: string;
  featured?: boolean;
  hasDetail?: boolean;
  title: string;
  short: string;
  description: string;
  mood: string;
  genres: string[];
  accent: string;
  playlists: Array<{ name: string; mood: string; tracks: number }>;
  schedule: Array<{ time: string; label: string; sound: string }>;
  benefits: string[];
}

type CompactIndustrySeed = {
  slug: string;
  number: string;
  name: string;
  mood: string;
  genres: string[];
  accent: string;
  title?: string;
};

function createCompactIndustry(seed: CompactIndustrySeed): Industry {
  const short = `Playlist phù hợp với nhịp vận hành và cá tính của ${seed.name.toLowerCase()}.`;

  return {
    ...seed,
    featured: false,
    hasDetail: false,
    title: seed.title ?? `Nhạc phù hợp cho ${seed.name.toLowerCase()}`,
    short,
    description: `MeloBiz xây dựng không gian âm thanh riêng cho ${seed.name.toLowerCase()}, tự động thay đổi theo khung giờ, có quyền sử dụng rõ ràng và quản lý tập trung.`,
    playlists: [
      { name: "Gentle Opening", mood: "Đón khách", tracks: 36 },
      { name: "Daily Flow", mood: "Nhịp chính", tracks: 42 },
      { name: "Soft Closing", mood: "Cuối ngày", tracks: 34 },
    ],
    schedule: [
      { time: "08:00", label: "Mở cửa", sound: seed.genres[0] ?? "Chill nhẹ" },
      { time: "13:00", label: "Nhịp chính", sound: seed.genres[1] ?? "Modern lounge" },
      { time: "19:00", label: "Cuối ngày", sound: seed.genres[2] ?? "Soft ambient" },
    ],
    benefits: [
      "Quyền sử dụng rõ ràng",
      "Playlist theo không gian",
      "Quản lý nhiều điểm phát",
    ],
  };
}

export const industries: Industry[] = [
  {
    slug: "quan-ca-phe",
    number: "01",
    name: "Quán cà phê",
    title: "Nhạc cho quán cà phê có chất riêng",
    short: "Giữ nhịp vừa đủ để khách muốn ngồi lâu hơn.",
    description: "Từ buổi sáng nhẹ nhàng đến giờ cao điểm sôi động, MeloBiz giúp quán duy trì một bản sắc âm thanh nhất quán mà không cần nhân viên tự chọn từng bài.",
    mood: "Chậm & ấm",
    genres: ["Lo-fi", "Acoustic", "Jazz"],
    accent: "#ff8a65",
    playlists: [
      { name: "Morning Drip", mood: "Tươi sáng", tracks: 42 },
      { name: "Slow Afternoon", mood: "Tập trung", tracks: 38 },
      { name: "After Six", mood: "Ấm áp", tracks: 46 },
    ],
    schedule: [
      { time: "07:00", label: "Mở cửa", sound: "Acoustic nhẹ" },
      { time: "11:30", label: "Giờ trưa", sound: "Lo-fi có nhịp" },
      { time: "18:00", label: "Buổi tối", sound: "Jazz & soul" },
    ],
    benefits: ["Playlist theo khung giờ", "Âm lượng và năng lượng ổn định", "Không quảng cáo chen ngang"],
  },
  {
    slug: "nha-hang",
    number: "02",
    name: "Nhà hàng",
    title: "Âm nhạc nâng trải nghiệm bàn ăn",
    short: "Tinh tế, vừa đủ và không lấn át cuộc trò chuyện.",
    description: "Thiết kế nhịp âm thanh cho từng ca phục vụ, từ bữa trưa thư thái đến bữa tối sang trọng, đồng nhất với phong cách ẩm thực và không gian.",
    mood: "Tinh tế",
    genres: ["Lounge", "Classical", "Chill"],
    accent: "#d79a55",
    playlists: [
      { name: "Lunch & Light", mood: "Thanh thoát", tracks: 36 },
      { name: "Dinner Stories", mood: "Sang trọng", tracks: 44 },
      { name: "Late Table", mood: "Lounge", tracks: 32 },
    ],
    schedule: [
      { time: "10:30", label: "Chuẩn bị", sound: "Piano nhẹ" },
      { time: "12:00", label: "Bữa trưa", sound: "Bossa & jazz" },
      { time: "19:00", label: "Bữa tối", sound: "Lounge tinh tế" },
    ],
    benefits: ["Không gián đoạn trải nghiệm", "Phù hợp nhiều phong cách ẩm thực", "Quản lý đồng bộ nhiều chi nhánh"],
  },
  {
    slug: "spa-wellness",
    number: "03",
    name: "Spa & Wellness",
    title: "Đưa khách vào trạng thái thư giãn",
    short: "Âm thanh liền mạch cho một hành trình phục hồi.",
    description: "Những lớp âm thanh mềm, ít chuyển động đột ngột và được cân chỉnh năng lượng giúp khách thả lỏng từ sảnh chờ đến phòng trị liệu.",
    mood: "Thư giãn",
    genres: ["Ambient", "Nature", "Piano"],
    accent: "#73b9a0",
    playlists: [
      { name: "Soft Arrival", mood: "Đón khách", tracks: 35 },
      { name: "Deep Restore", mood: "Thư giãn sâu", tracks: 48 },
      { name: "Quiet Glow", mood: "Tĩnh tại", tracks: 40 },
    ],
    schedule: [
      { time: "08:00", label: "Đón khách", sound: "Piano & nature" },
      { time: "13:00", label: "Trị liệu", sound: "Deep ambient" },
      { time: "19:00", label: "Cuối ngày", sound: "Meditation" },
    ],
    benefits: ["Chuyển bài êm", "Không lời và ít cao trào", "Playlist dài, không lặp nhanh"],
  },
  {
    slug: "phong-gym",
    number: "04",
    name: "Phòng gym",
    title: "Giữ năng lượng cho từng nhịp tập",
    short: "Nhịp mạnh đúng lúc, bền bỉ suốt ca vận hành.",
    description: "Playlist được chia theo cường độ và khung giờ giúp phòng tập luôn có năng lượng, từ warm-up buổi sáng đến peak hour buổi tối.",
    mood: "Năng lượng",
    genres: ["EDM", "Pop", "Workout"],
    accent: "#7fa7ed",
    playlists: [
      { name: "First Rep", mood: "Khởi động", tracks: 34 },
      { name: "Peak Mode", mood: "Cường độ cao", tracks: 50 },
      { name: "Cool Down", mood: "Hạ nhịp", tracks: 30 },
    ],
    schedule: [
      { time: "05:30", label: "Early crew", sound: "Pop workout" },
      { time: "17:30", label: "Peak hour", sound: "EDM high energy" },
      { time: "21:00", label: "Hạ nhịp", sound: "Future bass" },
    ],
    benefits: ["Chọn playlist theo BPM", "Năng lượng ổn định", "Phù hợp lớp nhóm và sàn tập"],
  },
  {
    slug: "khach-san",
    number: "05",
    name: "Khách sạn",
    title: "Một bản sắc âm thanh xuyên suốt",
    short: "Từ sảnh đến nhà hàng, mọi điểm chạm đều đồng nhất.",
    description: "Thiết lập cá tính âm thanh riêng cho từng khu vực nhưng vẫn giữ cùng tinh thần thương hiệu trên toàn bộ hành trình lưu trú.",
    mood: "Thanh lịch",
    genres: ["Elegant", "Piano", "Lounge"],
    accent: "#b698d4",
    playlists: [
      { name: "Lobby Signature", mood: "Chào đón", tracks: 45 },
      { name: "Poolside Ease", mood: "Thư thái", tracks: 38 },
      { name: "Night Concierge", mood: "Tinh tế", tracks: 36 },
    ],
    schedule: [
      { time: "06:30", label: "Breakfast", sound: "Acoustic elegant" },
      { time: "14:00", label: "Check-in", sound: "Signature lounge" },
      { time: "21:00", label: "Night mood", sound: "Soft piano" },
    ],
    benefits: ["Nhiều khu vực trong một hệ thống", "Âm thanh theo nhận diện thương hiệu", "Lịch phát tự động"],
  },
  {
    slug: "cua-hang-ban-le",
    number: "06",
    name: "Cửa hàng bán lẻ",
    title: "Tạo nhịp mua sắm đúng với thương hiệu",
    short: "Âm nhạc giúp khách bước vào đúng mood của bộ sưu tập.",
    description: "Từ boutique thời trang đến chuỗi bán lẻ, playlist được điều chỉnh theo tệp khách hàng, mùa chiến dịch và tốc độ mua sắm mong muốn.",
    mood: "Tươi mới",
    genres: ["Indie", "Pop", "Seasonal"],
    accent: "#ef7da6",
    playlists: [
      { name: "New Collection", mood: "Trẻ trung", tracks: 40 },
      { name: "Weekend Traffic", mood: "Sôi động", tracks: 46 },
      { name: "Soft Closing", mood: "Dễ chịu", tracks: 32 },
    ],
    schedule: [
      { time: "09:00", label: "Mở cửa", sound: "Indie pop" },
      { time: "15:00", label: "Đông khách", sound: "Upbeat pop" },
      { time: "20:30", label: "Cuối ngày", sound: "Soft electronic" },
    ],
    benefits: ["Cập nhật theo mùa", "Không lặp quảng cáo", "Đồng nhất toàn chuỗi"],
  },
  createCompactIndustry({
    slug: "quan-bar-lounge",
    number: "07",
    name: "Quán bar & lounge",
    mood: "Cuốn hút",
    genres: ["Lounge", "Soul", "Electronic"],
    accent: "#bf7b64",
  }),
  createCompactIndustry({
    slug: "salon-toc",
    number: "08",
    name: "Salon tóc",
    mood: "Thời thượng",
    genres: ["Pop", "R&B", "Chill"],
    accent: "#c995a1",
  }),
  createCompactIndustry({
    slug: "sieu-thi",
    number: "09",
    name: "Siêu thị",
    mood: "Thân thiện",
    genres: ["Easy pop", "Acoustic", "Seasonal"],
    accent: "#b99b63",
  }),
  createCompactIndustry({
    slug: "trung-tam-thuong-mai",
    number: "10",
    name: "Trung tâm thương mại",
    mood: "Hiện đại",
    genres: ["Pop", "Lounge", "Seasonal"],
    accent: "#a7826b",
  }),
  createCompactIndustry({
    slug: "phong-kham",
    number: "11",
    name: "Phòng khám",
    mood: "An tâm",
    genres: ["Piano", "Ambient", "Acoustic"],
    accent: "#8cac9d",
  }),
  createCompactIndustry({
    slug: "nha-khoa",
    number: "12",
    name: "Nha khoa",
    mood: "Nhẹ nhàng",
    genres: ["Ambient", "Piano", "Nature"],
    accent: "#93aaa5",
  }),
  createCompactIndustry({
    slug: "showroom-o-to",
    number: "13",
    name: "Showroom ô tô",
    mood: "Cao cấp",
    genres: ["Electronic", "Lounge", "Modern"],
    accent: "#8c8780",
  }),
  createCompactIndustry({
    slug: "van-phong",
    number: "14",
    name: "Văn phòng",
    mood: "Tập trung",
    genres: ["Lo-fi", "Ambient", "Instrumental"],
    accent: "#9b927c",
  }),
  createCompactIndustry({
    slug: "quan-nhau",
    number: "15",
    name: "Quán nhậu",
    mood: "Rộn ràng",
    genres: ["Pop", "Rock", "V-Pop"],
    accent: "#c27c55",
  }),
  createCompactIndustry({
    slug: "khu-vui-choi",
    number: "16",
    name: "Khu vui chơi",
    mood: "Vui tươi",
    genres: ["Happy pop", "Kids", "Upbeat"],
    accent: "#d09a63",
  }),
  createCompactIndustry({
    slug: "san-bay",
    number: "17",
    name: "Sân bay",
    mood: "Thư thái",
    genres: ["Ambient", "Piano", "World"],
    accent: "#899b9c",
  }),
  createCompactIndustry({
    slug: "phong-tra",
    number: "18",
    name: "Phòng trà & lounge",
    mood: "Sâu lắng",
    genres: ["Jazz", "Acoustic", "Soul"],
    accent: "#a27360",
  }),
];

export function getIndustry(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}

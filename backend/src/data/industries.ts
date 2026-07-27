import type {
  Industry,
  IndustryFaq,
  IndustryGroup,
  IndustryPlaylist,
  IndustryScheduleItem,
} from "../domain/industry.js";

const now = "2026-07-27T00:00:00.000Z";

const sharedFaqs: IndustryFaq[] = [
  {
    question: "Gói nhạc có bao gồm quyền phát tại điểm kinh doanh không?",
    answer: "Có. Giấy phép được cấp cho điểm kinh doanh đã đăng ký và có thể tra cứu công khai theo mã.",
  },
  {
    question: "Có thể đổi playlist theo khung giờ không?",
    answer: "Có. Doanh nghiệp có thể chọn thủ công hoặc thiết lập lịch phát tự động theo từng thời điểm.",
  },
  {
    question: "Một tài khoản quản lý được nhiều chi nhánh không?",
    answer: "Có. Chủ doanh nghiệp quản lý tập trung điểm phát, thành viên, lịch sử phát và trạng thái gói.",
  },
];

type DetailedSeed = {
  slug: string;
  name: string;
  group: IndustryGroup;
  sortOrder: number;
  headline: string;
  excerpt: string;
  description: string;
  mood: string;
  accent: string;
  genres: string[];
  playlists: Array<[string, string, number, "low" | "medium" | "high"]>;
  schedule: Array<[string, string, string, string, "low" | "medium" | "high"]>;
  benefits: string[];
};

function createDetailedIndustry(seed: DetailedSeed): Industry {
  const playlists: IndustryPlaylist[] = seed.playlists.map(
    ([name, mood, trackCount, energy], index) => ({
      id: `${seed.slug}-playlist-${index + 1}`,
      name,
      mood,
      description: `${mood} được biên tập riêng cho ${seed.name.toLowerCase()}.`,
      genres: seed.genres,
      trackCount,
      energy,
    }),
  );

  const schedule: IndustryScheduleItem[] = seed.schedule.map(
    ([time, label, playlistName, sound, energy]) => ({
      time,
      label,
      playlistId:
        playlists.find((playlist) => playlist.name === playlistName)?.id ??
        playlists[0]?.id ??
        "",
      sound,
      energy,
    }),
  );

  return {
    id: `industry-${seed.sortOrder}`,
    slug: seed.slug,
    name: seed.name,
    group: seed.group,
    sortOrder: seed.sortOrder,
    featured: true,
    active: true,
    hasDetail: true,
    headline: seed.headline,
    excerpt: seed.excerpt,
    description: seed.description,
    mood: seed.mood,
    accent: seed.accent,
    coverImage: "/images/business-spaces-hero.png",
    genres: seed.genres,
    playlists,
    schedule,
    benefits: seed.benefits,
    faqs: sharedFaqs,
    seo: {
      title: `Nhạc bản quyền cho ${seed.name} | MeloBiz`,
      description: seed.description,
      keywords: [
        `nhạc cho ${seed.name.toLowerCase()}`,
        `nhạc bản quyền ${seed.name.toLowerCase()}`,
        ...seed.genres.map((genre) => genre.toLowerCase()),
      ],
    },
    createdAt: now,
    updatedAt: now,
  };
}

function createCompactIndustry(
  slug: string,
  name: string,
  group: IndustryGroup,
  sortOrder: number,
): Industry {
  const description = `Giải pháp nhạc bản quyền và playlist tuyển chọn cho ${name.toLowerCase()}, có chứng từ và quản lý tập trung.`;
  return {
    id: `industry-${sortOrder}`,
    slug,
    name,
    group,
    sortOrder,
    featured: false,
    active: true,
    hasDetail: false,
    headline: `Nhạc phù hợp cho ${name.toLowerCase()}`,
    excerpt: description,
    description,
    mood: "Theo thương hiệu",
    accent: "#9bcbb8",
    coverImage: null,
    genres: [],
    playlists: [],
    schedule: [],
    benefits: [
      "Quyền sử dụng rõ ràng",
      "Playlist theo không gian",
      "Quản lý nhiều điểm phát",
    ],
    faqs: sharedFaqs,
    seo: {
      title: `Nhạc bản quyền cho ${name} | MeloBiz`,
      description,
      keywords: [`nhạc cho ${name.toLowerCase()}`, "nhạc bản quyền doanh nghiệp"],
    },
    createdAt: now,
    updatedAt: now,
  };
}

export const industries: Industry[] = [
  createDetailedIndustry({
    slug: "quan-ca-phe",
    name: "Quán cà phê",
    group: "hospitality",
    sortOrder: 1,
    headline: "Nhạc cho quán cà phê có chất riêng",
    excerpt: "Giữ nhịp vừa đủ để khách muốn ngồi lâu hơn.",
    description: "Từ buổi sáng nhẹ nhàng đến giờ cao điểm sôi động, MeloBiz giúp quán duy trì một bản sắc âm thanh nhất quán mà không cần nhân viên tự chọn từng bài.",
    mood: "Chậm & ấm",
    accent: "#ff8a65",
    genres: ["Lo-fi", "Acoustic", "Jazz"],
    playlists: [
      ["Morning Drip", "Tươi sáng", 42, "low"],
      ["Slow Afternoon", "Tập trung", 38, "medium"],
      ["After Six", "Ấm áp", 46, "medium"],
    ],
    schedule: [
      ["07:00", "Mở cửa", "Morning Drip", "Acoustic nhẹ", "low"],
      ["11:30", "Giờ trưa", "Slow Afternoon", "Lo-fi có nhịp", "medium"],
      ["18:00", "Buổi tối", "After Six", "Jazz & soul", "medium"],
    ],
    benefits: ["Playlist theo khung giờ", "Âm lượng và năng lượng ổn định", "Không quảng cáo chen ngang"],
  }),
  createDetailedIndustry({
    slug: "nha-hang",
    name: "Nhà hàng",
    group: "hospitality",
    sortOrder: 2,
    headline: "Âm nhạc nâng trải nghiệm bàn ăn",
    excerpt: "Tinh tế, vừa đủ và không lấn át cuộc trò chuyện.",
    description: "Thiết kế nhịp âm thanh cho từng ca phục vụ, từ bữa trưa thư thái đến bữa tối sang trọng, đồng nhất với phong cách ẩm thực và không gian.",
    mood: "Tinh tế",
    accent: "#d79a55",
    genres: ["Lounge", "Classical", "Chill"],
    playlists: [
      ["Lunch & Light", "Thanh thoát", 36, "low"],
      ["Dinner Stories", "Sang trọng", 44, "medium"],
      ["Late Table", "Lounge", 32, "low"],
    ],
    schedule: [
      ["10:30", "Chuẩn bị", "Lunch & Light", "Piano nhẹ", "low"],
      ["12:00", "Bữa trưa", "Lunch & Light", "Bossa & jazz", "medium"],
      ["19:00", "Bữa tối", "Dinner Stories", "Lounge tinh tế", "medium"],
    ],
    benefits: ["Không gián đoạn trải nghiệm", "Phù hợp nhiều phong cách ẩm thực", "Quản lý đồng bộ nhiều chi nhánh"],
  }),
  createDetailedIndustry({
    slug: "spa-wellness",
    name: "Spa & Wellness",
    group: "wellness",
    sortOrder: 3,
    headline: "Đưa khách vào trạng thái thư giãn",
    excerpt: "Âm thanh liền mạch cho một hành trình phục hồi.",
    description: "Những lớp âm thanh mềm, ít chuyển động đột ngột và được cân chỉnh năng lượng giúp khách thả lỏng từ sảnh chờ đến phòng trị liệu.",
    mood: "Thư giãn",
    accent: "#73b9a0",
    genres: ["Ambient", "Nature", "Piano"],
    playlists: [
      ["Soft Arrival", "Đón khách", 35, "low"],
      ["Deep Restore", "Thư giãn sâu", 48, "low"],
      ["Quiet Glow", "Tĩnh tại", 40, "low"],
    ],
    schedule: [
      ["08:00", "Đón khách", "Soft Arrival", "Piano & nature", "low"],
      ["13:00", "Trị liệu", "Deep Restore", "Deep ambient", "low"],
      ["19:00", "Cuối ngày", "Quiet Glow", "Meditation", "low"],
    ],
    benefits: ["Chuyển bài êm", "Không lời và ít cao trào", "Playlist dài, không lặp nhanh"],
  }),
  createDetailedIndustry({
    slug: "phong-gym",
    name: "Phòng gym",
    group: "fitness",
    sortOrder: 4,
    headline: "Giữ năng lượng cho từng nhịp tập",
    excerpt: "Nhịp mạnh đúng lúc, bền bỉ suốt ca vận hành.",
    description: "Playlist được chia theo cường độ và khung giờ giúp phòng tập luôn có năng lượng, từ warm-up buổi sáng đến peak hour buổi tối.",
    mood: "Năng lượng",
    accent: "#7fa7ed",
    genres: ["EDM", "Pop", "Workout"],
    playlists: [
      ["First Rep", "Khởi động", 34, "medium"],
      ["Peak Mode", "Cường độ cao", 50, "high"],
      ["Cool Down", "Hạ nhịp", 30, "low"],
    ],
    schedule: [
      ["05:30", "Early crew", "First Rep", "Pop workout", "medium"],
      ["17:30", "Peak hour", "Peak Mode", "EDM high energy", "high"],
      ["21:00", "Hạ nhịp", "Cool Down", "Future bass", "low"],
    ],
    benefits: ["Chọn playlist theo BPM", "Năng lượng ổn định", "Phù hợp lớp nhóm và sàn tập"],
  }),
  createDetailedIndustry({
    slug: "khach-san",
    name: "Khách sạn",
    group: "hospitality",
    sortOrder: 5,
    headline: "Một bản sắc âm thanh xuyên suốt",
    excerpt: "Từ sảnh đến nhà hàng, mọi điểm chạm đều đồng nhất.",
    description: "Thiết lập cá tính âm thanh riêng cho từng khu vực nhưng vẫn giữ cùng tinh thần thương hiệu trên toàn bộ hành trình lưu trú.",
    mood: "Thanh lịch",
    accent: "#b698d4",
    genres: ["Elegant", "Piano", "Lounge"],
    playlists: [
      ["Lobby Signature", "Chào đón", 45, "low"],
      ["Poolside Ease", "Thư thái", 38, "medium"],
      ["Night Concierge", "Tinh tế", 36, "low"],
    ],
    schedule: [
      ["06:30", "Breakfast", "Lobby Signature", "Acoustic elegant", "low"],
      ["14:00", "Check-in", "Lobby Signature", "Signature lounge", "medium"],
      ["21:00", "Night mood", "Night Concierge", "Soft piano", "low"],
    ],
    benefits: ["Nhiều khu vực trong một hệ thống", "Âm thanh theo nhận diện thương hiệu", "Lịch phát tự động"],
  }),
  createDetailedIndustry({
    slug: "cua-hang-ban-le",
    name: "Cửa hàng bán lẻ",
    group: "retail",
    sortOrder: 6,
    headline: "Tạo nhịp mua sắm đúng với thương hiệu",
    excerpt: "Âm nhạc giúp khách bước vào đúng mood của bộ sưu tập.",
    description: "Từ boutique thời trang đến chuỗi bán lẻ, playlist được điều chỉnh theo tệp khách hàng, mùa chiến dịch và tốc độ mua sắm mong muốn.",
    mood: "Tươi mới",
    accent: "#ef7da6",
    genres: ["Indie", "Pop", "Seasonal"],
    playlists: [
      ["New Collection", "Trẻ trung", 40, "medium"],
      ["Weekend Traffic", "Sôi động", 46, "high"],
      ["Soft Closing", "Dễ chịu", 32, "low"],
    ],
    schedule: [
      ["09:00", "Mở cửa", "New Collection", "Indie pop", "medium"],
      ["15:00", "Đông khách", "Weekend Traffic", "Upbeat pop", "high"],
      ["20:30", "Cuối ngày", "Soft Closing", "Soft electronic", "low"],
    ],
    benefits: ["Cập nhật theo mùa", "Không lặp quảng cáo", "Đồng nhất toàn chuỗi"],
  }),
  createCompactIndustry("quan-bar-lounge", "Quán bar & lounge", "entertainment", 7),
  createCompactIndustry("salon-toc", "Salon tóc", "wellness", 8),
  createCompactIndustry("sieu-thi", "Siêu thị", "retail", 9),
  createCompactIndustry("trung-tam-thuong-mai", "Trung tâm thương mại", "retail", 10),
  createCompactIndustry("phong-kham", "Phòng khám", "healthcare", 11),
  createCompactIndustry("nha-khoa", "Nha khoa", "healthcare", 12),
  createCompactIndustry("showroom-o-to", "Showroom ô tô", "retail", 13),
  createCompactIndustry("van-phong", "Văn phòng", "workplace", 14),
  createCompactIndustry("quan-nhau", "Quán nhậu", "hospitality", 15),
  createCompactIndustry("khu-vui-choi", "Khu vui chơi", "entertainment", 16),
  createCompactIndustry("san-bay", "Sân bay", "transport", 17),
  createCompactIndustry("phong-tra", "Phòng trà & lounge", "entertainment", 18),
];

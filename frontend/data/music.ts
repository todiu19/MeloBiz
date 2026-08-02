export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  genre: string;
  mood: string;
  cover: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  trackIds: string[];
  cover: string;
}

export const musicTracks: MusicTrack[] = [
  { id: "morning-window", title: "Morning by the Window", artist: "Melo Collective", duration: "3:24", genre: "Acoustic", mood: "Tươi sáng", cover: "linear-gradient(145deg, #dca568, #76533e)" },
  { id: "slow-pour", title: "Slow Pour", artist: "An Nhiên", duration: "2:58", genre: "Lo-fi", mood: "Thư giãn", cover: "linear-gradient(145deg, #849b87, #34453c)" },
  { id: "little-balcony", title: "Little Balcony", artist: "The Paper Cups", duration: "3:41", genre: "Indie", mood: "Ấm áp", cover: "linear-gradient(145deg, #c77b61, #5e3440)" },
  { id: "quiet-conversations", title: "Quiet Conversations", artist: "Mai & Friends", duration: "4:06", genre: "Jazz", mood: "Tinh tế", cover: "linear-gradient(145deg, #bea56f, #514737)" },
  { id: "after-the-rain", title: "After the Rain", artist: "Dịu Dàng", duration: "3:18", genre: "Piano", mood: "Nhẹ nhàng", cover: "linear-gradient(145deg, #7e9eaf, #394d62)" },
  { id: "city-lights", title: "City Lights, Soft Nights", artist: "Luma", duration: "3:35", genre: "Lounge", mood: "Hiện đại", cover: "linear-gradient(145deg, #846f9e, #392f4e)" },
  { id: "golden-hour", title: "Golden Hour Service", artist: "Melo Collective", duration: "2:47", genre: "Soul", mood: "Rộn ràng", cover: "linear-gradient(145deg, #d99b55, #73442d)" },
  { id: "soft-closing", title: "Soft Closing", artist: "An Nhiên", duration: "4:12", genre: "Ambient", mood: "Tĩnh tại", cover: "linear-gradient(145deg, #668c83, #283e3b)" },
  { id: "table-for-two", title: "Table for Two", artist: "Blue Lantern", duration: "3:52", genre: "Bossa", mood: "Lãng mạn", cover: "linear-gradient(145deg, #b66f64, #4d3034)" },
  { id: "easy-sunday", title: "Easy Sunday", artist: "The Paper Cups", duration: "3:09", genre: "Acoustic", mood: "Dễ chịu", cover: "linear-gradient(145deg, #d3bd7c, #666149)" },
];

export const musicPlaylists: MusicPlaylist[] = [
  { id: "morning-cafe", title: "Morning Cafe", subtitle: "Buổi sáng · 42 bài", description: "Acoustic và lo-fi vừa đủ tươi để mở cửa một ngày mới.", trackIds: ["morning-window", "slow-pour", "easy-sunday", "after-the-rain"], cover: "linear-gradient(155deg, #edc997 0%, #a96f4d 52%, #4e372d 100%)" },
  { id: "slow-afternoon", title: "Slow Afternoon", subtitle: "Buổi chiều · 38 bài", description: "Giữ không gian tập trung nhưng vẫn mềm mại và dễ trò chuyện.", trackIds: ["slow-pour", "little-balcony", "quiet-conversations", "table-for-two"], cover: "linear-gradient(155deg, #a8b8a3 0%, #627962 55%, #30443b 100%)" },
  { id: "dinner-stories", title: "Dinner Stories", subtitle: "Bữa tối · 44 bài", description: "Jazz, bossa và lounge tinh tế cho những cuộc trò chuyện dài.", trackIds: ["quiet-conversations", "table-for-two", "city-lights", "golden-hour"], cover: "linear-gradient(155deg, #c58a76 0%, #75464a 55%, #352735 100%)" },
  { id: "deep-restore", title: "Deep Restore", subtitle: "Thư giãn · 48 bài", description: "Piano và ambient liền mạch cho spa và không gian chăm sóc.", trackIds: ["after-the-rain", "soft-closing", "slow-pour"], cover: "linear-gradient(155deg, #9eb9b0 0%, #55796f 55%, #28433f 100%)" },
  { id: "retail-flow", title: "Retail Flow", subtitle: "Cửa hàng · 46 bài", description: "Nhịp pop và indie hiện đại, tạo năng lượng mua sắm tự nhiên.", trackIds: ["little-balcony", "golden-hour", "city-lights", "easy-sunday"], cover: "linear-gradient(155deg, #dab0bd 0%, #a65f79 52%, #523044 100%)" },
  { id: "late-lounge", title: "Late Lounge", subtitle: "Cuối ngày · 36 bài", description: "Một lớp âm thanh trầm ấm để khép lại ngày vận hành.", trackIds: ["city-lights", "soft-closing", "table-for-two"], cover: "linear-gradient(155deg, #aa9cbf 0%, #625778 52%, #302d46 100%)" },
];

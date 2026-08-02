"use client";

import "@/styles/music-app.css";
import { useEffect, useMemo, useState } from "react";
import { musicPlaylists, musicTracks, type MusicPlaylist, type MusicTrack } from "@/data/music";
import { getCurrentUser, logout } from "@/services/auth";
import type { CurrentUser } from "@/types/auth";

type AppView = "discover" | "tracks" | "playlists" | "artists" | "genres" | "moods" | "library" | "history";

const navigation: Array<{ id: AppView; icon: string; label: string }> = [
  { id: "discover", icon: "✦", label: "Khám phá" },
  { id: "tracks", icon: "♫", label: "Bài hát" },
  { id: "playlists", icon: "▤", label: "Danh sách phát" },
  { id: "artists", icon: "◉", label: "Nghệ sĩ" },
  { id: "genres", icon: "⌁", label: "Thể loại" },
  { id: "moods", icon: "◡", label: "Tâm trạng" },
  { id: "library", icon: "▥", label: "Thư viện" },
  { id: "history", icon: "↶", label: "Lịch sử phát" },
];

function Cover({ value, label, small = false }: { value: string; label: string; small?: boolean }) {
  return <span className={`music-cover${small ? " small" : ""}`} style={{ background: value }}><i>♪</i><b>{label.slice(0, 2).toUpperCase()}</b></span>;
}

function AccountContent({
  loading,
  message,
  onLogout,
  user,
}: {
  loading: boolean;
  message: string;
  onLogout: () => Promise<void>;
  user: CurrentUser | null;
}) {
  if (loading && !user) {
    return <section className="player-account-state"><span>♪</span><p>Đang tải thông tin tài khoản...</p></section>;
  }

  if (!user) {
    return (
      <section className="player-account-state">
        <span>◎</span>
        <small>TÀI KHOẢN MELOBIZ</small>
        <h1>Đăng nhập để đồng bộ<br />không gian của bạn.</h1>
        <p>{message || "Bạn vẫn có thể nghe thử MeloBiz mà không cần đăng nhập."}</p>
        <div><a href="/dang-nhap">Đăng nhập <b>→</b></a><a className="soft" href="/app">Tiếp tục nghe thử</a></div>
      </section>
    );
  }

  return (
    <section className="player-account">
      <div className="player-account-heading">
        <div><small>TÀI KHOẢN & DOANH NGHIỆP</small><h1>Không gian của bạn</h1><p>Quản lý danh tính đăng nhập và doanh nghiệp đang sử dụng MeloBiz.</p></div>
        <div className="player-account-identity"><span>{user.name.trim().charAt(0).toUpperCase()}</span><div><strong>{user.name}</strong><small>{user.email}</small></div></div>
      </div>

      <div className="player-account-grid">
        <article className="player-account-card">
          <span className="player-account-label">THÔNG TIN CÁ NHÂN</span>
          <dl>
            <div><dt>Họ và tên</dt><dd>{user.name}</dd></div>
            <div><dt>Email đăng nhập</dt><dd>{user.email}</dd></div>
            <div><dt>Ngày tạo tài khoản</dt><dd>{new Intl.DateTimeFormat("vi-VN").format(new Date(user.createdAt))}</dd></div>
          </dl>
        </article>

        <article className="player-account-card player-business-card">
          <span className="player-account-label">DOANH NGHIỆP</span>
          <div className="player-business-mark">MB</div>
          <h2>{user.businessName}</h2>
          <p>Playlist, địa điểm phát và giấy phép được quản lý theo doanh nghiệp này.</p>
          <a href="/app">Mở trình phát <span>→</span></a>
        </article>

        <article className="player-security-card">
          <div><span className="player-account-label">BẢO MẬT</span><h2>Phiên đăng nhập an toàn</h2></div>
          <p>MeloBiz dùng cookie HttpOnly và không lưu mật khẩu của bạn.</p>
          <button disabled={loading} onClick={() => void onLogout()} type="button">{loading ? "Đang xử lý..." : "Đăng xuất"}<span>→</span></button>
          {message && <div className="player-account-message">{message}</div>}
        </article>
      </div>
    </section>
  );
}

export function MusicApp({ page = "player" }: { page?: "player" | "account" }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [accountMessage, setAccountMessage] = useState("");
  const [view, setView] = useState<AppView>("discover");
  const [query, setQuery] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState<MusicPlaylist | null>(null);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(musicTracks[0]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(28);

  useEffect(() => {
    void getCurrentUser()
      .then(setUser)
      .catch((error: Error) => {
        setUser(null);
        setAccountMessage(error.message);
      })
      .finally(() => setUserLoading(false));
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setProgress((value) => value >= 100 ? 0 : value + 0.35), 500);
    return () => window.clearInterval(timer);
  }, [playing]);

  const visibleTracks = useMemo(() => {
    const source = selectedPlaylist
      ? musicTracks.filter((track) => selectedPlaylist.trackIds.includes(track.id))
      : musicTracks;
    const normalized = query.trim().toLocaleLowerCase("vi");
    return normalized
      ? source.filter((track) => `${track.title} ${track.artist} ${track.genre} ${track.mood}`.toLocaleLowerCase("vi").includes(normalized))
      : source;
  }, [query, selectedPlaylist]);

  function playTrack(track: MusicTrack) {
    setCurrentTrack(track);
    setProgress(0);
    setPlaying(true);
  }

  function openView(nextView: AppView) {
    if (page === "account") {
      window.location.href = `/app?view=${nextView}`;
      return;
    }
    setView(nextView);
    setSelectedPlaylist(null);
  }

  async function handleLogout() {
    setUserLoading(true);
    setAccountMessage("");
    try {
      await logout();
      window.location.href = "/app";
    } catch (error) {
      setAccountMessage((error as Error).message);
      setUserLoading(false);
    }
  }

  const pageTitle = selectedPlaylist?.title ?? navigation.find((item) => item.id === view)?.label ?? "Khám phá";

  return (
    <main className="music-app">
      <aside className="music-sidebar">
        <a className="music-logo" href="/app"><span>♪</span><b>Melo<i>Biz</i></b></a>
        <nav>
          {navigation.map((item) => (
            <button className={view === item.id && !selectedPlaylist ? "active" : ""} key={item.id} onClick={() => openView(item.id)} type="button">
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-secondary">
          <a href="/"><span>ⓘ</span><div><strong>Giới thiệu</strong></div></a>
          <a href="mailto:tonguyen191224@gmail.com"><span>✉</span><div><strong>Liên hệ hỗ trợ</strong></div></a>
        </div>
        <div className={`sidebar-business${user ? "" : " guest"}`}>
          <small>{user ? "ĐANG PHÁT CHO" : "CHẾ ĐỘ KHÁCH"}</small>
          <strong>{user?.businessName ?? "Nghe thử MeloBiz"}</strong>
          <a href={user ? "/tai-khoan" : "/dang-nhap"}>
            {user ? "Quản lý tài khoản" : "Đăng nhập để đồng bộ"} <span>↗</span>
          </a>
        </div>
      </aside>

      <section className="music-workspace">
        <div className="music-topbar">
          {page === "account" ? (
            <div className="app-topbar-title"><small>CÀI ĐẶT</small><strong>Tài khoản</strong></div>
          ) : (
            <label className="music-search"><span>⌕</span><input onChange={(event) => setQuery(event.target.value)} placeholder="Tìm bài hát, nghệ sĩ, thể loại..." value={query} /></label>
          )}
          <a className="location-pill" href="/tai-khoan"><i /> {user?.businessName ?? "Chế độ nghe thử"}</a>
          {user ? (
            <a className="profile-pill" href="/tai-khoan" aria-label="Tài khoản">{user.name.trim().charAt(0).toUpperCase()}</a>
          ) : (
            <a className="guest-login-pill" href="/tai-khoan">Tài khoản</a>
          )}
        </div>

        <div className={`music-scroll${page === "account" ? " account-scroll" : ""}`}>
          {page === "account" ? (
            <AccountContent loading={userLoading} message={accountMessage} onLogout={handleLogout} user={user} />
          ) : (<>
          {view === "discover" && !selectedPlaylist && (
            <section className="music-hero">
              <div className="music-hero-copy">
                <span>MELOBIZ SELECTS · BUỔI SÁNG</span>
                <h1>Nhạc vừa đủ hay.<br />Không gian vừa đủ riêng.</h1>
                <p>Một tuyển tập acoustic và lo-fi ấm áp, được cân nhịp cho buổi sáng tại quán.</p>
                <button onClick={() => playTrack(musicTracks[0])} type="button"><span>▶</span> Phát ngay</button>
              </div>
              <div className="hero-now"><small>MOOD HIỆN TẠI</small><strong>Chậm & ấm</strong><div>{Array.from({ length: 24 }).map((_, index) => <i key={index} style={{ height: `${9 + ((index * 7) % 28)}px` }} />)}</div></div>
            </section>
          )}

          {selectedPlaylist && (
            <section className="playlist-detail" style={{ background: selectedPlaylist.cover }}>
              <Cover value={selectedPlaylist.cover} label={selectedPlaylist.title} />
              <div><span>DANH SÁCH PHÁT</span><h1>{selectedPlaylist.title}</h1><p>{selectedPlaylist.description}</p><button onClick={() => visibleTracks[0] && playTrack(visibleTracks[0])} type="button">▶ Phát tất cả</button><button className="soft" type="button">＋ Lưu</button></div>
            </section>
          )}

          {!selectedPlaylist && (view === "discover" || view === "playlists" || view === "library") && (
            <section className="playlist-section-app">
              <div className="app-section-head"><div><span>ĐƯỢC BIÊN TẬP CHO BẠN</span><h2>{view === "discover" ? "Playlist cho hôm nay" : pageTitle}</h2></div><button onClick={() => setView("playlists")} type="button">Xem tất cả →</button></div>
              <div className="playlist-grid-app">
                {musicPlaylists.map((playlist) => (
                  <button className="playlist-card-app" key={playlist.id} onClick={() => setSelectedPlaylist(playlist)} type="button">
                    <Cover value={playlist.cover} label={playlist.title} />
                    <strong>{playlist.title}</strong><span>{playlist.subtitle}</span><i>▶</i>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="track-section-app">
            <div className="app-section-head"><div><span>{selectedPlaylist ? "TRONG PLAYLIST" : "THƯ VIỆN MELOBIZ"}</span><h2>{selectedPlaylist ? "Danh sách bài hát" : view === "discover" ? "Đang được yêu thích" : pageTitle}</h2></div><div className="track-filters"><button type="button">Tất cả mood⌄</button><button type="button">Tất cả thể loại⌄</button></div></div>
            <div className="track-list-app">
              <div className="track-list-head"><span>#</span><span>BÀI HÁT</span><span>THỂ LOẠI</span><span>MOOD</span><span>THỜI LƯỢNG</span><span /></div>
              {visibleTracks.map((track, index) => (
                <button className={currentTrack.id === track.id ? "track-row active" : "track-row"} key={track.id} onClick={() => playTrack(track)} type="button">
                  <span className="track-index">{currentTrack.id === track.id && playing ? "▮▮" : String(index + 1).padStart(2, "0")}</span>
                  <span className="track-main"><Cover value={track.cover} label={track.title} small /><span><strong>{track.title}</strong><small>{track.artist}</small></span></span>
                  <span><i className="track-tag">{track.genre}</i></span><span>{track.mood}</span><span>{track.duration}</span><span className="track-more">•••</span>
                </button>
              ))}
              {visibleTracks.length === 0 && <div className="empty-tracks">Không tìm thấy bài hát phù hợp.</div>}
            </div>
          </section>
          </>)}
        </div>
      </section>

      <div className="music-player">
        <div className="player-track"><Cover value={currentTrack.cover} label={currentTrack.title} small /><span><strong>{currentTrack.title}</strong><small>{currentTrack.artist}</small></span><button type="button">♡</button></div>
        <div className="player-center"><div><button type="button">↝</button><button type="button">◀</button><button className="play-main" onClick={() => setPlaying((value) => !value)} type="button">{playing ? "Ⅱ" : "▶"}</button><button type="button">▶</button><button type="button">↻</button></div><label><small>1:08</small><input aria-label="Tiến trình phát" max="100" onChange={(event) => setProgress(Number(event.target.value))} type="range" value={progress} /><small>{currentTrack.duration}</small></label></div>
        <div className="player-tools"><button type="button">▤</button><span>◖</span><input aria-label="Âm lượng" defaultValue="72" max="100" type="range" /></div>
      </div>
    </main>
  );
}

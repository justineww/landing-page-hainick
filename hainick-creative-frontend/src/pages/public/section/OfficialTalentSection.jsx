import { useState, useEffect, useRef } from "react";

const BASE_URL = "http://localhost:8000";

// ── Helpers ───────────────────────────────────────────────────────────────────
// Format follower menjadi gaya Indonesia (koma sebagai desimal), misal 15700 -> "15,7K"
const formatFollowersID = (val) => {
  const num = Number(val);
  if (!val || isNaN(num) || num === 0) return "—";
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1).replace(".", ",") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(".", ",") + "K";
  return String(num);
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const IGIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);
const TikTokIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.75a4.85 4.85 0 01-1-.06z" />
  </svg>
);
const TwitterIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548z" />
  </svg>
);
const EyeIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ── Talent Photo Card ─────────────────────────────────────────────────────────
const TalentPhotoCard = ({ talent, onClick }) => {
  const [imgError, setImgError] = useState(false);
  const photo = talent.image_url ? `${BASE_URL}${talent.image_url}` : null;
  const showFallback = !photo || imgError;

  return (
    <button
      className="ot-card"
      onClick={onClick}
      type="button"
      aria-label="Lihat detail talent"
    >
      <div className="ot-card-photo-wrap">
        {showFallback ? (
          <div className="ot-card-fallback">🧑</div>
        ) : (
          <img
            src={photo}
            alt="Talent Hainick"
            className="ot-card-img"
            onError={() => setImgError(true)}
          />
        )}
        <div className="ot-card-overlay">
          <span className="ot-card-hint">
            <EyeIcon /> Lihat Profil
          </span>
        </div>
      </div>
    </button>
  );
};

// ── Modal Detail Talent ───────────────────────────────────────────────────────
const OfficialTalentModal = ({ talentId, thumbnailUrl, onClose }) => {
  const [desc, setDesc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetch(`${BASE_URL}/api/load-official-talent-desc/${talentId}`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat detail talent");
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        const item = Array.isArray(data) ? data[0] : data;
        setDesc(item || null);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [talentId]);

  // Kunci scroll body & dukung tombol Escape selama modal terbuka
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const photo = desc?.image_url ? `${BASE_URL}${desc.image_url}` : thumbnailUrl;
  const hasPhysical = desc?.tinggi || desc?.berat || desc?.umur;

  return (
    <div className="ot-modal-backdrop" onClick={onClose}>
      <div className="ot-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="ot-modal-close" onClick={onClose} aria-label="Tutup">
          ✕
        </button>

        {loading ? (
          <div className="ot-modal-loading">
            <div className="ot-skel ot-skel-photo" />
            <div className="ot-modal-loading-info">
              <div className="ot-skel" style={{ width: "70%", height: 22 }} />
              <div
                className="ot-skel"
                style={{ width: "100%", height: 12, marginTop: 16 }}
              />
              <div
                className="ot-skel"
                style={{ width: "92%", height: 12, marginTop: 8 }}
              />
              <div
                className="ot-skel"
                style={{ width: "60%", height: 12, marginTop: 8 }}
              />
              <div
                className="ot-skel"
                style={{ width: "80%", height: 32, marginTop: 20 }}
              />
            </div>
          </div>
        ) : error ? (
          <p className="ot-modal-error">{error}</p>
        ) : (
          <div className="ot-modal-content">
            <div className="ot-modal-photo-wrap">
              {photo ? (
                <img
                  src={photo}
                  alt={desc?.nama || "Talent"}
                  className="ot-modal-photo"
                />
              ) : (
                <div className="ot-modal-photo-fallback">📷</div>
              )}
            </div>

            <div className="ot-modal-info">
              <h3 className="ot-modal-name">
                {desc?.nama?.trim() || "Talent Hainick"}
              </h3>

              {desc?.bio && <p className="ot-modal-bio">{desc.bio}</p>}

              <div className="ot-modal-socials">
                <div className="ot-social-stat">
                  <span className="ot-social-label">
                    <IGIcon /> Instagram
                  </span>
                  <span className="ot-social-count">
                    {formatFollowersID(desc?.followers_ig)}
                  </span>
                </div>
                <div className="ot-social-stat">
                  <span className="ot-social-label">
                    <TikTokIcon /> Tiktok
                  </span>
                  <span className="ot-social-count">
                    {formatFollowersID(desc?.followers_tiktok)}
                  </span>
                </div>
                <div className="ot-social-stat">
                  <span className="ot-social-label">
                    <TwitterIcon /> Twitter
                  </span>
                  <span className="ot-social-count">
                    {formatFollowersID(desc?.followers_twitter)}
                  </span>
                </div>
              </div>

              {hasPhysical && (
                <div className="ot-modal-physical">
                  {desc?.tinggi && <span>{desc.tinggi}cm</span>}
                  {desc?.berat && <span>{desc.berat}kg</span>}
                  {desc?.umur && <span>{desc.umur}th</span>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Section Utama ─────────────────────────────────────────────────────────────
export default function OfficialTalentSection() {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const fetchTalents = () => {
    setLoading(true);
    setError("");
    fetch(`${BASE_URL}/api/load-official-talent`, { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setTalents(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Gagal fetch official talent:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTalents();
  }, []);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [talents, loading]);

  const scrollBy = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.7), behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        :root {
          --navy: #1a2744;
          --navy-light: #263660;
          --accent: #4f7cff;
          --accent-soft: #eef2ff;
          --danger: #ef4444;
          --border: #e9ecf0;
          --muted: #9ca3af;
          --text: #1e293b;
          --bg: #f4f6fb;
          --card-bg: #fff;
          --font: 'Plus Jakarta Sans', sans-serif;
          --radius: 16px;
          --shadow: 0 2px 16px rgba(26,39,68,0.07);
        }
        * { box-sizing: border-box; }

        .ot-root {
          font-family: var(--font);
          background: #fff;
          padding: 48px 1rem 72px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .ot-title {
          font-size: clamp(1.3rem, 3vw, 1.9rem);
          font-weight: 800;
          letter-spacing: 0.02em;
          color: var(--navy);
          text-align: center;
          margin: 0 0 36px;
        }

        .ot-error {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--danger);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .ot-empty-block {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--muted);
          font-size: 0.9rem;
          border: 1.5px dashed var(--border);
          border-radius: var(--radius);
        }

        /* ── Carousel / Grid ── */
        .ot-scroll-outer { position: relative; }

        .ot-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #fff;
          border: 1.5px solid var(--border);
          box-shadow: var(--shadow);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 5;
          color: var(--navy);
          transition: background 0.2s, color 0.2s;
        }
        .ot-nav:hover { background: var(--accent-soft); color: var(--accent); }
        .ot-nav:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .ot-nav-left { left: -8px; }
        .ot-nav-right { right: -8px; }

        .ot-grid {
          display: grid;
          grid-auto-flow: column;
          grid-template-rows: repeat(2, 1fr);
          grid-auto-columns: 160px;
          gap: 16px;
          overflow-x: auto;
          scroll-behavior: smooth;
          scroll-snap-type: x proximity;
          padding: 4px 6px 10px;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .ot-grid::-webkit-scrollbar { display: none; }

        .ot-card {
          scroll-snap-align: start;
          border: 1.5px solid var(--border);
          background: none;
          padding: 0;
          cursor: pointer;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          animation: otCardIn 0.35s ease both;
        }
        .ot-card:hover { transform: translateY(-4px); box-shadow: 0 10px 28px rgba(26,39,68,0.14); }
        .ot-card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        @keyframes otCardIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ot-card-photo-wrap { position: relative; width: 100%; aspect-ratio: 1 / 1; background: #f0f0f0; }
        .ot-card-img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          filter: grayscale(100%) contrast(1.05);
          transition: filter 0.4s ease, transform 0.4s ease;
        }
        .ot-card:hover .ot-card-img { filter: grayscale(0%); transform: scale(1.06); }
        .ot-card-fallback {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, var(--navy), var(--accent));
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem;
        }
        .ot-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(10,15,30,0.68), transparent 60%);
          display: flex; align-items: flex-end; justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .ot-card:hover .ot-card-overlay { opacity: 1; }
        .ot-card-hint {
          color: #fff;
          font-size: 0.68rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          padding-bottom: 10px;
        }

        .ot-skel-card {
          border-radius: 14px;
          aspect-ratio: 1 / 1;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: otShimmer 1.4s infinite;
          scroll-snap-align: start;
        }
        @keyframes otShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Modal ── */
        .ot-modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(10,15,30,0.55);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 1rem;
          animation: otFadeIn 0.2s ease;
        }
        @keyframes otFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .ot-modal-box {
          position: relative;
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 2rem;
          box-shadow: 0 24px 64px rgba(10,15,30,0.2);
          animation: otSlideUp 0.25s ease;
        }
        @keyframes otSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: none; opacity: 1; } }

        .ot-modal-close {
          position: absolute; top: 16px; right: 16px;
          background: var(--bg); border: none; border-radius: 8px;
          width: 32px; height: 32px; cursor: pointer; font-size: 0.9rem;
          display: flex; align-items: center; justify-content: center;
          color: var(--muted); transition: background 0.15s;
        }
        .ot-modal-close:hover { background: var(--border); }

        .ot-modal-content { display: flex; gap: 1.75rem; align-items: flex-start; }
        @media (max-width: 600px) { .ot-modal-content { flex-direction: column; } }

        .ot-modal-photo-wrap {
          flex: 0 0 200px; width: 200px; height: 200px;
          border-radius: 14px; overflow: hidden; background: var(--bg);
        }
        @media (max-width: 600px) {
          .ot-modal-photo-wrap { width: 100%; flex-basis: auto; height: 220px; }
        }
        .ot-modal-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ot-modal-photo-fallback {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-size: 2.4rem; color: var(--muted); background: var(--bg);
        }

        .ot-modal-info { flex: 1; min-width: 0; padding-top: 6px; }
        .ot-modal-name {
          font-size: 1.4rem; font-weight: 800; letter-spacing: -0.01em;
          text-transform: uppercase; color: var(--navy); margin: 0 0 10px;
        }
        .ot-modal-bio { font-size: 0.85rem; line-height: 1.7; color: var(--text); margin: 0 0 20px; }

        .ot-modal-socials {
          display: flex; gap: 1.6rem; flex-wrap: wrap;
          padding-bottom: 16px; margin-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }
        .ot-social-stat { display: flex; flex-direction: column; gap: 4px; }
        .ot-social-label {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.72rem; font-weight: 700; color: var(--muted);
        }
        .ot-social-count { font-size: 1.35rem; font-weight: 800; color: var(--navy); }

        .ot-modal-physical { display: flex; gap: 1.4rem; font-size: 0.9rem; color: var(--text); font-weight: 600; }

        .ot-modal-loading { display: flex; gap: 1.75rem; }
        @media (max-width: 600px) { .ot-modal-loading { flex-direction: column; } }
        .ot-modal-loading-info { flex: 1; display: flex; flex-direction: column; }
        .ot-skel {
          border-radius: 8px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: otShimmer 1.4s infinite;
        }
        .ot-skel-photo { width: 200px; height: 200px; border-radius: 14px; flex-shrink: 0; }
        @media (max-width: 600px) { .ot-skel-photo { width: 100%; height: 220px; } }

        .ot-modal-error { color: var(--danger); font-size: 0.85rem; font-weight: 500; padding: 2rem 0; text-align: center; }

        @media (max-width: 600px) {
          .ot-grid { grid-template-rows: repeat(1, 1fr); grid-auto-columns: 130px; }
          .ot-nav { width: 34px; height: 34px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ot-card, .ot-card-img, .ot-card-overlay, .ot-modal-backdrop, .ot-modal-box { animation: none !important; transition: none !important; }
        }
      `}</style>

      <section
        id="officialTalent"
        className="ot-root"
        style={{ scrollMarginTop: "80px" }}
      >
        <h2 className="ot-title">Official Talent Hainick</h2>

        {error ? (
          <p className="ot-error">Gagal memuat data talent: {error}</p>
        ) : loading ? (
          <div className="ot-scroll-outer">
            <div className="ot-grid">
              {Array.from({ length: 10 }).map((_, i) => (
                <div className="ot-skel-card" key={i} />
              ))}
            </div>
          </div>
        ) : talents.length === 0 ? (
          <div className="ot-empty-block">
            Belum ada talent yang ditambahkan.
          </div>
        ) : (
          <div className="ot-scroll-outer">
            {canLeft && (
              <button
                className="ot-nav ot-nav-left"
                onClick={() => scrollBy(-1)}
                aria-label="Sebelumnya"
              >
                <ChevronLeftIcon />
              </button>
            )}
            <div
              className="ot-grid"
              ref={scrollRef}
              onScroll={updateScrollState}
            >
              {talents.map((t) => (
                <TalentPhotoCard
                  key={t.id}
                  talent={t}
                  onClick={() => setSelected(t)}
                />
              ))}
            </div>
            {canRight && (
              <button
                className="ot-nav ot-nav-right"
                onClick={() => scrollBy(1)}
                aria-label="Selanjutnya"
              >
                <ChevronRightIcon />
              </button>
            )}
          </div>
        )}
      </section>

      {selected && (
        <OfficialTalentModal
          talentId={selected.id}
          thumbnailUrl={
            selected.image_url ? `${BASE_URL}${selected.image_url}` : null
          }
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

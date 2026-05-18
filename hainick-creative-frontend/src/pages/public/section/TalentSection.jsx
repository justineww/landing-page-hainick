// TODO: Replace DUMMY_TALENTS with API call from backend

// ── Icons ─────────────────────────────────────────────────────────────────────
const IGIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.75a4.85 4.85 0 01-1-.06z" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// ── Constants ─────────────────────────────────────────────────────────────────
const SOCIAL_OPTIONS = [
  { key: "instagram", label: "Instagram", icon: <IGIcon /> },
  { key: "tiktok", label: "TikTok", icon: <TikTokIcon /> },
  { key: "x", label: "X", icon: <XIcon /> },
  { key: "youtube", label: "YouTube", icon: <YoutubeIcon /> },
];

const formatFollowers = (n) => {
  const num = parseInt(n, 10);
  if (isNaN(num)) return n;
  if (num >= 1000000)
    return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + "M";
  if (num >= 1000) return Math.round(num / 1000) + "K";
  return String(num);
};

// ── Dummy Data (TODO: ganti dengan fetch API backend) ─────────────────────────
const DUMMY_TALENTS = [
  {
    id: 1,
    name: "AKBARRY NOOR",
    photo:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&q=80",
    categories: ["Actor", "Host", "MC", "Content Creator"],
    socials: {
      instagram: { url: "https://instagram.com/", followers: "79000" },
      tiktok: { url: "https://tiktok.com/", followers: "60000" },
      x: { url: "https://x.com/", followers: "11000" },
    },
  },
  {
    id: 2,
    name: "SYAHFIRA ANGELA NURHALIZA",
    photo:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80",
    categories: ["Actor", "Host", "MC", "Content Creator"],
    socials: {
      instagram: { url: "https://instagram.com/", followers: "121000" },
      tiktok: { url: "https://tiktok.com/", followers: "30000" },
      x: { url: "https://x.com/", followers: "17000" },
    },
  },
  {
    id: 3,
    name: "ANNISA HERTAMI",
    photo:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    categories: ["Host", "MC", "Content Creator", "Model"],
    socials: {
      instagram: { url: "https://instagram.com/", followers: "11000" },
    },
  },
  {
    id: 4,
    name: "ARIELLA CALISTA",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80",
    categories: ["Host", "Content Creator", "Model"],
    socials: {
      instagram: { url: "https://instagram.com/", followers: "199000" },
      tiktok: { url: "https://tiktok.com/", followers: "414000" },
      x: { url: "https://x.com/", followers: "208000" },
    },
  },
  {
    id: 5,
    name: "AYASTROPHILE",
    photo:
      "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400&q=80",
    categories: ["Actor", "Host", "Content Creator", "Model"],
    socials: {
      instagram: { url: "https://instagram.com/", followers: "74000" },
      tiktok: { url: "https://tiktok.com/", followers: "136000" },
      x: { url: "https://x.com/", followers: "152000" },
    },
  },
  {
    id: 6,
    name: "DEVI KINAL PUTRI",
    photo:
      "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&q=80",
    categories: ["Actor", "Host", "Content Creator", "Model", "Influencer"],
    socials: {
      instagram: { url: "https://instagram.com/", followers: "286000" },
      tiktok: { url: "https://tiktok.com/", followers: "61000" },
      x: { url: "https://x.com/", followers: "669000" },
    },
  },
];

// ── TalentCard ─────────────────────────────────────────────────────────────────
function TalentCard({ talent }) {
  return (
    <div className="tc-card">
      <div className="tc-photo-wrap">
        <img src={talent.photo} alt={talent.name} className="tc-photo" />
      </div>
      <div className="tc-body">
        <h3 className="tc-name">{talent.name}</h3>

        {Object.keys(talent.socials).length > 0 && (
          <div className="tc-socials">
            {SOCIAL_OPTIONS.filter((s) => talent.socials[s.key]?.url).map(
              (s) => (
                <a
                  key={s.key}
                  href={talent.socials[s.key].url}
                  target="_blank"
                  rel="noreferrer"
                  className="tc-social-item"
                  title={s.label}
                >
                  <span className="tc-social-icon">{s.icon}</span>
                  <span className="tc-social-count">
                    {formatFollowers(talent.socials[s.key].followers)}
                  </span>
                </a>
              ),
            )}
          </div>
        )}

        {talent.categories.length > 0 && (
          <div className="tc-cats">
            {talent.categories.map((c) => (
              <span key={c} className="tc-cat">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── TalentSection ──────────────────────────────────────────────────────────────
export default function TalentSection() {
  // TODO: ganti DUMMY_TALENTS dengan data dari API
  const talents = DUMMY_TALENTS;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .ts-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #fff;
          padding: 48px 1rem 72px;
          max-width: 1060px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .ts-title {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0a0a0a;
          text-align: center;
          margin: 0 0 32px;
        }

        /* ── Grid ── */
        .ts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 768px) {
          .ts-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
        }
        @media (max-width: 480px) {
          .ts-grid { grid-template-columns: 1fr; }
        }

        /* ── Card ── */
        .tc-card {
          border: 1.5px solid #e8e8e8;
          border-radius: 14px;
          overflow: hidden;
          background: #fff;
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .tc-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
          transform: translateY(-3px);
        }

        .tc-photo-wrap {
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: #f0f0f0;
        }
        .tc-photo {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          transition: transform 0.4s ease;
        }
        .tc-card:hover .tc-photo { transform: scale(1.04); }

        .tc-body {
          padding: 14px 14px 16px;
        }

        .tc-name {
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #0a0a0a;
          margin: 0 0 8px;
          line-height: 1.25;
        }

        /* Socials — semua hitam */
        .tc-socials {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 9px;
        }
        .tc-social-item {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          text-decoration: none;
          color: #0a0a0a;
          transition: opacity 0.15s;
        }
        .tc-social-item:hover { opacity: 0.5; }
        .tc-social-icon {
          display: flex;
          align-items: center;
          color: #0a0a0a;
        }
        .tc-social-count {
          font-size: 0.75rem;
          font-weight: 600;
          color: #0a0a0a;
        }

        /* Categories */
        .tc-cats {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .tc-cat {
          font-size: 0.68rem;
          font-weight: 500;
          color: #555;
          background: #f2f2f2;
          border-radius: 4px;
          padding: 2px 7px;
        }
      `}</style>

      <section className="ts-root">
        <h2 className="ts-title">Official Talent Hainick</h2>
        <div className="ts-grid">
          {talents.map((t) => (
            <TalentCard key={t.id} talent={t} />
          ))}
        </div>
      </section>
    </>
  );
}

// ActivitySection.jsx
// Gambar dan teks deskripsi bisa diedit dari admin panel
// Props: activities (array), description (string) — dikirim dari admin/backend

// ── Ganti URL ini dengan link tujuan tombol Join ──────────────────────────────
const JOIN_LINK = "https://wa.me/6281234567890"; // TODO: ganti dengan link yang sesuai

// ── Avatar placeholder untuk Community section ───────────────────────────────
const AVATARS = [
  {
    id: 1,
    src: "https://placehold.co/80x80/f5c49a/fff?text=A",
    style: { top: "28%", left: "17%" },
  },
  {
    id: 2,
    src: "https://placehold.co/80x80/9b7fcc/fff?text=B",
    style: { top: "48%", left: "9%" },
  },
  {
    id: 3,
    src: "https://placehold.co/80x80/f4a7c0/fff?text=C",
    style: { top: "68%", left: "21%" },
  },
  {
    id: 4,
    src: "https://placehold.co/80x80/b5d4f5/fff?text=D",
    style: { top: "28%", right: "17%" },
  },
  {
    id: 5,
    src: "https://placehold.co/80x80/d4d4d4/fff?text=E",
    style: { top: "48%", right: "9%" },
  },
  {
    id: 6,
    src: "https://placehold.co/80x80/f5e07a/fff?text=F",
    style: { top: "68%", right: "21%" },
  },
];

// ── Default Data (TODO: ganti dengan fetch API dari backend) ──────────────────

const DEFAULT_ACTIVITIES = [
  {
    id: 1,
    image: "https://placehold.co/600x400/111/fff?text=Balikpapan",
    city: "Balikpapan",
  },
  {
    id: 2,
    image: "https://placehold.co/600x400/111/fff?text=Bali",
    city: "Bali",
  },
  {
    id: 3,
    image: "https://placehold.co/600x400/111/fff?text=Jogjakarta",
    city: "Jogjakarta",
  },
  {
    id: 4,
    image: "https://placehold.co/900x500/111/fff?text=Surabaya",
    city: "Surabaya",
  },
  {
    id: 5,
    image: "https://placehold.co/900x500/111/fff?text=Medan",
    city: "Medan",
  },
];

const DEFAULT_DESCRIPTION =
  "The Hainick team has traveled across Indonesia to Bali, Jogjakarta, Surabaya, Medan, and Balikpapan, connecting with talented creators in each city. These journeys have allowed us to discover unique local talents and showcase the incredible creative potential throughout our diverse archipelago. We're excited to demonstrate to our partners and clients that compelling campaigns can emerge from every corner of Indonesia. Thank you to all the amazing communities who welcomed us!";

// ── ActivitySection ───────────────────────────────────────────────────────────

export default function ActivitySection({
  activities = DEFAULT_ACTIVITIES,
  description = DEFAULT_DESCRIPTION,
  title = "Hainick Update",
}) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        /* ───── UPDATE SECTION ───── */

        .act-outer {
          max-width: 1060px;
          margin: 0 auto;
          padding: 0 1rem;
          box-sizing: border-box;
        }

        .act-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #fff;
          padding: 56px 0 0;
          box-sizing: border-box;
        }

        .act-heading {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0a0a0a;
          text-align: left;
          margin: 0 0 24px;
        }

        .act-grid-wrapper {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .act-row-top {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .act-row-bottom {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .act-card {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background: #111;
          aspect-ratio: 4/3;
        }

        .act-row-bottom .act-card {
          aspect-ratio: 16/9;
        }

        .act-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .act-card:hover img {
          transform: scale(1.04);
        }

        .act-description {
          padding: 20px 0 0;
        }

        .act-description p {
          font-size: 0.875rem;
          line-height: 1.8;
          color: #444;
          margin: 0;
          font-weight: 400;
        }

        /* ───── COMMUNITY SECTION ───── */

        .community-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #eef0f8;
          border-radius: 20px;
          box-sizing: border-box;
          position: relative;
          padding: 64px 24px;
          text-align: center;
          overflow: hidden;
          margin-top: 56px;
          margin-bottom: 72px;
        }

        .community-title {
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #0a0a0a;
          margin: 0 0 12px;
          position: relative;
          z-index: 1;
        }

        .community-subtitle {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #555;
          margin: 0 auto 32px;
          max-width: 440px;
          position: relative;
          z-index: 1;
        }

        /* Center avatar area */
        .community-center-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 260px;
        }

        .community-center-avatar {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #fff;
          box-shadow: 0 8px 32px rgba(13,27,75,0.18);
          position: relative;
          z-index: 2;
        }

        /* Floating small avatars — positioned relative to center-wrap */
        .community-avatar {
          position: absolute;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #fff;
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
          z-index: 2;
        }

        .av-1 { top: 8%;  left: 18%; }
        .av-2 { top: 40%; left: 6%;  }
        .av-3 { bottom: 4%; left: 22%; }
        .av-4 { top: 8%;  right: 18%; }
        .av-5 { top: 40%; right: 6%;  }
        .av-6 { bottom: 4%; right: 22%; }

        /* Join button */
        .community-join-btn {
          display: inline-block;
          padding: 14px 56px;
          background: #0d2b8e;
          color: #fff;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 700;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.15s ease;
          letter-spacing: 0.01em;
          position: relative;
          z-index: 1;
          margin-top: 8px;
          display: inline-block;
        }

        .community-join-btn:hover {
          background: #1a3fc4;
          transform: translateY(-2px);
        }

        /* ── Responsive: tablet ── */
        @media (max-width: 768px) {
          .act-row-top {
            grid-template-columns: repeat(2, 1fr);
          }

          .act-row-top .act-card:last-child {
            grid-column: 1 / -1;
            aspect-ratio: 16/9;
          }

          .act-root {
            padding-top: 40px;
          }

          .community-root {
            padding: 48px 24px 56px;
            margin-top: 40px;
            margin-bottom: 56px;
          }

          .community-avatar {
            width: 56px;
            height: 56px;
          }
        }

        /* ── Responsive: mobile ── */
        @media (max-width: 480px) {
          .act-row-top,
          .act-row-bottom {
            grid-template-columns: 1fr;
          }

          .act-row-top .act-card:last-child {
            grid-column: auto;
            aspect-ratio: 4/3;
          }

          .act-card,
          .act-row-bottom .act-card {
            aspect-ratio: 4/3;
          }

          .act-grid-wrapper {
            gap: 8px;
          }

          .community-root {
            padding: 40px 24px 48px;
          }

          .community-avatar {
            width: 48px;
            height: 48px;
          }

          .av-1 { top: 5%;  left: 4%; }
          .av-2 { top: 38%; left: 2%; }
          .av-3 { bottom: 5%; left: 4%; }
          .av-4 { top: 5%;  right: 4%; }
          .av-5 { top: 38%; right: 2%; }
          .av-6 { bottom: 5%; right: 4%; }
        }
      `}</style>

      {/* ── Wrapper ── */}
      <div className="act-outer">
        {/* ── Update Section ── */}
        <section className="act-root">
          <h2 className="act-heading">{title}</h2>

          <div className="act-grid-wrapper">
            <div className="act-row-top">
              {activities.slice(0, 3).map((item) => (
                <div className="act-card" key={item.id}>
                  <img src={item.image} alt={item.city} />
                </div>
              ))}
            </div>

            {activities.length > 3 && (
              <div className="act-row-bottom">
                {activities.slice(3).map((item) => (
                  <div className="act-card" key={item.id}>
                    <img src={item.image} alt={item.city} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="act-description">
            <p>{description}</p>
          </div>
        </section>

        {/* ── Community / Join Section ── */}
        <div className="community-root">
          <h2 className="community-title">Join our community!</h2>
          <p className="community-subtitle">
            Grow together in a healthy KOL management — not just chasing
            virality.
            <br />
            Get the opportunity to collaborate with brands and events.
          </p>

          {/* Center wrap with floating avatars */}
          <div className="community-center-wrap">
            <img
              className="community-avatar av-1"
              src={AVATARS[0].src}
              alt="creator"
            />
            <img
              className="community-avatar av-2"
              src={AVATARS[1].src}
              alt="creator"
            />
            <img
              className="community-avatar av-3"
              src={AVATARS[2].src}
              alt="creator"
            />
            <img
              className="community-center-avatar"
              src="https://placehold.co/130x130/1a3fc4/fff?text=:)"
              alt="community"
            />
            <img
              className="community-avatar av-4"
              src={AVATARS[3].src}
              alt="creator"
            />
            <img
              className="community-avatar av-5"
              src={AVATARS[4].src}
              alt="creator"
            />
            <img
              className="community-avatar av-6"
              src={AVATARS[5].src}
              alt="creator"
            />
          </div>

          <a
            className="community-join-btn"
            href={JOIN_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            Join
          </a>
        </div>
      </div>
      {/* end act-outer */}
    </>
  );
}

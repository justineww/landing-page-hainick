// =============================================
// KONFIGURASI - Nanti diganti fetch dari API/database
// =============================================

const TESTIMONIALS = [
  {
    id: 1,
    name: "Wiendy Nathalia",
    photo: "https://i.pravatar.cc/80?img=47",
    text: "Aku tahu hainick di awal aku mulai menjadi konten kreator. Dan hainick salah satu agency yang benar2 tulus membantu KOL nya untuk menjadi lebih baik dan berkualitas. Sebuah grup dimana aku tidak perlu pusing bersaing dengan kol2 suntik yang merajalela hehe… semoga kedepannya semakin banyak job dengan budget yang lebih besar ya kak^^.",
  },
  {
    id: 2,
    name: "Beby Ramadhani",
    photo: "https://i.pravatar.cc/80?img=32",
    text: "Hainick Management ter-keren poll !! profesional dan solid dalam campaign apapun.",
  },
  {
    id: 3,
    name: "Novelia Cristiani Simanjuntak",
    photo: "https://i.pravatar.cc/80?img=25",
    text: "Hainick adalah tempat dimana aku memulai untuk berani membuat konten, dengan management yang sangat baik bikin aku semakin paham tentang dunia kreator. Jadi kalo boleh perbanyak lagi untuk jobnya hehe.",
  },
  {
    id: 4,
    name: "Rida Nadisya",
    photo: "https://i.pravatar.cc/80?img=44",
    text: "Kak Nick dan admin handle baik dan sabar bgt, fee nya pun cair nya 😊 sukses terus hainick 🎉",
  },
];

const LOGOS = [
  {
    id: 1,
    name: "Vista Land Group",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Vista_Land_%26_Lifescapes_logo.svg/320px-Vista_Land_%26_Lifescapes_logo.svg.png",
  },
  {
    id: 2,
    name: "HMNS",
    src: "https://placehold.co/120x40/0a0a0a/ffffff?text=HMNS&font=montserrat",
  },
  {
    id: 3,
    name: "Hotto",
    src: "https://placehold.co/100x40/ff6b35/ffffff?text=Hotto&font=montserrat",
  },
  {
    id: 4,
    name: "O.TWO.O Cosmetics",
    src: "https://placehold.co/130x40/c8a96e/ffffff?text=O.TWO.O&font=montserrat",
  },
  {
    id: 5,
    name: "Dompet Dhuafa",
    src: "https://placehold.co/120x40/2d7a2d/ffffff?text=Dompet+Dhuafa&font=montserrat",
  },
  {
    id: 6,
    name: "Syngenta",
    src: "https://placehold.co/110x40/0066cc/ffffff?text=syngenta&font=montserrat",
  },
];

// =============================================
// KOMPONEN UTAMA
// =============================================

export default function TestimonySection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

        .testimony-section {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #ffffff;
          padding: 64px 24px 56px;
          box-sizing: border-box;
        }

        .testimony-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .testimony-title {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0a0a0a;
          margin: 0 0 10px;
        }
        .testimony-subtitle {
          font-size: 14px;
          color: #6b7280;
          font-weight: 400;
          margin: 0;
        }

        .testimony-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          max-width: 1160px;
          margin: 0 auto;
        }

        .testimony-card {
          background: #fff;
          border: 1px solid #e4e9f7;
          border-radius: 18px;
          padding: 24px 20px 20px;
          box-shadow: 0 4px 20px rgba(13,27,75,0.07);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .card-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          object-fit: cover;
          border: 2.5px solid #e4e9f7;
          flex-shrink: 0;
        }
        .card-avatar-placeholder {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #f0f3fa;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #b0bbd4;
          font-size: 22px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .card-quote {
          font-size: 13px;
          color: #3d4f72;
          font-style: italic;
          line-height: 1.7;
          flex: 1;
          margin: 0;
        }
        .card-name {
          font-size: 13px;
          font-weight: 700;
          color: #0d1b4b;
          margin: 0;
        }

        /* ── CLIENTS STRIP ── */
        .clients-strip {
          background: #f8f9fc;
          border-top: 1px solid #edf0f8;
          padding: 32px 24px;
          box-sizing: border-box;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .clients-row {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 32px 48px;
          max-width: 1160px;
          margin: 0 auto;
        }
        .client-logo {
          height: 36px;
          max-width: 120px;
          object-fit: contain;
          filter: grayscale(1) opacity(0.6);
          transition: filter 0.25s;
        }
        .client-logo:hover { filter: grayscale(0) opacity(1); }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .testimony-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .testimony-section { padding: 48px 20px 48px; }
        }
        @media (max-width: 768px) {
          .testimony-section { padding: 40px 16px 40px; }
          .testimony-header { margin-bottom: 32px; }
          .testimony-subtitle { font-size: 13px; }
          .clients-strip { padding: 28px 16px; }
          .clients-row { gap: 20px 32px; }
          .client-logo { height: 30px; max-width: 100px; }
        }
        @media (max-width: 480px) {
          .testimony-grid { grid-template-columns: 1fr; gap: 14px; }
          .testimony-section { padding: 32px 14px 32px; }
          .testimony-card { padding: 20px 16px 16px; }
          .clients-strip { padding: 20px 14px; }
          .clients-row { gap: 16px 20px; }
          .client-logo { height: 26px; max-width: 85px; }
        }
        @media (max-width: 360px) {
          .testimony-section { padding: 28px 12px; }
          .card-quote { font-size: 12.5px; }
          .card-name { font-size: 12px; }
        }
      `}</style>

      <section className="testimony-section">
        <div className="testimony-header">
          <h2 className="testimony-title">Testimony Our Talent</h2>
          <p className="testimony-subtitle">
            Hainick is an excellent talent agency that provides the best
            service.
          </p>
        </div>

        <div className="testimony-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="testimony-card">
              {t.photo ? (
                <img src={t.photo} alt={t.name} className="card-avatar" />
              ) : (
                <div className="card-avatar-placeholder">
                  {t.name.charAt(0).toUpperCase()}
                </div>
              )}
              <p className="card-quote">"{t.text}"</p>
              <p className="card-name">- {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="clients-strip">
        <div className="clients-row">
          {LOGOS.map((logo) => (
            <img
              key={logo.id}
              src={logo.src}
              alt={logo.name}
              className="client-logo"
            />
          ))}
        </div>
      </div>
    </>
  );
}

import { useState, useEffect, useRef } from "react";

const BASE_URL = "http://localhost:8000";

// Fallback jika API belum tersedia
const FALLBACK_CARDS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  image_url: null,
}));

// Susunan kolom: 3-3-2-2-2-2-3-3 = 20 kartu
// col: 0-7, row: posisi dalam kolom
const CARD_LAYOUT = [
  { id: 1, col: 0, row: 0 },
  { id: 2, col: 0, row: 1 },
  { id: 3, col: 0, row: 2 },
  { id: 4, col: 1, row: 0 },
  { id: 5, col: 1, row: 1 },
  { id: 6, col: 1, row: 2 },
  { id: 7, col: 2, row: 0 },
  { id: 8, col: 2, row: 1 },
  { id: 9, col: 3, row: 0 },
  { id: 10, col: 3, row: 1 },
  { id: 11, col: 4, row: 0 },
  { id: 12, col: 4, row: 1 },
  { id: 13, col: 5, row: 0 },
  { id: 14, col: 5, row: 1 },
  { id: 15, col: 6, row: 0 },
  { id: 16, col: 6, row: 1 },
  { id: 17, col: 6, row: 2 },
  { id: 18, col: 7, row: 0 },
  { id: 19, col: 7, row: 1 },
  { id: 20, col: 7, row: 2 },
];

const COL_WAVE_ORDER = [0, 7, 1, 6, 2, 5, 3, 4];
const ROW_OPACITY = { 0: 0.35, 1: 0.7, 2: 1.0 };
const COL_OFFSET_TOP = {
  0: -80,
  1: -40,
  2: -80,
  3: -20,
  4: -20,
  5: -80,
  6: -40,
  7: -80,
};

function groupByCol(cards) {
  return cards.reduce((acc, card) => {
    if (!acc[card.col]) acc[card.col] = [];
    acc[card.col].push(card);
    return acc;
  }, {});
}

function TalentCard({ card, visible, animDelay }) {
  const [hovered, setHovered] = useState(false);
  const baseOpacity = ROW_OPACITY[card.row] ?? 1;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        aspectRatio: "3/4",
        borderRadius: "clamp(12px, 1.6vw, 22px)",
        background: "#e8e5df",
        boxShadow: hovered
          ? "0 8px 24px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,.5)"
          : "0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)",
        overflow: "hidden",
        cursor: "pointer",
        opacity: visible ? (hovered ? 1 : baseOpacity) : 0,
        transform: visible
          ? hovered
            ? "translateY(-3px)"
            : "translateY(0)"
          : "translateY(-50px)",
        transition: visible
          ? `opacity .65s cubic-bezier(.22,1,.36,1) ${animDelay}ms,
             transform .65s cubic-bezier(.22,1,.36,1) ${animDelay}ms,
             box-shadow .3s ease`
          : "none",
      }}
    >
      {card.image_url ? (
        <img
          src={`${BASE_URL}${card.image_url}`}
          alt={`Talent ${card.id}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            // Grayscale saat tidak di-hover, berwarna saat hover
            filter: hovered ? "grayscale(0%)" : "grayscale(100%)",
            transition: "filter .4s ease",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(160deg, #e0ddd7 0%, #ccc9c2 100%)",
          }}
        />
      )}
    </div>
  );
}

export default function CreatorsSection() {
  // Merge layout statis dengan data dinamis dari API
  const [cards, setCards] = useState(
    CARD_LAYOUT.map((layout) => ({ ...layout, image_url: null })),
  );
  const [stats, setStats] = useState({
    creators: "25",
    brand: "100",
    projects: "+78",
  });
  const [visibleCards, setVisibleCards] = useState({});
  const [statsVisible, setStatsVisible] = useState(false);
  const [brandVisible, setBrandVisible] = useState(false);

  const sectionRef = useRef(null);
  const triggeredRef = useRef(false);

  // ── Fetch data dari API ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchPhotocards = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/creators-photocard`);
        if (!res.ok) return;
        const data = await res.json(); // array [{id, image_url}, ...]

        setCards((prev) =>
          prev.map((card) => {
            // Cari di API berdasarkan urutan index (data[card.id - 1])
            // atau bisa juga match by id jika API mengembalikan field id
            const apiItem =
              data.find((d) => d.id === card.id) ?? data[card.id - 1];
            return apiItem
              ? { ...card, image_url: apiItem.image_url ?? card.image_url }
              : card;
          }),
        );
      } catch (err) {
        console.error("Gagal memuat creators photocard:", err);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/creators-photocard-statistics`,
        );
        if (!res.ok) return;
        const data = await res.json(); // [{creators, brand, projects}] atau object langsung
        const row = Array.isArray(data) ? data[0] : data;
        if (row) {
          setStats({
            creators: row.creators ?? "25",
            brand: row.brand ?? "100",
            projects: row.projects ?? "+78",
          });
        }
      } catch (err) {
        console.error("Gagal memuat stats:", err);
      }
    };

    fetchPhotocards();
    fetchStats();
  }, []);

  // ── Trigger animasi wave ──────────────────────────────────────────────────
  function triggerAnimation() {
    if (triggeredRef.current) return;
    triggeredRef.current = true;

    setTimeout(() => setBrandVisible(true), 80);

    const grouped = groupByCol(cards);
    COL_WAVE_ORDER.forEach((colIdx, waveIdx) => {
      (grouped[colIdx] ?? []).forEach((card, rowIdx) => {
        const delay = waveIdx * 80 + rowIdx * 60;
        setTimeout(() => {
          setVisibleCards((prev) => ({ ...prev, [card.id]: true }));
        }, delay);
      });
    });

    setTimeout(() => setStatsVisible(true), 800);
  }

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) triggerAnimation();
        }),
      { threshold: 0.05 },
    );
    observer.observe(section);

    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) triggerAnimation();

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grouped = groupByCol(cards);
  const colIndices = Array.from({ length: 8 }, (_, i) => i);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      <section
        ref={sectionRef}
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          background: "#ffffff",
          width: "100%",
          maxWidth: "none",
          margin: "0",
          padding: "0",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Fade atas ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100px",
            background:
              "linear-gradient(to bottom, #ffffff 0%, #ffffff 20%, rgba(255,255,255,0) 100%)",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />

        {/* ── Fade bawah ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "220px",
            background:
              "linear-gradient(to top, #ffffff 30%, rgba(255,255,255,0) 100%)",
            zIndex: 8,
            pointerEvents: "none",
          }}
        />

        {/* ── Fade kiri ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "calc(max(0px, (100% - 1060px) / 2))",
            background:
              "linear-gradient(to right, #ffffff 40%, rgba(255,255,255,0) 100%)",
            zIndex: 15,
            pointerEvents: "none",
          }}
        />

        {/* ── Fade kanan ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "calc(max(0px, (100% - 1060px) / 2))",
            background:
              "linear-gradient(to left, #ffffff 40%, rgba(255,255,255,0) 100%)",
            zIndex: 15,
            pointerEvents: "none",
          }}
        />

        {/* ── Grid kartu ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "clamp(6px, 0.9vw, 12px)",
            width: "100%",
            boxSizing: "border-box",
            padding: "0 clamp(8px, 1.5vw, 20px)",
            paddingBottom: "200px",
          }}
        >
          {colIndices.map((colIdx) => (
            <div
              key={colIdx}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(6px, 0.9vw, 12px)",
                flex: "1 1 0%",
                minWidth: 0,
                marginTop: `${COL_OFFSET_TOP[colIdx]}px`,
              }}
            >
              {(grouped[colIdx] ?? []).map((card) => {
                const waveIdx = COL_WAVE_ORDER.indexOf(colIdx);
                const animDelay = waveIdx * 80 + card.row * 60;
                return (
                  <TalentCard
                    key={card.id}
                    card={card}
                    visible={!!visibleCards[card.id]}
                    animDelay={animDelay}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* ── Brand + Stats ── */}
        <div
          style={{
            position: "absolute",
            bottom: "220px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "1060px",
            padding: "0 1rem",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          {/* Brand name */}
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(0.9rem, 1.8vw, 1.2rem)",
              fontWeight: 700,
              color: "#111111",
              letterSpacing: "-0.01em",
              margin: "0 0 clamp(8px, 1.5vw, 14px)",
              whiteSpace: "nowrap",
              opacity: brandVisible ? 1 : 0,
              transform: brandVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity .5s ease, transform .5s ease",
            }}
          >
            Kreator Hainick.
          </p>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "clamp(24px, 5vw, 72px)",
            }}
          >
            {[
              { value: stats.creators, label: "TALENTS" },
              { value: stats.brand, label: "BRANDS" },
              { value: stats.projects, label: "PROJECTS" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible
                    ? "translateY(0)"
                    : "translateY(20px)",
                  transition: "opacity .6s ease, transform .6s ease",
                  transitionDelay: `${i * 0.12}s`,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
                    color: "#111111",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "clamp(0.6rem, 1vw, 0.75rem)",
                    color: "#666666",
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    marginTop: "5px",
                    fontWeight: 400,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

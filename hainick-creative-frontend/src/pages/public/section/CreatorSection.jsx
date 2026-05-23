import { useState, useEffect, useRef } from "react";

const BASE_URL = "http://localhost:8000";

const CREATOR_DATA = {
  brandName: "Kreator Hainick.",
  stats: [
    { id: "talents", value: 25, prefix: "", suffix: "", label: "Talents" },
    { id: "brands", value: 100, prefix: "", suffix: "", label: "Brands" },
    { id: "projects", value: 78, prefix: "+", suffix: "", label: "Projects" },
  ],
  // 8 kolom, distribusi: 3-3-2-2-2-2-3-3 = 20 kartu
  cards: [
    { id: 1, col: 0, row: 0, image_url: null, name: "Talent 1" },
    { id: 2, col: 0, row: 1, image_url: null, name: "Talent 2" },
    { id: 3, col: 0, row: 2, image_url: null, name: "Talent 3" },
    { id: 4, col: 1, row: 0, image_url: null, name: "Talent 4" },
    { id: 5, col: 1, row: 1, image_url: null, name: "Talent 5" },
    { id: 6, col: 1, row: 2, image_url: null, name: "Talent 6" },
    { id: 7, col: 2, row: 0, image_url: null, name: "Talent 7" },
    { id: 8, col: 2, row: 1, image_url: null, name: "Talent 8" },
    { id: 9, col: 3, row: 0, image_url: null, name: "Talent 9" },
    { id: 10, col: 3, row: 1, image_url: null, name: "Talent 10" },
    { id: 11, col: 4, row: 0, image_url: null, name: "Talent 11" },
    { id: 12, col: 4, row: 1, image_url: null, name: "Talent 12" },
    { id: 13, col: 5, row: 0, image_url: null, name: "Talent 13" },
    { id: 14, col: 5, row: 1, image_url: null, name: "Talent 14" },
    { id: 15, col: 6, row: 0, image_url: null, name: "Talent 15" },
    { id: 16, col: 6, row: 1, image_url: null, name: "Talent 16" },
    { id: 17, col: 6, row: 2, image_url: null, name: "Talent 17" },
    { id: 18, col: 7, row: 0, image_url: null, name: "Talent 18" },
    { id: 19, col: 7, row: 1, image_url: null, name: "Talent 19" },
    { id: 20, col: 7, row: 2, image_url: null, name: "Talent 20" },
  ],
};

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
  const finalOpacity = hovered ? 1 : baseOpacity;

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
        opacity: visible ? finalOpacity : 0,
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
          alt={card.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
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

export default function CreatorSection() {
  const [cards, setCards] = useState(CREATOR_DATA.cards);
  const [stats, setStats] = useState(CREATOR_DATA.stats);
  const [visibleCards, setVisibleCards] = useState({});
  const [statsVisible, setStatsVisible] = useState(false);
  const [brandVisible, setBrandVisible] = useState(false);

  const sectionRef = useRef(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/talents`);
        if (res.ok) {
          const data = await res.json();
          setCards((prev) =>
            prev.map((card, idx) => ({
              ...card,
              image_url: data[idx]?.image_url ?? card.image_url,
              name: data[idx]?.name ?? card.name,
            })),
          );
        }
      } catch (err) {
        console.error("Gagal memuat data talent:", err);
      }
      try {
        const res = await fetch(`${BASE_URL}/api/creator-stats`);
        if (res.ok) {
          const data = await res.json();
          setStats((prev) =>
            prev.map((s) => ({ ...s, value: data[s.id] ?? s.value })),
          );
        }
      } catch (err) {
        console.error("Gagal memuat stats:", err);
      }
    };
    fetchData();
  }, []);

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
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) triggerAnimation();
        });
      },
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
          // position relative wajib agar anak absolute bisa diposisikan di dalam
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

        {/* ── Fade bawah — menutupi batas bawah kartu ── */}
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

        {/* ── Grid kartu — full width ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "clamp(6px, 0.9vw, 12px)",
            width: "100%",
            boxSizing: "border-box",
            padding: "0 clamp(8px, 1.5vw, 20px)",
            // padding bawah agar section punya tinggi cukup untuk teks absolute
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

        {/*
          ── Brand + Stats ──
          position absolute + bottom: bebas naik turun tanpa bergantung
          pada tinggi kartu. Edit nilai "bottom" untuk mengatur posisi vertikal.
          Makin besar nilai bottom = makin naik.
        */}
        <div
          style={{
            position: "absolute",
            bottom: "220px", // ← EDIT INI untuk naik/turun
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
            {CREATOR_DATA.brandName}
          </p>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "clamp(24px, 5vw, 72px)",
            }}
          >
            {stats.map((stat, i) => (
              <div
                key={stat.id}
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
                  {stat.prefix}
                  {stat.value}
                  {stat.suffix}
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

import { useState, useEffect } from "react";

// =============================================
// ICON COMPONENTS
// =============================================

const InstagramIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const EmailIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
  </svg>
);

// =============================================
// CONTACT PANEL (kanan) — data dari API
// =============================================

function ContactPanel({ contact }) {
  if (!contact) return null;

  // Kolom DB: instagram_account, gmail_account, phone_number1, phone_number2
  const phones = [contact.phone_number1, contact.phone_number2].filter(Boolean);

  return (
    <div className="contact-panel">
      <span className="panel-brand">hainick.</span>

      <div className="panel-rows">
        {contact.instagram_account && (
          <div className="panel-row">
            <span className="panel-icon">
              <InstagramIcon />
            </span>
            <span className="panel-text">{contact.instagram_account}</span>
          </div>
        )}

        {contact.gmail_account && (
          <div className="panel-row">
            <span className="panel-icon">
              <EmailIcon />
            </span>
            <span className="panel-text">{contact.gmail_account}</span>
          </div>
        )}

        {phones.length > 0 && (
          <div className="panel-row panel-row-phone">
            <span className="panel-icon panel-icon-top">
              <PhoneIcon />
            </span>
            <div className="panel-phones">
              {phones.map((num, i) => (
                <span key={i} className="panel-text panel-phone-line">
                  <strong>{num}</strong>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================
// FORM KONTAK (kiri)
// =============================================

function ContactForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    // TODO: ganti dengan actual API call ke backend
    // const res = await fetch("/api/contact", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(form),
    // });
    // if (res.ok) setStatus("success"); else setStatus("error");

    // Simulasi sementara
    setTimeout(() => {
      console.log("Form data:", form);
      setStatus("success");
      setForm({ firstName: "", lastName: "", email: "", message: "" });
      setTimeout(() => setStatus(null), 3000);
    }, 800);
  };

  const isLoading = status === "loading";

  return (
    <div className="contact-form-wrap">
      <h3 className="form-heading">Let's get in touch</h3>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            className="form-input"
            type="text"
            name="firstName"
            placeholder="First name"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <input
            className="form-input"
            type="text"
            name="lastName"
            placeholder="Last name"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <input
          className="form-input"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <textarea
          className="form-input form-textarea"
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          required
        />

        <div className="form-footer">
          <button className="submit-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Submit"}
          </button>

          {status === "success" && (
            <span className="form-status form-status-ok">
              ✓ Pesan terkirim!
            </span>
          )}
          {status === "error" && (
            <span className="form-status form-status-err">
              Gagal mengirim, coba lagi.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

// =============================================
// KOMPONEN UTAMA — fetch dari /api/contacts
// =============================================

export default function ContactSection() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => {
        if (!r.ok) throw new Error("Gagal fetch contacts");
        return r.json();
      })
      .then((data) => {
        // Ambil baris pertama dari tabel contacts
        // Kolom DB: instagram_account, gmail_account, phone_number1, phone_number2
        const row = Array.isArray(data) ? (data[0] ?? null) : data;
        setContact(row);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .contact-section {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #ffffff;
          padding: 64px 24px;
          box-sizing: border-box;
        }

        .contact-section-title {
          text-align: center;
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0a0a0a;
          margin: 0 0 52px;
        }

        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          max-width: 1000px;
          margin: 0 auto;
          align-items: start;
        }

        /* ── FORM ── */
        .form-heading {
          font-size: 22px;
          font-weight: 800;
          color: #0d1b4b;
          margin: 0 0 28px;
          letter-spacing: -0.02em;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .form-input {
          width: 100%;
          padding: 13px 14px;
          border: 1.5px solid #dde3f0;
          border-radius: 10px;
          font-size: 13.5px;
          font-family: inherit;
          color: #0d1b4b;
          background: #fff;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .form-input::placeholder { color: #aab2c8; }
        .form-input:focus {
          border-color: #1a3fc4;
          box-shadow: 0 0 0 3px rgba(26,63,196,0.08);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .form-footer {
          display: flex;
          align-items: center;
          gap: 16px;
          justify-content: flex-end;
        }

        .submit-btn {
          padding: 12px 32px;
          background: #0d1b4b;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s, opacity 0.2s;
          letter-spacing: 0.2px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #1a3fc4;
          transform: translateY(-1px);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .form-status { font-size: 13px; font-weight: 600; }
        .form-status-ok  { color: #16a34a; }
        .form-status-err { color: #dc2626; }

        /* ── PANEL ── */
        .contact-panel {
          display: flex;
          flex-direction: column;
          gap: 22px;
          padding: 32px 28px;
        }

        .panel-brand {
          font-size: 26px;
          font-weight: 800;
          color: #0d1b4b;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .panel-rows {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .panel-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .panel-row-phone { align-items: flex-start; }

        .panel-icon {
          color: #0d1b4b;
          flex-shrink: 0;
          line-height: 0;
        }
        .panel-icon-top { margin-top: 1px; }

        .panel-text {
          font-size: 14px;
          color: #2d3a5e;
          font-weight: 500;
          line-height: 1.5;
        }

        .panel-phones {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .panel-phone-line { display: block; }

        /* ── SKELETON LOADER ── */
        .contact-skeleton {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 32px 28px;
        }
        .skeleton-line {
          height: 14px;
          border-radius: 6px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        .skeleton-line.short { width: 40%; }
        .skeleton-line.mid   { width: 65%; }
        .skeleton-line.long  { width: 85%; }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .contact-layout { gap: 36px; }
          .contact-section { padding: 48px 20px; }
        }
        @media (max-width: 768px) {
          .contact-layout { grid-template-columns: 1fr; gap: 32px; }
          .contact-section { padding: 40px 16px; }
          .contact-panel { padding: 0; }
          .panel-brand { font-size: 22px; }
        }
        @media (max-width: 480px) {
          .form-row { grid-template-columns: 1fr; gap: 14px; }
          .contact-section { padding: 32px 14px; }
          .form-heading { font-size: 18px; }
          .form-input { padding: 11px 12px; font-size: 13px; }
          .submit-btn { padding: 11px 24px; font-size: 13px; }
          .panel-text { font-size: 13px; }
          .contact-section-title { margin: 0 0 36px; }
        }
        @media (max-width: 360px) {
          .contact-section { padding: 28px 12px; }
          .panel-brand { font-size: 20px; }
        }
      `}</style>

      <section className="contact-section">
        <h2 className="contact-section-title">Contact Us</h2>

        <div className="contact-layout">
          <ContactForm />

          {/* Panel kanan: skeleton saat loading, data saat sudah ada */}
          {loading ? (
            <div className="contact-skeleton">
              <div
                className="skeleton-line short"
                style={{ height: "22px", marginBottom: "4px" }}
              />
              <div className="skeleton-line mid" />
              <div className="skeleton-line long" />
              <div className="skeleton-line mid" />
            </div>
          ) : (
            <ContactPanel contact={contact} />
          )}
        </div>
      </section>
    </>
  );
}

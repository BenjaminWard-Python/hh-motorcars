import { useState, useEffect, useRef } from "react";

const ADMIN_PASSWORD = "HHMotorcars2024";

const SAMPLE_INVENTORY = [
  {
    id: "1",
    year: "1987",
    make: "Porsche",
    model: "911",
    trim: "Carrera Targa",
    price: "89500",
    mileage: "67,200",
    color: "Guards Red",
    vin: "WP0EB0915HS120XXX",
    status: "active",
    description: "Stunning G-body 911 Carrera Targa in Guards Red. Numbers matching engine, Fuchs wheels, recent major service including IMS bearing. A true driver's car in exceptional condition.",
    images: [],
    dateAdded: "2025-01-15",
  },
  {
    id: "2",
    year: "1993",
    make: "Porsche",
    model: "964",
    trim: "Carrera 2 Coupe",
    price: "124000",
    mileage: "44,800",
    color: "Midnight Blue Metallic",
    vin: "WP0AB2964PS420XXX",
    status: "active",
    description: "Exceptional 964 C2 with factory sport seats and limited-slip differential. Documented service history. Fresh clutch and brake refresh. One of the finest examples available.",
    images: [],
    dateAdded: "2025-02-01",
  },
  {
    id: "3",
    year: "1997",
    make: "Porsche",
    model: "993",
    trim: "Carrera 4S Coupe",
    price: "189000",
    mileage: "38,100",
    color: "Arctic Silver Metallic",
    vin: "WP0AA2997VS300XXX",
    status: "active",
    description: "Last of the air-cooled 911s — the legendary 993 C4S. Wide body, all-wheel drive, sport exhaust. Meticulously maintained with full HH Motorcars inspection completed.",
    images: [],
    dateAdded: "2025-02-10",
  },
];

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const formatPrice = (p) => {
  const n = parseInt(p.replace(/\D/g, ""), 10);
  return isNaN(n) ? p : "$" + n.toLocaleString();
};

// ─── Color palette & style constants ───────────────────────────────────────────
const C = {
  bg: "#0f0e0d",
  card: "#1a1916",
  cardBorder: "#2e2c28",
  accent: "#c9a84c",
  accentDark: "#a8883a",
  text: "#e8e4dc",
  muted: "#7a7468",
  red: "#c0392b",
  green: "#2ecc71",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: ${C.bg}; color: ${C.text}; font-family: 'Barlow', sans-serif; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.cardBorder}; border-radius: 3px; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

  .card-hover {
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.5);
    border-color: ${C.accent}55 !important;
  }

  .btn-primary {
    background: ${C.accent};
    color: #0f0e0d;
    border: none;
    padding: 10px 22px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.15s ease;
    border-radius: 2px;
  }
  .btn-primary:hover { background: ${C.accentDark}; transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }

  .btn-ghost {
    background: transparent;
    color: ${C.text};
    border: 1px solid ${C.cardBorder};
    padding: 9px 20px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
    border-radius: 2px;
  }
  .btn-ghost:hover { border-color: ${C.accent}; color: ${C.accent}; }

  .btn-danger {
    background: transparent;
    color: ${C.red};
    border: 1px solid ${C.red}55;
    padding: 7px 16px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    border-radius: 2px;
  }
  .btn-danger:hover { background: ${C.red}22; border-color: ${C.red}; }

  input, textarea, select {
    background: #111010;
    border: 1px solid ${C.cardBorder};
    color: ${C.text};
    font-family: 'Barlow', sans-serif;
    font-size: 14px;
    padding: 10px 14px;
    border-radius: 2px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus, textarea:focus, select:focus { border-color: ${C.accent}; }
  select option { background: #1a1916; }

  label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${C.muted};
    display: block;
    margin-bottom: 6px;
  }

  .field-group { margin-bottom: 16px; }

  .tag {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 2px;
  }
`;

// ─── Placeholders when no image is uploaded ─────────────────────────────────
const CarPlaceholder = ({ color = C.muted }) => (
  <svg viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <rect width="300" height="160" fill="#111010" />
    <path d="M60 100 L80 70 Q100 55 130 55 L180 55 Q210 55 225 70 L245 100 Q255 105 255 115 L255 120 L45 120 L45 115 Q45 105 60 100Z" fill="#1e1c19" stroke={color} strokeWidth="1.5" />
    <path d="M85 70 Q100 58 120 58 L180 58 Q200 58 215 70Z" fill="#252320" />
    <circle cx="95" cy="120" r="16" fill="#111010" stroke={color} strokeWidth="1.5" />
    <circle cx="95" cy="120" r="8" fill="#1e1c19" />
    <circle cx="210" cy="120" r="16" fill="#111010" stroke={color} strokeWidth="1.5" />
    <circle cx="210" cy="120" r="8" fill="#1e1c19" />
    <text x="150" y="145" textAnchor="middle" fill={color} fontSize="9" fontFamily="sans-serif" letterSpacing="2">NO PHOTO</text>
  </svg>
);

// ─── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ view, setView, isAdmin, setIsAdmin }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(15,14,13,0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${C.cardBorder}`,
      padding: "0 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 64,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, border: `1px solid ${C.accent}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontFamily: "'Barlow Condensed'", fontWeight: 700,
          letterSpacing: 1, color: C.accent,
        }}>HH</div>
        <div>
          <div style={{ fontFamily: "'Playfair Display'", fontSize: 15, fontWeight: 600, lineHeight: 1 }}>HH Motorcars</div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 10, letterSpacing: 2, color: C.muted, textTransform: "uppercase" }}>Independent Porsche Center</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button className="btn-ghost" onClick={() => setView("public")}
          style={{ borderColor: view === "public" ? C.accent : C.cardBorder, color: view === "public" ? C.accent : C.text }}>
          For Sale
        </button>
        {isAdmin ? (
          <>
            <button className="btn-ghost" onClick={() => setView("admin")}
              style={{ borderColor: view === "admin" ? C.accent : C.cardBorder, color: view === "admin" ? C.accent : C.text }}>
              Manage Inventory
            </button>
            <button className="btn-danger" onClick={() => { setIsAdmin(false); setView("public"); }}>
              Log Out
            </button>
          </>
        ) : (
          <button className="btn-ghost" onClick={() => setView("login")}>
            Admin
          </button>
        )}
      </div>
    </nav>
  );
}

// ─── Public Inventory ─────────────────────────────────────────────────────────
function PublicInventory({ inventory }) {
  const [selected, setSelected] = useState(null);
  const active = inventory.filter(c => c.status === "active");

  if (selected) return <CarDetail car={selected} onBack={() => setSelected(null)} />;

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero strip */}
      <div style={{
        borderBottom: `1px solid ${C.cardBorder}`,
        padding: "40px 24px 32px",
        background: `linear-gradient(160deg, #171614 0%, ${C.bg} 60%)`,
      }}>
        <div style={{
          fontFamily: "'Barlow Condensed'", fontSize: 11, letterSpacing: 3,
          textTransform: "uppercase", color: C.accent, marginBottom: 10,
        }}>Cincinnati, Ohio</div>
        <h1 style={{
          fontFamily: "'Playfair Display'", fontSize: "clamp(28px, 4vw, 48px)",
          fontWeight: 700, lineHeight: 1.1, marginBottom: 12,
        }}>Current Inventory</h1>
        <p style={{ color: C.muted, fontSize: 15, maxWidth: 480, lineHeight: 1.6 }}>
          Curated classic Porsches — each inspected, serviced, and ready for the next enthusiast.
        </p>
        <div style={{ marginTop: 20, display: "flex", gap: 32 }}>
          {[["513.909.0280", "Phone"], ["sales@hhmotorcars.com", "Email"]].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 10, letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 14, color: C.text }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: "24px" }}>
        {active.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: C.muted }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>◎</div>
            <div style={{ fontFamily: "'Barlow Condensed'", letterSpacing: 2, textTransform: "uppercase" }}>No vehicles currently listed</div>
            <div style={{ fontSize: 13, marginTop: 8 }}>Check back soon or contact us directly</div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}>
            {active.map((car, i) => (
              <CarCard key={car.id} car={car} onClick={() => setSelected(car)} delay={i * 60} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CarCard({ car, onClick, delay = 0 }) {
  return (
    <div className="card-hover" onClick={onClick} style={{
      background: C.card, border: `1px solid ${C.cardBorder}`,
      borderRadius: 4, overflow: "hidden", cursor: "pointer",
      animation: `fadeIn 0.5s ease ${delay}ms both`,
    }}>
      {/* Image */}
      <div style={{ height: 200, background: "#0d0c0b", position: "relative", overflow: "hidden" }}>
        {car.images && car.images[0] ? (
          <img src={car.images[0]} alt={`${car.year} ${car.model}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <CarPlaceholder color={C.cardBorder} />
        )}
        <div style={{
          position: "absolute", bottom: 10, right: 10,
          background: "rgba(15,14,13,0.85)", backdropFilter: "blur(8px)",
          padding: "4px 10px", borderRadius: 2,
          fontFamily: "'Barlow Condensed'", fontSize: 16, fontWeight: 600,
          color: C.accent, letterSpacing: 0.5,
        }}>
          {formatPrice(car.price)}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "18px 20px 20px" }}>
        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 12, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
          {car.year}
        </div>
        <div style={{ fontFamily: "'Playfair Display'", fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
          {car.make} {car.model}
        </div>
        {car.trim && (
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 14 }}>{car.trim}</div>
        )}

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {car.mileage && (
            <div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginBottom: 2 }}>Miles</div>
              <div style={{ fontSize: 13 }}>{car.mileage}</div>
            </div>
          )}
          {car.color && (
            <div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginBottom: 2 }}>Color</div>
              <div style={{ fontSize: 13 }}>{car.color}</div>
            </div>
          )}
        </div>

        <div style={{
          marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.cardBorder}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ color: C.muted, fontSize: 12 }}>View Details →</span>
          <span style={{
            fontFamily: "'Barlow Condensed'", fontSize: 10, letterSpacing: 1.5,
            textTransform: "uppercase", color: C.green, background: `${C.green}15`,
            padding: "2px 8px", borderRadius: 2,
          }}>Available</span>
        </div>
      </div>
    </div>
  );
}

function CarDetail({ car, onBack }) {
  const [imgIdx, setImgIdx] = useState(0);
  const hasImages = car.images && car.images.length > 0;

  return (
    <div style={{ minHeight: "100vh", animation: "fadeIn 0.4s ease" }}>
      <div style={{ padding: "20px 40px", borderBottom: `1px solid ${C.cardBorder}` }}>
        <button className="btn-ghost" onClick={onBack}>← Back to Inventory</button>
      </div>

      <div style={{ padding: "40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 40 }}>
          {/* Left: images + description */}
          <div>
            <div style={{ background: "#0d0c0b", borderRadius: 4, overflow: "hidden", marginBottom: 12, height: 380, position: "relative" }}>
              {hasImages ? (
                <img src={car.images[imgIdx]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <CarPlaceholder color={C.cardBorder} />
              )}
            </div>
            {hasImages && car.images.length > 1 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {car.images.map((img, i) => (
                  <div key={i} onClick={() => setImgIdx(i)} style={{
                    width: 72, height: 48, borderRadius: 2, overflow: "hidden", cursor: "pointer",
                    border: `2px solid ${i === imgIdx ? C.accent : "transparent"}`,
                  }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: 32 }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 11, letterSpacing: 2, color: C.accent, textTransform: "uppercase", marginBottom: 8 }}>About This Vehicle</div>
              <p style={{ color: "#b8b2a8", lineHeight: 1.75, fontSize: 15 }}>{car.description}</p>
            </div>
          </div>

          {/* Right: details + CTA */}
          <div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 13, color: C.muted, letterSpacing: 2, marginBottom: 4 }}>{car.year}</div>
            <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 28, fontWeight: 700, lineHeight: 1.1, marginBottom: 4 }}>
              {car.make} {car.model}
            </h2>
            {car.trim && <div style={{ color: C.muted, fontSize: 15, marginBottom: 20 }}>{car.trim}</div>}

            <div style={{ fontSize: 30, fontFamily: "'Playfair Display'", fontWeight: 600, color: C.accent, marginBottom: 28 }}>
              {formatPrice(car.price)}
            </div>

            {/* Specs grid */}
            <div style={{ background: "#111010", borderRadius: 4, padding: 20, marginBottom: 20 }}>
              {[
                ["Year", car.year],
                ["Mileage", car.mileage],
                ["Color", car.color],
                ["VIN", car.vin],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${C.cardBorder}` }}>
                  <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 11, letterSpacing: 1.5, color: C.muted, textTransform: "uppercase" }}>{label}</span>
                  <span style={{ fontSize: 14, textAlign: "right" }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 4, padding: 20 }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 11, letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginBottom: 12 }}>Inquire About This Vehicle</div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.6 }}>
                Contact HH Motorcars to schedule a viewing or request additional details.
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 13, color: C.text, marginBottom: 4 }}>📞 513.909.0280</div>
                <div style={{ fontSize: 13, color: C.text }}>✉️ sales@hhmotorcars.com</div>
              </div>
              <a href="mailto:sales@hhmotorcars.com?subject=Inquiry: {car.year} {car.make} {car.model}" style={{ display: "block", textDecoration: "none" }}>
                <button className="btn-primary" style={{ width: "100%", marginTop: 12 }}>
                  Send Inquiry
                </button>
              </a>
            </div>

            <div style={{ marginTop: 16, fontSize: 12, color: C.muted, lineHeight: 1.6, textAlign: "center" }}>
              HH Motorcars · 16 East 72nd Street, Cincinnati, OH 45216
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function Login({ onSuccess }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const attempt = () => {
    if (pass === ADMIN_PASSWORD) { onSuccess(); setError(""); }
    else { setError("Incorrect password. Please try again."); }
  };

  return (
    <div style={{
      minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        background: C.card, border: `1px solid ${C.cardBorder}`,
        borderRadius: 4, padding: 40, width: "100%", maxWidth: 380,
        animation: "slideDown 0.3s ease",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 11, letterSpacing: 3, color: C.accent, textTransform: "uppercase", marginBottom: 8 }}>Admin Access</div>
          <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 22, fontWeight: 600 }}>Inventory Manager</h2>
        </div>

        <div className="field-group">
          <label>Password</label>
          <input
            type="password" value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && attempt()}
            placeholder="Enter admin password"
          />
        </div>

        {error && (
          <div style={{ color: C.red, fontSize: 13, marginBottom: 16, padding: "8px 12px", background: `${C.red}15`, borderRadius: 2 }}>
            {error}
          </div>
        )}

        <button className="btn-primary" onClick={attempt} style={{ width: "100%" }}>
          Enter
        </button>

        <div style={{ marginTop: 20, fontSize: 12, color: C.muted, textAlign: "center", lineHeight: 1.6 }}>
          Default password: <span style={{ color: C.text, fontFamily: "monospace" }}>HHMotorcars2024</span><br />
          Change this in the source code before deploying.
        </div>
      </div>
    </div>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel({ inventory, setInventory }) {
  const [editing, setEditing] = useState(null); // null = list, 'new' = new form, id = edit form
  const [confirmDelete, setConfirmDelete] = useState(null);

  const startNew = () => setEditing({
    id: generateId(), year: "", make: "Porsche", model: "", trim: "",
    price: "", mileage: "", color: "", vin: "", status: "active",
    description: "", images: [], dateAdded: new Date().toISOString().split("T")[0],
  });

  const save = (car) => {
    setInventory(prev => {
      const exists = prev.find(c => c.id === car.id);
      return exists ? prev.map(c => c.id === car.id ? car : c) : [car, ...prev];
    });
    setEditing(null);
  };

  const remove = (id) => {
    setInventory(prev => prev.filter(c => c.id !== id));
    setConfirmDelete(null);
  };

  const toggleStatus = (id) => {
    setInventory(prev => prev.map(c => c.id === id
      ? { ...c, status: c.status === "active" ? "sold" : "active" }
      : c
    ));
  };

  if (editing) {
    return <CarForm initial={editing} onSave={save} onCancel={() => setEditing(null)} />;
  }

  return (
    <div style={{ padding: "40px", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 11, letterSpacing: 3, color: C.accent, textTransform: "uppercase", marginBottom: 6 }}>
            Admin Panel
          </div>
          <h1 style={{ fontFamily: "'Playfair Display'", fontSize: 28, fontWeight: 700 }}>Manage Inventory</h1>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
            {inventory.filter(c => c.status === "active").length} active · {inventory.filter(c => c.status === "sold").length} sold
          </div>
        </div>
        <button className="btn-primary" onClick={startNew}>+ Add Vehicle</button>
      </div>

      {inventory.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
          <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>◎</div>
          <div>No vehicles yet. Add your first listing.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {inventory.map(car => (
            <div key={car.id} style={{
              background: C.card, border: `1px solid ${C.cardBorder}`,
              borderRadius: 4, padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 20,
              opacity: car.status === "sold" ? 0.6 : 1,
              animation: "fadeIn 0.3s ease",
            }}>
              {/* Mini photo */}
              <div style={{ width: 90, height: 60, flexShrink: 0, borderRadius: 2, overflow: "hidden", background: "#0d0c0b" }}>
                {car.images && car.images[0]
                  ? <img src={car.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <CarPlaceholder color={C.cardBorder} />
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
                  <span style={{ fontFamily: "'Playfair Display'", fontSize: 16, fontWeight: 600 }}>
                    {car.year} {car.make} {car.model}
                  </span>
                  {car.trim && <span style={{ fontSize: 12, color: C.muted }}>{car.trim}</span>}
                  <span className="tag" style={{
                    background: car.status === "active" ? `${C.green}20` : `${C.muted}20`,
                    color: car.status === "active" ? C.green : C.muted,
                  }}>
                    {car.status}
                  </span>
                </div>
                <div style={{ color: C.muted, fontSize: 13 }}>
                  {formatPrice(car.price)} {car.mileage && `· ${car.mileage} mi`} {car.color && `· ${car.color}`}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button className="btn-ghost" style={{ fontSize: 12, padding: "6px 14px" }} onClick={() => toggleStatus(car.id)}>
                  {car.status === "active" ? "Mark Sold" : "Relist"}
                </button>
                <button className="btn-ghost" style={{ fontSize: 12, padding: "6px 14px" }} onClick={() => setEditing(car)}>
                  Edit
                </button>
                {confirmDelete === car.id ? (
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn-danger" onClick={() => remove(car.id)}>Confirm</button>
                    <button className="btn-ghost" style={{ fontSize: 12, padding: "6px 10px" }} onClick={() => setConfirmDelete(null)}>✕</button>
                  </div>
                ) : (
                  <button className="btn-danger" onClick={() => setConfirmDelete(car.id)}>Remove</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Car Form ─────────────────────────────────────────────────────────────────
function CarForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const [imageInput, setImageInput] = useState("");
  const fileInputRef = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addImage = () => {
    const url = imageInput.trim();
    if (url) { set("images", [...(form.images || []), url]); setImageInput(""); }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        set("images", [...(form.images || []), ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i) => set("images", form.images.filter((_, idx) => idx !== i));

  const valid = form.year && form.model && form.price;

  return (
    <div style={{ padding: "40px", minHeight: "100vh", animation: "fadeIn 0.3s ease" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <button className="btn-ghost" onClick={onCancel} style={{ marginBottom: 16 }}>← Cancel</button>
          <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 24, fontWeight: 700 }}>
            {initial.year ? `Edit: ${initial.year} ${initial.model}` : "Add New Vehicle"}
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="field-group">
            <label>Year *</label>
            <input value={form.year} onChange={e => set("year", e.target.value)} placeholder="e.g. 1987" />
          </div>
          <div className="field-group">
            <label>Make *</label>
            <input value={form.make} onChange={e => set("make", e.target.value)} placeholder="e.g. Porsche" />
          </div>
          <div className="field-group">
            <label>Model *</label>
            <input value={form.model} onChange={e => set("model", e.target.value)} placeholder="e.g. 911" />
          </div>
          <div className="field-group">
            <label>Trim / Variant</label>
            <input value={form.trim} onChange={e => set("trim", e.target.value)} placeholder="e.g. Carrera Targa" />
          </div>
          <div className="field-group">
            <label>Price * (numbers only)</label>
            <input value={form.price} onChange={e => set("price", e.target.value)} placeholder="e.g. 89500" />
          </div>
          <div className="field-group">
            <label>Mileage</label>
            <input value={form.mileage} onChange={e => set("mileage", e.target.value)} placeholder="e.g. 67,200" />
          </div>
          <div className="field-group">
            <label>Color</label>
            <input value={form.color} onChange={e => set("color", e.target.value)} placeholder="e.g. Guards Red" />
          </div>
          <div className="field-group">
            <label>VIN</label>
            <input value={form.vin} onChange={e => set("vin", e.target.value)} placeholder="Vehicle Identification Number" />
          </div>
        </div>

        <div className="field-group">
          <label>Status</label>
          <select value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="active">Active — Visible on site</option>
            <option value="sold">Sold — Hidden from site</option>
          </select>
        </div>

        <div className="field-group">
          <label>Description</label>
          <textarea
            value={form.description} onChange={e => set("description", e.target.value)}
            rows={5} placeholder="Describe this vehicle — condition, notable features, recent work, history..."
            style={{ resize: "vertical" }}
          />
        </div>

        {/* Images */}
        <div className="field-group">
          <label>Photos</label>
          <div style={{ background: "#111010", border: `1px solid ${C.cardBorder}`, borderRadius: 2, padding: 16, marginBottom: 10 }}>
            {/* Upload from device */}
            <div style={{ marginBottom: 12 }}>
              <input
                type="file" accept="image/*" multiple ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <button className="btn-ghost" onClick={() => fileInputRef.current.click()} style={{ width: "100%", marginBottom: 8 }}>
                📁 Upload Photos from Device
              </button>
            </div>

            {/* Or paste URL */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                value={imageInput} onChange={e => setImageInput(e.target.value)}
                placeholder="Or paste an image URL and click Add"
                onKeyDown={e => e.key === "Enter" && addImage()}
                style={{ flex: 1 }}
              />
              <button className="btn-ghost" onClick={addImage} style={{ flexShrink: 0, whiteSpace: "nowrap" }}>Add URL</button>
            </div>
          </div>

          {form.images && form.images.length > 0 && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {form.images.map((img, i) => (
                <div key={i} style={{ position: "relative", width: 100, height: 70 }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 2 }} />
                  <button onClick={() => removeImage(i)} style={{
                    position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.8)",
                    border: "none", color: "#fff", width: 20, height: 20, borderRadius: "50%",
                    cursor: "pointer", fontSize: 12, lineHeight: 1,
                  }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button className="btn-primary" onClick={() => onSave(form)} disabled={!valid}
            style={{ opacity: valid ? 1 : 0.4, cursor: valid ? "pointer" : "not-allowed" }}>
            Save Vehicle
          </button>
          <button className="btn-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("public");
  const [isAdmin, setIsAdmin] = useState(false);
  const [inventory, setInventory] = useState(SAMPLE_INVENTORY);
  const [loaded, setLoaded] = useState(false);

  // Persist inventory via storage API
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("hh-inventory");
        if (result && result.value) {
          setInventory(JSON.parse(result.value));
        }
      } catch {
        // First run, use sample data
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await window.storage.set("hh-inventory", JSON.stringify(inventory));
      } catch (e) {
        console.error("Storage error:", e);
      }
    })();
  }, [inventory, loaded]);

  const handleLogin = () => { setIsAdmin(true); setView("admin"); };

  if (!loaded) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: C.muted }}>
        <div style={{ animation: "pulse 1.2s ease infinite" }}>Loading…</div>
      </div>
    );
  }

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
        <Nav view={view} setView={setView} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

        {view === "public" && <PublicInventory inventory={inventory} />}
        {view === "login" && <Login onSuccess={handleLogin} />}
        {view === "admin" && isAdmin && <AdminPanel inventory={inventory} setInventory={setInventory} />}
      </div>
    </>
  );
}
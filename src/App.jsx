import { useState, useEffect, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "HHMotorcars2024";

const SAMPLE_INVENTORY = [
  {
    id: "1", year: "1987", make: "Porsche", model: "911", trim: "Carrera Targa",
    price: "89500", mileage: "67,200", color: "Guards Red", vin: "WP0EB0915HS120XXX",
    status: "active",
    description: "Stunning G-body 911 Carrera Targa in Guards Red. Numbers matching engine, Fuchs wheels, recent major service including IMS bearing. A true driver's car in exceptional condition.",
    images: [], dateAdded: "2025-01-15",
  },
  {
    id: "2", year: "1993", make: "Porsche", model: "964", trim: "Carrera 2 Coupe",
    price: "124000", mileage: "44,800", color: "Midnight Blue Metallic", vin: "WP0AB2964PS420XXX",
    status: "active",
    description: "Exceptional 964 C2 with factory sport seats and limited-slip differential. Documented service history. Fresh clutch and brake refresh. One of the finest examples available.",
    images: [], dateAdded: "2025-02-01",
  },
  {
    id: "3", year: "1997", make: "Porsche", model: "993", trim: "Carrera 4S Coupe",
    price: "189000", mileage: "38,100", color: "Arctic Silver Metallic", vin: "WP0AA2997VS300XXX",
    status: "active",
    description: "Last of the air-cooled 911s — the legendary 993 C4S. Wide body, all-wheel drive, sport exhaust. Meticulously maintained with full HH Motorcars inspection completed.",
    images: [], dateAdded: "2025-02-10",
  },
];

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
const formatPrice = (p) => {
  const n = parseInt(String(p).replace(/\D/g, ""), 10);
  return isNaN(n) ? p : "$" + n.toLocaleString();
};

const C = {
  black: "#111111",
  white: "#ffffff",
  offwhite: "#f7f6f4",
  border: "#e0ddd8",
  accent: "#b8860b",
  accentLight: "#d4a017",
  text: "#1a1a1a",
  muted: "#6b6560",
  lightgray: "#f0eeeb",
  red: "#c0392b",
  green: "#2a7a2a",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #fff; color: ${C.text}; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  .fade-up { animation: fadeUp 0.6s ease both; }
  .fade-up-2 { animation: fadeUp 0.6s ease 0.1s both; }
  .fade-up-3 { animation: fadeUp 0.6s ease 0.2s both; }

  .hh-nav {
    position: sticky; top: 0; z-index: 200;
    background: ${C.black};
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; height: 68px;
    border-bottom: 1px solid #222;
  }
  .hh-nav-logo { display: flex; align-items: center; gap: 14px; cursor: pointer; }
  .hh-nav-badge {
    width: 38px; height: 38px; border: 1.5px solid ${C.accent};
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500;
    color: ${C.accent}; letter-spacing: 1px; flex-shrink: 0;
  }
  .hh-nav-name { color: #fff; font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; line-height: 1; }
  .hh-nav-sub { color: #888; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
  .hh-nav-links { display: flex; align-items: center; gap: 4px; }
  .hh-nav-link {
    color: #ccc; font-size: 12px; font-weight: 500; letter-spacing: 1.5px;
    text-transform: uppercase; padding: 8px 16px; cursor: pointer;
    border: 1px solid transparent; transition: color 0.2s, border-color 0.2s, background 0.2s;
    background: none; font-family: 'DM Sans', sans-serif;
  }
  .hh-nav-link:hover { color: #fff; }
  .hh-nav-link.active { color: ${C.accent}; border-color: ${C.accent}44; }
  .hh-nav-link.cta { color: ${C.accent}; border-color: ${C.accent}; margin-left: 8px; }
  .hh-nav-link.cta:hover { background: ${C.accent}; color: #000; }

  .page-hero {
    background: ${C.black}; color: #fff;
    padding: 80px 80px 72px;
    border-bottom: 3px solid ${C.accent};
  }
  .page-hero-eyebrow {
    font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 3px;
    text-transform: uppercase; color: ${C.accent}; margin-bottom: 16px;
  }
  .page-hero h1 {
    font-family: 'Cormorant Garamond', serif; font-size: clamp(40px, 5vw, 72px);
    font-weight: 600; line-height: 1.05; margin-bottom: 20px;
  }
  .page-hero p { font-size: 16px; color: #bbb; line-height: 1.7; max-width: 560px; }

  .section { padding: 72px 80px; }
  .section-alt { background: ${C.offwhite}; }
  .section-black { background: ${C.black}; color: #fff; padding: 72px 80px; }
  .section-title {
    font-family: 'Cormorant Garamond', serif; font-size: clamp(28px, 3vw, 42px);
    font-weight: 600; line-height: 1.1; margin-bottom: 16px; color: ${C.text};
  }
  .section-title.white { color: #fff; }
  .section-eyebrow {
    font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 3px;
    text-transform: uppercase; color: ${C.accent}; margin-bottom: 12px;
  }
  .section-body { font-size: 15px; line-height: 1.75; color: ${C.muted}; }
  .gold-rule { width: 48px; height: 2px; background: ${C.accent}; margin: 20px 0; }

  .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-top: 40px; }
  .card-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 40px; }

  .info-card {
    background: #fff; border: 1px solid ${C.border}; padding: 32px;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .info-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .info-card h3 { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; margin-bottom: 10px; }
  .info-card p { font-size: 14px; line-height: 1.7; color: ${C.muted}; }

  .review-card { border-left: 3px solid ${C.accent}; padding: 24px 28px; background: #fff; }
  .review-text { font-size: 14px; line-height: 1.75; color: ${C.muted}; font-style: italic; margin-bottom: 12px; }
  .review-stars { color: ${C.accent}; font-size: 13px; margin-bottom: 4px; }

  .service-list { list-style: none; }
  .service-list li {
    padding: 14px 0; border-bottom: 1px solid ${C.border};
    display: flex; align-items: flex-start; gap: 16px; font-size: 15px; line-height: 1.6;
  }
  .service-list li::before { content: '—'; color: ${C.accent}; flex-shrink: 0; font-weight: 600; }

  .contact-bar {
    background: ${C.black}; color: #fff;
    display: flex; align-items: center; justify-content: space-between;
    padding: 32px 80px; gap: 24px; flex-wrap: wrap;
    border-top: 3px solid ${C.accent};
  }
  .contact-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #888; font-family: 'DM Mono', monospace; margin-bottom: 4px; }
  .contact-value { font-size: 15px; color: #fff; }

  .hh-footer {
    background: #0a0a0a; color: #555; padding: 24px 80px;
    font-size: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
  }

  .btn-primary {
    display: inline-block; background: ${C.black}; color: #fff;
    padding: 12px 28px; font-size: 12px; font-weight: 500; letter-spacing: 1.5px;
    text-transform: uppercase; cursor: pointer; border: none;
    font-family: 'DM Sans', sans-serif; transition: background 0.2s; text-decoration: none;
  }
  .btn-primary:hover { background: #333; }
  .btn-outline {
    display: inline-block; background: transparent; color: ${C.black};
    padding: 11px 28px; font-size: 12px; font-weight: 500; letter-spacing: 1.5px;
    text-transform: uppercase; cursor: pointer; border: 1.5px solid ${C.black};
    font-family: 'DM Sans', sans-serif; transition: background 0.2s, color 0.2s; text-decoration: none;
  }
  .btn-outline:hover { background: ${C.black}; color: #fff; }
  .btn-gold {
    display: inline-block; background: ${C.accent}; color: #fff;
    padding: 12px 28px; font-size: 12px; font-weight: 500; letter-spacing: 1.5px;
    text-transform: uppercase; cursor: pointer; border: none;
    font-family: 'DM Sans', sans-serif; transition: background 0.2s; text-decoration: none;
  }
  .btn-gold:hover { background: ${C.accentLight}; }

  .inv-card {
    background: #fff; border: 1px solid ${C.border}; overflow: hidden; cursor: pointer;
    transition: box-shadow 0.25s, transform 0.25s;
  }
  .inv-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.1); transform: translateY(-3px); }
  .inv-card-img { height: 210px; background: ${C.lightgray}; position: relative; overflow: hidden; }
  .inv-card-img img { width: 100%; height: 100%; object-fit: cover; }
  .inv-price-badge {
    position: absolute; bottom: 12px; right: 12px;
    background: ${C.black}; color: #fff;
    padding: 5px 12px; font-family: 'DM Mono', monospace; font-size: 14px;
  }
  .inv-card-body { padding: 20px 22px 22px; }
  .inv-year { font-size: 11px; letter-spacing: 2px; color: ${C.muted}; text-transform: uppercase; font-family: 'DM Mono', monospace; margin-bottom: 4px; }
  .inv-name { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; margin-bottom: 2px; }
  .inv-trim { font-size: 13px; color: ${C.muted}; margin-bottom: 14px; }
  .inv-specs { display: flex; gap: 20px; flex-wrap: wrap; }
  .inv-spec-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: ${C.muted}; margin-bottom: 2px; font-family: 'DM Mono', monospace; }
  .inv-spec-val { font-size: 13px; color: ${C.text}; }
  .inv-card-footer { margin-top: 16px; padding-top: 14px; border-top: 1px solid ${C.border}; display: flex; justify-content: space-between; align-items: center; }
  .available-badge { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: ${C.green}; background: #e8f5e8; padding: 3px 10px; font-family: 'DM Mono', monospace; }

  .admin-row {
    background: #fff; border: 1px solid ${C.border}; padding: 16px 20px;
    display: flex; align-items: center; gap: 20px; margin-bottom: 10px; transition: box-shadow 0.2s;
  }
  .admin-row:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.06); }

  input, textarea, select {
    background: #fff; border: 1px solid ${C.border}; color: ${C.text};
    font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 10px 14px;
    width: 100%; outline: none; transition: border-color 0.2s;
  }
  input:focus, textarea:focus, select:focus { border-color: ${C.black}; }
  label { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: ${C.muted}; display: block; margin-bottom: 6px; font-family: 'DM Mono', monospace; }
  .field-group { margin-bottom: 16px; }

  .btn-ghost-sm {
    background: transparent; color: ${C.text}; border: 1px solid ${C.border};
    padding: 7px 16px; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;
    cursor: pointer; transition: border-color 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .btn-ghost-sm:hover { border-color: ${C.black}; }
  .btn-danger-sm {
    background: transparent; color: ${C.red}; border: 1px solid ${C.red}55;
    padding: 7px 14px; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;
    cursor: pointer; transition: background 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .btn-danger-sm:hover { background: #fef2f2; }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
  .two-col-img { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }

  @media (max-width: 900px) {
    .hh-nav { padding: 0 20px; }
    .hh-nav-sub { display: none; }
    .page-hero { padding: 48px 24px; }
    .section { padding: 48px 24px; }
    .section-black { padding: 48px 24px; }
    .contact-bar { padding: 24px; flex-direction: column; align-items: flex-start; }
    .hh-footer { padding: 20px 24px; flex-direction: column; }
    .two-col, .two-col-img, .card-grid-3 { grid-template-columns: 1fr; gap: 32px; }
  }
`;

// ─── Shared ───────────────────────────────────────────────────────────────────
function CarSVG() {
  return (
    <svg viewBox="0 0 400 220" fill="none" style={{ width: "100%", height: "100%" }}>
      <rect width="400" height="220" fill={C.lightgray} />
      <path d="M80 138 L105 98 Q130 75 170 74 L240 74 Q280 74 300 98 L325 138 Q340 144 340 158 L340 164 L60 164 L60 158 Q60 144 80 138Z" fill="#e0ddd8" stroke={C.border} strokeWidth="2" />
      <path d="M110 98 Q132 80 162 80 L238 80 Q268 80 290 98Z" fill="#d0ccc8" />
      <circle cx="120" cy="164" r="22" fill="#fff" stroke={C.border} strokeWidth="2" />
      <circle cx="120" cy="164" r="10" fill={C.lightgray} />
      <circle cx="280" cy="164" r="22" fill="#fff" stroke={C.border} strokeWidth="2" />
      <circle cx="280" cy="164" r="10" fill={C.lightgray} />
      <text x="200" y="200" textAnchor="middle" fill={C.muted} fontSize="11" fontFamily="monospace" letterSpacing="3">NO PHOTO</text>
    </svg>
  );
}

function ContactBar() {
  return (
    <div className="contact-bar">
      {[["Phone","513.909.0280"],["Email","sales@hhmotorcars.com"],["Address","16 East 72nd Street, Cincinnati, OH 45216"],["Hours","Mon–Fri 8am–5pm"]].map(([l,v]) => (
        <div key={l}><div className="contact-label">{l}</div><div className="contact-value">{v}</div></div>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="hh-footer">
      <div>© {new Date().getFullYear()} HH Motorcars, LLC · 16 East 72nd Street, Cincinnati, OH 45216</div>
      <div>HH Motorcars is not affiliated with Porsche Cars North America or Porsche AG.</div>
    </footer>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ page, setPage, isAdmin, setIsAdmin }) {
  return (
    <nav className="hh-nav">
      <div className="hh-nav-logo" onClick={() => setPage("about")}>
        <div className="hh-nav-badge">HH</div>
        <div>
          <div className="hh-nav-name">HH Motorcars</div>
          <div className="hh-nav-sub">Independent Porsche Center</div>
        </div>
      </div>
      <div className="hh-nav-links">
        {[["about","About Us"],["service","Service"],["restoration","Restoration"],["sales","For Sale"]].map(([id,label]) => (
          <button key={id} className={`hh-nav-link${page===id?" active":""}`} onClick={() => setPage(id)}>{label}</button>
        ))}
        {isAdmin ? (
          <>
            <button className={`hh-nav-link${page==="admin"?" active":""}`} onClick={() => setPage("admin")}>Manage</button>
            <button className="hh-nav-link" style={{color:C.red}} onClick={() => { setIsAdmin(false); setPage("about"); }}>Log Out</button>
          </>
        ) : (
          <button className="hh-nav-link" style={{color:"#555",fontSize:11}} onClick={() => setPage("login")}>Admin</button>
        )}
        <a href="tel:5139090280" className="hh-nav-link cta">Call Us</a>
      </div>
    </nav>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutPage({ setPage }) {
  const reviews = [
    { text: "My relationship with HH Motorcars began in 2021. Throughout the restoration process, I found the HH Team extremely knowledgeable in all aspects regarding these vintage vehicles. Their attention to detail while maintaining the authenticity of the final product confirmed that my choice to utilize HH Motorcars was correct.", stars: 5 },
    { text: "HH Motorcars is an excellent choice for the Porsche enthusiast. Whether you own a vintage or newer model, HH Motorcars is a modern facility with the specific tools and equipment to properly service your Porsche. Personalized service, expert advice and timely repairs — HH is a fantastic option.", stars: 5 },
    { text: "HH Motorcars is a fabulous place to buy and maintain a Porsche. They are extremely knowledgeable about these cars. My wife liked our car so much that with their help, I bought her one. I tell everyone: if you are going to buy a Porsche, use HH Motorcars.", stars: 5 },
    { text: "Hired HH to do a PPI on a GT3 I was buying out of state and sight unseen. They were very patient, helpful, and super knowledgeable about the platform. You can definitely tell these guys know Porsche.", stars: 5 },
  ];
  return (
    <div>
      <div className="page-hero">
        <div className="page-hero-eyebrow fade-up">Cincinnati, Ohio · Est. 2010</div>
        <h1 className="fade-up-2">The Right Caretaker<br />for Your Dream Car.</h1>
        <p className="fade-up-3">HH Motorcars is Cincinnati's premier independent Porsche dealer, service center, and restoration shop — with over a decade of expertise in acquiring, selling, and restoring classic Porsche models.</p>
        <div style={{marginTop:36,display:"flex",gap:12,flexWrap:"wrap"}}>
          <button className="btn-gold fade-up-3" onClick={() => setPage("sales")}>Browse Inventory</button>
          <button className="btn-outline" style={{color:"#fff",borderColor:"#fff"}} onClick={() => setPage("service")}>Our Services</button>
        </div>
      </div>

      <div className="section">
        <div className="two-col">
          <div>
            <div className="section-eyebrow">Our Mission</div>
            <h2 className="section-title">Offering the Best in Sales, Service & Restoration</h2>
            <div className="gold-rule" />
            <p className="section-body" style={{marginBottom:16}}>For classic Porsche enthusiasts, HH Motorcars provides a specialized, detailed, and passion-driven approach to service, sales and restoration. HH Motorcars is a great choice for those who value quality and expertise.</p>
            <p className="section-body">HH understands the intricacies of Porsche builds, from classic restorations to contemporary modifications. Their award-winning restoration shop has garnered recognition for its commitment to delivering outstanding results. With technicians well-versed in engine rebuilding and comprehensive Porsche servicing, HH Motorcars ensures that your prized possession receives the utmost care.</p>
          </div>
          <div>
            <div style={{background:C.black,padding:40,color:"#fff",marginBottom:2}}>
              <div style={{fontFamily:"'Cormorant Garamond', serif",fontSize:20,fontStyle:"italic",lineHeight:1.6,color:"#ddd",marginBottom:20}}>
                "Those lucky enough to own their dream car, owe it to themselves to find the right caretaker of their dream."
              </div>
              <div style={{width:32,height:2,background:C.accent,marginBottom:12}} />
              <div style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"#888"}}>HH Motorcars</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2}}>
              {[["10+","Years Experience"],["500+","Porsches Serviced"],["Award","Winning Restoration"],["5★","Google Reviews"]].map(([val,label]) => (
                <div key={label} style={{background:C.offwhite,padding:"22px 16px",textAlign:"center"}}>
                  <div style={{fontFamily:"'Cormorant Garamond', serif",fontSize:28,fontWeight:600,color:C.accent}}>{val}</div>
                  <div style={{fontSize:10,letterSpacing:1.5,textTransform:"uppercase",color:C.muted,marginTop:4}}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section section-alt">
        <div className="section-eyebrow">Why HH Motorcars?</div>
        <h2 className="section-title">A Passion-Driven Approach</h2>
        <div className="gold-rule" />
        <div className="card-grid-3">
          {[
            {title:"Passion, Not Pressure",body:"Our goal is to find the highest and best match of Porsche to a new owner. We take the time to understand what you want and guide you to the right car."},
            {title:"Top Value",body:"We understand the true value of a Porsche and, more importantly, how to maintain or enhance its value. Our expertise protects your investment."},
            {title:"Purpose",body:"It's not only an acquisition — it's how the car will be maintained, driven and cared for. We build lasting relationships with every client and their car."},
            {title:"Specialized Knowledge",body:"Our technicians have deep expertise in classic Porsche models that dealerships simply cannot match. We know these cars inside and out."},
            {title:"Genuine Parts",body:"We maintain relationships with Porsche dealers and trusted suppliers to source factory-stamped and OEM-quality parts for every repair and restoration."},
            {title:"Community",body:"HH Motorcars sponsors and organizes drives and events, connecting enthusiasts and helping you get the most out of your Porsche experience."},
          ].map(c => (
            <div className="info-card" key={c.title}>
              <div style={{width:28,height:2,background:C.accent,marginBottom:16}} />
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-eyebrow">Client Reviews</div>
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="gold-rule" />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:32}}>
          {reviews.map((r,i) => (
            <div className="review-card" key={i}>
              <div className="review-stars">{"★".repeat(r.stars)}</div>
              <p className="review-text">"{r.text}"</p>
              <div style={{fontSize:11,letterSpacing:1.5,textTransform:"uppercase",color:C.muted}}>Verified Google Review</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:28}}>
          <a href="https://www.google.com/maps/place/HH+Motorcars" target="_blank" rel="noreferrer" className="btn-outline">View All Reviews on Google</a>
        </div>
      </div>

      <ContactBar /><Footer />
    </div>
  );
}

// ─── Service ──────────────────────────────────────────────────────────────────
function ServicePage() {
  return (
    <div>
      <div className="page-hero">
        <div className="page-hero-eyebrow">Classic Porsche Service</div>
        <h1>Expert Service,<br />Done the Right Way.</h1>
        <p>From routine maintenance to major mechanical work, HH Motorcars follows factory specifications using the proper tools, parts, and procedures — because every element of your Porsche matters.</p>
      </div>

      <div className="section">
        <div className="two-col">
          <div>
            <div className="section-eyebrow">Independent Porsche Specialists</div>
            <h2 className="section-title">The Path to Proper Porsche Care</h2>
            <div className="gold-rule" />
            <p className="section-body" style={{marginBottom:16}}>The path to maintaining and repairing your Porsche can indeed be intimidating. At HH Motorcars, our process and procedures follow factory specifications so you can have confidence in every repair.</p>
            <p className="section-body" style={{marginBottom:16}}>Classic models — 356, 911, 912, 924, 928, 944, 968, 996, 997, 991, Boxster, Cayman, Cayenne, Macan and Panamera — are our specialty. While dealership technicians focus on newer models, our team brings deep expertise to the classics that deserve it most.</p>
            <p className="section-body">We maintain close relationships with Porsche dealerships and trusted suppliers to ensure access to factory-stamped and OEM-quality parts, ensuring every repair is done right.</p>
          </div>
          <div style={{background:C.offwhite,padding:36}}>
            <div className="section-eyebrow" style={{marginBottom:20}}>Models We Service</div>
            {["Porsche 356 (1948–1965)","Porsche 911 F / G Body (1964–1989)","Porsche 964 & 993 (1989–1998)","Porsche 996 & 997 (1998–2013)","Porsche 991 (2011–2019)","Porsche Boxster & Cayman","Porsche Cayenne & Macan","Porsche Panamera","Porsche 914, 924, 928, 944, 968"].map(m => (
              <div key={m} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`,fontSize:14,display:"flex",gap:12,alignItems:"center"}}>
                <span style={{color:C.accent,fontWeight:600}}>—</span><span>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section section-alt">
        <div className="section-eyebrow">Our Process</div>
        <h2 className="section-title">How We Approach Every Service</h2>
        <div className="gold-rule" />
        <div className="card-grid-3">
          {[
            {num:"01",title:"Identifying the Problem",body:"Porsches, especially older air-cooled models, require experience and specific skills to diagnose. Logic and deductive reasoning drawn from genuine experience is critical."},
            {num:"02",title:"Inspection & Assessment",body:"We perform a thorough assessment of your vehicle, documenting issues and communicating transparently before any work begins. No surprises."},
            {num:"03",title:"Genuine Parts",body:"We source factory Porsche-stamped parts, OEM, or quality aftermarket alternatives — always recommending what's best for your specific car and budget."},
            {num:"04",title:"Precision Labor",body:"Repairing a Porsche requires precision. Our technicians are experienced with the interdependent systems of classic models and take nothing for granted."},
            {num:"05",title:"Testing & Verification",body:"After every repair, we conduct proper post-service testing to confirm all repairs are working optimally and safely before returning your car."},
            {num:"06",title:"Preventative Guidance",body:"We advise on timely service intervals and proper driving habits to keep your Porsche in peak condition and protect its long-term value."},
          ].map(s => (
            <div className="info-card" key={s.num}>
              <div style={{fontFamily:"'Cormorant Garamond', serif",fontSize:36,fontWeight:600,color:C.border,marginBottom:12}}>{s.num}</div>
              <h3>{s.title}</h3><p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="two-col">
          <div>
            <div className="section-eyebrow">Services Offered</div>
            <h2 className="section-title">Full-Service Porsche Care</h2>
            <div className="gold-rule" />
            <ul className="service-list">
              {["Engine rebuilding and comprehensive servicing","Transmission and transaxle repair","Scheduled maintenance and oil service","Brake service and suspension work","Diagnostic and electrical work","IMS bearing service (996/997 Boxster)","Air conditioning and heating systems","Pre-purchase inspections (PPI)","Concours preparation","Audio and navigational upgrades","Cosmetic revitalization"].map(s => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div>
            <div className="section-eyebrow">Dealership vs. Independent</div>
            <h2 className="section-title">Why Choose an Independent Specialist?</h2>
            <div className="gold-rule" />
            <p className="section-body" style={{marginBottom:16}}>Porsche dealerships are always an option — and for newer models under warranty, they are often the right choice. But for classic models, an independent specialist like HH Motorcars is frequently the better path.</p>
            <p className="section-body" style={{marginBottom:16}}>Dealership technicians' training and resources are focused on current models. Older models receive less specialized support at a dealership than they once did.</p>
            <p className="section-body" style={{marginBottom:32}}>Our technicians have the hands-on knowledge, the specialized tooling, and the genuine passion for classic Porsches that keeps your car running as it was meant to.</p>
            <a href="tel:5139090280" className="btn-primary">Schedule Service — 513.909.0280</a>
          </div>
        </div>
      </div>

      <ContactBar /><Footer />
    </div>
  );
}

// ─── Restoration ──────────────────────────────────────────────────────────────
function RestorationPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="page-hero-eyebrow">Restoration & Metal Fabrication</div>
        <h1>Where Art Meets<br />Engineering.</h1>
        <p>HH Motorcars' award-winning restoration shop brings classic Porsches back to life. From sympathetic restorations to full concours rebuilds — done the right way, with the right tools, without compromise.</p>
      </div>

      <div className="section">
        <div className="two-col">
          <div>
            <div className="section-eyebrow">Our Philosophy</div>
            <h2 className="section-title">No Corners Cut. Ever.</h2>
            <div className="gold-rule" />
            <p className="section-body" style={{marginBottom:16}}>Restoration and preservation of classic Porsches is becoming more of an art than a trade. The demand for authenticity, historical accuracy, and mechanical integrity has never been higher — and at HH Motorcars, we meet that standard on every build.</p>
            <p className="section-body" style={{marginBottom:16}}>Whether the goal is a sympathetic restoration that preserves patina and originality, or a full ground-up rebuild to factory-new condition, we approach every car with the same attention to detail.</p>
            <p className="section-body">Porsche defines a classic as a model not mass-produced for at least 10 years. We know, appreciate, and have a genuine passion for these vehicles.</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            {[
              {title:"Organization",body:"Organizing the restoration process is key. Our experience means every build is planned and documented from start to finish — no surprises, no shortcuts."},
              {title:"Detail Oriented",body:"From sympathetic restorations to full rebuilds, there are no corners to be cut. Every fastener, every gasket, every surface receives our full attention."},
              {title:"Best Practices & Tooling",body:"We use the tried and true methods along with the proper tools and techniques. The right process for the right car, every time."},
            ].map(p => (
              <div key={p.title} style={{background:C.offwhite,padding:28}}>
                <div style={{width:24,height:2,background:C.accent,marginBottom:12}} />
                <div style={{fontFamily:"'Cormorant Garamond', serif",fontSize:18,fontWeight:600,marginBottom:8}}>{p.title}</div>
                <p style={{fontSize:14,color:C.muted,lineHeight:1.7}}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section section-alt">
        <div className="section-eyebrow">Restoration Services</div>
        <h2 className="section-title">From Preservation to Full Rebuild</h2>
        <div className="gold-rule" />
        <div className="card-grid-3">
          {[
            {title:"Sympathetic Restoration",body:"For cars with valuable patina and history, we carefully preserve originality while addressing mechanical and safety concerns. Authentic, honest, and correct."},
            {title:"Full Restoration",body:"A complete disassembly, inspection, rebuild, and refinishing to as-new or better-than-new condition. Every system addressed. Every surface perfect."},
            {title:"Metal Fabrication",body:"Our in-house metal fabrication capabilities allow us to address rust, accident damage, and missing pieces with craftsmanship that matches the original factory work."},
            {title:"Engine Rebuilding",body:"Flat-six rebuilds for air-cooled and water-cooled Porsches. We rebuild to factory specification using genuine or OEM-quality components with full documentation."},
            {title:"Concours Preparation",body:"Preparing your Porsche for show? We know what judges look for and bring the detail, documentation, and presentation your car deserves."},
            {title:"Overland Builds",body:"Our unique Cayenne Overland program transforms the 958-generation Cayenne into a capable, stylish adventure vehicle with HH-designed custom components."},
          ].map(c => (
            <div className="info-card" key={c.title}>
              <div style={{width:28,height:2,background:C.accent,marginBottom:16}} />
              <h3>{c.title}</h3><p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section-black">
        <div className="section-eyebrow">Notable Projects</div>
        <h2 className="section-title white">Featured Restorations</h2>
        <div className="gold-rule" />
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))",gap:24,marginTop:32}}>
          {[
            {title:"1970 Porsche 914/6",desc:"Full restoration of a rare 914/6 — one of only 3,351 ever produced. Complete mechanical and body restoration to period-correct specification.",link:"https://hhmotorcars.com/1970porsche914-6"},
            {title:"1973 Porsche 911 RS",desc:"Restoration of a legendary Carrera RS. Meticulous attention to authenticity, correct Fuchs wheels, correct livery, and full mechanical rebuild.",link:"https://youtube.com/shorts/0FCSS2czpcE"},
            {title:"1983 Porsche 911SC",desc:"Full engine restoration on a beautiful 911SC. Complete disassembly, inspection, rebuild, and dyno verification before delivery.",link:"https://youtube.com/shorts/R37SyN3Bfyw"},
          ].map(p => (
            <div key={p.title} style={{border:`1px solid #333`,padding:32}}>
              <div style={{width:28,height:2,background:C.accent,marginBottom:16}} />
              <div style={{fontFamily:"'Cormorant Garamond', serif",fontSize:20,fontWeight:600,color:"#fff",marginBottom:10}}>{p.title}</div>
              <p style={{fontSize:14,color:"#888",lineHeight:1.7,marginBottom:20}}>{p.desc}</p>
              <a href={p.link} target="_blank" rel="noreferrer" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:C.accent,textDecoration:"none",borderBottom:`1px solid ${C.accent}44`,paddingBottom:2}}>View Project →</a>
            </div>
          ))}
        </div>
      </div>

      <div className="section" style={{textAlign:"center"}}>
        <div className="section-eyebrow" style={{textAlign:"center"}}>Start Your Project</div>
        <h2 className="section-title" style={{textAlign:"center",maxWidth:520,margin:"0 auto 16px"}}>Ready to Restore Your Classic Porsche?</h2>
        <div style={{width:48,height:2,background:C.accent,margin:"0 auto 24px"}} />
        <p style={{fontSize:15,color:C.muted,maxWidth:480,margin:"0 auto 32px",lineHeight:1.75}}>Every restoration begins with a conversation. Contact us to discuss your car, your goals, and how HH Motorcars can bring your vision to life.</p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <a href="tel:5139090280" className="btn-primary">Call 513.909.0280</a>
          <a href="mailto:sales@hhmotorcars.com" className="btn-outline">Email Us</a>
        </div>
      </div>

      <ContactBar /><Footer />
    </div>
  );
}

// ─── Sales ────────────────────────────────────────────────────────────────────
function SalesPage({ inventory }) {
  const [selected, setSelected] = useState(null);
  const active = inventory.filter(c => c.status === "active");
  if (selected) return <CarDetail car={selected} onBack={() => setSelected(null)} />;

  return (
    <div>
      <div className="page-hero">
        <div className="page-hero-eyebrow">Current Inventory</div>
        <h1>Classic Porsches,<br />Carefully Curated.</h1>
        <p>Every vehicle in our inventory has been inspected and vetted by our team. We find the highest and best match of Porsche to new owner — with passion, not pressure.</p>
      </div>

      <div className="section">
        {active.length === 0 ? (
          <div style={{textAlign:"center",padding:"80px 0",color:C.muted}}>
            <div style={{fontFamily:"'Cormorant Garamond', serif",fontSize:48,marginBottom:12,color:C.border}}>◎</div>
            <div style={{fontFamily:"'DM Mono', monospace",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>No vehicles currently listed</div>
            <p style={{fontSize:14,color:C.muted,marginBottom:24}}>Check back soon or contact us — we source vehicles to order.</p>
            <a href="mailto:sales@hhmotorcars.com" className="btn-primary">Contact Us About Inventory</a>
          </div>
        ) : (
          <>
            <div style={{marginBottom:32,display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12}}>
              <div>
                <div className="section-eyebrow">Available Now</div>
                <h2 className="section-title" style={{marginBottom:0}}>{active.length} {active.length===1?"Vehicle":"Vehicles"} Available</h2>
              </div>
              <a href="mailto:sales@hhmotorcars.com" style={{fontSize:13,color:C.muted,textDecoration:"none",borderBottom:`1px solid ${C.border}`,paddingBottom:2}}>Don't see what you're looking for? Contact us →</a>
            </div>
            <div className="card-grid">
              {active.map((car, i) => (
                <div className="inv-card" key={car.id} onClick={() => setSelected(car)}>
                  <div className="inv-card-img">
                    {car.images && car.images[0] ? <img src={car.images[0]} alt={`${car.year} ${car.model}`} /> : <CarSVG />}
                    <div className="inv-price-badge">{formatPrice(car.price)}</div>
                  </div>
                  <div className="inv-card-body">
                    <div className="inv-year">{car.year}</div>
                    <div className="inv-name">{car.make} {car.model}</div>
                    {car.trim && <div className="inv-trim">{car.trim}</div>}
                    <div className="inv-specs">
                      {car.mileage && <div><div className="inv-spec-label">Miles</div><div className="inv-spec-val">{car.mileage}</div></div>}
                      {car.color && <div><div className="inv-spec-label">Color</div><div className="inv-spec-val">{car.color}</div></div>}
                    </div>
                    <div className="inv-card-footer">
                      <span style={{fontSize:12,color:C.muted}}>View Details →</span>
                      <span className="available-badge">Available</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="section section-alt">
        <div className="section-eyebrow">Our Buying Program</div>
        <h2 className="section-title">Acquiring a Porsche the Right Way</h2>
        <div className="gold-rule" />
        <div className="two-col" style={{marginTop:32}}>
          <div>
            <p className="section-body" style={{marginBottom:16}}>If you are looking to acquire a classic Porsche, HH Motorcars provides a program to facilitate your acquisition. Our knowledge base of classic Porsches is second to none.</p>
            <p className="section-body" style={{marginBottom:16}}>A reliable and knowledgeable shop can guide, advise, and help you maintain your classic Porsche. We don't just sell you a car — we help you become a confident, informed Porsche owner.</p>
            <p className="section-body">Don't see what you're looking for? We source vehicles to order. Contact us with your wish list and we'll find the right car for you.</p>
          </div>
          <div>
            <ul className="service-list">
              {["Honest, transparent vehicle history disclosure","Full pre-sale mechanical inspection","Guidance on model selection and specification","Sourcing to order — we find your perfect Porsche","Ongoing service relationship after purchase","We understand long-term value — not just the sale"].map(s => <li key={s}>{s}</li>)}
            </ul>
            <div style={{marginTop:28}}>
              <a href="mailto:sales@hhmotorcars.com" className="btn-primary">Contact About Purchasing</a>
            </div>
          </div>
        </div>
      </div>

      <ContactBar /><Footer />
    </div>
  );
}

function CarDetail({ car, onBack }) {
  const [imgIdx, setImgIdx] = useState(0);
  const hasImages = car.images && car.images.length > 0;
  return (
    <div style={{animation:"fadeIn 0.4s ease"}}>
      <div style={{padding:"20px 48px",borderBottom:`1px solid ${C.border}`,background:C.offwhite}}>
        <button className="btn-ghost-sm" onClick={onBack}>← Back to Inventory</button>
      </div>
      <div style={{padding:"48px 80px",maxWidth:1200,margin:"0 auto"}}>
        <div className="two-col-img">
          <div>
            <div style={{background:C.lightgray,height:400,overflow:"hidden",marginBottom:10}}>
              {hasImages ? <img src={car.images[imgIdx]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} /> : <CarSVG />}
            </div>
            {hasImages && car.images.length > 1 && (
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
                {car.images.map((img,i) => (
                  <div key={i} onClick={() => setImgIdx(i)} style={{width:72,height:48,overflow:"hidden",cursor:"pointer",border:`2px solid ${i===imgIdx?C.black:"transparent"}`}}>
                    <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                  </div>
                ))}
              </div>
            )}
            <div style={{marginTop:16}}>
              <div className="section-eyebrow">About This Vehicle</div>
              <p style={{fontSize:15,lineHeight:1.75,color:C.muted,marginTop:8}}>{car.description}</p>
            </div>
          </div>
          <div>
            <div className="inv-year" style={{marginBottom:6}}>{car.year}</div>
            <h1 style={{fontFamily:"'Cormorant Garamond', serif",fontSize:36,fontWeight:600,lineHeight:1.1,marginBottom:4}}>{car.make} {car.model}</h1>
            {car.trim && <div style={{fontSize:16,color:C.muted,marginBottom:24}}>{car.trim}</div>}
            <div style={{fontFamily:"'Cormorant Garamond', serif",fontSize:36,fontWeight:600,marginBottom:32}}>{formatPrice(car.price)}</div>
            <div style={{background:C.offwhite,padding:24,marginBottom:24}}>
              {[["Year",car.year],["Mileage",car.mileage],["Color",car.color],["VIN",car.vin]].filter(([,v])=>v).map(([label,value]) => (
                <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{fontSize:11,letterSpacing:1.5,textTransform:"uppercase",color:C.muted,fontFamily:"'DM Mono', monospace"}}>{label}</span>
                  <span style={{fontSize:14}}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{border:`1px solid ${C.border}`,padding:28}}>
              <div className="section-eyebrow" style={{marginBottom:12}}>Inquire About This Vehicle</div>
              <p style={{fontSize:14,color:C.muted,marginBottom:20,lineHeight:1.6}}>Contact HH Motorcars to schedule a viewing or request additional details.</p>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:14,marginBottom:6}}>📞 <strong>513.909.0280</strong></div>
                <div style={{fontSize:14}}>✉️ <strong>sales@hhmotorcars.com</strong></div>
              </div>
              <a href={`mailto:sales@hhmotorcars.com?subject=Inquiry: ${car.year} ${car.make} ${car.model}`} className="btn-primary" style={{width:"100%",display:"block",textAlign:"center",textDecoration:"none"}}>Send Inquiry Email</a>
            </div>
            <div style={{marginTop:16,fontSize:12,color:C.muted,textAlign:"center"}}>HH Motorcars · 16 East 72nd Street, Cincinnati, OH 45216</div>
          </div>
        </div>
      </div>
      <ContactBar /><Footer />
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginPage({ onSuccess }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const attempt = () => { if (pass === ADMIN_PASSWORD) { onSuccess(); } else setError("Incorrect password."); };
  return (
    <div style={{minHeight:"70vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.offwhite}}>
      <div style={{background:"#fff",border:`1px solid ${C.border}`,padding:48,width:"100%",maxWidth:380}}>
        <div className="section-eyebrow" style={{textAlign:"center",marginBottom:8}}>Admin Access</div>
        <h2 style={{fontFamily:"'Cormorant Garamond', serif",fontSize:24,textAlign:"center",marginBottom:32}}>Inventory Manager</h2>
        <div className="field-group">
          <label>Password</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key==="Enter" && attempt()} placeholder="Enter admin password" />
        </div>
        {error && <div style={{color:C.red,fontSize:13,marginBottom:16}}>{error}</div>}
        <button className="btn-primary" onClick={attempt} style={{width:"100%"}}>Enter</button>
      </div>
    </div>
  );
}

// ─── Admin ────────────────────────────────────────────────────────────────────
function AdminPage({ inventory, setInventory }) {
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const startNew = () => setEditing({
    id:generateId(),year:"",make:"Porsche",model:"",trim:"",
    price:"",mileage:"",color:"",vin:"",status:"active",
    description:"",images:[],dateAdded:new Date().toISOString().split("T")[0],
  });

  const save = (car) => {
    setInventory(prev => prev.find(c=>c.id===car.id) ? prev.map(c=>c.id===car.id?car:c) : [car,...prev]);
    setEditing(null);
  };

  const remove = (id) => { setInventory(prev=>prev.filter(c=>c.id!==id)); setConfirmDelete(null); };
  const toggleStatus = (id) => setInventory(prev=>prev.map(c=>c.id===id?{...c,status:c.status==="active"?"sold":"active"}:c));

  if (editing) return <CarForm initial={editing} onSave={save} onCancel={() => setEditing(null)} />;

  return (
    <div style={{padding:"48px 80px",minHeight:"80vh"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:36}}>
        <div>
          <div className="section-eyebrow">Admin Panel</div>
          <h1 style={{fontFamily:"'Cormorant Garamond', serif",fontSize:32,fontWeight:600}}>Manage Inventory</h1>
          <div style={{color:C.muted,fontSize:13,marginTop:4}}>
            {inventory.filter(c=>c.status==="active").length} active · {inventory.filter(c=>c.status==="sold").length} sold
          </div>
        </div>
        <button className="btn-primary" onClick={startNew}>+ Add Vehicle</button>
      </div>
      {inventory.length === 0 ? (
        <div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>No vehicles yet. Add your first listing.</div>
      ) : inventory.map(car => (
        <div className="admin-row" key={car.id} style={{opacity:car.status==="sold"?0.55:1}}>
          <div style={{width:88,height:58,flexShrink:0,overflow:"hidden",background:C.lightgray}}>
            {car.images&&car.images[0] ? <img src={car.images[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} /> : <CarSVG />}
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Cormorant Garamond', serif",fontSize:18,fontWeight:600}}>
              {car.year} {car.make} {car.model}
              {car.trim && <span style={{fontWeight:400,fontSize:15,color:C.muted}}> · {car.trim}</span>}
            </div>
            <div style={{fontSize:13,color:C.muted,marginTop:2}}>
              {formatPrice(car.price)} {car.mileage&&`· ${car.mileage} mi`} {car.color&&`· ${car.color}`}
              <span style={{marginLeft:10,fontSize:11,letterSpacing:1.5,textTransform:"uppercase",color:car.status==="active"?C.green:C.muted,fontFamily:"'DM Mono', monospace"}}>● {car.status}</span>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexShrink:0}}>
            <button className="btn-ghost-sm" onClick={() => toggleStatus(car.id)}>{car.status==="active"?"Mark Sold":"Relist"}</button>
            <button className="btn-ghost-sm" onClick={() => setEditing(car)}>Edit</button>
            {confirmDelete===car.id ? (
              <>
                <button className="btn-danger-sm" onClick={() => remove(car.id)}>Confirm Delete</button>
                <button className="btn-ghost-sm" onClick={() => setConfirmDelete(null)}>✕</button>
              </>
            ) : (
              <button className="btn-danger-sm" onClick={() => setConfirmDelete(car.id)}>Remove</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function CarForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const [imageInput, setImageInput] = useState("");
  const fileInputRef = useRef();
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const addImage = () => { const url=imageInput.trim(); if(url){set("images",[...(form.images||[]),url]);setImageInput("");} };
  const handleFileUpload = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(f => ({...f, images: [...(f.images||[]), ev.target.result]}));
      reader.readAsDataURL(file);
    });
  };
  const removeImage = (i) => set("images",form.images.filter((_,idx)=>idx!==i));
  const valid = form.year && form.model && form.price;

  return (
    <div style={{padding:"48px 80px",minHeight:"80vh"}}>
      <div style={{maxWidth:720,margin:"0 auto"}}>
        <button className="btn-ghost-sm" onClick={onCancel} style={{marginBottom:24}}>← Cancel</button>
        <h2 style={{fontFamily:"'Cormorant Garamond', serif",fontSize:28,fontWeight:600,marginBottom:32}}>
          {initial.year ? `Edit: ${initial.year} ${initial.model}` : "Add New Vehicle"}
        </h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {[["year","Year *","e.g. 1987"],["make","Make *","e.g. Porsche"],["model","Model *","e.g. 911"],["trim","Trim / Variant","e.g. Carrera Targa"],["price","Price * (numbers only)","e.g. 89500"],["mileage","Mileage","e.g. 67,200"],["color","Color","e.g. Guards Red"],["vin","VIN","Vehicle Identification Number"]].map(([key,label,ph]) => (
            <div className="field-group" key={key}>
              <label>{label}</label>
              <input value={form[key]||""} onChange={e=>set(key,e.target.value)} placeholder={ph} />
            </div>
          ))}
        </div>
        <div className="field-group">
          <label>Status</label>
          <select value={form.status} onChange={e=>set("status",e.target.value)}>
            <option value="active">Active — Visible on site</option>
            <option value="sold">Sold — Hidden from site</option>
          </select>
        </div>
        <div className="field-group">
          <label>Description</label>
          <textarea value={form.description} onChange={e=>set("description",e.target.value)} rows={5} placeholder="Describe this vehicle..." style={{resize:"vertical"}} />
        </div>
        <div className="field-group">
          <label>Photos</label>
          <div style={{border:`1px solid ${C.border}`,padding:16,marginBottom:10}}>
            <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handleFileUpload} style={{display:"none"}} />
            <button className="btn-ghost-sm" onClick={() => fileInputRef.current.click()} style={{width:"100%",marginBottom:12}}>📁 Upload Photos from Device</button>
            <div style={{display:"flex",gap:8}}>
              <input value={imageInput} onChange={e=>setImageInput(e.target.value)} placeholder="Or paste image URL" onKeyDown={e=>e.key==="Enter"&&addImage()} style={{flex:1}} />
              <button className="btn-ghost-sm" onClick={addImage}>Add</button>
            </div>
          </div>
          {form.images&&form.images.length>0 && (
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {form.images.map((img,i) => (
                <div key={i} style={{position:"relative",width:100,height:70}}>
                  <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                  <button onClick={() => removeImage(i)} style={{position:"absolute",top:2,right:2,background:"rgba(0,0,0,0.7)",border:"none",color:"#fff",width:20,height:20,cursor:"pointer",fontSize:11}}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{display:"flex",gap:12}}>
          <button className="btn-primary" onClick={() => onSave(form)} disabled={!valid} style={{opacity:valid?1:0.4}}>Save Vehicle</button>
          <button className="btn-outline" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("about");
  const [isAdmin, setIsAdmin] = useState(false);
  const [inventory, setInventory] = useState(() => {
    try { const s=localStorage.getItem("hh-inventory"); return s?JSON.parse(s):SAMPLE_INVENTORY; }
    catch { return SAMPLE_INVENTORY; }
  });

  useEffect(() => {
    try { localStorage.setItem("hh-inventory",JSON.stringify(inventory)); } catch(e){}
  }, [inventory]);

  useEffect(() => { window.scrollTo(0,0); }, [page]);

  const handleLogin = () => { setIsAdmin(true); setPage("admin"); };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{minHeight:"100vh",background:"#fff"}}>
        <Nav page={page} setPage={setPage} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
        {page==="about" && <AboutPage setPage={setPage} />}
        {page==="service" && <ServicePage />}
        {page==="restoration" && <RestorationPage />}
        {page==="sales" && <SalesPage inventory={inventory} />}
        {page==="login" && <LoginPage onSuccess={handleLogin} />}
        {page==="admin" && isAdmin && <AdminPage inventory={inventory} setInventory={setInventory} />}
      </div>
    </>
  );
}
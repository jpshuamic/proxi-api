import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://proxi-production.up.railway.app";

const C = {
  bg: "#0A0A0A",
  accent: "#1D9E75",
  text: "#FFFFFF",
  secondary: "#888888",
  card: "#1A1A1A",
  border: "#2A2A2A",
  cardHover: "#222222",
  purple: "#7F77DD",
  coral: "#D85A30",
};

function useWindowWidth() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
      <div style={{
        width: 40, height: 40, border: `3px solid ${C.border}`,
        borderTop: `3px solid ${C.accent}`, borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Header({ onSearch }: { onSearch: (q: string) => void }) {
  const navigate = useNavigate();
  const w = useWindowWidth();
  const isMobile = w < 768;
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 200,
        background: "rgba(10,10,10,0.96)",
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${C.border}`,
        padding: isMobile ? "0 16px" : "0 24px",
        height: 60, display: "flex", alignItems: "center", gap: 12,
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
        >
          <div style={{
            width: 32, height: 32, background: C.accent, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 18, color: "#fff",
          }}>P</div>
          <span style={{ fontWeight: 800, fontSize: 20, color: C.accent, letterSpacing: "-0.5px" }}>
            Proxi
          </span>
        </div>

        {/* Desktop search */}
        {!isMobile && (
          <div style={{ flex: 1, maxWidth: 480, position: "relative" }}>
            <input
              type="search"
              placeholder="Search listings, tasks, categories..."
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onSearch(q)}
              style={{
                width: "100%", height: 38, background: C.card,
                border: `1px solid ${C.border}`, borderRadius: 20,
                padding: "0 42px 0 16px", color: C.text, fontSize: 14,
                outline: "none", boxSizing: "border-box",
              }}
            />
            <button
              onClick={() => onSearch(q)}
              style={{
                position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)",
                background: C.accent, border: "none", color: "#fff",
                width: 30, height: 30, borderRadius: 15, cursor: "pointer",
                fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >⌕</button>
          </div>
        )}

        {/* Desktop buttons */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 10, marginLeft: "auto", flexShrink: 0 }}>
            <button style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.text, padding: "7px 18px", borderRadius: 20, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
              Sign In
            </button>
            <button style={{ background: C.accent, border: "none", color: "#fff", padding: "7px 18px", borderRadius: 20, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
              Post Free
            </button>
          </div>
        )}

        {/* Mobile: search icon + hamburger */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            <button
              onClick={() => onSearch(q)}
              style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
            >⌕</button>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: menuOpen ? C.accent : C.card, border: `1px solid ${menuOpen ? C.accent : C.border}`, color: "#fff", width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}
            >
              {menuOpen ? "✕" : (
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <div style={{ width: 18, height: 2, background: C.text, borderRadius: 1 }} />
                  <div style={{ width: 14, height: 2, background: C.text, borderRadius: 1 }} />
                  <div style={{ width: 18, height: 2, background: C.text, borderRadius: 1 }} />
                </div>
              )}
            </button>
          </div>
        )}
      </header>

      {/* Mobile menu overlay */}
      {isMobile && menuOpen && (
        <div style={{
          position: "fixed", top: 60, left: 0, right: 0, bottom: 0, zIndex: 190,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        }} onClick={() => setMenuOpen(false)}>
          <div
            style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "12px 16px 24px" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Mobile search */}
            <div style={{ position: "relative", marginBottom: 16 }}>
              <input
                type="search"
                placeholder="Search listings..."
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { onSearch(q); setMenuOpen(false); } }}
                style={{ width: "100%", height: 44, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "0 44px 0 16px", color: C.text, fontSize: 15, outline: "none", boxSizing: "border-box" }}
              />
              <button
                onClick={() => { onSearch(q); setMenuOpen(false); }}
                style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", background: C.accent, border: "none", color: "#fff", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 14 }}
              >⌕</button>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ flex: 1, background: "transparent", border: `1px solid ${C.border}`, color: C.text, height: 44, borderRadius: 12, cursor: "pointer", fontSize: 15, fontWeight: 500 }}>
                Sign In
              </button>
              <button style={{ flex: 2, background: C.accent, border: "none", color: "#fff", height: 44, borderRadius: 12, cursor: "pointer", fontSize: 15, fontWeight: 700 }}>
                Post for Free
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Hero({ onSearch }: { onSearch: (q: string) => void }) {
  const w = useWindowWidth();
  const isMobile = w < 768;
  const [q, setQ] = useState("");

  return (
    <section style={{
      background: `linear-gradient(135deg, #060606 0%, #0D1A0D 60%, #051208 100%)`,
      padding: isMobile ? "48px 16px 40px" : "80px 24px 64px",
      textAlign: "center",
    }}>
      <div style={{
        display: "inline-block",
        background: `${C.accent}20`, border: `1px solid ${C.accent}40`,
        borderRadius: 20, padding: "4px 14px", fontSize: 12, color: C.accent,
        marginBottom: 18, fontWeight: 600, letterSpacing: 0.3,
      }}>
        Nigeria's #1 Hyper-Local Marketplace
      </div>
      <h1 style={{
        fontSize: isMobile ? "clamp(30px,9vw,42px)" : "clamp(40px,5.5vw,68px)",
        fontWeight: 900, color: C.text, margin: "0 0 16px",
        lineHeight: 1.08, letterSpacing: isMobile ? "-1px" : "-2.5px",
      }}>
        Buy, Sell &amp; Hire{" "}
        <span style={{ color: C.accent }}>Near You</span>
      </h1>
      <p style={{
        color: C.secondary, fontSize: isMobile ? 15 : 18,
        margin: "0 auto 32px", maxWidth: 440, lineHeight: 1.6,
      }}>
        Discover thousands of listings from trusted traders in your neighbourhood.
      </p>

      {/* Search bar */}
      <div style={{
        maxWidth: isMobile ? "100%" : 580,
        margin: "0 auto",
        display: "flex", gap: 0,
        background: C.card, border: `1.5px solid ${C.border}`,
        borderRadius: 28, overflow: "hidden",
        boxShadow: `0 0 40px ${C.accent}18`,
      }}>
        <input
          type="search"
          placeholder="What are you looking for today?"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSearch(q)}
          style={{
            flex: 1, background: "transparent", border: "none",
            padding: isMobile ? "14px 16px" : "16px 24px",
            fontSize: isMobile ? 15 : 16, color: C.text, outline: "none",
            minWidth: 0,
          }}
        />
        <button
          onClick={() => onSearch(q)}
          style={{
            background: C.accent, color: "#fff", border: "none",
            padding: isMobile ? "12px 20px" : "14px 28px",
            fontWeight: 800, fontSize: isMobile ? 14 : 16, cursor: "pointer",
            borderRadius: "0 26px 26px 0", flexShrink: 0, whiteSpace: "nowrap",
          }}
        >
          {isMobile ? "Search" : "Search"}
        </button>
      </div>

      {/* Quick tags */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
        {["iPhones", "Cars", "Services", "Tasks", "Ankara"].map(tag => (
          <button
            key={tag}
            onClick={() => onSearch(tag)}
            style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.secondary, borderRadius: 16, padding: "5px 14px", fontSize: 13, cursor: "pointer" }}
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}

function Stats({ listingsCount, tasksCount }: { listingsCount: number; tasksCount: number }) {
  const w = useWindowWidth();
  const isMobile = w < 480;
  const items = [
    { value: listingsCount > 0 ? listingsCount.toLocaleString() : "—", label: "Active Listings" },
    { value: tasksCount > 0 ? tasksCount.toLocaleString() : "—", label: "Open Tasks" },
    { value: "100%", label: "Escrow Safe" },
    { value: "Free", label: "To List" },
  ];
  return (
    <div style={{
      background: C.card, borderBottom: `1px solid ${C.border}`,
      padding: isMobile ? "16px" : "20px 24px",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
      gap: isMobile ? "16px 8px" : "0",
    }}>
      {items.map(({ value, label }) => (
        <div key={label} style={{ textAlign: "center", padding: "4px 0" }}>
          <div style={{ fontSize: isMobile ? 22 : "clamp(22px,3vw,30px)", fontWeight: 900, color: C.accent }}>{value}</div>
          <div style={{ fontSize: 12, color: C.secondary, marginTop: 2 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

function CategoryChips({ active, onSelect }: { active: string; onSelect: (c: string) => void }) {
  const CATS = ["All", "Vehicles", "Electronics", "Fashion", "Home", "Property", "Tasks", "Services"];
  const w = useWindowWidth();
  const isMobile = w < 768;
  return (
    <div style={{
      padding: isMobile ? "14px 16px" : "16px 24px",
      display: "flex", gap: 8, overflowX: "auto",
      scrollbarWidth: "none", WebkitOverflowScrolling: "touch",
    }}>
      <style>{`.cats-scroll::-webkit-scrollbar{display:none}`}</style>
      {CATS.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          style={{
            flexShrink: 0,
            background: active === cat ? C.accent : C.card,
            color: active === cat ? "#fff" : C.text,
            border: `1px solid ${active === cat ? C.accent : C.border}`,
            borderRadius: 20, padding: "7px 16px",
            fontSize: isMobile ? 13 : 14,
            fontWeight: active === cat ? 700 : 500,
            cursor: "pointer", transition: "all 0.15s",
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

function TrustBadge({ score }: { score: number | null }) {
  if (score == null) return null;
  const n = Number(score);
  const color = n >= 70 ? C.accent : n >= 40 ? "#EF9F27" : "#E24B4A";
  return (
    <span style={{
      marginLeft: "auto", fontSize: 11, fontWeight: 700,
      color, background: color + "18",
      padding: "2px 7px", borderRadius: 6, flexShrink: 0,
    }}>
      {n}/100
    </span>
  );
}

function ListingCard({ listing }: { listing: any }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const price = listing.price ?? listing.amount ?? listing.budget ?? 0;
  const seller = listing.seller ?? listing.user ?? listing.owner ?? {};
  const sellerName = seller.name ?? seller.username ?? "Seller";
  const sellerScore = seller.rating ?? seller.score ?? seller.trustScore ?? null;
  const location = listing.location ?? listing.city ?? "Nigeria";

  return (
    <div
      onClick={() => navigate(`/listing/${listing.id ?? listing._id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? C.cardHover : C.card,
        border: `1px solid ${hovered ? C.accent + "55" : C.border}`,
        borderRadius: 14, overflow: "hidden", cursor: "pointer",
        transition: "all 0.18s",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 10px 32px rgba(0,0,0,0.5)` : "none",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ background: "#161616", height: 170, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {listing.images?.[0] || listing.image ? (
          <img
            src={listing.images?.[0] ?? listing.image}
            alt={listing.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div style={{ fontSize: 42, opacity: 0.2 }}>📦</div>
        )}
        {(listing.category || listing.type) && (
          <div style={{ position: "absolute", top: 10, left: 10, background: `${C.accent}DD`, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 8 }}>
            {listing.category ?? listing.type}
          </div>
        )}
      </div>
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {listing.title ?? listing.name}
        </h3>
        <div style={{ fontSize: 20, fontWeight: 900, color: C.accent }}>
          ₦{Number(price).toLocaleString()}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: C.secondary }}>
          <span>📍</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{String(location)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.accent + "28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: C.accent, flexShrink: 0 }}>
            {String(sellerName)[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize: 12, color: C.secondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{String(sellerName)}</span>
          <TrustBadge score={sellerScore} />
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: any }) {
  const budget = task.budget ?? task.price ?? task.amount ?? 0;
  const location = task.location ?? task.city ?? "Nigeria";
  const urgency = task.urgency ?? task.priority ?? "normal";
  const urgencyColor = urgency === "high" || urgency === "urgent" ? "#E24B4A" : urgency === "medium" ? "#EF9F27" : C.accent;

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.35, flex: 1 }}>
          {task.title ?? task.name}
        </h3>
        <span style={{ background: urgencyColor + "22", color: urgencyColor, border: `1px solid ${urgencyColor}44`, borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}>
          {String(urgency).toUpperCase()}
        </span>
      </div>
      {task.description && (
        <p style={{ margin: 0, fontSize: 13, color: C.secondary, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {task.description}
        </p>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginTop: 2 }}>
        <div style={{ fontSize: 19, fontWeight: 900, color: C.accent }}>₦{Number(budget).toLocaleString()}</div>
        <div style={{ fontSize: 12, color: C.secondary }}>📍{String(location)}</div>
      </div>
      <button style={{ background: C.accent, border: "none", color: "#fff", borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 2 }}>
        View Details
      </button>
    </div>
  );
}

function EmptyState({ type }: { type: string }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px", color: C.secondary }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: C.card, border: `1px solid ${C.border}`, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>
        {type === "listings" ? "📦" : "📋"}
      </div>
      <h3 style={{ color: C.text, fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>No {type} yet</h3>
      <p style={{ margin: "0 0 20px", fontSize: 14 }}>Be the first to post a {type === "listings" ? "listing" : "task"}!</p>
      <button style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 20, padding: "10px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
        Post Free Now
      </button>
    </div>
  );
}

function FeatureBanner() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const items = [
    { icon: "🔒", title: "Escrow Safe", desc: "Money held until delivery" },
    { icon: "⭐", title: "Trust Scores", desc: "Verified sellers only" },
    { icon: "📍", title: "Near You", desc: "Hyper-local listings" },
  ];
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
      gap: 16, maxWidth: 1280, margin: "0 auto",
      padding: isMobile ? "24px 16px" : "32px 24px",
    }}>
      {items.map(it => (
        <div key={it.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontSize: 28 }}>{it.icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{it.title}</div>
            <div style={{ fontSize: 13, color: C.secondary, marginTop: 2 }}>{it.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const w = useWindowWidth();
  const isMobile = w < 768;
  const isSmall = w < 480;
  const [listings, setListings] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorListings, setErrorListings] = useState("");
  const [errorTasks, setErrorTasks] = useState("");
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`${API}/api/listings`)
      .then(r => r.json())
      .then(data => setListings(Array.isArray(data) ? data : data.data ?? data.listings ?? []))
      .catch(() => setErrorListings("Failed to load listings"))
      .finally(() => setLoadingListings(false));

    fetch(`${API}/api/tasks`)
      .then(r => r.json())
      .then(data => setTasks(Array.isArray(data) ? data : data.data ?? data.tasks ?? []))
      .catch(() => setErrorTasks("Failed to load tasks"))
      .finally(() => setLoadingTasks(false));
  }, []);

  const filteredListings = listings.filter(l => {
    const matchCat = category === "All" || (l.category ?? l.type ?? "").toLowerCase() === category.toLowerCase();
    const matchQ = !searchQuery || (l.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) || (l.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });

  const gridCols = isSmall
    ? "repeat(auto-fill,minmax(160px,1fr))"
    : isMobile
      ? "repeat(auto-fill,minmax(200px,1fr))"
      : "repeat(auto-fill,minmax(260px,1fr))";

  const taskCols = isSmall
    ? "1fr"
    : isMobile
      ? "1fr"
      : "repeat(auto-fill,minmax(300px,1fr))";

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: C.text }}>
      <Header onSearch={setSearchQuery} />
      <Hero onSearch={setSearchQuery} />
      <Stats listingsCount={listings.length} tasksCount={tasks.length} />
      <FeatureBanner />
      <CategoryChips active={category} onSelect={setCategory} />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 16px 80px" : "0 24px 80px" }}>
        {/* Listings */}
        <section style={{ marginBottom: isMobile ? 40 : 60 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: isMobile ? "20px 0 16px" : "28px 0 18px" }}>
            <h2 style={{ margin: 0, fontSize: isMobile ? 20 : 24, fontWeight: 800, color: C.text }}>
              {searchQuery ? `"${searchQuery}"` : "Latest Listings"}
              {filteredListings.length > 0 && (
                <span style={{ marginLeft: 8, fontSize: 14, color: C.secondary, fontWeight: 500 }}>({filteredListings.length})</span>
              )}
            </h2>
            <button style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.secondary, borderRadius: 20, padding: "5px 14px", fontSize: 12, cursor: "pointer" }}>
              View All
            </button>
          </div>

          {loadingListings ? (
            <Spinner />
          ) : errorListings ? (
            <div style={{ textAlign: "center", padding: 40, color: "#E24B4A" }}>{errorListings}</div>
          ) : filteredListings.length === 0 ? (
            <EmptyState type="listings" />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: isMobile ? 12 : 18 }}>
              {filteredListings.map((l, i) => <ListingCard key={l.id ?? l._id ?? i} listing={l} />)}
            </div>
          )}
        </section>

        {/* Tasks */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isMobile ? 16 : 18 }}>
            <h2 style={{ margin: 0, fontSize: isMobile ? 20 : 24, fontWeight: 800, color: C.text }}>
              Open Tasks
              {tasks.length > 0 && <span style={{ marginLeft: 8, fontSize: 14, color: C.secondary, fontWeight: 500 }}>({tasks.length})</span>}
            </h2>
            <button style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.secondary, borderRadius: 20, padding: "5px 14px", fontSize: 12, cursor: "pointer" }}>
              View All
            </button>
          </div>

          {loadingTasks ? (
            <Spinner />
          ) : errorTasks ? (
            <div style={{ textAlign: "center", padding: 40, color: "#E24B4A" }}>{errorTasks}</div>
          ) : tasks.length === 0 ? (
            <EmptyState type="tasks" />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: taskCols, gap: isMobile ? 12 : 18 }}>
              {tasks.map((t, i) => <TaskCard key={t.id ?? t._id ?? i} task={t} />)}
            </div>
          )}
        </section>
      </main>

      {/* Mobile sticky CTA */}
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(10,10,10,0.96)", backdropFilter: "blur(10px)", borderTop: `1px solid ${C.border}`, padding: "12px 16px", display: "flex", gap: 10, zIndex: 100 }}>
          <button style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, color: C.text, height: 44, borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            Sign In
          </button>
          <button style={{ flex: 2, background: C.accent, border: "none", color: "#fff", height: 44, borderRadius: 12, cursor: "pointer", fontSize: 15, fontWeight: 800 }}>
            Post for Free
          </button>
        </div>
      )}

      <footer style={{ background: C.card, borderTop: `1px solid ${C.border}`, padding: isMobile ? "28px 16px 80px" : "40px 24px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, background: C.accent, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, color: "#fff" }}>P</div>
            <span style={{ fontWeight: 800, fontSize: 18, color: C.accent }}>Proxi</span>
          </div>
          <p style={{ color: C.secondary, fontSize: 14, margin: "0 0 8px", lineHeight: 1.6 }}>
            🔒 All transactions protected by <strong style={{ color: C.text }}>100% Escrow</strong>
          </p>
          <p style={{ color: C.border, fontSize: 12, margin: 0 }}>© 2025 Proxi. Nigeria's Hyper-Local Marketplace.</p>
        </div>
      </footer>
    </div>
  );
}

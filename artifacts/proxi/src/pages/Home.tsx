import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://proxi-production.up.railway.app";

const C = {
  bg: "#0A0A0A",
  accent: "#1DB954",
  text: "#FFFFFF",
  secondary: "#888888",
  card: "#1A1A1A",
  border: "#2A2A2A",
  cardHover: "#222222",
};

const CATEGORIES = ["All", "Vehicles", "Electronics", "Fashion", "Home", "Property", "Tasks"];

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
  const [q, setQ] = useState("");
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,10,0.95)",
      backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.border}`,
      padding: "0 24px", height: 64, display: "flex", alignItems: "center", gap: 16,
    }}>
      <div onClick={() => navigate("/")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, background: C.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, color: "#000" }}>P</div>
        <span style={{ fontWeight: 800, fontSize: 20, color: C.accent, letterSpacing: "-0.5px" }}>Proxi</span>
      </div>
      <div style={{ flex: 1, maxWidth: 480, position: "relative" }}>
        <input
          type="search"
          placeholder="Search listings, tasks, categories..."
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSearch(q)}
          style={{
            width: "100%", height: 40, background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 20, padding: "0 40px 0 16px", color: C.text, fontSize: 14,
            outline: "none", boxSizing: "border-box",
          }}
        />
        <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: C.secondary, cursor: "pointer" }} onClick={() => onSearch(q)}>
          &#128269;
        </span>
      </div>
      <div style={{ display: "flex", gap: 10, marginLeft: "auto", flexShrink: 0 }}>
        <button style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.text, padding: "8px 18px", borderRadius: 20, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
          Sign In
        </button>
        <button style={{ background: C.accent, border: "none", color: "#000", padding: "8px 18px", borderRadius: 20, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
          Post Free
        </button>
      </div>
    </header>
  );
}

function Hero({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = useState("");
  return (
    <section style={{ background: `linear-gradient(135deg, #0A0A0A 0%, #111 50%, #0A1A0A 100%)`, padding: "72px 24px 56px", textAlign: "center" }}>
      <div style={{ display: "inline-block", background: `${C.accent}22`, border: `1px solid ${C.accent}44`, borderRadius: 20, padding: "4px 14px", fontSize: 13, color: C.accent, marginBottom: 20, fontWeight: 600 }}>
        Nigeria&apos;s #1 Hyper-Local Marketplace
      </div>
      <h1 style={{ fontSize: "clamp(36px,6vw,64px)", fontWeight: 900, color: C.text, margin: "0 0 16px", lineHeight: 1.1, letterSpacing: "-2px" }}>
        Buy, Sell &amp; Hire <span style={{ color: C.accent }}>Near You</span>
      </h1>
      <p style={{ color: C.secondary, fontSize: 18, margin: "0 auto 36px", maxWidth: 480 }}>
        Discover thousands of listings from trusted sellers in your neighborhood.
      </p>
      <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", gap: 0, background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 30, overflow: "hidden", boxShadow: `0 0 40px ${C.accent}22` }}>
        <input
          type="search"
          placeholder="What are you looking for today?"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSearch(q)}
          style={{ flex: 1, background: "transparent", border: "none", padding: "16px 24px", fontSize: 16, color: C.text, outline: "none" }}
        />
        <button onClick={() => onSearch(q)} style={{ background: C.accent, color: "#000", border: "none", padding: "12px 28px", fontWeight: 800, fontSize: 16, cursor: "pointer", borderRadius: "0 28px 28px 0", flexShrink: 0 }}>
          Search
        </button>
      </div>
    </section>
  );
}

function Stats({ listingsCount, tasksCount }: { listingsCount: number; tasksCount: number }) {
  const items = [
    { value: listingsCount > 0 ? listingsCount.toLocaleString() : "—", label: "Active Listings" },
    { value: tasksCount > 0 ? tasksCount.toLocaleString() : "—", label: "Open Tasks" },
    { value: "100%", label: "Escrow Safe" },
    { value: "Free", label: "To List" },
  ];
  return (
    <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "20px 24px", display: "flex", justifyContent: "center", gap: "clamp(24px,5vw,80px)", flexWrap: "wrap" }}>
      {items.map(({ value, label }) => (
        <div key={label} style={{ textAlign: "center" }}>
          <div style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 900, color: C.accent }}>{value}</div>
          <div style={{ fontSize: 13, color: C.secondary, marginTop: 2 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

function CategoryChips({ active, onSelect }: { active: string; onSelect: (c: string) => void }) {
  return (
    <div style={{ padding: "20px 24px", display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none" }}>
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          style={{
            flexShrink: 0, background: active === cat ? C.accent : C.card,
            color: active === cat ? "#000" : C.text, border: `1px solid ${active === cat ? C.accent : C.border}`,
            borderRadius: 20, padding: "8px 18px", fontSize: 14, fontWeight: active === cat ? 700 : 500,
            cursor: "pointer", transition: "all 0.15s",
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

function ListingCard({ listing }: { listing: any }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const price = listing.price ?? listing.amount ?? listing.budget ?? 0;
  const seller = listing.seller ?? listing.user ?? listing.owner ?? {};
  const sellerName = seller.name ?? seller.username ?? seller.fullName ?? "Seller";
  const sellerScore = seller.rating ?? seller.score ?? seller.trustScore ?? null;
  const location = listing.location ?? listing.city ?? listing.state ?? "Nigeria";

  return (
    <div
      onClick={() => navigate(`/listing/${listing.id ?? listing._id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? C.cardHover : C.card, border: `1px solid ${hovered ? C.accent + "44" : C.border}`,
        borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "all 0.2s",
        transform: hovered ? "translateY(-2px)" : "none", boxShadow: hovered ? `0 8px 32px ${C.accent}18` : "none",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ background: "#1E1E1E", height: 180, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {listing.images?.[0] || listing.image ? (
          <img src={listing.images?.[0] ?? listing.image} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <div style={{ fontSize: 48, opacity: 0.3 }}>🏷️</div>
        )}
        {(listing.category || listing.type) && (
          <div style={{ position: "absolute", top: 10, left: 10, background: `${C.accent}CC`, color: "#000", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 10 }}>
            {listing.category ?? listing.type}
          </div>
        )}
      </div>
      <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {listing.title ?? listing.name}
        </h3>
        <div style={{ fontSize: 20, fontWeight: 900, color: C.accent }}>
          {"\u20A6"}{Number(price).toLocaleString()}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.secondary }}>
          <span>📍</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{String(location)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.accent + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.accent, flexShrink: 0 }}>
            {String(sellerName)[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize: 13, color: C.secondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{String(sellerName)}</span>
          {sellerScore != null && (
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#FFB800", flexShrink: 0 }}>★ {Number(sellerScore).toFixed(1)}</span>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); navigate(`/listing/${listing.id ?? listing._id}`); }}
          style={{ marginTop: 8, background: "transparent", border: `1px solid ${C.accent}`, color: C.accent, borderRadius: 8, padding: "8px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%" }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: any }) {
  const budget = task.budget ?? task.price ?? task.amount ?? 0;
  const location = task.location ?? task.city ?? task.state ?? "Nigeria";
  const urgency = task.urgency ?? task.priority ?? task.status ?? "normal";
  const urgencyColor = urgency === "high" || urgency === "urgent" ? "#FF4444" : urgency === "medium" ? "#FFB800" : C.accent;

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
      padding: 20, display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text, lineHeight: 1.3, flex: 1 }}>
          {task.title ?? task.name}
        </h3>
        <span style={{ background: urgencyColor + "22", color: urgencyColor, border: `1px solid ${urgencyColor}44`, borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}>
          {String(urgency).toUpperCase()}
        </span>
      </div>
      {task.description && (
        <p style={{ margin: 0, fontSize: 13, color: C.secondary, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {task.description}
        </p>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: C.accent }}>{"\u20A6"}{Number(budget).toLocaleString()}</div>
        <div style={{ fontSize: 13, color: C.secondary, display: "flex", alignItems: "center", gap: 4 }}>
          <span>📍</span>{String(location)}
        </div>
      </div>
      <button style={{ background: C.accent, border: "none", color: "#000", borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%", marginTop: 4 }}>
        View Details
      </button>
    </div>
  );
}

function EmptyState({ type }: { type: string }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 24px", color: C.secondary }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>{type === "listings" ? "🏷️" : "📋"}</div>
      <h3 style={{ color: C.text, fontSize: 20, fontWeight: 700, margin: "0 0 10px" }}>No {type} yet</h3>
      <p style={{ margin: "0 0 24px", fontSize: 15 }}>Be the first to post a {type === "listings" ? "listing" : "task"}!</p>
      <button style={{ background: C.accent, color: "#000", border: "none", borderRadius: 20, padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
        Post Free Now
      </button>
    </div>
  );
}

export default function Home() {
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
      .then(data => {
        const arr = Array.isArray(data) ? data : data.data ?? data.listings ?? data.results ?? [];
        setListings(arr);
      })
      .catch(() => setErrorListings("Failed to load listings"))
      .finally(() => setLoadingListings(false));

    fetch(`${API}/api/tasks`)
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : data.data ?? data.tasks ?? data.results ?? [];
        setTasks(arr);
      })
      .catch(() => setErrorTasks("Failed to load tasks"))
      .finally(() => setLoadingTasks(false));
  }, []);

  const filteredListings = listings.filter(l => {
    const matchCat = category === "All" || (l.category ?? l.type ?? "").toLowerCase() === category.toLowerCase();
    const matchQ = !searchQuery || (l.title ?? l.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) || (l.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: C.text }}>
      <Header onSearch={setSearchQuery} />
      <Hero onSearch={setSearchQuery} />
      <Stats listingsCount={listings.length} tasksCount={tasks.length} />
      <CategoryChips active={category} onSelect={setCategory} />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px" }}>
        {/* Listings Section */}
        <section style={{ marginBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "32px 0 20px" }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>
              {searchQuery ? `Results for "${searchQuery}"` : "Latest Listings"}
              {filteredListings.length > 0 && <span style={{ marginLeft: 10, fontSize: 16, color: C.secondary, fontWeight: 500 }}>({filteredListings.length})</span>}
            </h2>
            <button style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.secondary, borderRadius: 20, padding: "6px 16px", fontSize: 13, cursor: "pointer" }}>
              View All
            </button>
          </div>

          {loadingListings ? (
            <Spinner />
          ) : errorListings ? (
            <div style={{ textAlign: "center", padding: 40, color: "#FF4444" }}>{errorListings}</div>
          ) : filteredListings.length === 0 ? (
            <EmptyState type="listings" />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
              {filteredListings.map((l, i) => <ListingCard key={l.id ?? l._id ?? i} listing={l} />)}
            </div>
          )}
        </section>

        {/* Tasks Section */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 0 20px" }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>
              Open Tasks
              {tasks.length > 0 && <span style={{ marginLeft: 10, fontSize: 16, color: C.secondary, fontWeight: 500 }}>({tasks.length})</span>}
            </h2>
            <button style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.secondary, borderRadius: 20, padding: "6px 16px", fontSize: 13, cursor: "pointer" }}>
              View All
            </button>
          </div>

          {loadingTasks ? (
            <Spinner />
          ) : errorTasks ? (
            <div style={{ textAlign: "center", padding: 40, color: "#FF4444" }}>{errorTasks}</div>
          ) : tasks.length === 0 ? (
            <EmptyState type="tasks" />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
              {tasks.map((t, i) => <TaskCard key={t.id ?? t._id ?? i} task={t} />)}
            </div>
          )}
        </section>
      </main>

      <footer style={{ background: C.card, borderTop: `1px solid ${C.border}`, padding: "40px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, background: C.accent, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, color: "#000" }}>P</div>
            <span style={{ fontWeight: 800, fontSize: 18, color: C.accent }}>Proxi</span>
          </div>
          <p style={{ color: C.secondary, fontSize: 14, margin: "0 0 8px" }}>
            🔒 All transactions are protected by <strong style={{ color: C.text }}>100% Escrow</strong> — your money is safe until you&apos;re satisfied.
          </p>
          <p style={{ color: C.border, fontSize: 12, margin: 0 }}>© 2025 Proxi. Nigeria&apos;s Hyper-Local Marketplace.</p>
        </div>
      </footer>
    </div>
  );
}

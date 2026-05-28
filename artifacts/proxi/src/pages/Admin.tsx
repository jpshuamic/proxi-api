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

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color?: string }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 20px", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color ?? C.accent}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 900, color: color ?? C.accent }}>{value}</div>
        <div style={{ fontSize: 13, color: C.secondary, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function Table({ columns, rows, emptyMsg }: { columns: string[]; rows: any[][]; emptyMsg: string }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 14, border: `1px solid ${C.border}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
        <thead>
          <tr style={{ background: "#141414" }}>
            {columns.map(col => (
              <th key={col} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: C.secondary, textTransform: "uppercase", letterSpacing: 0.8, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: "40px 16px", textAlign: "center", color: C.secondary, fontSize: 14 }}>
                {emptyMsg}
              </td>
            </tr>
          ) : rows.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: `1px solid ${C.border}22`, background: ri % 2 === 0 ? "transparent" : "#141414" }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: "13px 16px", fontSize: 14, color: C.text, verticalAlign: "middle" }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = String(status ?? "active").toLowerCase();
  const color = s === "active" || s === "available" || s === "open" ? C.accent
    : s === "sold" || s === "closed" || s === "completed" ? "#888"
    : s === "pending" ? "#FFB800"
    : "#FF4444";
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
      {String(status ?? "Active").charAt(0).toUpperCase() + String(status ?? "active").slice(1)}
    </span>
  );
}

function fmt(n: any) {
  return Number(n ?? 0).toLocaleString();
}

function fmtDate(d: any) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" }); } catch { return "—"; }
}

export default function Admin() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingL, setLoadingL] = useState(true);
  const [loadingT, setLoadingT] = useState(true);
  const [activeTab, setActiveTab] = useState<"listings" | "tasks">("listings");

  useEffect(() => {
    fetch(`${API}/api/listings`)
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : data.data ?? data.listings ?? data.results ?? [];
        setListings(arr);
      })
      .catch(() => {})
      .finally(() => setLoadingL(false));

    fetch(`${API}/api/tasks`)
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : data.data ?? data.tasks ?? data.results ?? [];
        setTasks(arr);
      })
      .catch(() => {})
      .finally(() => setLoadingT(false));
  }, []);

  const totalRevenue = listings.reduce((s, l) => s + Number(l.price ?? l.amount ?? 0), 0);
  const uniqueSellers = new Set(listings.map(l => (l.seller ?? l.user ?? l.owner)?.id ?? (l.seller ?? l.user ?? l.owner)?._id ?? l.sellerId).filter(Boolean)).size;

  const listingRows = listings.map(l => {
    const seller = l.seller ?? l.user ?? l.owner ?? {};
    const sellerName = seller.name ?? seller.username ?? seller.fullName ?? l.sellerName ?? "—";
    return [
      <span style={{ fontWeight: 600, maxWidth: 200, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title ?? l.name ?? "—"}</span>,
      <span style={{ color: C.accent, fontWeight: 700 }}>{"\u20A6"}{fmt(l.price ?? l.amount)}</span>,
      <span style={{ color: C.secondary }}>{l.category ?? l.type ?? "General"}</span>,
      <span>{String(sellerName)}</span>,
      <span style={{ color: C.secondary }}>{fmtDate(l.createdAt ?? l.date ?? l.created_at)}</span>,
      <StatusBadge status={l.status ?? "active"} />,
    ];
  });

  const taskRows = tasks.map(t => {
    const poster = t.poster ?? t.user ?? t.owner ?? t.createdBy ?? {};
    const posterName = poster.name ?? poster.username ?? poster.fullName ?? t.posterName ?? "—";
    return [
      <span style={{ fontWeight: 600, maxWidth: 200, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title ?? t.name ?? "—"}</span>,
      <span style={{ color: C.accent, fontWeight: 700 }}>{"\u20A6"}{fmt(t.budget ?? t.price ?? t.amount)}</span>,
      <span style={{ color: C.secondary }}>{t.type ?? t.category ?? "Task"}</span>,
      <span>{String(posterName)}</span>,
      <span style={{ color: C.secondary }}>{fmtDate(t.createdAt ?? t.date ?? t.created_at)}</span>,
      <StatusBadge status={t.status ?? "open"} />,
    ];
  });

  const isLoading = loadingL && loadingT;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', -apple-system, sans-serif", color: C.text }}>
      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: 64, display: "flex", alignItems: "center", gap: 16 }}>
        <div onClick={() => navigate("/")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, background: C.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, color: "#000" }}>P</div>
          <span style={{ fontWeight: 800, fontSize: 20, color: C.accent, letterSpacing: "-0.5px" }}>Proxi</span>
        </div>
        <span style={{ color: C.secondary, fontSize: 14 }}>/</span>
        <span style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>Admin Dashboard</span>
        <button onClick={() => navigate("/")} style={{ marginLeft: "auto", background: "transparent", border: `1px solid ${C.border}`, color: C.secondary, borderRadius: 20, padding: "7px 16px", fontSize: 13, cursor: "pointer" }}>
          ← Back to Site
        </button>
      </header>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ margin: "0 0 6px", fontSize: 28, fontWeight: 900 }}>Admin Dashboard</h1>
          <p style={{ margin: 0, color: C.secondary, fontSize: 14 }}>Overview of marketplace activity</p>
        </div>

        {/* Stats */}
        {isLoading ? <Spinner /> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
            <StatCard label="Total Users" value={uniqueSellers || "—"} icon="👥" color={C.accent} />
            <StatCard label="Total Listings" value={listings.length} icon="🏷️" color="#3B82F6" />
            <StatCard label="Total Tasks" value={tasks.length} icon="📋" color="#A855F7" />
            <StatCard label="Total Revenue" value={`${"\u20A6"}${fmt(totalRevenue)}`} icon="💰" color="#FFB800" />
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24, background: C.card, borderRadius: 12, padding: 4, width: "fit-content", border: `1px solid ${C.border}` }}>
          {(["listings", "tasks"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? C.accent : "transparent",
                color: activeTab === tab ? "#000" : C.secondary,
                border: "none", borderRadius: 8, padding: "8px 22px",
                fontWeight: activeTab === tab ? 700 : 500, fontSize: 14, cursor: "pointer",
                transition: "all 0.15s", textTransform: "capitalize",
              }}
            >
              {tab} {activeTab === tab && <span style={{ opacity: 0.7 }}>({tab === "listings" ? listings.length : tasks.length})</span>}
            </button>
          ))}
        </div>

        {/* Tables */}
        {activeTab === "listings" && (
          <div>
            <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>Listings</h2>
            {loadingL ? <Spinner /> : (
              <Table
                columns={["Title", "Price", "Category", "Seller", "Date", "Status"]}
                rows={listingRows}
                emptyMsg="No listings found"
              />
            )}
          </div>
        )}

        {activeTab === "tasks" && (
          <div>
            <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>Tasks</h2>
            {loadingT ? <Spinner /> : (
              <Table
                columns={["Title", "Budget", "Type", "Posted By", "Date", "Status"]}
                rows={taskRows}
                emptyMsg="No tasks found"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

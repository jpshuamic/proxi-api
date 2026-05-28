import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = "https://proxi-production.up.railway.app";

const C = {
  bg: "#0A0A0A",
  accent: "#1DB954",
  text: "#FFFFFF",
  secondary: "#888888",
  card: "#1A1A1A",
  border: "#2A2A2A",
};

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
      <div style={{
        width: 44, height: 44, border: `3px solid ${C.border}`,
        borderTop: `3px solid ${C.accent}`, borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msgSent, setMsgSent] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/listings/${id}`)
      .then(r => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(data => {
        const item = data.data ?? data.listing ?? data;
        setListing(item);
      })
      .catch(() => {
        fetch(`${API}/api/listings`)
          .then(r => r.json())
          .then(data => {
            const arr = Array.isArray(data) ? data : data.data ?? data.listings ?? [];
            const found = arr.find((l: any) => String(l.id ?? l._id) === String(id));
            if (found) setListing(found);
            else setError("Listing not found");
            setRelated(arr.filter((l: any) => String(l.id ?? l._id) !== String(id)).slice(0, 4));
          })
          .catch(() => setError("Failed to load listing"));
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (listing) {
      fetch(`${API}/api/listings`)
        .then(r => r.json())
        .then(data => {
          const arr = Array.isArray(data) ? data : data.data ?? data.listings ?? [];
          setRelated(arr.filter((l: any) => String(l.id ?? l._id) !== String(id)).slice(0, 4));
        })
        .catch(() => {});
    }
  }, [listing, id]);

  if (loading) return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <Header />
      <Spinner />
    </div>
  );

  if (error || !listing) return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <Header />
      <div style={{ textAlign: "center", padding: 80, color: C.secondary }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>😕</div>
        <h2 style={{ color: C.text }}>{error || "Listing not found"}</h2>
        <button onClick={() => navigate("/")} style={{ background: C.accent, border: "none", color: "#000", borderRadius: 20, padding: "12px 28px", fontWeight: 700, cursor: "pointer", marginTop: 20 }}>
          Back to Home
        </button>
      </div>
    </div>
  );

  const images: string[] = listing.images?.length ? listing.images : listing.image ? [listing.image] : [];
  const price = listing.price ?? listing.amount ?? listing.budget ?? 0;
  const seller = listing.seller ?? listing.user ?? listing.owner ?? {};
  const sellerName = seller.name ?? seller.username ?? seller.fullName ?? "Seller";
  const sellerScore = seller.rating ?? seller.score ?? seller.trustScore ?? null;
  const location = listing.location ?? listing.city ?? listing.state ?? "Nigeria";

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', -apple-system, sans-serif", color: C.text }}>
      <Header />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px" }}>
        <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", color: C.secondary, cursor: "pointer", fontSize: 14, marginBottom: 28, padding: 0 }}>
          ← Back
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,0.8fr)", gap: 40 }}>
          {/* Left: Images */}
          <div>
            <div style={{ background: "#1E1E1E", borderRadius: 16, overflow: "hidden", height: 380, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {images.length > 0 ? (
                <img src={images[activeImg]} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ fontSize: 72, opacity: 0.3 }}>🏷️</div>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
                {images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)} style={{ width: 72, height: 72, borderRadius: 10, overflow: "hidden", border: `2px solid ${i === activeImg ? C.accent : C.border}`, cursor: "pointer", flexShrink: 0 }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div style={{ marginTop: 28 }}>
                <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700 }}>Description</h3>
                <p style={{ margin: 0, color: C.secondary, lineHeight: 1.7, fontSize: 15 }}>{listing.description}</p>
              </div>
            )}

            {/* Tags/details */}
            {(listing.condition || listing.brand || listing.model) && (
              <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[["Condition", listing.condition], ["Brand", listing.brand], ["Model", listing.model]].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k as string} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 14px", fontSize: 13 }}>
                    <span style={{ color: C.secondary }}>{k as string}: </span>
                    <span style={{ color: C.text, fontWeight: 600 }}>{v as string}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              {(listing.category || listing.type) && (
                <div style={{ display: "inline-block", background: `${C.accent}22`, color: C.accent, border: `1px solid ${C.accent}44`, borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                  {listing.category ?? listing.type}
                </div>
              )}
              <h1 style={{ margin: "0 0 16px", fontSize: 26, fontWeight: 900, lineHeight: 1.2 }}>{listing.title ?? listing.name}</h1>
              <div style={{ fontSize: 36, fontWeight: 900, color: C.accent, marginBottom: 12 }}>
                {"\u20A6"}{Number(price).toLocaleString()}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.secondary, fontSize: 14 }}>
                📍 {String(location)}
              </div>
              {listing.createdAt && (
                <div style={{ color: C.secondary, fontSize: 13, marginTop: 6 }}>
                  Posted {new Date(listing.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              )}
            </div>

            {/* Seller Card */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: C.secondary, textTransform: "uppercase", letterSpacing: 1 }}>Seller Info</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${C.accent}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: C.accent, flexShrink: 0 }}>
                  {String(sellerName)[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{String(sellerName)}</div>
                  {sellerScore != null && (
                    <div style={{ color: "#FFB800", fontSize: 14 }}>★ {Number(sellerScore).toFixed(1)} rating</div>
                  )}
                  {seller.phone && <div style={{ color: C.secondary, fontSize: 13 }}>{seller.phone}</div>}
                </div>
              </div>
              <button
                onClick={() => setMsgSent(true)}
                style={{ width: "100%", background: msgSent ? "#333" : C.accent, border: "none", color: msgSent ? C.secondary : "#000", borderRadius: 10, padding: "14px 0", fontWeight: 800, fontSize: 15, cursor: msgSent ? "default" : "pointer", transition: "all 0.2s" }}
              >
                {msgSent ? "✓ Message Sent!" : "💬 Message Seller"}
              </button>
            </div>

            {/* Escrow badge */}
            <div style={{ background: `${C.accent}11`, border: `1px solid ${C.accent}33`, borderRadius: 12, padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22 }}>🔒</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.accent }}>100% Escrow Protected</div>
                <div style={{ fontSize: 13, color: C.secondary, marginTop: 4, lineHeight: 1.5 }}>Your payment is held securely until you receive and approve your item.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Listings */}
        {related.length > 0 && (
          <section style={{ marginTop: 60 }}>
            <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 800 }}>Related Listings</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {related.map((l, i) => {
                const lPrice = l.price ?? l.amount ?? 0;
                const lLoc = l.location ?? l.city ?? "Nigeria";
                return (
                  <div key={l.id ?? l._id ?? i} onClick={() => navigate(`/listing/${l.id ?? l._id}`)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer" }}>
                    <div style={{ height: 140, background: "#1E1E1E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {(l.images?.[0] || l.image) ? (
                        <img src={l.images?.[0] ?? l.image} alt={l.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : <span style={{ fontSize: 36, opacity: 0.3 }}>🏷️</span>}
                    </div>
                    <div style={{ padding: 14 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title ?? l.name}</div>
                      <div style={{ fontSize: 17, fontWeight: 900, color: C.accent }}>{"\u20A6"}{Number(lPrice).toLocaleString()}</div>
                      <div style={{ fontSize: 12, color: C.secondary, marginTop: 4 }}>📍 {String(lLoc)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Header() {
  const navigate = useNavigate();
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,10,0.95)",
      backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.border}`,
      padding: "0 24px", height: 64, display: "flex", alignItems: "center", gap: 16,
    }}>
      <div onClick={() => navigate("/")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 32, height: 32, background: C.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, color: "#000" }}>P</div>
        <span style={{ fontWeight: 800, fontSize: 20, color: C.accent, letterSpacing: "-0.5px" }}>Proxi</span>
      </div>
      <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
        <button style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.text, padding: "8px 18px", borderRadius: 20, cursor: "pointer", fontSize: 14 }}>Sign In</button>
        <button style={{ background: C.accent, border: "none", color: "#000", padding: "8px 18px", borderRadius: 20, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Post Free</button>
      </div>
    </header>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = "https://proxi-production.up.railway.app";

const C = {
  bg: "#0A0A0A",
  accent: "#1D9E75",
  text: "#FFFFFF",
  secondary: "#888888",
  card: "#1A1A1A",
  border: "#2A2A2A",
};

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
      <div style={{ width: 44, height: 44, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Header() {
  const navigate = useNavigate();
  const w = useWindowWidth();
  const isMobile = w < 768;
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(10,10,10,0.96)", backdropFilter: "blur(14px)",
      borderBottom: `1px solid ${C.border}`,
      padding: isMobile ? "0 16px" : "0 24px",
      height: 60, display: "flex", alignItems: "center", gap: 12,
    }}>
      <button
        onClick={() => navigate(-1)}
        style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
      >←</button>
      <div onClick={() => navigate("/")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 30, height: 30, background: C.accent, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 17, color: "#fff" }}>P</div>
        <span style={{ fontWeight: 800, fontSize: 19, color: C.accent, letterSpacing: "-0.5px" }}>Proxi</span>
      </div>
      {!isMobile && (
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.text, padding: "7px 18px", borderRadius: 20, cursor: "pointer", fontSize: 14 }}>Sign In</button>
          <button style={{ background: C.accent, border: "none", color: "#fff", padding: "7px 18px", borderRadius: 20, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Post Free</button>
        </div>
      )}
    </header>
  );
}

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const w = useWindowWidth();
  const isMobile = w < 768;
  const [listing, setListing] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msgSent, setMsgSent] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/listings/${id}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(data => setListing(data.data ?? data.listing ?? data))
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

  if (loading) return <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}><Header /><Spinner /></div>;
  if (error || !listing) return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <Header />
      <div style={{ textAlign: "center", padding: 80, color: C.secondary }}>
        <div style={{ fontSize: 52, marginBottom: 20 }}>🔍</div>
        <h2 style={{ color: C.text }}>{error || "Listing not found"}</h2>
        <button onClick={() => navigate("/")} style={{ background: C.accent, border: "none", color: "#fff", borderRadius: 20, padding: "12px 28px", fontWeight: 700, cursor: "pointer", marginTop: 20 }}>
          Back to Home
        </button>
      </div>
    </div>
  );

  const images: string[] = listing.images?.length ? listing.images : listing.image ? [listing.image] : [];
  const price = listing.price ?? listing.amount ?? listing.budget ?? 0;
  const seller = listing.seller ?? listing.user ?? listing.owner ?? {};
  const sellerName = seller.name ?? seller.username ?? "Seller";
  const sellerScore = seller.rating ?? seller.score ?? seller.trustScore ?? null;
  const location = listing.location ?? listing.city ?? "Nigeria";
  const scoreColor = sellerScore ? (sellerScore >= 70 ? C.accent : sellerScore >= 40 ? "#EF9F27" : "#E24B4A") : C.secondary;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', -apple-system, sans-serif", color: C.text }}>
      <Header />

      {/* Mobile: stacked. Desktop: 2-col */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "20px 16px 100px" : "32px 24px 80px" }}>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.2fr) minmax(0,0.8fr)",
          gap: isMobile ? 24 : 44,
        }}>
          {/* Images */}
          <div>
            <div style={{
              background: "#161616", borderRadius: 16, overflow: "hidden",
              height: isMobile ? "56vw" : 380,
              maxHeight: isMobile ? 280 : 380,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 12,
            }}>
              {images.length > 0 ? (
                <img src={images[activeImg]} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ fontSize: 64, opacity: 0.15 }}>📦</div>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                {images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)} style={{ width: 64, height: 64, borderRadius: 10, overflow: "hidden", border: `2px solid ${i === activeImg ? C.accent : C.border}`, cursor: "pointer", flexShrink: 0 }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}

            {/* Description – below images on desktop, below price card on mobile */}
            {!isMobile && listing.description && (
              <div style={{ marginTop: 28 }}>
                <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700 }}>Description</h3>
                <p style={{ margin: 0, color: C.secondary, lineHeight: 1.7, fontSize: 14 }}>{listing.description}</p>
              </div>
            )}

            {!isMobile && (listing.condition || listing.brand) && (
              <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[["Condition", listing.condition], ["Brand", listing.brand], ["Model", listing.model]].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k as string} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 12px", fontSize: 12 }}>
                    <span style={{ color: C.secondary }}>{k as string}: </span>
                    <span style={{ fontWeight: 600 }}>{v as string}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              {(listing.category || listing.type) && (
                <div style={{ display: "inline-block", background: `${C.accent}20`, color: C.accent, border: `1px solid ${C.accent}40`, borderRadius: 8, padding: "3px 12px", fontSize: 11, fontWeight: 700, marginBottom: 10 }}>
                  {listing.category ?? listing.type}
                </div>
              )}
              <h1 style={{ margin: "0 0 12px", fontSize: isMobile ? 22 : 26, fontWeight: 900, lineHeight: 1.2 }}>
                {listing.title ?? listing.name}
              </h1>
              <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 900, color: C.accent, marginBottom: 10 }}>
                ₦{Number(price).toLocaleString()}
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 13, color: C.secondary }}>
                <span>📍 {String(location)}</span>
                {listing.createdAt && <span>🕐 {new Date(listing.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</span>}
              </div>
            </div>

            {/* Mobile: description here */}
            {isMobile && listing.description && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.secondary, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Description</div>
                <p style={{ margin: 0, color: C.secondary, lineHeight: 1.65, fontSize: 14 }}>{listing.description}</p>
              </div>
            )}

            {/* Seller */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: isMobile ? 16 : 20 }}>
              <div style={{ fontWeight: 600, fontSize: 12, color: C.secondary, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Seller Info</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: `${C.accent}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: C.accent, flexShrink: 0 }}>
                  {String(sellerName)[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{String(sellerName)}</div>
                  {sellerScore != null && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, background: scoreColor }} />
                      <span style={{ fontSize: 13, color: scoreColor, fontWeight: 600 }}>{Number(sellerScore)}/100 trust score</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Sticky action on desktop; button here on mobile too */}
              <button
                onClick={() => setMsgSent(true)}
                style={{ width: "100%", background: msgSent ? C.card : C.accent, border: `1px solid ${msgSent ? C.border : C.accent}`, color: msgSent ? C.secondary : "#fff", borderRadius: 10, padding: "13px 0", fontWeight: 800, fontSize: 15, cursor: msgSent ? "default" : "pointer", transition: "all 0.2s" }}
              >
                {msgSent ? "✓ Message Sent!" : "Message Seller"}
              </button>
            </div>

            {/* Escrow */}
            <div style={{ background: `${C.accent}10`, border: `1px solid ${C.accent}30`, borderRadius: 12, padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>🔒</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.accent }}>100% Escrow Protected</div>
                <div style={{ fontSize: 12, color: C.secondary, marginTop: 3, lineHeight: 1.5 }}>Payment held securely until you confirm receipt.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section style={{ marginTop: isMobile ? 36 : 56 }}>
            <h2 style={{ margin: "0 0 20px", fontSize: isMobile ? 18 : 22, fontWeight: 800 }}>Similar Listings</h2>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(auto-fill,minmax(220px,1fr))", gap: isMobile ? 10 : 14 }}>
              {related.map((l, i) => (
                <div key={l.id ?? l._id ?? i} onClick={() => navigate(`/listing/${l.id ?? l._id}`)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", cursor: "pointer" }}>
                  <div style={{ height: isMobile ? 100 : 130, background: "#161616", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {(l.images?.[0] || l.image) ? (
                      <img src={l.images?.[0] ?? l.image} alt={l.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : <span style={{ fontSize: 28, opacity: 0.2 }}>📦</span>}
                  </div>
                  <div style={{ padding: isMobile ? 10 : 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title ?? l.name}</div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: C.accent }}>₦{Number(l.price ?? l.amount ?? 0).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile floating CTA */}
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(10,10,10,0.96)", backdropFilter: "blur(10px)", borderTop: `1px solid ${C.border}`, padding: "12px 16px", display: "flex", gap: 10, zIndex: 100 }}>
          <button style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, color: C.text, height: 48, borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            Make Offer
          </button>
          <button
            onClick={() => setMsgSent(true)}
            style={{ flex: 2, background: msgSent ? C.card : C.accent, border: "none", color: msgSent ? C.secondary : "#fff", height: 48, borderRadius: 12, cursor: "pointer", fontSize: 15, fontWeight: 800 }}
          >
            {msgSent ? "✓ Message Sent!" : "Message Seller"}
          </button>
        </div>
      )}
    </div>
  );
}

// Tallyroom, the sample app the runs worked on, in its own purple. These are the screens act 2 changes.
import { F } from "../theme";
import { DodoWordmark, Logo } from "../Logo";
import { GoogleG } from "./Chrome";

const P = { brand: "#6E48C4", deep: "#4B2E9A", dim: "#F3EFFC", ink: "#1E1B2E", text: "#66637A", line: "#E6E3EF" };

const Nav: React.FC<{ right?: React.ReactNode }> = ({ right }) => (
  <div style={{ height: 64, display: "flex", alignItems: "center", gap: 28, padding: "0 32px", borderBottom: `1px solid ${P.line}`, fontFamily: F.sans, background: "#fff" }}>
    <b style={{ fontSize: 24, color: P.ink, letterSpacing: "-0.03em" }}>Tallyroom</b>
    {["Home", "Pricing", "Dashboard"].map((n) => <span key={n} style={{ fontSize: 17, color: P.text }}>{n}</span>)}
    <span style={{ marginLeft: "auto" }}>{right}</span>
  </div>
);

export const TallyLanding: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#fff", fontFamily: F.sans }}>
    <div style={{ height: 52, display: "flex", alignItems: "center", gap: 26, padding: "0 40px", fontSize: 14, color: "#55536A" }}>
      <b style={{ fontSize: 20, color: P.ink, letterSpacing: "-0.03em" }}>Tallyroom</b>
      <span>Home</span><span>Pricing</span><span>Dashboard</span><span>FAQ</span>
      <span style={{ marginLeft: "auto", background: P.brand, color: "#fff", borderRadius: 8, padding: "8px 14px", fontWeight: 600 }}>Start free trial</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 52, bottom: 0, background: "linear-gradient(140deg,#6A7FE8 0%,#7B55C9 55%,#9B4FE0 100%)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 70, color: "#fff" }}>
      <span style={{ fontSize: 14, background: "rgba(255,255,255,0.18)", borderRadius: 20, padding: "6px 14px" }}>✨ Introducing Tallyroom</span>
      <p style={{ margin: "26px 0 0", fontSize: 54, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.05, textAlign: "center", maxWidth: 760 }}>Revolutionize the Way You Manage Shared Expenses</p>
      <p style={{ margin: "22px 0 0", fontSize: 18, opacity: 0.85, textAlign: "center", maxWidth: 600, lineHeight: 1.45 }}>Split bills with friends, roommates and beyond.</p>
      <div style={{ marginTop: 30, display: "flex", gap: 14 }}>
        <span style={{ background: "#fff", color: P.brand, borderRadius: 10, padding: "13px 24px", fontSize: 17, fontWeight: 600 }}>Get Started Today</span>
        <span style={{ border: "1.5px solid rgba(255,255,255,0.6)", borderRadius: 10, padding: "13px 24px", fontSize: 17, fontWeight: 600 }}>Learn More</span>
      </div>
    </div>
  </div>
);

const GROUPS = [
  { name: "Flat 4B", who: "4 people", owed: "you're owed £86.40" },
  { name: "Ski trip", who: "6 people", owed: "you owe £212.00" },
  { name: "Office lunch", who: "9 people", owed: "settled up" },
];

export const TallyDashboard: React.FC<{ faded?: boolean; tag?: string }> = ({ faded, tag }) => (
  <div style={{ position: "absolute", inset: 0, background: "#FAF9FD", fontFamily: F.sans }}>
    <Nav right={<span style={{ width: 34, height: 34, borderRadius: 17, display: "block", background: "linear-gradient(135deg,#6A7FE8,#9B4FE0)" }} />} />
    <div style={{ padding: "30px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
      <b style={{ fontSize: 30, color: P.ink, letterSpacing: "-0.03em" }}>Your groups</b>
      {GROUPS.map((g) => (
        <div key={g.name} style={{ background: "#fff", border: `1px solid ${P.line}`, borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, opacity: faded ? 0.55 : 1 }}>
          <span style={{ width: 44, height: 44, borderRadius: 12, background: P.dim, color: P.brand, display: "grid", placeItems: "center", fontWeight: 700, fontSize: 20 }}>{g.name[0]}</span>
          <span style={{ display: "flex", flexDirection: "column" }}>
            <b style={{ fontSize: 21, color: P.ink }}>{g.name}</b>
            <span style={{ fontSize: 16, color: P.text }}>{g.who}</span>
          </span>
          <span style={{ marginLeft: "auto", fontSize: 18, color: P.text }}>{faded ? "sample" : g.owed}</span>
        </div>
      ))}
      {tag && <span style={{ fontSize: 15, color: P.text }}>{tag}</span>}
    </div>
  </div>
);

export const TallySignIn: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#F6F5FA", fontFamily: F.sans, display: "grid", placeItems: "center" }}>
    <div style={{ width: 430, background: "#fff", borderRadius: 16, boxShadow: "0 10px 40px rgba(30,27,46,0.10), 0 0 0 1px rgba(30,27,46,0.06)", overflow: "hidden" }}>
      <div style={{ padding: "36px 40px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#6A7FE8,#9B4FE0)" }} />
        <b style={{ marginTop: 10, fontSize: 22, color: P.ink }}>Sign in to Tallyroom</b>
        <span style={{ fontSize: 15, color: P.text }}>Welcome back! Please sign in to continue</span>
        <span style={{ marginTop: 18, width: "100%", height: 44, border: `1px solid ${P.line}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 16, color: P.ink }}>
          <GoogleG size={18} /> Continue with Google
        </span>
        <span style={{ margin: "8px 0", fontSize: 13, color: P.text }}>or</span>
        <span style={{ width: "100%", height: 44, border: `1px solid ${P.line}`, borderRadius: 10, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15, color: "#9C99AD" }}>Email address</span>
        <span style={{ marginTop: 12, width: "100%", height: 44, background: "#2F3037", borderRadius: 10, display: "grid", placeItems: "center", fontSize: 16, fontWeight: 600, color: "#fff" }}>Continue</span>
      </div>
      <div style={{ background: "#F7F7F8", borderTop: "1px solid #EEEEF0", padding: "14px", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, fontSize: 13, color: "#747686" }}>
        Secured by <Logo brand="clerk" size={15} color="#747686" /> <b>clerk</b>
      </div>
    </div>
  </div>
);

const PLANS = [
  { name: "Free", what: "1 group" },
  { name: "Plus", what: "Unlimited groups" },
  { name: "Household", what: "Unlimited groups and CSV export" },
];

export const TallyPricing: React.FC<{ live: boolean }> = ({ live }) => (
  <div style={{ position: "absolute", inset: 0, background: "#FAF9FD", fontFamily: F.sans }}>
    <Nav />
    <div style={{ padding: "30px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      <b style={{ fontSize: 30, color: P.ink, letterSpacing: "-0.03em" }}>Pricing</b>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {PLANS.map((p, k) => (
          <div key={p.name} style={{ background: "#fff", border: `${k === 1 && live ? 2 : 1}px solid ${k === 1 && live ? P.brand : P.line}`, borderRadius: 14, padding: "20px 18px", display: "flex", flexDirection: "column", gap: 8, height: 250 }}>
            <b style={{ fontSize: 20, color: P.ink }}>{p.name}</b>
            <span style={{ fontSize: 17, color: P.text, lineHeight: 1.35 }}>{p.what}</span>
            <span style={{
              marginTop: "auto", height: 42, borderRadius: 10, display: "grid", placeItems: "center", fontSize: 16, fontWeight: 600,
              background: k === 0 ? "#F1EFF6" : live ? P.brand : "#ECEAF2", color: k === 0 ? P.text : live ? "#fff" : "#A7A4B6",
            }}>{k === 0 ? "Current plan" : live ? "Subscribe" : "Coming soon"}</span>
          </div>
        ))}
      </div>
      <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: P.text, opacity: live ? 1 : 0 }}>
        Payments by <DodoWordmark height={22} />
      </span>
    </div>
  </div>
);

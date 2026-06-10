import React from "react"

const EXAMPLES = ["tourist", "neal_wu", "jiangly", "ecnerwala", "dreamoon"]

const FEATURES = [
  ["📊","Difficulty Breakdown"],
  ["🗺️","Topic Heatmap"],
  ["📈","Rating History"],
  ["🔥","Activity Calendar"],
  ["🏆","Interview Score"],
  ["🤖","AI Study Plan"],
  ["🔮","Difficulty Predictor"],
  ["🔗","Shareable Link"],
  ["🌍","Global Rank"],
  ["📅","Progress Timeline"],
  ["🎯","Goal Tracker"],
  ["🗣️","Language Stats"],
]

export default function LandingPage({ onAnalyze }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"calc(100vh - 68px)", padding:"40px 24px", textAlign:"center" }}>

      <div style={{ fontSize:60, marginBottom:20, filter:"drop-shadow(0 0 32px rgba(99,179,237,0.35))" }}>∑</div>

      <h1 style={{ fontSize:"clamp(28px,5vw,50px)", fontWeight:700, letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:14, maxWidth:680 }}>
        Analyze your{" "}
        <span style={{ background:"linear-gradient(135deg,#63b3ed,#b794f4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          LeetCode journey
        </span>{" "}
        like a pro
      </h1>

      <p style={{ fontSize:15, color:"var(--text2)", maxWidth:460, lineHeight:1.7, marginBottom:36 }}>
        Deep analytics on difficulty, topic mastery, contest rating, and global rank — powered by the real LeetCode API. Type your username in the search bar above to get started.
      </p>

      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:36, color:"var(--text3)", fontSize:12 }}>
        <i className="fa-solid fa-arrow-up" style={{ color:"var(--accent)" }} />
        Type your LeetCode username in the search bar above
      </div>

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", maxWidth:720, marginBottom:40 }}>
        {FEATURES.map(([icon, label]) => (
          <div key={label} style={{ padding:"7px 14px", borderRadius:20, background:"var(--surface)", border:"1px solid var(--border)", fontSize:12, color:"var(--text2)", display:"flex", alignItems:"center", gap:5 }}>
            <span>{icon}</span> {label}
          </div>
        ))}
      </div>

      <div style={{ fontSize:11, color:"var(--text3)", marginBottom:12, letterSpacing:"1px", textTransform:"uppercase" }}>
        Or try a top coder
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:40 }}>
        {EXAMPLES.map(name => (
          <button key={name} onClick={() => onAnalyze(name)}
            style={{ padding:"8px 18px", borderRadius:8, cursor:"pointer", background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text2)", fontSize:13, fontFamily:"var(--font-mono)", fontWeight:500, transition:"all 0.15s" }}
            onMouseEnter={e => { e.target.style.borderColor="var(--border2)"; e.target.style.color="var(--text)"; e.target.style.background="var(--surface2)" }}
            onMouseLeave={e => { e.target.style.borderColor="var(--border)";  e.target.style.color="var(--text2)"; e.target.style.background="var(--surface)" }}>
            {name}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap", justifyContent:"center", fontSize:12, color:"var(--text3)", paddingTop:24, borderTop:"0.5px solid var(--border)", maxWidth:500, width:"100%" }}>
        <span><i className="fa-solid fa-shield-halved" style={{ color:"var(--green)", marginRight:5 }} />Live LeetCode API</span>
        <span><i className="fa-solid fa-bolt" style={{ color:"var(--yellow)", marginRight:5 }} />Cached 5 min</span>
        <span><i className="fa-solid fa-lock-open" style={{ color:"var(--accent)", marginRight:5 }} />No extra login</span>
        <span><i className="fa-solid fa-heart" style={{ color:"var(--red)", marginRight:5 }} />Free forever</span>
      </div>

    </div>
  )
}
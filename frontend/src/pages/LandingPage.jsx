import React from "react"

const EXAMPLES = ["tourist", "neal_wu", "jiangly", "ecnerwala", "dreamoon"]

const FEATURES = [
  "Skill gap analyzer","Interview score","Daily challenge",
  "Topic heatmap","Goal tracker","Global rank",
  "Rating history","AI study plan","Language stats",
]

export default function LandingPage({ onAnalyze }) {
  return (
    <div style={{ minHeight:"calc(100vh - 68px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center", position:"relative" }}>

      {/* Announcement pill */}
      <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 14px", borderRadius:20, background:"rgba(99,179,237,0.08)", border:"0.5px solid rgba(99,179,237,0.25)", marginBottom:20 }}>
        <span style={{ width:6, height:6, borderRadius:"50%", background:"#3B6D11", flexShrink:0 }} />
        <span style={{ fontSize:11, color:"var(--accent)", fontWeight:500 }}>Live LeetCode data · No extra login required to analyze</span>
      </div>

      {/* Hero heading */}
      <h1 style={{ fontSize:"clamp(28px,5vw,48px)", fontWeight:500, letterSpacing:"-1.5px", lineHeight:1.15, marginBottom:14, maxWidth:620, color:"var(--text)" }}>
        Your LeetCode journey,{" "}
        <span style={{ background:"linear-gradient(135deg,#63b3ed,#b794f4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          analyzed like a pro
        </span>
      </h1>

      <p style={{ fontSize:15, color:"var(--text2)", maxWidth:460, lineHeight:1.75, marginBottom:32 }}>
        Deep analytics on topic mastery, interview readiness, skill gaps, and company-specific prep — powered by real LeetCode data.
      </p>

      {/* Search box */}
      <div style={{ display:"flex", gap:10, marginBottom:32, width:"100%", maxWidth:460, justifyContent:"center" }}>
        <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, background:"var(--surface)", border:"0.5px solid var(--border2)", borderRadius:10, padding:"10px 16px" }}>
          <i className="fa-brands fa-leetcode" style={{ color:"var(--accent)", fontSize:15 }} />
          <input
            type="text"
            placeholder="Enter any LeetCode username..."
            onKeyDown={e => e.key === "Enter" && e.target.value.trim() && onAnalyze(e.target.value.trim())}
            style={{ background:"none", border:"none", outline:"none", color:"var(--text)", fontFamily:"var(--font-mono)", fontSize:13, width:"100%" }}
          />
        </div>
        <button
          onClick={e => {
            const input = e.currentTarget.parentElement.querySelector("input")
            if (input.value.trim()) onAnalyze(input.value.trim())
          }}
          style={{ padding:"10px 22px", borderRadius:10, background:"linear-gradient(135deg,#185FA5,#3B6D11)", color:"#fff", border:"none", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"var(--font-main)", display:"flex", alignItems:"center", gap:7, whiteSpace:"nowrap", boxShadow:"0 4px 16px rgba(24,95,165,0.25)" }}>
          <i className="fa-solid fa-chart-line" style={{ fontSize:13 }} /> Analyze
        </button>
      </div>

      {/* Feature pills */}
      <div style={{ display:"flex", gap:7, flexWrap:"wrap", justifyContent:"center", maxWidth:580, marginBottom:36 }}>
        {FEATURES.map(f => (
          <span key={f} style={{ fontSize:11, padding:"4px 12px", borderRadius:20, background:"var(--surface)", border:"0.5px solid var(--border)", color:"var(--text2)" }}>{f}</span>
        ))}
      </div>

      {/* Example users */}
      <div style={{ fontSize:11, color:"var(--text3)", marginBottom:10, textTransform:"uppercase", letterSpacing:"1px" }}>Try a top coder</div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:40 }}>
        {EXAMPLES.map(name => (
          <button key={name} onClick={() => onAnalyze(name)}
            style={{ padding:"7px 16px", borderRadius:8, cursor:"pointer", background:"var(--surface)", border:"0.5px solid var(--border)", color:"var(--text2)", fontSize:12, fontFamily:"var(--font-mono)", fontWeight:500, transition:"all 0.15s" }}
            onMouseEnter={e => { e.target.style.borderColor="var(--border2)"; e.target.style.color="var(--text)"; e.target.style.background="var(--surface2)" }}
            onMouseLeave={e => { e.target.style.borderColor="var(--border)";  e.target.style.color="var(--text2)"; e.target.style.background="var(--surface)" }}>
            {name}
          </button>
        ))}
      </div>

      {/* Trust bar */}
      <div style={{ display:"flex", gap:20, flexWrap:"wrap", justifyContent:"center", fontSize:12, color:"var(--text3)", paddingTop:20, borderTop:"0.5px solid var(--border)", maxWidth:480, width:"100%" }}>
        <span><i className="fa-solid fa-shield-halved" style={{ color:"var(--green)", marginRight:5 }} />Live API</span>
        <span><i className="fa-solid fa-bolt" style={{ color:"var(--yellow)", marginRight:5 }} />Cached 5 min</span>
        <span><i className="fa-solid fa-lock" style={{ color:"var(--accent)", marginRight:5 }} />Secure auth</span>
        <span><i className="fa-solid fa-heart" style={{ color:"var(--red)", marginRight:5 }} />Free forever</span>
      </div>
    </div>
  )
}
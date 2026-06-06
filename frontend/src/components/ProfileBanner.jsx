import React, { useMemo } from "react"

function computeFaangScore(data) {
  const { solved, calendar, topics } = data
  const topicCount = [...(topics?.fundamental||[]),...(topics?.intermediate||[]),...(topics?.advanced||[])].filter(t => t.problemsSolved >= 5).length
  const s1 = Math.min(100, Math.round((solved.total / 500) * 30))
  const s2 = Math.min(100, Math.round((solved.hard  / 150) * 30))
  const s3 = Math.min(100, Math.round((topicCount   / 15)  * 25))
  const s4 = Math.min(100, Math.round(Math.min(calendar.streak||0, 100) / 100 * 15))
  return Math.round(s1 + s2 + s3 + s4)
}

export default function ProfileBanner({ data }) {
  const { profile, solved, contest, calendar } = data
  const initials = (profile.realName || data.username).split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()
  const faang    = useMemo(() => computeFaangScore(data), [data])

  const faangTier =
    faang >= 88 ? { label:"FAANG+ Ready",    color:"#3B6D11" } :
    faang >= 72 ? { label:"Tier 1 Ready",     color:"#185FA5" } :
    faang >= 55 ? { label:"Tier 2 Ready",     color:"#BA7517" } :
                  { label:"Keep grinding",    color:"#7F77DD" }

  return (
    <div className="card" style={{ padding:"22px 28px", marginBottom:24, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(99,179,237,0.03),rgba(183,148,244,0.03))", pointerEvents:"none" }} />

      <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:16 }}>
        {/* Avatar */}
        <div style={{ position:"relative", flexShrink:0 }}>
          {profile.avatar
            ? <img src={profile.avatar} alt={data.username} style={{ width:56, height:56, borderRadius:"50%", objectFit:"cover", boxShadow:"0 0 0 3px rgba(99,179,237,0.2)" }} />
            : <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#63b3ed,#b794f4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:500, color:"#fff", boxShadow:"0 0 0 3px rgba(99,179,237,0.2)" }}>{initials}</div>
          }
          <div style={{ position:"absolute", bottom:2, right:2, width:12, height:12, borderRadius:"50%", background:"#3B6D11", border:"2px solid var(--surface)" }} />
        </div>

        {/* Info */}
        <div style={{ flex:1 }}>
          <h2 style={{ fontSize:18, fontWeight:500, color:"var(--text)", marginBottom:4 }}>{profile.realName || data.username}</h2>
          <p style={{ fontSize:12, color:"var(--text3)", marginBottom:8 }}>
            <a href={"https://leetcode.com/"+data.username} target="_blank" rel="noreferrer" style={{ color:"var(--text3)" }}>leetcode.com/{data.username}</a>
            {profile.country && <span> · {profile.country}</span>}
            {profile.company && <span> · {profile.company}</span>}
          </p>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {profile.ranking && <span style={{ fontSize:10, fontWeight:600, padding:"3px 9px", borderRadius:20, background:"rgba(59,109,17,0.1)", color:"#3B6D11", border:"0.5px solid rgba(59,109,17,0.25)" }}>🏆 Rank #{profile.ranking.toLocaleString()}</span>}
            {calendar?.streak > 0 && <span style={{ fontSize:10, fontWeight:600, padding:"3px 9px", borderRadius:20, background:"rgba(186,117,23,0.1)", color:"#BA7517", border:"0.5px solid rgba(186,117,23,0.25)" }}>🔥 {calendar.streak}d streak</span>}
            {contest?.badge && <span style={{ fontSize:10, fontWeight:600, padding:"3px 9px", borderRadius:20, background:"rgba(127,119,221,0.1)", color:"#7F77DD", border:"0.5px solid rgba(127,119,221,0.25)" }}>⭐ {contest.badge}</span>}
            <span style={{ fontSize:10, fontWeight:600, padding:"3px 9px", borderRadius:20, background:faangTier.color+"18", color:faangTier.color, border:"0.5px solid "+faangTier.color+"30" }}>{faangTier.label}</span>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display:"flex", gap:28, borderLeft:"0.5px solid var(--border2)", paddingLeft:24 }}>
          {[
            { val:solved.total.toLocaleString(), lbl:"Solved",     color:"#3B6D11" },
            { val:contest.rating || "—",         lbl:"Rating",     color:"#185FA5" },
            { val:contest.topPercentage !== "N/A" ? "Top "+contest.topPercentage+"%" : "—", lbl:"Percentile", color:"#BA7517" },
          ].map(({ val, lbl, color }) => (
            <div key={lbl} style={{ textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:500, fontFamily:"var(--font-mono)", color, lineHeight:1 }}>{val}</div>
              <div style={{ fontSize:10, color:"var(--text3)", marginTop:5, textTransform:"uppercase", letterSpacing:"0.5px" }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAANG readiness bar */}
      <div style={{ padding:"10px 14px", background:"rgba(59,109,17,0.05)", border:"0.5px solid rgba(59,109,17,0.15)", borderRadius:8, display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ fontSize:11, color:"var(--text3)", flexShrink:0, width:120 }}>FAANG+ readiness</div>
        <div style={{ flex:1, height:5, background:"var(--surface3)", borderRadius:3, overflow:"hidden" }}>
          <div style={{ height:"100%", background:faangTier.color, borderRadius:3, width:faang+"%", transition:"width 1.2s ease" }} />
        </div>
        <div style={{ fontSize:12, fontWeight:600, fontFamily:"var(--font-mono)", color:faangTier.color, flexShrink:0, width:36, textAlign:"right" }}>{faang}%</div>
        <div style={{ fontSize:11, color:faangTier.color, flexShrink:0 }}>{faangTier.label}</div>
      </div>
    </div>
  )
}
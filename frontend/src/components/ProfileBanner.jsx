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
    faang >= 88 ? { label:"FAANG+ Ready",  color:"#3B6D11" } :
    faang >= 72 ? { label:"Tier 1 Ready",  color:"#185FA5" } :
    faang >= 55 ? { label:"Tier 2 Ready",  color:"#BA7517" } :
                  { label:"Keep grinding", color:"#7F77DD" }

  return (
    <div className="card" style={{ padding:"18px 20px", marginBottom:24, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(99,179,237,0.03),rgba(183,148,244,0.03))", pointerEvents:"none" }} />

      {/* Top row — avatar + info + stats */}
      <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:14, flexWrap:"wrap" }}>

        {/* Avatar */}
        <div style={{ flexShrink:0 }}>
          {profile.avatar
            ? <img src={profile.avatar} alt={data.username} style={{ width:48, height:48, borderRadius:"50%", objectFit:"cover", boxShadow:"0 0 0 2px rgba(99,179,237,0.3)" }} />
            : <div style={{ width:48, height:48, borderRadius:"50%", background:"linear-gradient(135deg,#63b3ed,#b794f4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:600, color:"#fff", boxShadow:"0 0 0 2px rgba(99,179,237,0.3)" }}>{initials}</div>
          }
        </div>

        {/* Name + badges */}
        <div style={{ flex:1, minWidth:0 }}>
          <h2 style={{ fontSize:16, fontWeight:600, color:"var(--text)", marginBottom:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{profile.realName || data.username}</h2>
          <p style={{ fontSize:11, color:"var(--text3)", marginBottom:8, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            <a href={"https://leetcode.com/"+data.username} target="_blank" rel="noreferrer" style={{ color:"var(--text3)" }}>@{data.username}</a>
            {profile.country && <span> · {profile.country}</span>}
          </p>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            {profile.ranking && <span style={{ fontSize:9, fontWeight:600, padding:"2px 7px", borderRadius:20, background:"rgba(59,109,17,0.1)", color:"#3B6D11", border:"0.5px solid rgba(59,109,17,0.25)", whiteSpace:"nowrap" }}>?? #{profile.ranking.toLocaleString()}</span>}
            {calendar?.streak > 0 && <span style={{ fontSize:9, fontWeight:600, padding:"2px 7px", borderRadius:20, background:"rgba(186,117,23,0.1)", color:"#BA7517", border:"0.5px solid rgba(186,117,23,0.25)", whiteSpace:"nowrap" }}>?? {calendar.streak}d</span>}
            {contest?.badge && <span style={{ fontSize:9, fontWeight:600, padding:"2px 7px", borderRadius:20, background:"rgba(127,119,221,0.1)", color:"#7F77DD", border:"0.5px solid rgba(127,119,221,0.25)", whiteSpace:"nowrap" }}>? {contest.badge}</span>}
            <span style={{ fontSize:9, fontWeight:600, padding:"2px 7px", borderRadius:20, background:faangTier.color+"18", color:faangTier.color, border:"0.5px solid "+faangTier.color+"30", whiteSpace:"nowrap" }}>{faangTier.label}</span>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display:"flex", gap:16, paddingLeft:14, borderLeft:"0.5px solid var(--border2)", flexShrink:0 }}>
          {[
            { val:solved.total.toLocaleString(), lbl:"Solved",     color:"#3B6D11" },
            { val:contest.rating || "—",         lbl:"Rating",     color:"#185FA5" },
            { val:contest.topPercentage !== "N/A" ? "Top "+contest.topPercentage+"%" : "—", lbl:"Rank", color:"#BA7517" },
          ].map(({ val, lbl, color }) => (
            <div key={lbl} style={{ textAlign:"center" }}>
              <div style={{ fontSize:18, fontWeight:600, fontFamily:"var(--font-mono)", color, lineHeight:1 }}>{val}</div>
              <div style={{ fontSize:9, color:"var(--text3)", marginTop:4, textTransform:"uppercase", letterSpacing:"0.4px" }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAANG readiness bar */}
      <div style={{ padding:"8px 12px", background:"rgba(59,109,17,0.05)", border:"0.5px solid rgba(59,109,17,0.15)", borderRadius:8, display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ fontSize:10, color:"var(--text3)", flexShrink:0 }}>FAANG+</div>
        <div style={{ flex:1, height:4, background:"var(--surface3)", borderRadius:3, overflow:"hidden" }}>
          <div style={{ height:"100%", background:faangTier.color, borderRadius:3, width:faang+"%", transition:"width 1.2s ease" }} />
        </div>
        <div style={{ fontSize:11, fontWeight:600, fontFamily:"var(--font-mono)", color:faangTier.color, flexShrink:0 }}>{faang}%</div>
        <div style={{ fontSize:10, color:faangTier.color, flexShrink:0 }}>{faangTier.label}</div>
      </div>
    </div>
  )
}

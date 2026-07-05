import React from "react"

function StatCard({ icon, color, value, label, badge, badgeColor, sub }) {
  return (
    <div className="card" style={{ padding:"18px 20px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <div style={{ width:32, height:32, borderRadius:8, background:color+"18", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <i className={"fa-solid "+icon} style={{ color, fontSize:15 }} />
        </div>
        {badge && (
          <span style={{ fontSize:10, fontWeight:600, padding:"3px 8px", borderRadius:20, background:badgeColor+"15", color:badgeColor, border:"0.5px solid "+badgeColor+"30" }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ fontSize:28, fontWeight:500, fontFamily:"var(--font-mono)", color, lineHeight:1, marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:11, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom: sub ? 6 : 0 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:"var(--text3)" }}>{sub}</div>}
    </div>
  )
}

export default function StatCards({ data }) {
  const { solved, contest, calendar } = data

  const accRate = solved.totalSubs > 0
    ? ((solved.total / solved.totalSubs) * 100).toFixed(1) + "%"
    : "N/A"

  const streak        = calendar.streak        || 0
  const totalActive   = calendar.totalActiveDays || 0

  // Determine if user solved something today
  const todayTs   = Math.floor(new Date().setHours(0,0,0,0) / 1000)
  const solvedToday = calendar.submissions
    ? Object.keys(calendar.submissions).some(ts => parseInt(ts) >= todayTs)
    : false

  const streakStatus = streak === 0
    ? { label:"No streak", color:"#A32D2D" }
    : solvedToday
      ? { label:"🔥 Active today", color:"#3B6D11" }
      : { label:"⚠️ Solve today!", color:"#BA7517" }

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
      <StatCard
        icon="fa-circle-check"
        color="#3B6D11"
        value={solved.total.toLocaleString()}
        label="Problems solved"
        badge={accRate+" acc"}
        badgeColor="#3B6D11"
        sub={"Easy "+solved.easy+" · Med "+solved.medium+" · Hard "+solved.hard}
      />
      <StatCard
        icon="fa-star"
        color="#185FA5"
        value={contest.rating || "—"}
        label="Contest rating"
        badge={contest.topPercentage && contest.topPercentage !== "N/A" ? "Top "+contest.topPercentage+"%" : "Unrated"}
        badgeColor="#185FA5"
        sub={contest.attended ? contest.attended+" contests entered" : "No contests yet"}
      />
      <StatCard
        icon="fa-fire"
        color={streak > 0 ? "#BA7517" : "#A32D2D"}
        value={streak+"d"}
        label="Current streak"
        badge={streakStatus.label}
        badgeColor={streakStatus.color}
        sub={totalActive+" total active days"}
      />
      <StatCard
        icon="fa-calendar-check"
        color="#7F77DD"
        value={totalActive}
        label="Active days"
        badge={solvedToday ? "✓ Solved today" : "Not yet today"}
        badgeColor={solvedToday ? "#3B6D11" : "#BA7517"}
        sub={"Streak: "+streak+"d · Keep it going!"}
      />
    </div>
  )
}
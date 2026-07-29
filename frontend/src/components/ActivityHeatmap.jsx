import React, { useMemo, useState } from "react"

const LEVELS = [
  "rgba(99,179,237,0.0)",
  "rgba(99,179,237,0.2)",
  "rgba(99,179,237,0.45)",
  "rgba(99,179,237,0.7)",
  "#63b3ed",
]

const MOTIVATIONAL = [
  "Every problem you solve makes the next one easier 💪",
  "Consistency beats intensity — keep showing up 🔥",
  "One problem a day keeps the rejection away 😄",
  "Your future self will thank you for today 🚀",
  "Top coders weren't born — they were built one problem at a time ⚡",
]

function getLevel(count) {
  if (!count) return 0
  if (count === 1) return 1
  if (count === 2) return 2
  if (count <= 4) return 3
  return 4
}

export default function ActivityHeatmap({ calendar }) {
  const [tooltip, setTooltip] = useState(null)
  const submissions = calendar?.submissions || {}
  const streak      = calendar?.streak      || 0
  const totalActive = calendar?.totalActiveDays || 0

  // Build 52-week grid
  const { weeks, monthLabels, maxDay, totalSolved, longestStreak } = useMemo(() => {
    const today    = new Date()
    const start    = new Date(today)
    start.setDate(today.getDate() - 364)
    // Align to Sunday
    start.setDate(start.getDate() - start.getDay())

    const weeks     = []
    const months    = {}
    let   maxCount  = 0
    let   total     = 0
    let   best      = 0
    let   cur       = 0
    let   lastDate  = null

    let cur_date = new Date(start)
    while (cur_date <= today) {
      const week = []
      for (let d = 0; d < 7; d++) {
        const dateStr = cur_date.toISOString().split("T")[0]
        const ts      = Math.floor(cur_date.getTime() / 1000)
        // Match timestamp within the same day
        const count   = Object.entries(submissions).reduce((s,[k,v]) => {
          const kd = new Date(parseInt(k)*1000).toISOString().split("T")[0]
          return kd === dateStr ? s + v : s
        }, 0)

        if (count > maxCount) maxCount = count
        if (count > 0) {
          total++
          if (lastDate && (cur_date - lastDate) / 86400000 === 1) {
            cur++
          } else { cur = 1 }
          if (cur > best) best = cur
          lastDate = new Date(cur_date)
        }

        const monthKey = cur_date.toLocaleDateString("en-US", { month:"short" })
        if (!months[monthKey]) months[monthKey] = weeks.length

        week.push({ date:dateStr, count, ts, future: cur_date > today })
        cur_date.setDate(cur_date.getDate() + 1)
      }
      weeks.push(week)
    }

    const monthLabels = Object.entries(months).map(([m, w]) => ({ month:m, week:w }))
    return { weeks, monthLabels, maxDay:maxCount, totalSolved:total, longestStreak:best }
  }, [submissions])

  const todayTs  = Math.floor(new Date().setHours(0,0,0,0)/1000)
  const solvedToday = Object.keys(submissions).some(ts => {
    const d = new Date(parseInt(ts)*1000)
    return d.toDateString() === new Date().toDateString()
  })

  const quote = useMemo(() => MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)], [])

  return (
    <div className="card" style={{ marginBottom:24, padding:"22px 24px" }}>
      <div className="card-header">
        <div>
          <div className="card-title">Activity heatmap</div>
          <div className="card-subtitle">52 weeks of your coding consistency</div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {!solvedToday && (
            <div style={{ fontSize:11, padding:"4px 12px", borderRadius:20, background:"rgba(163,45,45,0.1)", border:"0.5px solid rgba(163,45,45,0.3)", color:"#A32D2D", fontWeight:600 }}>
              ⚠️ Solve today to keep streak!
            </div>
          )}
          {solvedToday && (
            <div style={{ fontSize:11, padding:"4px 12px", borderRadius:20, background:"rgba(59,109,17,0.1)", border:"0.5px solid rgba(59,109,17,0.3)", color:"#3B6D11", fontWeight:600 }}>
              ✓ Solved today!
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:18 }}>
        {[
          { label:"Current streak",  val:streak+"d",      color:streak>0?"#f6ad55":"#A32D2D", icon:"fa-fire"           },
          { label:"Longest streak",  val:longestStreak+"d",color:"#185FA5",                   icon:"fa-trophy"         },
          { label:"Active days",     val:totalActive,      color:"#3B6D11",                   icon:"fa-calendar-check" },
          { label:"Best single day", val:maxDay+" solved", color:"#7F77DD",                   icon:"fa-star"           },
        ].map(({ label, val, color, icon }) => (
          <div key={label} style={{ background:"var(--surface2)", borderRadius:8, padding:"10px 14px", border:"0.5px solid var(--border)", display:"flex", alignItems:"center", gap:10 }}>
            <i className={"fa-solid "+icon} style={{ color, fontSize:16, flexShrink:0 }} />
            <div>
              <div style={{ fontSize:15, fontWeight:600, fontFamily:"var(--font-mono)", color, lineHeight:1 }}>{val}</div>
              <div style={{ fontSize:10, color:"var(--text3)", marginTop:3, textTransform:"uppercase", letterSpacing:"0.3px" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Month labels */}
      <div style={{ display:"flex", marginBottom:4, marginLeft:24 }}>
        {monthLabels.map(({ month, week }) => (
          <div key={month} style={{ position:"absolute", marginLeft: week*13+"px", fontSize:10, color:"var(--text3)", pointerEvents:"none" }}>{month}</div>
        ))}
        <div style={{ height:14 }} />
      </div>

      {/* Heatmap grid */}
      <div style={{ display:"flex", gap:3, overflowX:"auto", paddingBottom:8, position:"relative" }}>
        {/* Day labels */}
        <div style={{ display:"flex", flexDirection:"column", gap:3, marginRight:4, paddingTop:18 }}>
          {["","Mon","","Wed","","Fri",""].map((d,i) => (
            <div key={i} style={{ height:10, fontSize:9, color:"var(--text3)", lineHeight:"10px", width:20 }}>{d}</div>
          ))}
        </div>

        {/* Weeks */}
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          {/* Month labels */}
          <div style={{ display:"flex", gap:3, marginBottom:4, height:14 }}>
            {weeks.map((_, wi) => {
              const label = monthLabels.find(m => m.week === wi)
              return <div key={wi} style={{ width:10, fontSize:9, color:"var(--text3)", whiteSpace:"nowrap" }}>{label ? label.month : ""}</div>
            })}
          </div>
          {/* Grid */}
          <div style={{ display:"flex", gap:3 }}>
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display:"flex", flexDirection:"column", gap:3 }}>
                {week.map((day, di) => {
                  const lvl   = getLevel(day.count)
                  const color = LEVELS[lvl]
                  const isToday = day.date === new Date().toISOString().split("T")[0]
                  return (
                    <div key={di}
                      onMouseEnter={() => setTooltip({ date:day.date, count:day.count, x:wi, y:di })}
                      onMouseLeave={() => setTooltip(null)}
                      style={{
                        width:10, height:10, borderRadius:2,
                        background: day.future ? "transparent" : color,
                        border: isToday ? "1.5px solid #63b3ed" : lvl>0 ? "0.5px solid rgba(99,179,237,0.3)" : "0.5px solid rgba(255,255,255,0.04)",
                        cursor: day.count > 0 ? "pointer" : "default",
                        transition:"transform 0.1s",
                        transform: tooltip?.date===day.date ? "scale(1.6)" : "scale(1)",
                        boxShadow: tooltip?.date===day.date && day.count>0 ? "0 0 6px rgba(99,179,237,0.6)" : "none",
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{ marginTop:10, padding:"8px 14px", background:"var(--surface2)", borderRadius:8, border:"0.5px solid var(--border2)", fontSize:12, color:"var(--text2)", display:"flex", alignItems:"center", gap:10 }}>
          <i className="fa-solid fa-calendar-day" style={{ color:"var(--accent)" }} />
          <span><strong style={{ color:"var(--text)" }}>{tooltip.date}</strong> — {tooltip.count > 0 ? <span style={{ color:"#3B6D11", fontWeight:600 }}>{tooltip.count} problem{tooltip.count>1?"s":""} solved 🔥</span> : <span style={{ color:"var(--text3)" }}>No activity</span>}</span>
        </div>
      )}

      {/* Legend + motivational */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:14, flexWrap:"wrap", gap:10 }}>
        <div style={{ fontSize:11, color:"var(--text3)", fontStyle:"italic", maxWidth:400 }}>"{quote}"</div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:10, color:"var(--text3)" }}>Less</span>
          {LEVELS.map((c,i) => (
            <div key={i} style={{ width:10, height:10, borderRadius:2, background:c, border:"0.5px solid rgba(99,179,237,0.2)" }} />
          ))}
          <span style={{ fontSize:10, color:"var(--text3)" }}>More</span>
        </div>
      </div>
    </div>
  )
}
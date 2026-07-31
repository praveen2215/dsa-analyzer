import React, { useMemo, useState, useRef } from "react"

const LEVELS = [
  "rgba(99,179,237,0.0)",
  "rgba(99,179,237,0.2)",
  "rgba(99,179,237,0.45)",
  "rgba(99,179,237,0.7)",
  "#63b3ed",
]

const MOTIVATIONAL = [
  "Every problem you solve makes the next one easier ??",
  "Consistency beats intensity — keep showing up ??",
  "One problem a day keeps the rejection away ??",
  "Your future self will thank you for today ??",
  "Top coders were built one problem at a time ?",
]

function getLevel(count) {
  if (!count) return 0
  if (count === 1) return 1
  if (count === 2) return 2
  if (count <= 4)  return 3
  return 4
}

export default function ActivityHeatmap({ calendar }) {
  const [tooltip, setTooltip] = useState(null)
  const scrollRef = useRef(null)
  const submissions = calendar?.submissions || {}
  const streak      = calendar?.streak      || 0
  const totalActive = calendar?.totalActiveDays || 0

  const { weeks, monthLabels, maxDay, longestStreak } = useMemo(() => {
    const today = new Date()
    const start = new Date(today)
    start.setDate(today.getDate() - 364)
    start.setDate(start.getDate() - start.getDay())

    const weeks       = []
    const monthsSeen  = {}
    let   maxCount    = 0
    let   best        = 0
    let   cur         = 0
    let   lastDate    = null
    let   cur_date    = new Date(start)

    while (cur_date <= today) {
      const week = []
      for (let d = 0; d < 7; d++) {
        const dateStr = cur_date.toISOString().split("T")[0]
        const count   = Object.entries(submissions).reduce((s,[k,v]) => {
          return new Date(parseInt(k)*1000).toISOString().split("T")[0] === dateStr ? s + v : s
        }, 0)

        if (count > maxCount) maxCount = count
        if (count > 0) {
          if (lastDate && (cur_date - lastDate) / 86400000 === 1) cur++
          else cur = 1
          if (cur > best) best = cur
          lastDate = new Date(cur_date)
        }

        const monthKey = cur_date.toLocaleDateString("en-US", { month:"short" })
        if (!monthsSeen[monthKey]) monthsSeen[monthKey] = weeks.length

        week.push({ date:dateStr, count, future: cur_date > today })
        cur_date.setDate(cur_date.getDate() + 1)
      }
      weeks.push(week)
    }

    const monthLabels = Object.entries(monthsSeen).map(([m, w]) => ({ month:m, week:w }))
    return { weeks, monthLabels, maxDay:maxCount, longestStreak:best }
  }, [submissions])

  const solvedToday = Object.keys(submissions).some(ts =>
    new Date(parseInt(ts)*1000).toDateString() === new Date().toDateString()
  )

  const quote = useMemo(() => MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)], [])

  // Cell size — smaller on mobile
  const CELL = 10
  const GAP  = 3

  return (
    <div className="card" style={{ marginBottom:24, padding:"18px 16px" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, flexWrap:"wrap", gap:8 }}>
        <div>
          <div className="card-title">Activity heatmap</div>
          <div className="card-subtitle">52 weeks of coding consistency</div>
        </div>
        {!solvedToday
          ? <div style={{ fontSize:11, padding:"4px 10px", borderRadius:20, background:"rgba(163,45,45,0.1)", border:"0.5px solid rgba(163,45,45,0.3)", color:"#A32D2D", fontWeight:600, flexShrink:0 }}>?? Solve today!</div>
          : <div style={{ fontSize:11, padding:"4px 10px", borderRadius:20, background:"rgba(59,109,17,0.1)", border:"0.5px solid rgba(59,109,17,0.3)", color:"#3B6D11", fontWeight:600, flexShrink:0 }}>? Solved today!</div>
        }
      </div>

      {/* Stats — 2x2 grid on mobile */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:14 }}>
        {[
          { label:"Streak",      val:streak+"d",        color:streak>0?"#f6ad55":"#A32D2D", icon:"fa-fire"           },
          { label:"Longest",     val:longestStreak+"d", color:"#185FA5",                   icon:"fa-trophy"         },
          { label:"Active days", val:totalActive,       color:"#3B6D11",                   icon:"fa-calendar-check" },
          { label:"Best day",    val:maxDay+" solved",  color:"#7F77DD",                   icon:"fa-star"           },
        ].map(({ label, val, color, icon }) => (
          <div key={label} style={{ background:"var(--surface2)", borderRadius:8, padding:"8px 10px", border:"0.5px solid var(--border)" }}>
            <div style={{ fontSize:14, fontWeight:600, fontFamily:"var(--font-mono)", color, lineHeight:1, marginBottom:4 }}>{val}</div>
            <div style={{ fontSize:9, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.3px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Heatmap — horizontally scrollable on mobile */}
      <div ref={scrollRef} style={{ overflowX:"auto", overflowY:"hidden", paddingBottom:6, WebkitOverflowScrolling:"touch" }}>
        <div style={{ display:"inline-flex", flexDirection:"column", minWidth:"max-content" }}>

          {/* Month labels */}
          <div style={{ display:"flex", gap:GAP, marginBottom:4, marginLeft:22 }}>
            {weeks.map((_, wi) => {
              const label = monthLabels.find(m => m.week === wi)
              return (
                <div key={wi} style={{ width:CELL, fontSize:8, color:"var(--text3)", overflow:"visible", whiteSpace:"nowrap" }}>
                  {label ? label.month : ""}
                </div>
              )
            })}
          </div>

          {/* Grid with day labels */}
          <div style={{ display:"flex", gap:0 }}>
            {/* Day labels */}
            <div style={{ display:"flex", flexDirection:"column", gap:GAP, marginRight:4, paddingTop:0 }}>
              {["S","M","T","W","T","F","S"].map((d,i) => (
                <div key={i} style={{ height:CELL, fontSize:8, color:"var(--text3)", lineHeight:CELL+"px", width:14, textAlign:"right" }}>
                  {i % 2 === 1 ? d : ""}
                </div>
              ))}
            </div>

            {/* Weeks */}
            <div style={{ display:"flex", gap:GAP }}>
              {weeks.map((week, wi) => (
                <div key={wi} style={{ display:"flex", flexDirection:"column", gap:GAP }}>
                  {week.map((day, di) => {
                    const lvl     = getLevel(day.count)
                    const isToday = day.date === new Date().toISOString().split("T")[0]
                    return (
                      <div key={di}
                        onMouseEnter={() => setTooltip({ date:day.date, count:day.count })}
                        onMouseLeave={() => setTooltip(null)}
                        onTouchStart={() => setTooltip({ date:day.date, count:day.count })}
                        style={{
                          width:CELL, height:CELL, borderRadius:2,
                          background: day.future ? "transparent" : LEVELS[lvl],
                          border: isToday ? "1.5px solid #63b3ed" : lvl>0 ? "0.5px solid rgba(99,179,237,0.2)" : "0.5px solid rgba(255,255,255,0.03)",
                          cursor: day.count > 0 ? "pointer" : "default",
                          transition:"transform 0.1s",
                          transform: tooltip?.date===day.date && day.count>0 ? "scale(1.5)" : "scale(1)",
                          flexShrink:0,
                        }}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{ marginTop:8, padding:"6px 12px", background:"var(--surface2)", borderRadius:7, border:"0.5px solid var(--border2)", fontSize:11, color:"var(--text2)", display:"flex", alignItems:"center", gap:8 }}>
          <i className="fa-solid fa-calendar-day" style={{ color:"var(--accent)", flexShrink:0 }} />
          <span><strong style={{ color:"var(--text)" }}>{tooltip.date}</strong> — {tooltip.count > 0 ? <span style={{ color:"#3B6D11", fontWeight:600 }}>{tooltip.count} problem{tooltip.count>1?"s":""} solved</span> : <span style={{ color:"var(--text3)" }}>No activity</span>}</span>
        </div>
      )}

      {/* Legend + quote */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10, flexWrap:"wrap", gap:8 }}>
        <div style={{ fontSize:10, color:"var(--text3)", fontStyle:"italic", flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>"{quote}"</div>
        <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>
          <span style={{ fontSize:9, color:"var(--text3)" }}>Less</span>
          {LEVELS.map((c,i) => (
            <div key={i} style={{ width:8, height:8, borderRadius:2, background:c, border:"0.5px solid rgba(99,179,237,0.15)", flexShrink:0 }} />
          ))}
          <span style={{ fontSize:9, color:"var(--text3)" }}>More</span>
        </div>
      </div>
    </div>
  )
}

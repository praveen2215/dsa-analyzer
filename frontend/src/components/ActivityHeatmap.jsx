import React, { useMemo } from "react"

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const DAYS   = ["","Mon","","Wed","","Fri",""]
const LEVELS = ["rgba(128,128,128,0.08)","rgba(59,109,17,0.2)","rgba(59,109,17,0.45)","rgba(59,109,17,0.7)","#3B6D11"]

export default function ActivityHeatmap({ calendar }) {
  const { submissions = {}, streak = 0, totalActiveDays = 0 } = calendar || {}

  const weeks = useMemo(() => {
    const now   = Math.floor(Date.now() / 1000)
    const start = now - 52 * 7 * 86400
    return Array.from({ length: 52 }, (_, w) =>
      Array.from({ length: 7 }, (_, d) => {
        const ts  = start + (w * 7 + d) * 86400
        const key = Object.keys(submissions).find(k => Math.abs(parseInt(k) - ts) < 86400)
        return { ts, count: key ? submissions[key] : 0 }
      })
    )
  }, [submissions])

  return (
    <div className="card" style={{ padding: "22px 24px", marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Activity heatmap</div>
          <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 3 }}>{totalActiveDays} active days · {streak} day streak</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text3)" }}>
          Less {LEVELS.map((c, i) => <div key={i} style={{ width: 11, height: 11, borderRadius: 3, background: c }} />)} More
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 3, marginBottom: 4, paddingLeft: 28 }}>
          {weeks.map((week, wi) => {
            const date = new Date(week[0].ts * 1000)
            return <div key={wi} style={{ width: 13, fontSize: 9, color: "var(--text3)", textAlign: "center", flexShrink: 0 }}>
              {date.getDate() <= 7 ? MONTHS[date.getMonth()] : ""}
            </div>
          })}
        </div>

        {[0,1,2,3,4,5,6].map(d => (
          <div key={d} style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 3 }}>
            <div style={{ width: 24, fontSize: 9, color: "var(--text3)", textAlign: "right", flexShrink: 0 }}>{DAYS[d]}</div>
            {weeks.map((week, wi) => {
              const { count, ts } = week[d]
              const lvl  = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 9 ? 3 : 4
              const date = new Date(ts * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              return <div key={wi} title={count + " submissions · " + date}
                style={{ width: 13, height: 13, borderRadius: 3, background: LEVELS[lvl], cursor: "pointer", flexShrink: 0, transition: "transform 0.12s" }}
                onMouseEnter={e => e.target.style.transform = "scale(1.5)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"} />
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
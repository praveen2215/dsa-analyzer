import React, { useState, useEffect, useMemo } from "react"

const DEFAULT_GOALS = {
  weekly:  { easy:5,  medium:10, hard:5  },
  monthly: { easy:20, medium:40, hard:20 },
}

function getStorageKey(username) {
  return `dsa_goals_${username}`
}

function getWeekStart() {
  const now    = new Date()
  const day    = now.getDay()
  const diff   = (day === 0 ? -6 : 1 - day)
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return Math.floor(monday.getTime() / 1000)
}

function getMonthStart() {
  const now   = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  start.setHours(0, 0, 0, 0)
  return Math.floor(start.getTime() / 1000)
}

function countFromCalendar(submissions, fromTimestamp) {
  if (!submissions || !Object.keys(submissions).length) return 0
  return Object.entries(submissions).reduce((total, [ts, count]) => {
    return parseInt(ts) >= fromTimestamp ? total + count : total
  }, 0)
}

function GoalRing({ pct, color, size=52 }) {
  const r    = size/2-5
  const circ = 2*Math.PI*r
  const fill = Math.min(pct, 100)
  return (
    <svg width={size} height={size} viewBox={"0 0 "+size+" "+size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface3)" strokeWidth="4"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={fill >= 100 ? "#3B6D11" : color} strokeWidth="4"
        strokeDasharray={circ*fill/100+" "+circ} strokeDashoffset={circ*0.25} strokeLinecap="round"
        style={{ transition:"stroke-dasharray 1s ease" }}/>
      <text x={size/2} y={size/2+4} textAnchor="middle" fontSize="11" fontWeight="500"
        fill={fill >= 100 ? "#3B6D11" : color} fontFamily="var(--font-mono)">
        {fill >= 100 ? "✓" : fill+"%"}
      </text>
    </svg>
  )
}

function GoalRow({ label, current, target, color, onEdit, editKey, isAuto }) {
  const [editing, setEditing] = useState(false)
  const [val,     setVal]     = useState(target)
  const pct  = Math.min(100, Math.round((current / Math.max(1, target)) * 100))
  const done = current >= target
  const save = () => { onEdit(editKey, parseInt(val) || target); setEditing(false) }

  return (
    <div style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 0", borderBottom:"0.5px solid var(--border)" }}>
      <GoalRing pct={pct} color={done ? "#3B6D11" : color} />
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
          <span style={{ fontSize:12, fontWeight:500, color: done ? "#3B6D11" : "var(--text)" }}>
            {label} {done && "🎉"}
          </span>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:12, color: done ? "#3B6D11" : "var(--text2)", fontWeight: done ? 700 : 400 }}>
              {current}
            </span>
            <span style={{ color:"var(--text3)", fontSize:12 }}>/</span>
            {isAuto ? (
              /* Auto-calculated total — not editable */
              <span style={{ fontFamily:"var(--font-mono)", fontSize:12, color:"var(--accent)", fontWeight:600 }}
                title="Auto-calculated from Easy + Medium + Hard targets">
                {target}
              </span>
            ) : editing ? (
              <input type="number" value={val} onChange={e => setVal(e.target.value)}
                onBlur={save} onKeyDown={e => e.key==="Enter" && save()} autoFocus min={1}
                style={{ width:48, fontFamily:"var(--font-mono)", fontSize:12, background:"var(--surface3)", border:"0.5px solid var(--border2)", borderRadius:4, color:"var(--text)", padding:"2px 5px", outline:"none" }} />
            ) : (
              <span onClick={() => setEditing(true)} title="Click to edit goal"
                style={{ fontFamily:"var(--font-mono)", fontSize:12, color:"var(--text3)", cursor:"pointer", borderBottom:"1px dashed var(--border2)" }}>
                {target}
              </span>
            )}
            {isAuto && (
              <span title="Auto-calculated" style={{ fontSize:10, color:"var(--accent)", opacity:0.7 }}>
                <i className="fa-solid fa-calculator" style={{ fontSize:9 }} />
              </span>
            )}
          </div>
        </div>
        <div style={{ height:5, background:"var(--surface3)", borderRadius:3, overflow:"hidden" }}>
          <div style={{ height:"100%", background: done ? "#3B6D11" : color, borderRadius:3, width:pct+"%", transition:"width 1s ease" }} />
        </div>
      </div>
    </div>
  )
}

export default function GoalTracker({ data }) {
  const { solved, calendar } = data
  const storageKey = getStorageKey(data.username)

  const [period, setPeriod] = useState("weekly")
  const [goals,  setGoals]  = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "null") || DEFAULT_GOALS }
    catch { return DEFAULT_GOALS }
  })

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null")
      setGoals(saved || DEFAULT_GOALS)
    } catch { setGoals(DEFAULT_GOALS) }
  }, [storageKey])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(goals))
  }, [goals, storageKey])

  const updateGoal = (key, val) => setGoals(g => ({ ...g, [period]:{ ...g[period], [key]:val } }))

  const submissions  = calendar?.submissions || {}
  const weekStart    = useMemo(() => getWeekStart(),  [])
  const monthStart   = useMemo(() => getMonthStart(), [])

  const solvedThisWeek  = useMemo(() => countFromCalendar(submissions, weekStart),  [submissions, weekStart])
  const solvedThisMonth = useMemo(() => countFromCalendar(submissions, monthStart), [submissions, monthStart])

  const weekLabel = useMemo(() => {
    const start = new Date(weekStart * 1000)
    const end   = new Date(weekStart * 1000 + 6 * 86400000)
    return start.toLocaleDateString("en-US", { month:"short", day:"numeric" }) + " – " +
           end.toLocaleDateString("en-US",   { month:"short", day:"numeric" })
  }, [weekStart])

  const monthLabel = useMemo(() => {
    const now = new Date()
    return now.toLocaleDateString("en-US", { month:"long", year:"numeric" })
  }, [])

  const daysLeftInWeek = useMemo(() => {
    const day = new Date().getDay()
    return day === 0 ? 0 : 7 - day
  }, [])

  const daysLeftInMonth = useMemo(() => {
    const now  = new Date()
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return last.getDate() - now.getDate()
  }, [])

  const periodSolved = period === "weekly" ? solvedThisWeek : solvedThisMonth
  const daysLeft     = period === "weekly" ? daysLeftInWeek : daysLeftInMonth
  const periodLabel  = period === "weekly" ? weekLabel      : monthLabel

  const total       = solved.total || 1
  const easyRatio   = solved.easy   / total
  const medRatio    = solved.medium / total
  const hardRatio   = solved.hard   / total

  const periodEasy   = Math.round(periodSolved * easyRatio)
  const periodMedium = Math.round(periodSolved * medRatio)
  const periodHard   = Math.round(periodSolved * hardRatio)

  // ── Auto-calculate total target from easy + medium + hard ──────────────────
  const autoTotalTarget = goals[period].easy + goals[period].medium + goals[period].hard

  const rows = [
    {
      label:   "Total solved",
      current: periodSolved,
      target:  autoTotalTarget,   // ← auto-calculated, not editable
      color:   "#185FA5",
      key:     "solved",
      isAuto:  true,              // ← marks it as auto
    },
    { label:"Easy problems",   current:periodEasy,   target:goals[period].easy,   color:"#3B6D11", key:"easy",   isAuto:false },
    { label:"Medium problems", current:periodMedium, target:goals[period].medium, color:"#BA7517", key:"medium", isAuto:false },
    { label:"Hard problems",   current:periodHard,   target:goals[period].hard,   color:"#A32D2D", key:"hard",   isAuto:false },
  ]

  const overallPct = Math.round(
    rows.reduce((s,r) => s + Math.min(100,(r.current / Math.max(1,r.target))*100), 0) / rows.length
  )

  return (
    <div className="card" style={{ padding:"22px 24px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:500 }}>Goal tracker</div>
          <div style={{ fontSize:12, color:"var(--text3)", marginTop:3 }}>
            <span style={{ color:"var(--accent)", fontFamily:"var(--font-mono)" }}>{data.username}</span>
            {" · "}{periodLabel}
          </div>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {["weekly","monthly"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              fontSize:11, padding:"4px 12px", borderRadius:6, cursor:"pointer", textTransform:"capitalize",
              border:"0.5px solid "+(period===p ? "var(--border2)":"var(--border)"),
              background:period===p ? "var(--surface2)":"transparent",
              color:period===p ? "var(--text)":"var(--text3)",
              fontFamily:"var(--font-main)", transition:"all 0.15s"
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
        <div style={{ background:"var(--surface2)", borderRadius:8, padding:"10px 14px" }}>
          <div style={{ fontSize:10, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:4 }}>Overall</div>
          <div style={{ fontSize:20, fontWeight:500, fontFamily:"var(--font-mono)", color: overallPct >= 100 ? "#3B6D11" : "#185FA5" }}>
            {overallPct}%
          </div>
        </div>
        <div style={{ background:"var(--surface2)", borderRadius:8, padding:"10px 14px" }}>
          <div style={{ fontSize:10, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:4 }}>
            {period === "weekly" ? "This week" : "This month"}
          </div>
          <div style={{ fontSize:20, fontWeight:500, fontFamily:"var(--font-mono)", color:"#3B6D11" }}>
            {periodSolved} <span style={{ fontSize:12, color:"var(--text3)" }}>/ {autoTotalTarget}</span>
          </div>
        </div>
        <div style={{ background:"var(--surface2)", borderRadius:8, padding:"10px 14px" }}>
          <div style={{ fontSize:10, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:4 }}>Days left</div>
          <div style={{ fontSize:20, fontWeight:500, fontFamily:"var(--font-mono)", color: daysLeft <= 2 ? "#A32D2D" : "#BA7517" }}>
            {daysLeft}d
          </div>
        </div>
      </div>

      {/* Info notice */}
      <div style={{ padding:"8px 12px", background:"rgba(24,95,165,0.06)", border:"0.5px solid rgba(24,95,165,0.15)", borderRadius:7, fontSize:11, color:"var(--text3)", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
        <i className="fa-solid fa-calculator" style={{ color:"#185FA5", flexShrink:0 }} />
        target = Easy + Medium + Hard · Resets every {period === "weekly" ? "Monday" : "1st of the month"}
      </div>

      {/* Goal rows */}
      {rows.map(r => (
        <GoalRow key={r.key} label={r.label} current={r.current} target={r.target}
          color={r.color} onEdit={updateGoal} editKey={r.key} isAuto={r.isAuto} />
      ))}

      {/* Footer messages */}
      {overallPct >= 100 && (
        <div style={{ marginTop:12, padding:"10px 14px", background:"rgba(59,109,17,0.1)", border:"0.5px solid rgba(59,109,17,0.3)", borderRadius:8, fontSize:12, color:"#3B6D11", textAlign:"center", fontWeight:600 }}>
          🎉 All goals completed for this {period === "weekly" ? "week" : "month"}! Outstanding work!
        </div>
      )}
      {overallPct < 100 && daysLeft <= 2 && daysLeft > 0 && (
        <div style={{ marginTop:12, padding:"10px 14px", background:"rgba(163,45,45,0.08)", border:"0.5px solid rgba(163,45,45,0.2)", borderRadius:8, fontSize:12, color:"#A32D2D", textAlign:"center" }}>
          ⚡ Only {daysLeft} day{daysLeft > 1 ? "s" : ""} left — push hard to hit your goals!
        </div>
      )}
      {overallPct >= 50 && overallPct < 100 && daysLeft > 2 && (
        <div style={{ marginTop:12, padding:"10px 14px", background:"rgba(24,95,165,0.06)", border:"0.5px solid rgba(24,95,165,0.15)", borderRadius:8, fontSize:12, color:"#185FA5", textAlign:"center" }}>
          💪 Halfway there — keep the momentum going!
        </div>
      )}
    </div>
  )
}
import React, { useState, useEffect, useMemo } from "react"
import axios from "axios"

const DEFAULT_GOALS = {
  weekly:  { easy:5,  medium:10, hard:5  },
  monthly: { easy:20, medium:40, hard:20 },
}

const BASE = import.meta.env.VITE_API_URL || ""

async function fetchGoals(username) {
  try {
    const res = await axios.get(`${BASE}/api/goals/${username}`, { withCredentials:true })
    return res.data.goals || DEFAULT_GOALS
  } catch { return null }
}

async function saveGoals(username, goals) {
  try {
    await axios.post(`${BASE}/api/goals/${username}`, { goals }, { withCredentials:true })
  } catch {
    // Fallback to localStorage
    localStorage.setItem(`dsa_goals_${username}`, JSON.stringify(goals))
  }
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

function GoalRing({ pct, color, size=48 }) {
  const r    = size/2-5
  const circ = 2*Math.PI*r
  const fill = Math.min(pct, 100)
  return (
    <svg width={size} height={size} viewBox={"0 0 "+size+" "+size} style={{ flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface3)" strokeWidth="4"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={fill>=100?"#3B6D11":color} strokeWidth="4"
        strokeDasharray={circ*fill/100+" "+circ} strokeDashoffset={circ*0.25} strokeLinecap="round"
        style={{ transition:"stroke-dasharray 1s ease" }}/>
      <text x={size/2} y={size/2+4} textAnchor="middle" fontSize="10" fontWeight="500"
        fill={fill>=100?"#3B6D11":color} fontFamily="var(--font-mono)">
        {fill>=100?"?":fill+"%"}
      </text>
    </svg>
  )
}

function GoalRow({ label, current, target, color, onEdit, editKey }) {
  const [editing, setEditing] = useState(false)
  const [val,     setVal]     = useState(target)
  const pct  = Math.min(100, Math.round((current / Math.max(1, target)) * 100))
  const done = current >= target
  const save = () => { onEdit(editKey, parseInt(val) || target); setEditing(false) }

  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"0.5px solid var(--border)" }}>
      <GoalRing pct={pct} color={done?"#3B6D11":color} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
          <span style={{ fontSize:12, fontWeight:500, color:done?"#3B6D11":"var(--text)", whiteSpace:"nowrap" }}>
            {label} {done && "??"}
          </span>
          <div style={{ display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:12, color:done?"#3B6D11":"var(--text2)", fontWeight:done?700:400 }}>{current}</span>
            <span style={{ color:"var(--text3)", fontSize:12 }}>/</span>
            {editing
              ? <input type="number" value={val} onChange={e => setVal(e.target.value)}
                  onBlur={save} onKeyDown={e => e.key==="Enter" && save()} autoFocus min={1}
                  style={{ width:44, fontFamily:"var(--font-mono)", fontSize:12, background:"var(--surface3)", border:"0.5px solid var(--border2)", borderRadius:4, color:"var(--text)", padding:"2px 4px", outline:"none" }} />
              : <span onClick={() => setEditing(true)} title="Click to edit"
                  style={{ fontFamily:"var(--font-mono)", fontSize:12, color:"var(--text3)", cursor:"pointer", borderBottom:"1px dashed var(--border2)" }}>{target}</span>
            }
          </div>
        </div>
        <div style={{ height:4, background:"var(--surface3)", borderRadius:3, overflow:"hidden" }}>
          <div style={{ height:"100%", background:done?"#3B6D11":color, borderRadius:3, width:pct+"%", transition:"width 1s ease" }} />
        </div>
      </div>
    </div>
  )
}

export default function GoalTracker({ data }) {
  const { solved, calendar } = data
  const username = data.username

  const [period,  setPeriod]  = useState("weekly")
  const [goals,   setGoals]   = useState(DEFAULT_GOALS)
  const [synced,  setSynced]  = useState(false)

  // Load goals from backend on mount — same across all devices
  useEffect(() => {
    fetchGoals(username).then(g => {
      if (g) {
        setGoals(g)
        setSynced(true)
      } else {
        // Fallback to localStorage
        try {
          const saved = JSON.parse(localStorage.getItem(`dsa_goals_${username}`) || "null")
          if (saved) setGoals(saved)
        } catch {}
      }
    })
  }, [username])

  const updateGoal = (key, val) => {
    const updated = { ...goals, [period]:{ ...goals[period], [key]:val } }
    setGoals(updated)
    saveGoals(username, updated)
  }

  const submissions   = calendar?.submissions || {}
  const weekStart     = useMemo(() => getWeekStart(),  [])
  const monthStart    = useMemo(() => getMonthStart(), [])
  const solvedThisWeek  = useMemo(() => countFromCalendar(submissions, weekStart),  [submissions, weekStart])
  const solvedThisMonth = useMemo(() => countFromCalendar(submissions, monthStart), [submissions, monthStart])

  const weekLabel = useMemo(() => {
    const start = new Date(weekStart * 1000)
    const end   = new Date(weekStart * 1000 + 6 * 86400000)
    return start.toLocaleDateString("en-US", { month:"short", day:"numeric" }) + " – " +
           end.toLocaleDateString("en-US",   { month:"short", day:"numeric" })
  }, [weekStart])

  const monthLabel = useMemo(() => new Date().toLocaleDateString("en-US", { month:"long", year:"numeric" }), [])

  const daysLeftInWeek  = useMemo(() => { const d = new Date().getDay(); return d===0?0:7-d }, [])
  const daysLeftInMonth = useMemo(() => { const n=new Date(); return new Date(n.getFullYear(),n.getMonth()+1,0).getDate()-n.getDate() }, [])

  const periodSolved = period==="weekly" ? solvedThisWeek : solvedThisMonth
  const daysLeft     = period==="weekly" ? daysLeftInWeek : daysLeftInMonth
  const periodLabel  = period==="weekly" ? weekLabel      : monthLabel

  const total       = solved.total || 1
  const periodEasy   = Math.round(periodSolved * (solved.easy   / total))
  const periodMedium = Math.round(periodSolved * (solved.medium / total))
  const periodHard   = Math.round(periodSolved * (solved.hard   / total))

  const autoTotalTarget = goals[period].easy + goals[period].medium + goals[period].hard

  const rows = [
    { label:"Total solved",    current:periodSolved,  target:autoTotalTarget, color:"#185FA5", key:"solved",  isAuto:true  },
    { label:"Easy problems",   current:periodEasy,    target:goals[period].easy,   color:"#3B6D11", key:"easy",   isAuto:false },
    { label:"Medium problems", current:periodMedium,  target:goals[period].medium, color:"#BA7517", key:"medium", isAuto:false },
    { label:"Hard problems",   current:periodHard,    target:goals[period].hard,   color:"#A32D2D", key:"hard",   isAuto:false },
  ]

  const overallPct = Math.round(rows.reduce((s,r) => s + Math.min(100,(r.current/Math.max(1,r.target))*100), 0) / rows.length)

  return (
    <div className="card" style={{ padding:"18px 16px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, gap:8, flexWrap:"wrap" }}>
        <div style={{ minWidth:0 }}>
          <div className="card-title">Goal tracker</div>
          <div className="card-subtitle" style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ color:"var(--accent)", fontFamily:"var(--font-mono)" }}>{username}</span>
            {synced && <span style={{ fontSize:9, color:"#3B6D11", padding:"1px 5px", borderRadius:4, background:"rgba(59,109,17,0.1)" }}>? synced</span>}
          </div>
        </div>
        <div style={{ display:"flex", gap:4, flexShrink:0 }}>
          {["weekly","monthly"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              fontSize:11, padding:"4px 10px", borderRadius:6, cursor:"pointer", textTransform:"capitalize",
              border:"0.5px solid "+(period===p?"var(--border2)":"var(--border)"),
              background:period===p?"var(--surface2)":"transparent",
              color:period===p?"var(--text)":"var(--text3)",
              fontFamily:"var(--font-main)", transition:"all 0.15s"
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:12 }}>
        <div style={{ background:"var(--surface2)", borderRadius:8, padding:"8px 10px" }}>
          <div style={{ fontSize:9, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:3 }}>Overall</div>
          <div style={{ fontSize:18, fontWeight:600, fontFamily:"var(--font-mono)", color:overallPct>=100?"#3B6D11":"#185FA5" }}>{overallPct}%</div>
        </div>
        <div style={{ background:"var(--surface2)", borderRadius:8, padding:"8px 10px" }}>
          <div style={{ fontSize:9, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:3 }}>{period==="weekly"?"This week":"This month"}</div>
          <div style={{ fontSize:18, fontWeight:600, fontFamily:"var(--font-mono)", color:"#3B6D11" }}>
            {periodSolved} <span style={{ fontSize:10, color:"var(--text3)" }}>/ {autoTotalTarget}</span>
          </div>
        </div>
        <div style={{ background:"var(--surface2)", borderRadius:8, padding:"8px 10px" }}>
          <div style={{ fontSize:9, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:3 }}>Days left</div>
          <div style={{ fontSize:18, fontWeight:600, fontFamily:"var(--font-mono)", color:daysLeft<=2?"#A32D2D":"#BA7517" }}>{daysLeft}d</div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding:"6px 10px", background:"rgba(24,95,165,0.06)", border:"0.5px solid rgba(24,95,165,0.15)", borderRadius:6, fontSize:10, color:"var(--text3)", marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
        <i className="fa-solid fa-calculator" style={{ color:"#185FA5", flexShrink:0 }} />
        Total = Easy + Medium + Hard · Resets every {period==="weekly"?"Monday":"1st of month"} · Synced across devices
      </div>

      {/* Goal rows */}
      {rows.map(r => (
        r.isAuto
          ? <div key={r.key} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"0.5px solid var(--border)" }}>
              <GoalRing pct={Math.min(100,Math.round((r.current/Math.max(1,r.target))*100))} color="#185FA5" />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <span style={{ fontSize:12, fontWeight:500, color:"var(--text)" }}>{r.label}</span>
                  <span style={{ fontFamily:"var(--font-mono)", fontSize:12, color:"var(--accent)", fontWeight:600 }}>{r.current} / {r.target}</span>
                </div>
                <div style={{ height:4, background:"var(--surface3)", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", background:"#185FA5", borderRadius:3, width:Math.min(100,Math.round((r.current/Math.max(1,r.target))*100))+"%", transition:"width 1s ease" }} />
                </div>
              </div>
            </div>
          : <GoalRow key={r.key} label={r.label} current={r.current} target={r.target} color={r.color} onEdit={updateGoal} editKey={r.key} />
      ))}

      {/* Footer messages */}
      {overallPct>=100 && <div style={{ marginTop:10, padding:"8px 12px", background:"rgba(59,109,17,0.1)", border:"0.5px solid rgba(59,109,17,0.3)", borderRadius:8, fontSize:12, color:"#3B6D11", textAlign:"center", fontWeight:600 }}>?? All goals done for this {period==="weekly"?"week":"month"}!</div>}
      {overallPct<100 && daysLeft<=2 && daysLeft>0 && <div style={{ marginTop:10, padding:"8px 12px", background:"rgba(163,45,45,0.08)", border:"0.5px solid rgba(163,45,45,0.2)", borderRadius:8, fontSize:12, color:"#A32D2D", textAlign:"center" }}>? Only {daysLeft} day{daysLeft>1?"s":""} left — push hard!</div>}
      {overallPct>=50 && overallPct<100 && daysLeft>2 && <div style={{ marginTop:10, padding:"8px 12px", background:"rgba(24,95,165,0.06)", border:"0.5px solid rgba(24,95,165,0.15)", borderRadius:8, fontSize:12, color:"#185FA5", textAlign:"center" }}>?? Halfway there — keep going!</div>}
    </div>
  )
}

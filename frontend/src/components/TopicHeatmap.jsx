import React, { useMemo, useState } from "react"

const KNOWN_TOTALS = {
  "array":1600,"dynamic-programming":590,"string":590,"math":560,"tree":360,
  "depth-first-search":420,"greedy":410,"binary-search":280,"breadth-first-search":270,
  "graph":290,"sorting":370,"hash-table":590,"two-pointers":230,"bit-manipulation":170,
  "stack":290,"heap-priority-queue":240,"backtracking":210,"sliding-window":200,
  "linked-list":175,"trie":90,"matrix":210,"simulation":330,"design":230,
  "recursion":100,"divide-and-conquer":100,"union-find":80,"monotonic-stack":110,
}

// Approximate % of hard problems per topic (out of total for that topic)
// Used to reward users who solved more of the harder problems
const HARD_PCT = {
  "dynamic-programming":0.36,"graph":0.34,"backtracking":0.30,"heap-priority-queue":0.27,
  "binary-search":0.24,"trie":0.27,"bit-manipulation":0.20,"sliding-window":0.22,
  "monotonic-stack":0.24,"union-find":0.24,"divide-and-conquer":0.22,"design":0.28,
  "tree":0.22,"depth-first-search":0.24,"breadth-first-search":0.22,"stack":0.20,
  "two-pointers":0.18,"linked-list":0.18,"array":0.20,"string":0.18,
  "math":0.18,"hash-table":0.16,"sorting":0.15,"greedy":0.20,
  "matrix":0.20,"simulation":0.15,"recursion":0.18,
}

function computeScore(tag) {
  const total    = KNOWN_TOTALS[tag.tagSlug] || Math.round(tag.problemsSolved * 2.5)
  const solved   = tag.problemsSolved || 0

  // Factor 1: Coverage — how many problems solved out of known total (50%)
  const coverage = Math.min(100, Math.round((solved / total) * 100))

  // Factor 2: Depth — penalise topics where user solved only Easy problems
  // We estimate depth from: if coverage is high but they have few total solved, likely stuck at Easy
  // We reward based on coverage exceeding "easy-only" threshold (~30% of a topic is easy)
  const easyThresh    = Math.round(total * 0.30)
  const mediumThresh  = Math.round(total * 0.30 + total * 0.45)
  let depthScore
  if (solved <= easyThresh) {
    depthScore = Math.round((solved / Math.max(1, easyThresh)) * 40)
  } else if (solved <= mediumThresh) {
    depthScore = 40 + Math.round(((solved - easyThresh) / Math.max(1, mediumThresh - easyThresh)) * 40)
  } else {
    depthScore = 80 + Math.round(((solved - mediumThresh) / Math.max(1, total - mediumThresh)) * 20)
  }
  depthScore = Math.min(100, depthScore)

  // Factor 3: Difficulty weight — topics that are inherently harder give more credit
  // Solving 20% of DP is harder than 20% of Array, so we reward accordingly
  const hardPct      = HARD_PCT[tag.tagSlug] || 0.20
  const difficultyBonus = Math.round(hardPct * 100) // e.g. DP=36, Array=20

  // Weighted final score
  const score = Math.round(coverage * 0.50 + depthScore * 0.35 + difficultyBonus * 0.15)

  return { score: Math.min(99, score), coverage, depthScore, difficultyBonus, total }
}

function getMastery(score) {
  if (score >= 80) return { label:"Expert",     color:"#3B6D11" }
  if (score >= 55) return { label:"Proficient", color:"#185FA5" }
  if (score >= 35) return { label:"Learning",   color:"#BA7517" }
  return               { label:"Weak",          color:"#A32D2D" }
}

function ScoreBar({ label, value, color, note }) {
  return (
    <div style={{ marginBottom:"var(--sp-2)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"var(--fs-xs)", color:"var(--text3)", marginBottom:3 }}>
        <span>{label}</span>
        <span style={{ color:"var(--text2)", fontFamily:"var(--font-mono)" }}>{value}% {note && <span style={{ color:"var(--text3)", fontSize:9 }}>({note})</span>}</span>
      </div>
      <div className="bar-track" style={{ height:4 }}>
        <div className="bar-fill" style={{ background:color, width:value+"%" }} />
      </div>
    </div>
  )
}

function TopicCell({ tag }) {
  const [hovered, setHovered] = useState(false)
  const { score, coverage, depthScore, difficultyBonus, total } = computeScore(tag)
  const m = getMastery(score)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--surface3)" : "var(--surface2)",
        borderRadius: 8,
        padding: "var(--sp-3) var(--sp-4)",
        borderLeft: "3px solid " + m.color,
        border: hovered ? "0.5px solid var(--border2)" : "0.5px solid var(--border)",
        borderLeftWidth: 3,
        borderLeftColor: m.color,
        transition: "all 0.18s",
        transform: hovered ? "translateY(-2px)" : "none",
        cursor: "default",
      }}>

      <div style={{ fontSize:"var(--fs-xs)", color:"var(--text3)", marginBottom:4, lineHeight:"var(--lh-tight)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
        {tag.tagName}
      </div>

      <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:6 }}>
        <div className="stat-value" style={{ fontSize:"var(--fs-2xl)", color:m.color }}>{score}</div>
        <div style={{ fontSize:"var(--fs-xs)", color:"var(--text3)" }}>/ 100</div>
      </div>

      <div style={{ fontSize:"var(--fs-xs)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.4px", color:m.color, marginBottom:"var(--sp-2)" }}>
        {m.label}
      </div>

      {hovered ? (
        <div style={{ borderTop:"0.5px solid var(--border)", paddingTop:"var(--sp-2)", marginTop:4 }}>
          <ScoreBar label="Coverage (50%)"         value={coverage}         color="#185FA5" note={tag.problemsSolved+"/"+total} />
          <ScoreBar label="Depth (35%)"            value={depthScore}       color="#BA7517" />
          <ScoreBar label="Topic difficulty (15%)" value={difficultyBonus}  color="#7F77DD" note={(HARD_PCT[tag.tagSlug]||0.20)*100+"%h"} />
          <div style={{ marginTop:6, fontSize:"var(--fs-xs)", color:"var(--text3)", lineHeight:1.5 }}>
            {tag.problemsSolved} solved · target 70%+ coverage = {Math.round(total*0.7)} problems
          </div>
        </div>
      ) : (
        <div className="bar-track" style={{ height:4 }}>
          <div className="bar-fill" style={{ background:m.color, width:score+"%" }} />
        </div>
      )}
    </div>
  )
}

export default function TopicHeatmap({ topics, solved }) {
  const [filter, setFilter] = useState("all")

  const allTags = useMemo(() => [
    ...(topics?.fundamental   || []),
    ...(topics?.intermediate  || []),
    ...(topics?.advanced      || []),
  ].filter(t => t.problemsSolved > 0)
   .map(t => ({ ...t, _score: computeScore(t).score }))
   .sort((a, b) => b._score - a._score), [topics])

  const filtered = useMemo(() => {
    if (filter === "top10")  return allTags.slice(0, 10)
    if (filter === "expert") return allTags.filter(t => t._score >= 80)
    if (filter === "weak")   return allTags.filter(t => t._score < 35)
    return allTags
  }, [allTags, filter])

  const counts = useMemo(() => ({
    expert:     allTags.filter(t => t._score >= 80).length,
    proficient: allTags.filter(t => t._score >= 55 && t._score < 80).length,
    learning:   allTags.filter(t => t._score >= 35 && t._score < 55).length,
    weak:       allTags.filter(t => t._score < 35).length,
  }), [allTags])

  if (!allTags.length) return (
    <div className="card" style={{ marginBottom:"var(--sp-6)", color:"var(--text3)", textAlign:"center", fontSize:"var(--fs-base)" }}>
      No topic data available for this user.
    </div>
  )

  return (
    <div className="card" style={{ marginBottom:"var(--sp-6)" }}>
      <div className="card-header">
        <div>
          <div className="card-title">Topic mastery heatmap</div>
          <div className="card-subtitle">
            Coverage 50% · Depth 35% · Topic difficulty 15% · hover any card for breakdown
          </div>
        </div>
        <div style={{ display:"flex", gap:"var(--sp-1)" }}>
          {["all","top10","expert","weak"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              fontSize:"var(--fs-xs)", padding:"4px var(--sp-3)", borderRadius:6, cursor:"pointer",
              border:"0.5px solid "+(filter===f ? "var(--border2)" : "var(--border)"),
              background:filter===f ? "var(--surface2)" : "transparent",
              color:filter===f ? "var(--text)" : "var(--text3)",
              fontFamily:"var(--font-main)", transition:"all 0.15s", textTransform:"capitalize"
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Summary counts */}
      <div className="grid-4" style={{ marginBottom:"var(--sp-4)" }}>
        {[
          { label:"Expert",     count:counts.expert,     color:"#3B6D11", filter:"expert"     },
          { label:"Proficient", count:counts.proficient, color:"#185FA5", filter:"proficient" },
          { label:"Learning",   count:counts.learning,   color:"#BA7517", filter:"learning"   },
          { label:"Weak",       count:counts.weak,       color:"#A32D2D", filter:"weak"       },
        ].map(({ label, count, color, filter:f }) => (
          <div key={label} onClick={() => setFilter(f === filter ? "all" : f)}
            style={{ background:"var(--surface2)", borderRadius:8, padding:"var(--sp-3) var(--sp-4)", cursor:"pointer", borderLeft:"3px solid "+color, transition:"all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background="var(--surface3)"}
            onMouseLeave={e => e.currentTarget.style.background="var(--surface2)"}>
            <div className="stat-value" style={{ fontSize:"var(--fs-xl)", color }}>{count}</div>
            <div className="stat-label" style={{ marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:"var(--sp-4)", marginBottom:"var(--sp-4)", flexWrap:"wrap", alignItems:"center" }}>
        {[["Expert","#3B6D11","≥ 80"],["Proficient","#185FA5","55–79"],["Learning","#BA7517","35–54"],["Weak","#A32D2D","< 35"]].map(([l,c,r]) => (
          <span key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:"var(--fs-sm)", color:"var(--text2)" }}>
            <span style={{ width:10, height:10, borderRadius:2, background:c }} />{l} <span style={{ color:"var(--text3)" }}>({r})</span>
          </span>
        ))}
        <span style={{ fontSize:"var(--fs-xs)", color:"var(--text3)", marginLeft:"auto" }}>Hover a card for score breakdown</span>
      </div>

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))", gap:"var(--sp-2)" }}>
        {filtered.map(tag => <TopicCell key={tag.tagSlug} tag={tag} />)}
      </div>

      {/* Scoring explanation */}
      <div style={{ marginTop:"var(--sp-5)", paddingTop:"var(--sp-4)", borderTop:"0.5px solid var(--border)", display:"flex", flexDirection:"column", gap:6 }}>
        <div style={{ fontSize:"var(--fs-sm)", fontWeight:500, color:"var(--text2)" }}>How scoring works</div>
        <div style={{ display:"flex", gap:"var(--sp-8)", flexWrap:"wrap" }}>
          {[
            { label:"Coverage (50%)",         color:"#185FA5", desc:"Problems solved vs total available in that topic" },
            { label:"Depth (35%)",            color:"#BA7517", desc:"Rewards solving Medium/Hard — not just Easy problems" },
            { label:"Topic difficulty (15%)", color:"#7F77DD", desc:"Harder topics (DP, Graph) get extra credit than easy ones (Array)" },
          ].map(({ label, color, desc }) => (
            <div key={label} style={{ display:"flex", gap:"var(--sp-2)", alignItems:"flex-start" }}>
              <div style={{ width:10, height:10, borderRadius:2, background:color, flexShrink:0, marginTop:3 }} />
              <div>
                <div style={{ fontSize:"var(--fs-sm)", fontWeight:500, color:"var(--text2)" }}>{label}</div>
                <div style={{ fontSize:"var(--fs-xs)", color:"var(--text3)" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
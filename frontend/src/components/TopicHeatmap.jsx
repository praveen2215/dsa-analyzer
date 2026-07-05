import React, { useMemo, useState } from "react"

// Realistic interview targets for a student with 100-200 total problems
// Based on what top placement candidates actually need per topic
const TARGET_TOTALS = {
  "array":               50,  // core topic — 50 covers all patterns
  "dynamic-programming": 40,  // important — 40 covers all DP types
  "string":              40,  // 40 covers all string patterns
  "math":                20,  // secondary topic
  "tree":                35,  // 35 covers all tree patterns
  "depth-first-search":  30,  // overlaps with tree/graph
  "greedy":              25,
  "binary-search":       25,  // 25 covers all binary search patterns
  "breadth-first-search":25,
  "graph":               30,  // 30 covers all graph patterns
  "sorting":             20,
  "hash-table":          35,
  "two-pointers":        25,
  "bit-manipulation":    15,  // niche
  "stack":               25,
  "heap-priority-queue": 20,
  "backtracking":        20,
  "sliding-window":      20,
  "linked-list":         20,
  "trie":                12,  // small topic
  "matrix":              20,
  "simulation":          15,
  "design":              15,
  "recursion":           15,
  "divide-and-conquer":  12,
  "union-find":          12,
  "monotonic-stack":     12,
  "prefix-sum":          15,
  "segment-tree":         8,
  "binary-indexed-tree":  8,
  "topological-sort":    10,
  "binary-tree":         30,
  "binary-search-tree":  15,
}

const HARD_PCT = {
  "dynamic-programming":0.36,"graph":0.34,"backtracking":0.30,"heap-priority-queue":0.27,
  "binary-search":0.24,"trie":0.27,"bit-manipulation":0.20,"sliding-window":0.22,
  "monotonic-stack":0.24,"union-find":0.24,"divide-and-conquer":0.22,"design":0.28,
  "tree":0.22,"depth-first-search":0.24,"breadth-first-search":0.22,"stack":0.20,
  "two-pointers":0.18,"linked-list":0.18,"array":0.20,"string":0.18,
  "math":0.18,"hash-table":0.16,"sorting":0.15,"greedy":0.20,
  "matrix":0.20,"simulation":0.15,"recursion":0.18,"prefix-sum":0.15,
  "binary-tree":0.22,"binary-search-tree":0.20,"topological-sort":0.25,
}

function computeScore(tag) {
  const target  = TARGET_TOTALS[tag.tagSlug] || Math.max(10, Math.min(30, Math.round(tag.problemsSolved * 1.3)))
  const solved  = tag.problemsSolved || 0

  // Factor 1: Coverage — solved vs target (50%)
  const coverage = Math.min(100, Math.round((solved / target) * 100))

  // Factor 2: Depth — rewards solving beyond easy-only (35%)
  const easyThresh   = Math.round(target * 0.30)
  const mediumThresh = Math.round(target * 0.75)
  let depthScore
  if (solved <= easyThresh) {
    depthScore = Math.round((solved / Math.max(1, easyThresh)) * 40)
  } else if (solved <= mediumThresh) {
    depthScore = 40 + Math.round(((solved - easyThresh) / Math.max(1, mediumThresh - easyThresh)) * 40)
  } else {
    depthScore = 80 + Math.round(((solved - mediumThresh) / Math.max(1, target - mediumThresh)) * 20)
  }
  depthScore = Math.min(100, depthScore)

  // Factor 3: Topic difficulty bonus (15%)
  const hardPct         = HARD_PCT[tag.tagSlug] || 0.20
  const difficultyBonus = Math.round(hardPct * 100)

  const score = Math.round(coverage * 0.50 + depthScore * 0.35 + difficultyBonus * 0.15)
  return { score: Math.min(99, score), coverage, depthScore, difficultyBonus, target }
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
        <span style={{ color:"var(--text2)", fontFamily:"var(--font-mono)" }}>
          {value}% {note && <span style={{ color:"var(--text3)", fontSize:9 }}>({note})</span>}
        </span>
      </div>
      <div className="bar-track" style={{ height:4 }}>
        <div className="bar-fill" style={{ background:color, width:value+"%" }} />
      </div>
    </div>
  )
}

function TopicCell({ tag }) {
  const [hovered, setHovered] = useState(false)
  const { score, coverage, depthScore, difficultyBonus, target } = computeScore(tag)
  const m     = getMastery(score)
  const maxed = tag.problemsSolved >= target

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:      hovered ? "var(--surface3)" : "var(--surface2)",
        borderRadius:    8,
        padding:         "var(--sp-3) var(--sp-4)",
        border:          hovered ? "0.5px solid var(--border2)" : "0.5px solid var(--border)",
        borderLeftWidth: 3,
        borderLeftColor: m.color,
        transition:      "all 0.18s",
        transform:       hovered ? "translateY(-2px)" : "none",
        cursor:          "default",
      }}>

      <div style={{ fontSize:"var(--fs-xs)", color:"var(--text3)", marginBottom:4, lineHeight:"var(--lh-tight)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
        {tag.tagName}
      </div>

      <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:6 }}>
        <div className="stat-value" style={{ fontSize:"var(--fs-2xl)", color:m.color }}>{score}</div>
        <div style={{ fontSize:"var(--fs-xs)", color:"var(--text3)" }}>/ 100</div>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"var(--sp-2)" }}>
        <div style={{ fontSize:"var(--fs-xs)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.4px", color:m.color }}>
          {m.label}
        </div>
        {maxed && <span style={{ fontSize:9, color:"#3B6D11", fontWeight:600 }}>✓ DONE</span>}
      </div>

      {hovered ? (
        <div style={{ borderTop:"0.5px solid var(--border)", paddingTop:"var(--sp-2)", marginTop:4 }}>
          <ScoreBar label="Coverage (50%)"         value={coverage}        color="#185FA5" note={tag.problemsSolved+"/"+target} />
          <ScoreBar label="Depth (35%)"            value={depthScore}      color="#BA7517" />
          <ScoreBar label="Topic difficulty (15%)" value={difficultyBonus} color="#7F77DD" />
          <div style={{ marginTop:6, fontSize:"var(--fs-xs)", color:"var(--text3)", lineHeight:1.5 }}>
            Solved {tag.problemsSolved} · target {target} · need {Math.max(0, target - tag.problemsSolved)} more
            {maxed && <span style={{ color:"#3B6D11", marginLeft:4 }}>✓ Target reached!</span>}
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
            Targets calibrated for placement-ready candidates · hover any card for details
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

      {/* Summary */}
      <div className="grid-4" style={{ marginBottom:"var(--sp-4)" }}>
        {[
          { label:"Expert",     count:counts.expert,     color:"#3B6D11", f:"expert"     },
          { label:"Proficient", count:counts.proficient, color:"#185FA5", f:"proficient" },
          { label:"Learning",   count:counts.learning,   color:"#BA7517", f:"learning"   },
          { label:"Weak",       count:counts.weak,       color:"#A32D2D", f:"weak"       },
        ].map(({ label, count, color, f }) => (
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

      {/* Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))", gap:"var(--sp-2)" }}>
        {filtered.map(tag => <TopicCell key={tag.tagSlug} tag={tag} />)}
      </div>

      {/* Target reference */}
      <div style={{ marginTop:"var(--sp-5)", paddingTop:"var(--sp-4)", borderTop:"0.5px solid var(--border)" }}>
        <div style={{ fontSize:"var(--fs-sm)", fontWeight:500, color:"var(--text2)", marginBottom:8 }}>
          Placement-ready targets (problems needed per topic)
        </div>
        <div style={{ display:"flex", gap:"var(--sp-3)", flexWrap:"wrap" }}>
          {[
            { label:"Array",       target:50,  color:"#185FA5" },
            { label:"DP",          target:40,  color:"#185FA5" },
            { label:"Tree",        target:35,  color:"#185FA5" },
            { label:"Hash Table",  target:35,  color:"#185FA5" },
            { label:"String",      target:40,  color:"#185FA5" },
            { label:"Graph",       target:30,  color:"#BA7517" },
            { label:"Stack",       target:25,  color:"#BA7517" },
            { label:"Backtrack",   target:20,  color:"#BA7517" },
            { label:"Heap",        target:20,  color:"#BA7517" },
            { label:"Trie",        target:12,  color:"#A32D2D" },
          ].map(({ label, target, color }) => (
            <div key={label} style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", background:"var(--surface2)", borderRadius:6, border:"0.5px solid var(--border)" }}>
              <span style={{ fontSize:"var(--fs-xs)", color:"var(--text2)" }}>{label}</span>
              <span style={{ fontSize:"var(--fs-xs)", fontFamily:"var(--font-mono)", fontWeight:600, color }}>{target}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
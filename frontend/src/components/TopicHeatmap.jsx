import React, { useMemo, useState } from "react"

// Realistic TARGET (not total available) — capped based on what a strong candidate needs
// Topics with 1000s of problems are capped at what actually matters for interviews
const TARGET_TOTALS = {
  "array":              150,  // 1600 exist but 200 covers all patterns
  "dynamic-programming": 50, // 590 exist but 100 covers all DP patterns thoroughly
  "string":             80,  // 590 exist but 120 covers all string patterns
  "math":                50,  // 560 exist but math is secondary
  "tree":               50,  // 360 exist but 100 covers all tree patterns
  "depth-first-search": 40,  // 420 exist but 100 is enough
  "greedy":              60,  // 410 exist
  "binary-search":       40,  // 280 exist but 60 covers all binary search patterns
  "breadth-first-search": 40, // 270 exist but 60 covers all BFS patterns
  "graph":               40,  // 290 exist but 80 covers all graph patterns
  "sorting":             50,  // 370 exist but sorting is simpler
  "hash-table":         70,  // 590 exist but 100 covers all hash patterns
  "two-pointers":        50,  // 230 exist but 60 covers all two pointer patterns
  "bit-manipulation":    30,  // 170 exist but bit manip is specialized
  "stack":               40,  // 290 exist
  "heap-priority-queue": 30,  // 240 exist
  "backtracking":        40,  // 210 exist
  "sliding-window":      40,  // 200 exist
  "linked-list":         50,  // 175 exist
  "trie":                30,  // 90 exist — small topic
  "matrix":              50,  // 210 exist
  "simulation":          30,  // 330 exist but low interview weight
  "design":              30,  // 230 exist
  "recursion":           40,  // 100 exist
  "divide-and-conquer":  30,  // 100 exist
  "union-find":          20,  // 80 exist — niche
  "monotonic-stack":     30,  // 110 exist
  "prefix-sum":          40,  // 200 exist
  "segment-tree":        20,  // specialized
  "binary-indexed-tree": 20,  // specialized
  "topological-sort":    20,  // 80 exist
  "binary-tree":         60,  // important tree subtype
  "binary-search-tree":  40,  // specific BST problems
}

// % of Hard problems per topic — used for depth scoring
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
  const target   = TARGET_TOTALS[tag.tagSlug] || Math.min(100, Math.round(tag.problemsSolved * 2))
  const solved   = tag.problemsSolved || 0

  // Factor 1: Coverage — solved vs realistic target (50%)
  // Once you hit the target, you are at 100% — solving more is fine but not required
  const coverage = Math.min(100, Math.round((solved / target) * 100))

  // Factor 2: Depth — rewards solving beyond easy-only problems
  // Easy = ~30% of target, Medium = ~45%, Hard = ~25%
  const easyThresh   = Math.round(target * 0.30)
  const mediumThresh = Math.round(target * 0.30 + target * 0.45)
  let depthScore
  if (solved <= easyThresh) {
    depthScore = Math.round((solved / Math.max(1, easyThresh)) * 40)
  } else if (solved <= mediumThresh) {
    depthScore = 40 + Math.round(((solved - easyThresh) / Math.max(1, mediumThresh - easyThresh)) * 40)
  } else {
    depthScore = 80 + Math.round(((solved - mediumThresh) / Math.max(1, target - mediumThresh)) * 20)
  }
  depthScore = Math.min(100, depthScore)

  // Factor 3: Topic difficulty bonus — harder topics get extra credit
  const hardPct         = HARD_PCT[tag.tagSlug] || 0.20
  const difficultyBonus = Math.round(hardPct * 100)

  // Weighted final
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
  const { score, coverage, depthScore, difficultyBonus, target } = computeScore(tag)
  const m = getMastery(score)
  const maxed = tag.problemsSolved >= target

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

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"var(--sp-2)" }}>
        <div style={{ fontSize:"var(--fs-xs)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.4px", color:m.color }}>
          {m.label}
        </div>
        {maxed && <span style={{ fontSize:9, color:"#3B6D11", fontWeight:600 }}>✓ TARGET MET</span>}
      </div>

      {hovered ? (
        <div style={{ borderTop:"0.5px solid var(--border)", paddingTop:"var(--sp-2)", marginTop:4 }}>
          <ScoreBar label="Coverage (50%)"         value={coverage}        color="#185FA5" note={tag.problemsSolved+"/"+target+" target"} />
          <ScoreBar label="Depth (35%)"            value={depthScore}      color="#BA7517" />
          <ScoreBar label="Topic difficulty (15%)" value={difficultyBonus} color="#7F77DD" />
          <div style={{ marginTop:6, fontSize:"var(--fs-xs)", color:"var(--text3)", lineHeight:1.5 }}>
            Solved: {tag.problemsSolved} · Interview target: {target} problems
            {maxed && <span style={{ color:"#3B6D11", marginLeft:4 }}>✓ Reached!</span>}
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
            Targets based on interview importance · Coverage 50% · Depth 35% · Topic difficulty 15%
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

      <div className="grid-4" style={{ marginBottom:"var(--sp-4)" }}>
        {[
          { label:"Expert",     count:counts.expert,     color:"#3B6D11", f:"expert" },
          { label:"Proficient", count:counts.proficient, color:"#185FA5", f:"proficient" },
          { label:"Learning",   count:counts.learning,   color:"#BA7517", f:"learning" },
          { label:"Weak",       count:counts.weak,       color:"#A32D2D", f:"weak" },
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

      <div style={{ display:"flex", gap:"var(--sp-4)", marginBottom:"var(--sp-4)", flexWrap:"wrap", alignItems:"center" }}>
        {[["Expert","#3B6D11","≥ 80"],["Proficient","#185FA5","55–79"],["Learning","#BA7517","35–54"],["Weak","#A32D2D","< 35"]].map(([l,c,r]) => (
          <span key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:"var(--fs-sm)", color:"var(--text2)" }}>
            <span style={{ width:10, height:10, borderRadius:2, background:c }} />{l} <span style={{ color:"var(--text3)" }}>({r})</span>
          </span>
        ))}
        <span style={{ fontSize:"var(--fs-xs)", color:"var(--text3)", marginLeft:"auto" }}>Hover a card to see breakdown and target</span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))", gap:"var(--sp-2)" }}>
        {filtered.map(tag => <TopicCell key={tag.tagSlug} tag={tag} />)}
      </div>

      <div style={{ marginTop:"var(--sp-5)", paddingTop:"var(--sp-4)", borderTop:"0.5px solid var(--border)", display:"flex", flexDirection:"column", gap:6 }}>
        <div style={{ fontSize:"var(--fs-sm)", fontWeight:500, color:"var(--text2)" }}>Interview targets (realistic, not all-time total)</div>
        <div style={{ display:"flex", gap:"var(--sp-6)", flexWrap:"wrap" }}>
          {[
            { label:"Array",    target:200, note:"most important topic"    },
            { label:"DP",       target:100, note:"covers all patterns"     },
            { label:"Tree",     target:100, note:"covers all tree types"   },
            { label:"Graph",    target:80,  note:"covers all traversals"   },
            { label:"String",   target:120, note:"covers all patterns"     },
            { label:"Trie",     target:30,  note:"small but valuable"      },
          ].map(({ label, target, note }) => (
            <div key={label} style={{ fontSize:"var(--fs-xs)", color:"var(--text3)" }}>
              <span style={{ color:"var(--text2)", fontWeight:500 }}>{label}</span> → {target} <span style={{ opacity:0.6 }}>({note})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
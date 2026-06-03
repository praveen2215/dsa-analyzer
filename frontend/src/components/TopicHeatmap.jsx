import React, { useMemo, useState } from "react"

const KNOWN_TOTALS = {
  "array":1600,"dynamic-programming":590,"string":590,"math":560,"tree":360,
  "depth-first-search":420,"greedy":410,"binary-search":280,"breadth-first-search":270,
  "graph":290,"sorting":370,"hash-table":590,"two-pointers":230,"bit-manipulation":170,
  "stack":290,"heap-priority-queue":240,"backtracking":210,"sliding-window":200,
  "linked-list":175,"trie":90,"matrix":210,"simulation":330,"design":230,
  "recursion":100,"divide-and-conquer":100,"union-find":80,"monotonic-stack":110
}

const HARD_RATIO_BY_TOPIC = {
  "dynamic-programming":0.38,"graph":0.35,"backtracking":0.30,"heap-priority-queue":0.28,
  "binary-search":0.25,"tree":0.22,"depth-first-search":0.25,"trie":0.28,
  "bit-manipulation":0.20,"sliding-window":0.22,"two-pointers":0.18,"stack":0.20,
  "array":0.20,"string":0.18,"math":0.18,"hash-table":0.16,"sorting":0.15,
  "linked-list":0.18,"greedy":0.20,"breadth-first-search":0.22,"matrix":0.20,
  "union-find":0.25,"monotonic-stack":0.25,"divide-and-conquer":0.22,"design":0.28
}

function computeScore(tag, beatsData) {
  const total       = KNOWN_TOTALS[tag.tagSlug] || Math.round(tag.problemsSolved * 1.6)
  const solvedPct   = Math.min(100, (tag.problemsSolved / total) * 100)

  const knownHardRatio = HARD_RATIO_BY_TOPIC[tag.tagSlug] || 0.22
  const hardInTopic    = Math.round(tag.problemsSolved * knownHardRatio)
  const hardScore      = Math.min(100, (hardInTopic / Math.max(1, tag.problemsSolved)) * 100 * (1 / knownHardRatio))

  const beats     = beatsData?.[tag.tagSlug] || beatsData?.overall || 50
  const beatsScore = beats

  const weighted = (solvedPct * 0.40) + (hardScore * 0.35) + (beatsScore * 0.25)
  return {
    score:      Math.round(weighted),
    solvedPct:  Math.round(solvedPct),
    hardScore:  Math.round(hardScore),
    beatsScore: Math.round(beatsScore),
    total,
  }
}

function getMastery(score) {
  if (score >= 80) return { label: "Expert",     color: "#3B6D11" }
  if (score >= 55) return { label: "Proficient", color: "#185FA5" }
  if (score >= 35) return { label: "Learning",   color: "#BA7517" }
  return               { label: "Weak",          color: "#A32D2D" }
}

function ScoreBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text3)", marginBottom: 3 }}>
        <span>{label}</span><span style={{ color: "var(--text2)", fontFamily: "var(--font-mono)" }}>{value}%</span>
      </div>
      <div style={{ height: 4, background: "var(--surface3)", borderRadius: 2 }}>
        <div style={{ height: "100%", background: color, borderRadius: 2, width: value + "%", transition: "width 0.8s ease" }} />
      </div>
    </div>
  )
}

function TopicCell({ tag, beatsData }) {
  const [hovered, setHovered] = useState(false)
  const { score, solvedPct, hardScore, beatsScore, total } = computeScore(tag, beatsData)
  const m = getMastery(score)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--surface3)" : "var(--surface2)",
        borderRadius: 8, padding: "12px 14px",
        transition: "all 0.18s",
        transform: hovered ? "translateY(-2px)" : "none",
        cursor: "default",
        border: hovered ? "0.5px solid var(--border2)" : "0.5px solid var(--border)",
        borderLeft: "3px solid " + m.color,
      }}
    >
      <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>{tag.tagName}</div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
        <div style={{ fontSize: 22, fontWeight: 500, fontFamily: "var(--font-mono)", color: m.color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 10, color: "var(--text3)" }}>/ 100</div>
      </div>

      <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px", color: m.color, marginBottom: 8 }}>{m.label}</div>

      {hovered ? (
        <div style={{ borderTop: "0.5px solid var(--border)", paddingTop: 8, marginTop: 4 }}>
          <ScoreBar label="Coverage (40%)" value={solvedPct}  color="#185FA5" />
          <ScoreBar label="Depth (35%)"    value={hardScore}  color="#BA7517" />
          <ScoreBar label="Beats (25%)"    value={beatsScore} color="#3B6D11" />
          <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 6 }}>
            {tag.problemsSolved} solved of ~{total}
          </div>
        </div>
      ) : (
        <div style={{ height: 4, background: "var(--surface3)", borderRadius: 2 }}>
          <div style={{ height: "100%", background: m.color, borderRadius: 2, width: score + "%" }} />
        </div>
      )}
    </div>
  )
}

export default function TopicHeatmap({ topics, solved }) {
  const [filter, setFilter] = useState("all")

  const beatsData = useMemo(() => ({
    overall:  solved?.beatsMedium || 50,
  }), [solved])

  const allTags = useMemo(() => [
    ...(topics?.fundamental   || []),
    ...(topics?.intermediate  || []),
    ...(topics?.advanced      || []),
  ].filter(t => t.problemsSolved > 0)
   .map(t => ({ ...t, _score: computeScore(t, beatsData).score }))
   .sort((a, b) => b._score - a._score), [topics, beatsData])

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
    <div className="card" style={{ padding: "22px 24px", marginBottom: 24, color: "var(--text3)", textAlign: "center", fontSize: 13 }}>
      No topic data available for this user.
    </div>
  )

  return (
    <div className="card" style={{ padding: "22px 24px", marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Topic mastery heatmap</div>
          <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 3 }}>
            Weighted score: 40% coverage · 35% depth · 25% beats · hover any card for breakdown
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["all","top10","expert","weak"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              fontSize: 11, padding: "4px 10px", borderRadius: 6, cursor: "pointer",
              border: "0.5px solid " + (filter === f ? "var(--border2)" : "var(--border)"),
              background: filter === f ? "var(--surface2)" : "transparent",
              color: filter === f ? "var(--text)" : "var(--text3)",
              fontFamily: "var(--font-main)", transition: "all 0.15s", textTransform: "capitalize"
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Expert",     count: counts.expert,     color: "#3B6D11" },
          { label: "Proficient", count: counts.proficient, color: "#185FA5" },
          { label: "Learning",   count: counts.learning,   color: "#BA7517" },
          { label: "Weak",       count: counts.weak,       color: "#A32D2D" },
        ].map(({ label, count, color }) => (
          <div key={label} onClick={() => setFilter(label.toLowerCase())}
            style={{ background: "var(--surface2)", borderRadius: 8, padding: "10px 14px", cursor: "pointer", borderLeft: "3px solid " + color, transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--surface3)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--surface2)"}>
            <div style={{ fontSize: 20, fontWeight: 500, fontFamily: "var(--font-mono)", color }}>{count}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
        {[["Expert","#3B6D11","≥ 80"],["Proficient","#185FA5","55–79"],["Learning","#BA7517","35–54"],["Weak","#A32D2D","< 35"]].map(([l,c,r]) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text2)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l} <span style={{ color: "var(--text3)" }}>({r})</span>
          </span>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(145px,1fr))", gap: 8 }}>
        {filtered.map(tag => <TopicCell key={tag.tagSlug} tag={tag} beatsData={beatsData} />)}
      </div>
    </div>
  )
}
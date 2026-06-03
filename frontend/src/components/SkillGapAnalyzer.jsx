import React, { useState, useMemo } from "react"

// What top companies actually focus on — based on real interview data
const COMPANY_REQUIREMENTS = {
  Google: {
    color: "#4285F4", logo: "G",
    topics: [
      { slug:"dynamic-programming", weight:22, label:"Dynamic Programming" },
      { slug:"graph",               weight:18, label:"Graphs"              },
      { slug:"array",               weight:15, label:"Arrays"              },
      { slug:"tree",                weight:12, label:"Trees"               },
      { slug:"string",              weight:10, label:"Strings"             },
      { slug:"backtracking",        weight:8,  label:"Backtracking"        },
      { slug:"binary-search",       weight:8,  label:"Binary Search"       },
      { slug:"heap-priority-queue", weight:7,  label:"Heaps"               },
    ],
    minRating:    1800,
    minSolved:    300,
    minHard:      80,
    desc:         "Focuses heavily on DP and graph problems. Expects clean code and optimal complexity.",
  },
  Meta: {
    color: "#0866FF", logo: "f",
    topics: [
      { slug:"array",               weight:20, label:"Arrays"              },
      { slug:"tree",                weight:18, label:"Trees"               },
      { slug:"graph",               weight:15, label:"Graphs"              },
      { slug:"dynamic-programming", weight:12, label:"Dynamic Programming" },
      { slug:"string",              weight:12, label:"Strings"             },
      { slug:"hash-table",          weight:10, label:"Hash Tables"         },
      { slug:"two-pointers",        weight:8,  label:"Two Pointers"        },
      { slug:"recursion",           weight:5,  label:"Recursion"           },
    ],
    minRating:    1700,
    minSolved:    250,
    minHard:      60,
    desc:         "Loves tree and array problems. Speed and communication matter a lot.",
  },
  Amazon: {
    color: "#FF9900", logo: "a",
    topics: [
      { slug:"array",               weight:20, label:"Arrays"              },
      { slug:"tree",                weight:15, label:"Trees"               },
      { slug:"dynamic-programming", weight:15, label:"Dynamic Programming" },
      { slug:"string",              weight:12, label:"Strings"             },
      { slug:"graph",               weight:12, label:"Graphs"              },
      { slug:"hash-table",          weight:10, label:"Hash Tables"         },
      { slug:"sorting",             weight:8,  label:"Sorting"             },
      { slug:"heap-priority-queue", weight:8,  label:"Heaps"               },
    ],
    minRating:    1500,
    minSolved:    200,
    minHard:      40,
    desc:         "Broad coverage expected. Leadership principles combined with solid DSA.",
  },
  Microsoft: {
    color: "#00A4EF", logo: "M",
    topics: [
      { slug:"tree",                weight:20, label:"Trees"               },
      { slug:"array",               weight:18, label:"Arrays"              },
      { slug:"string",              weight:15, label:"Strings"             },
      { slug:"dynamic-programming", weight:12, label:"Dynamic Programming" },
      { slug:"linked-list",         weight:10, label:"Linked Lists"        },
      { slug:"graph",               weight:10, label:"Graphs"              },
      { slug:"binary-search",       weight:8,  label:"Binary Search"       },
      { slug:"stack",               weight:7,  label:"Stacks"              },
    ],
    minRating:    1500,
    minSolved:    180,
    minHard:      35,
    desc:         "Strong emphasis on trees and OOP design. Good for mid-level engineers.",
  },
  Apple: {
    color: "#555555", logo: "",
    topics: [
      { slug:"array",               weight:18, label:"Arrays"              },
      { slug:"string",              weight:18, label:"Strings"             },
      { slug:"tree",                weight:15, label:"Trees"               },
      { slug:"dynamic-programming", weight:13, label:"Dynamic Programming" },
      { slug:"graph",               weight:12, label:"Graphs"              },
      { slug:"hash-table",          weight:10, label:"Hash Tables"         },
      { slug:"sorting",             weight:8,  label:"Sorting"             },
      { slug:"two-pointers",        weight:6,  label:"Two Pointers"        },
    ],
    minRating:    1600,
    minSolved:    220,
    minHard:      50,
    desc:         "Balanced difficulty. Strong systems thinking expected alongside DSA.",
  },
  Netflix: {
    color: "#E50914", logo: "N",
    topics: [
      { slug:"dynamic-programming", weight:20, label:"Dynamic Programming" },
      { slug:"graph",               weight:18, label:"Graphs"              },
      { slug:"array",               weight:15, label:"Arrays"              },
      { slug:"tree",                weight:12, label:"Trees"               },
      { slug:"heap-priority-queue", weight:12, label:"Heaps"               },
      { slug:"backtracking",        weight:10, label:"Backtracking"        },
      { slug:"string",              weight:8,  label:"Strings"             },
      { slug:"binary-search",       weight:5,  label:"Binary Search"       },
    ],
    minRating:    1900,
    minSolved:    350,
    minHard:      100,
    desc:         "High bar — expects senior-level problem solving. Mostly hard problems.",
  },
}

const KNOWN_TOTALS = {
  "array":1600,"dynamic-programming":590,"string":590,"math":560,"tree":360,
  "depth-first-search":420,"greedy":410,"binary-search":280,"breadth-first-search":270,
  "graph":290,"sorting":370,"hash-table":590,"two-pointers":230,"bit-manipulation":170,
  "stack":290,"heap-priority-queue":240,"backtracking":210,"sliding-window":200,
  "linked-list":175,"trie":90,"recursion":100,
}

function getTopicMastery(slug, topics) {
  const all = [
    ...(topics?.fundamental   || []),
    ...(topics?.intermediate  || []),
    ...(topics?.advanced      || []),
  ]
  // Try slug and name matching
  const found = all.find(t =>
    t.tagSlug?.toLowerCase() === slug ||
    t.tagName?.toLowerCase().replace(/\s+/g,"-") === slug ||
    t.tagName?.toLowerCase() === slug.replace(/-/g," ")
  )
  if (!found) return 0
  const total = KNOWN_TOTALS[slug] || Math.max(50, Math.round(found.problemsSolved * 2))
  return Math.min(100, Math.round((found.problemsSolved / total) * 100))
}

function computeReadiness(company, data) {
  const { solved, contest, topics } = data
  const cfg = COMPANY_REQUIREMENTS[company]

  // Topic score — weighted average mastery
  const topicScores = cfg.topics.map(t => ({
    ...t,
    mastery: getTopicMastery(t.slug, topics),
  }))
  const totalWeight = topicScores.reduce((s,t) => s + t.weight, 0)
  const topicScore  = Math.round(topicScores.reduce((s,t) => s + (t.mastery * t.weight / totalWeight), 0))

  // Volume score
  const volScore = Math.min(100, Math.round((solved.total / cfg.minSolved) * 100))

  // Hard score
  const hardScore = Math.min(100, Math.round((solved.hard / cfg.minHard) * 100))

  // Rating score
  const ratingScore = contest.rating
    ? Math.min(100, Math.round((contest.rating / cfg.minRating) * 100))
    : Math.min(50, Math.round(volScore * 0.5))

  // Overall readiness
  const overall = Math.round(topicScore * 0.40 + volScore * 0.25 + hardScore * 0.20 + ratingScore * 0.15)

  // Gap topics — what needs most work
  const gaps = topicScores
    .map(t => ({ ...t, gap: Math.max(0, 70 - t.mastery), urgency: t.weight * Math.max(0, 70 - t.mastery) }))
    .filter(t => t.mastery < 70)
    .sort((a,b) => b.urgency - a.urgency)
    .slice(0, 3)

  const tier =
    overall >= 85 ? { label:"Ready to apply! ✓", color:"#3B6D11", bg:"rgba(59,109,17,0.1)" } :
    overall >= 65 ? { label:"Almost there",       color:"#185FA5", bg:"rgba(24,95,165,0.1)" } :
    overall >= 45 ? { label:"3–6 months away",    color:"#BA7517", bg:"rgba(186,117,23,0.1)" } :
                   { label:"6–12 months away",    color:"#A32D2D", bg:"rgba(163,45,45,0.1)" }

  return { overall, topicScore, volScore, hardScore, ratingScore, topicScores, gaps, tier }
}

function GapBar({ label, mastery, weight, target=70, color }) {
  const pct     = Math.min(100, mastery)
  const reached = mastery >= target
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
        <span style={{ color:"var(--text2)" }}>{label}</span>
        <span style={{ fontFamily:"var(--font-mono)", color: reached ? "#3B6D11" : "var(--text3)" }}>
          {mastery}% {reached ? "✓" : `/ ${target}% target`}
        </span>
      </div>
      <div style={{ position:"relative", height:7, background:"var(--surface3)", borderRadius:4 }}>
        <div style={{ height:"100%", background: reached ? "#3B6D11" : color, borderRadius:4, width:pct+"%", transition:"width 1s ease" }} />
        {/* Target marker */}
        <div style={{ position:"absolute", top:-2, left:target+"%", width:2, height:11, background:"rgba(255,255,255,0.3)", borderRadius:1 }} />
      </div>
    </div>
  )
}

export default function SkillGapAnalyzer({ data }) {
  const [selected, setSelected] = useState("Google")

  const company  = COMPANY_REQUIREMENTS[selected]
  const analysis = useMemo(() => computeReadiness(selected, data), [selected, data])

  return (
    <div className="card" style={{ padding:"22px 24px", marginBottom:24 }}>
      <div style={{ fontSize:14, fontWeight:500, marginBottom:3 }}>Skill gap analyzer</div>
      <div style={{ fontSize:12, color:"var(--text3)", marginBottom:16 }}>
        Compare your mastery against what top companies actually ask — see exactly what to study
      </div>

      {/* Company selector */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        {Object.entries(COMPANY_REQUIREMENTS).map(([name, cfg]) => (
          <button key={name} onClick={() => setSelected(name)}
            style={{
              padding:"7px 14px", borderRadius:8, cursor:"pointer",
              border:"0.5px solid "+(selected===name ? cfg.color+"88" : "var(--border)"),
              background: selected===name ? cfg.color+"18" : "var(--surface2)",
              color: selected===name ? cfg.color : "var(--text2)",
              fontSize:12, fontWeight: selected===name ? 600 : 400,
              fontFamily:"var(--font-main)", transition:"all 0.15s",
              display:"flex", alignItems:"center", gap:6,
            }}>
            <span style={{ fontSize:13, fontWeight:700, color: selected===name ? cfg.color : "var(--text3)" }}>{cfg.logo}</span>
            {name}
          </button>
        ))}
      </div>

      {/* Company description */}
      <div style={{ padding:"10px 14px", background:"var(--surface2)", borderRadius:8, border:"0.5px solid var(--border)", marginBottom:16, fontSize:12, color:"var(--text2)", display:"flex", alignItems:"center", gap:10 }}>
        <i className="fa-solid fa-circle-info" style={{ color:company.color, flexShrink:0 }} />
        {company.desc}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

        {/* Left — Overall readiness */}
        <div>
          <div style={{ fontSize:12, color:"var(--text3)", marginBottom:12, fontWeight:500 }}>Overall readiness</div>

          {/* Big score */}
          <div style={{ padding:"20px", background:"var(--surface2)", borderRadius:12, border:"0.5px solid "+company.color+"44", textAlign:"center", marginBottom:14 }}>
            <div style={{ fontSize:52, fontWeight:700, fontFamily:"var(--font-mono)", color:company.color, lineHeight:1, marginBottom:6 }}>
              {analysis.overall}%
            </div>
            <div style={{ fontSize:13, fontWeight:600, color:analysis.tier.color, marginBottom:4 }}>{analysis.tier.label}</div>
            <div style={{ display:"inline-block", padding:"4px 14px", borderRadius:20, background:analysis.tier.bg, color:analysis.tier.color, fontSize:11, border:"0.5px solid "+analysis.tier.color+"44" }}>
              {selected} Interview Readiness
            </div>
          </div>

          {/* 4 factor scores */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
            {[
              { label:"Topic mastery",   val:analysis.topicScore,  color:"#185FA5", icon:"fa-brain" },
              { label:"Problem volume",  val:analysis.volScore,    color:"#3B6D11", icon:"fa-layer-group" },
              { label:"Hard problems",   val:analysis.hardScore,   color:"#A32D2D", icon:"fa-fire" },
              { label:"Contest rating",  val:analysis.ratingScore, color:"#7F77DD", icon:"fa-star" },
            ].map(({ label, val, color, icon }) => (
              <div key={label} style={{ background:"var(--surface2)", borderRadius:8, padding:"10px 12px", border:"0.5px solid var(--border)", borderTop:"2px solid "+color }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                  <i className={"fa-solid "+icon} style={{ color, fontSize:11 }} />
                  <span style={{ fontSize:10, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.3px" }}>{label}</span>
                </div>
                <div style={{ fontSize:18, fontWeight:600, fontFamily:"var(--font-mono)", color }}>
                  {Math.min(100, val)}%
                </div>
              </div>
            ))}
          </div>

          {/* Minimum requirements */}
          <div style={{ padding:"12px 14px", background:"var(--surface2)", borderRadius:8, border:"0.5px solid var(--border)" }}>
            <div style={{ fontSize:11, color:"var(--text3)", marginBottom:8, fontWeight:500 }}>{selected} minimum bar</div>
            {[
              { label:"Problems solved", yours:data.solved.total,        min:company.minSolved, color:"#3B6D11" },
              { label:"Hard problems",   yours:data.solved.hard,         min:company.minHard,   color:"#A32D2D" },
              { label:"Contest rating",  yours:data.contest.rating || 0, min:company.minRating, color:"#7F77DD" },
            ].map(({ label, yours, min, color }) => {
              const met = yours >= min
              return (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6, fontSize:12 }}>
                  <i className={"fa-solid "+(met ? "fa-circle-check" : "fa-circle-xmark")} style={{ color: met ? "#3B6D11" : "#A32D2D", fontSize:13, flexShrink:0 }} />
                  <span style={{ flex:1, color:"var(--text2)" }}>{label}</span>
                  <span style={{ fontFamily:"var(--font-mono)", color: met ? "#3B6D11" : "#A32D2D", fontWeight:600 }}>
                    {yours} / {min}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right — Topic breakdown */}
        <div>
          <div style={{ fontSize:12, color:"var(--text3)", marginBottom:12, fontWeight:500 }}>
            Topic coverage for {selected} · dashed line = 70% target
          </div>

          <div style={{ marginBottom:16 }}>
            {analysis.topicScores.map(t => (
              <GapBar key={t.slug} label={t.label} mastery={t.mastery} weight={t.weight} color={company.color} />
            ))}
          </div>

          {/* Top gaps to fix */}
          {analysis.gaps.length > 0 && (
            <div style={{ padding:"14px 16px", background:"rgba(186,117,23,0.06)", border:"0.5px solid rgba(186,117,23,0.2)", borderRadius:10 }}>
              <div style={{ fontSize:12, fontWeight:500, color:"#BA7517", marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ fontSize:13 }} />
                Priority gaps to close for {selected}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {analysis.gaps.map((t, i) => (
                  <div key={t.slug} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:"var(--surface2)", borderRadius:8, border:"0.5px solid var(--border)" }}>
                    <div style={{ width:22, height:22, borderRadius:"50%", background:"rgba(186,117,23,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#BA7517", flexShrink:0 }}>{i+1}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:500, color:"var(--text)" }}>{t.label}</div>
                      <div style={{ fontSize:10, color:"var(--text3)", marginTop:2 }}>
                        Currently {t.mastery}% · Need 70% · Weight {t.weight}%
                      </div>
                    </div>
                    <div style={{ fontSize:11, fontWeight:600, color:"#A32D2D", fontFamily:"var(--font-mono)" }}>
                      +{Math.max(0, 70-t.mastery)}%
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:10, fontSize:11, color:"var(--text3)" }}>
                💡 Focus on these topics first — they have the highest impact on your {selected} readiness score
              </div>
            </div>
          )}

          {analysis.gaps.length === 0 && (
            <div style={{ padding:"14px 16px", background:"rgba(59,109,17,0.08)", border:"0.5px solid rgba(59,109,17,0.2)", borderRadius:10, textAlign:"center" }}>
              <i className="fa-solid fa-trophy" style={{ color:"#3B6D11", fontSize:24, display:"block", marginBottom:8 }} />
              <div style={{ fontSize:13, fontWeight:600, color:"#3B6D11" }}>All topics above 70%!</div>
              <div style={{ fontSize:12, color:"var(--text2)", marginTop:4 }}>You meet the topic requirements for {selected}. Apply now! 🚀</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
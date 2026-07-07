import React, { useState, useMemo, useEffect } from "react"

const STORAGE_KEY = "skillgap_targets_v1"

const COMPANY_REQUIREMENTS = {
  Google: {
    color:"#4285F4", logo:"G", tier:"FAANG",
    minSolved:300, minHard:80,
    desc:"Focuses heavily on DP and graph problems. Expects clean code and optimal complexity.",
    topics:[
      {slug:"dynamic-programming", weight:22, label:"Dynamic Programming", base:60},
      {slug:"graph",               weight:18, label:"Graphs",              base:50},
      {slug:"array",               weight:15, label:"Arrays",              base:70},
      {slug:"tree",                weight:12, label:"Trees",               base:50},
      {slug:"string",              weight:10, label:"Strings",             base:40},
      {slug:"backtracking",        weight:8,  label:"Backtracking",        base:25},
      {slug:"binary-search",       weight:8,  label:"Binary Search",       base:30},
      {slug:"heap-priority-queue", weight:7,  label:"Heaps",               base:25},
    ],
  },
  Meta: {
    color:"#0866FF", logo:"f", tier:"FAANG",
    minSolved:250, minHard:60,
    desc:"Loves tree and array problems. Speed and communication matter a lot.",
    topics:[
      {slug:"array",               weight:20, label:"Arrays",              base:70},
      {slug:"tree",                weight:18, label:"Trees",               base:55},
      {slug:"graph",               weight:15, label:"Graphs",              base:40},
      {slug:"dynamic-programming", weight:12, label:"Dynamic Programming", base:40},
      {slug:"string",              weight:12, label:"Strings",             base:45},
      {slug:"hash-table",          weight:10, label:"Hash Tables",         base:35},
      {slug:"two-pointers",        weight:8,  label:"Two Pointers",        base:25},
      {slug:"recursion",           weight:5,  label:"Recursion",           base:20},
    ],
  },
  Amazon: {
    color:"#FF9900", logo:"a", tier:"FAANG",
    minSolved:200, minHard:40,
    desc:"Broad coverage expected. Leadership principles combined with solid DSA.",
    topics:[
      {slug:"array",               weight:20, label:"Arrays",              base:60},
      {slug:"tree",                weight:15, label:"Trees",               base:45},
      {slug:"dynamic-programming", weight:15, label:"Dynamic Programming", base:45},
      {slug:"string",              weight:12, label:"Strings",             base:40},
      {slug:"graph",               weight:12, label:"Graphs",              base:35},
      {slug:"hash-table",          weight:10, label:"Hash Tables",         base:30},
      {slug:"sorting",             weight:8,  label:"Sorting",             base:20},
      {slug:"heap-priority-queue", weight:8,  label:"Heaps",               base:20},
    ],
  },
  Microsoft: {
    color:"#00A4EF", logo:"M", tier:"FAANG",
    minSolved:180, minHard:35,
    desc:"Strong emphasis on trees and OOP design. Good for mid-level engineers.",
    topics:[
      {slug:"tree",                weight:20, label:"Trees",               base:50},
      {slug:"array",               weight:18, label:"Arrays",              base:55},
      {slug:"string",              weight:15, label:"Strings",             base:40},
      {slug:"dynamic-programming", weight:12, label:"Dynamic Programming", base:35},
      {slug:"linked-list",         weight:10, label:"Linked Lists",        base:25},
      {slug:"graph",               weight:10, label:"Graphs",              base:30},
      {slug:"binary-search",       weight:8,  label:"Binary Search",       base:20},
      {slug:"stack",               weight:7,  label:"Stacks",              base:20},
    ],
  },
  Adobe: {
    color:"#FF0000", logo:"Ad", tier:"FAANG",
    minSolved:200, minHard:45,
    desc:"Heavy focus on arrays and strings. Expects strong coding and design skills.",
    topics:[
      {slug:"array",               weight:20, label:"Arrays",              base:55},
      {slug:"string",              weight:18, label:"Strings",             base:50},
      {slug:"dynamic-programming", weight:16, label:"Dynamic Programming", base:40},
      {slug:"tree",                weight:14, label:"Trees",               base:40},
      {slug:"graph",               weight:12, label:"Graphs",              base:30},
      {slug:"hash-table",          weight:10, label:"Hash Tables",         base:30},
      {slug:"sorting",             weight:6,  label:"Sorting",             base:20},
      {slug:"binary-search",       weight:4,  label:"Binary Search",       base:15},
    ],
  },
  Oracle: {
    color:"#F80000", logo:"Or", tier:"Mid",
    minSolved:150, minHard:25,
    desc:"Focuses on data structures and database-related problem solving. SRM regular recruiter.",
    topics:[
      {slug:"array",               weight:22, label:"Arrays",              base:45},
      {slug:"string",              weight:18, label:"Strings",             base:40},
      {slug:"tree",                weight:16, label:"Trees",               base:35},
      {slug:"dynamic-programming", weight:14, label:"Dynamic Programming", base:30},
      {slug:"hash-table",          weight:12, label:"Hash Tables",         base:25},
      {slug:"graph",               weight:10, label:"Graphs",              base:25},
      {slug:"sorting",             weight:8,  label:"Sorting",             base:15},
    ],
  },
  IBM: {
    color:"#1F70C1", logo:"IBM", tier:"Mid",
    minSolved:120, minHard:15,
    desc:"Expects strong fundamentals in arrays, strings and data structures. Visits SRM regularly.",
    topics:[
      {slug:"array",               weight:25, label:"Arrays",              base:40},
      {slug:"string",              weight:20, label:"Strings",             base:35},
      {slug:"hash-table",          weight:16, label:"Hash Tables",         base:25},
      {slug:"tree",                weight:14, label:"Trees",               base:30},
      {slug:"sorting",             weight:12, label:"Sorting",             base:15},
      {slug:"dynamic-programming", weight:8,  label:"Dynamic Programming", base:20},
      {slug:"graph",               weight:5,  label:"Graphs",              base:15},
    ],
  },
  Optum: {
    color:"#D9534F", logo:"Op", tier:"Mid",
    minSolved:120, minHard:15,
    desc:"United Health Group tech arm. Visits SRM Ramapuram. Focuses on problem solving fundamentals.",
    topics:[
      {slug:"array",               weight:25, label:"Arrays",              base:40},
      {slug:"string",              weight:20, label:"Strings",             base:35},
      {slug:"hash-table",          weight:15, label:"Hash Tables",         base:25},
      {slug:"tree",                weight:15, label:"Trees",               base:30},
      {slug:"dynamic-programming", weight:12, label:"Dynamic Programming", base:20},
      {slug:"sorting",             weight:8,  label:"Sorting",             base:15},
      {slug:"graph",               weight:5,  label:"Graphs",              base:15},
    ],
  },
  TCS: {
    color:"#0A2F5E", logo:"TCS", tier:"Service",
    minSolved:60, minHard:3,
    desc:"Mass recruiter at SRM. TCS NQT focuses on basic aptitude, arrays, strings and math.",
    topics:[
      {slug:"array",               weight:28, label:"Arrays",              base:25},
      {slug:"string",              weight:25, label:"Strings",             base:20},
      {slug:"math",                weight:18, label:"Math",                base:15},
      {slug:"sorting",             weight:14, label:"Sorting",             base:10},
      {slug:"hash-table",          weight:10, label:"Hash Tables",         base:10},
      {slug:"dynamic-programming", weight:5,  label:"Dynamic Programming", base:8 },
    ],
  },
  Infosys: {
    color:"#007CC3", logo:"In", tier:"Service",
    minSolved:60, minHard:3,
    desc:"Major SRM recruiter. Infosys InfyTQ focuses on basic programming and data structures.",
    topics:[
      {slug:"array",               weight:28, label:"Arrays",              base:25},
      {slug:"string",              weight:25, label:"Strings",             base:20},
      {slug:"sorting",             weight:16, label:"Sorting",             base:10},
      {slug:"math",                weight:14, label:"Math",                base:12},
      {slug:"hash-table",          weight:10, label:"Hash Tables",         base:10},
      {slug:"linked-list",         weight:7,  label:"Linked Lists",        base:8 },
    ],
  },
  Wipro: {
    color:"#341C60", logo:"Wi", tier:"Service",
    minSolved:50, minHard:2,
    desc:"Wipro NLTH. Frequent SRM recruiter. Basic DSA, patterns and aptitude.",
    topics:[
      {slug:"array",               weight:30, label:"Arrays",              base:20},
      {slug:"string",              weight:25, label:"Strings",             base:18},
      {slug:"math",                weight:18, label:"Math",                base:12},
      {slug:"sorting",             weight:15, label:"Sorting",             base:8 },
      {slug:"hash-table",          weight:8,  label:"Hash Tables",         base:8 },
      {slug:"linked-list",         weight:4,  label:"Linked Lists",        base:5 },
    ],
  },
  Cognizant: {
    color:"#1252A3", logo:"Co", tier:"Service",
    minSolved:50, minHard:2,
    desc:"Top SRM recruiter every year. GenC and GenC Next tracks. Focuses on core DSA.",
    topics:[
      {slug:"array",               weight:30, label:"Arrays",              base:20},
      {slug:"string",              weight:25, label:"Strings",             base:18},
      {slug:"math",                weight:16, label:"Math",                base:12},
      {slug:"sorting",             weight:13, label:"Sorting",             base:8 },
      {slug:"hash-table",          weight:10, label:"Hash Tables",         base:8 },
      {slug:"linked-list",         weight:6,  label:"Linked Lists",        base:5 },
    ],
  },
  Accenture: {
    color:"#A100FF", logo:"Ac", tier:"Service",
    minSolved:40, minHard:1,
    desc:"Very high volume SRM recruiter. Accenture ASE test is mostly arrays, strings and aptitude.",
    topics:[
      {slug:"array",               weight:32, label:"Arrays",              base:15},
      {slug:"string",              weight:28, label:"Strings",             base:15},
      {slug:"math",                weight:20, label:"Math",                base:10},
      {slug:"sorting",             weight:12, label:"Sorting",             base:6 },
      {slug:"hash-table",          weight:8,  label:"Hash Tables",         base:6 },
    ],
  },
  Capgemini: {
    color:"#0070AD", logo:"Ca", tier:"Service",
    minSolved:40, minHard:1,
    desc:"Regular SRM recruiter. Game-based assessment + coding. Focus on basics.",
    topics:[
      {slug:"array",               weight:32, label:"Arrays",              base:15},
      {slug:"string",              weight:28, label:"Strings",             base:15},
      {slug:"math",                weight:20, label:"Math",                base:10},
      {slug:"sorting",             weight:12, label:"Sorting",             base:6 },
      {slug:"hash-table",          weight:8,  label:"Hash Tables",         base:6 },
    ],
  },
}

const TIER_ORDER  = ["FAANG","Mid","Service"]
const TIER_LABELS = { FAANG:"FAANG / Top Product", Mid:"Mid-tier Product", Service:"Service Based (SRM Regulars)" }
const TIER_COLORS = { FAANG:"#185FA5", Mid:"#BA7517", Service:"#3B6D11" }

function loadSavedTargets() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }
  catch { return {} }
}

// Auto-bump by +5 every time solved hits or exceeds target
function getEffectiveTarget(companyKey, slug, solved, base, savedTargets) {
  const storageKey = `${companyKey}_${slug}`
  let current = savedTargets[storageKey] !== undefined ? savedTargets[storageKey] : base
  while (solved >= current) { current += 5 }
  return current
}

function buildTopicLookup(topics) {
  const all = [...(topics?.fundamental||[]),...(topics?.intermediate||[]),...(topics?.advanced||[])]
  const map = {}
  all.forEach(t => {
    const s = t.problemsSolved || 0
    if (t.tagSlug) map[t.tagSlug.toLowerCase()] = s
    if (t.tagName) {
      map[t.tagName.toLowerCase()] = s
      map[t.tagName.toLowerCase().replace(/\s+/g,"-")] = s
      map[t.tagName.toLowerCase().replace(/[^a-z0-9]/g,"-")] = s
    }
  })
  return map
}

function getSolvedCount(slug, lookup) {
  const keys = [slug, slug.toLowerCase(), slug.replace(/-/g," ")]
  for (const k of keys) { if (lookup[k] !== undefined) return lookup[k] }
  return 0
}

function computeReadiness(companyKey, data, savedTargets) {
  const { solved, topics } = data
  const cfg    = COMPANY_REQUIREMENTS[companyKey]
  const lookup = buildTopicLookup(topics)

  const topicScores = cfg.topics.map(t => {
    const solvedCount = getSolvedCount(t.slug, lookup)
    const target      = getEffectiveTarget(companyKey, t.slug, solvedCount, t.base, savedTargets)
    const mastery     = Math.min(100, Math.round((solvedCount / target) * 100))
    const bumped      = target > t.base
    return { ...t, solved:solvedCount, target, mastery, bumped }
  })

  const totalWeight = topicScores.reduce((s,t) => s + t.weight, 0)
  const topicScore  = Math.round(topicScores.reduce((s,t) => s + (t.mastery * t.weight / totalWeight), 0))
  const volScore    = Math.min(100, Math.round((solved.total / cfg.minSolved) * 100))
  const hardScore   = Math.min(100, Math.round((solved.hard  / Math.max(1,cfg.minHard)) * 100))
  const overall     = Math.round(topicScore * 0.50 + volScore * 0.30 + hardScore * 0.20)

  const gaps = topicScores
    .filter(t => t.mastery < 100)
    .map(t => ({ ...t, urgency: t.weight * Math.max(0, 100 - t.mastery) }))
    .sort((a,b) => b.urgency - a.urgency)
    .slice(0, 3)

  const tier =
    overall >= 85 ? { label:"Ready to apply! ✓", color:"#3B6D11", bg:"rgba(59,109,17,0.1)"  } :
    overall >= 65 ? { label:"Almost there",       color:"#185FA5", bg:"rgba(24,95,165,0.1)"  } :
    overall >= 45 ? { label:"3–6 months away",    color:"#BA7517", bg:"rgba(186,117,23,0.1)" } :
                   { label:"6–12 months away",    color:"#A32D2D", bg:"rgba(163,45,45,0.1)"  }

  return { overall, topicScore, volScore, hardScore, topicScores, gaps, tier }
}

function GapBar({ label, mastery, color, solved, target, base, bumped }) {
  const remaining = Math.max(0, target - solved)
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
        <span style={{ color:"var(--text2)", display:"flex", alignItems:"center", gap:5 }}>
          {label}
          {bumped && <span style={{ fontSize:9, color:"#BA7517", fontWeight:600 }}>🔥 +{target-base}</span>}
        </span>
        <span style={{ fontFamily:"var(--font-mono)", display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ color:solved>0?"var(--text)":"var(--text3)" }}>{solved}</span>
          <span style={{ color:"var(--text3)" }}>/ {target}</span>
          {mastery >= 100 && <span style={{ color:"#3B6D11" }}>✓</span>}
        </span>
      </div>
      <div style={{ height:7, background:"var(--surface3)", borderRadius:4, overflow:"hidden" }}>
        <div style={{ height:"100%", background:mastery>=100?"#3B6D11":mastery>60?color:"#A32D2D", borderRadius:4, width:Math.min(100,mastery)+"%", transition:"width 1s ease" }} />
      </div>
      <div style={{ fontSize:10, marginTop:3, display:"flex", justifyContent:"space-between" }}>
        <span style={{ color:"var(--text3)" }}>{mastery}%</span>
        {remaining > 0
          ? <span style={{ color:mastery>60?color:"#A32D2D" }}>need {remaining} more</span>
          : <span style={{ color:"#3B6D11" }}>target met! next: {target+5}</span>
        }
      </div>
    </div>
  )
}

export default function SkillGapAnalyzer({ data }) {
  const [selected,     setSelected]     = useState("Google")
  const [savedTargets, setSavedTargets] = useState(() => loadSavedTargets())

  // Persist targets to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTargets))
  }, [savedTargets])

  const lookup = useMemo(() => buildTopicLookup(data.topics), [data.topics])

  // Auto-bump and persist targets when solved hits target
  useEffect(() => {
    const cfg     = COMPANY_REQUIREMENTS[selected]
    const updates = {}
    cfg.topics.forEach(t => {
      const solvedCount = getSolvedCount(t.slug, lookup)
      const storageKey  = `${selected}_${t.slug}`
      const current     = savedTargets[storageKey] !== undefined ? savedTargets[storageKey] : t.base
      let   next        = current
      while (solvedCount >= next) { next += 5 }
      if (next !== current) updates[storageKey] = next
    })
    if (Object.keys(updates).length > 0) {
      setSavedTargets(prev => ({ ...prev, ...updates }))
    }
  }, [selected, lookup])

  const company  = COMPANY_REQUIREMENTS[selected]
  const analysis = useMemo(() => computeReadiness(selected, data, savedTargets), [selected, data, savedTargets])

  return (
    <div className="card" style={{ padding:"22px 24px", marginBottom:24 }}>
      <div className="card-header">
        <div>
          <div className="card-title">Skill gap analyzer</div>
          <div className="card-subtitle">Targets auto-increase by +5 when met · your solved vs company expected count</div>
        </div>
      </div>

      {/* Company selector grouped by tier */}
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
        {TIER_ORDER.map(tier => (
          <div key={tier}>
            <div style={{ fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"1px", color:TIER_COLORS[tier], marginBottom:6, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:TIER_COLORS[tier], flexShrink:0 }} />
              {TIER_LABELS[tier]}
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {Object.entries(COMPANY_REQUIREMENTS)
                .filter(([,cfg]) => cfg.tier === tier)
                .map(([name, cfg]) => (
                  <button key={name} onClick={() => setSelected(name)}
                    style={{
                      padding:"5px 12px", borderRadius:7, cursor:"pointer",
                      border:"0.5px solid "+(selected===name ? cfg.color+"88":"var(--border)"),
                      background:selected===name ? cfg.color+"18":"var(--surface2)",
                      color:selected===name ? cfg.color:"var(--text2)",
                      fontSize:11, fontWeight:selected===name ? 600 : 400,
                      fontFamily:"var(--font-main)", transition:"all 0.15s",
                    }}>
                    {name}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Company description */}
      <div style={{ padding:"10px 14px", background:"var(--surface2)", borderRadius:8, border:"0.5px solid var(--border)", marginBottom:16, fontSize:12, color:"var(--text2)", display:"flex", alignItems:"center", gap:10 }}>
        <i className="fa-solid fa-circle-info" style={{ color:company.color, flexShrink:0 }} />
        {company.desc}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

        {/* Left */}
        <div>
          <div style={{ fontSize:12, color:"var(--text3)", marginBottom:12, fontWeight:500 }}>Overall readiness</div>

          <div style={{ padding:"20px", background:"var(--surface2)", borderRadius:12, border:"0.5px solid "+company.color+"44", textAlign:"center", marginBottom:14 }}>
            <div style={{ fontSize:52, fontWeight:700, fontFamily:"var(--font-mono)", color:company.color, lineHeight:1, marginBottom:6 }}>
              {analysis.overall}%
            </div>
            <div style={{ fontSize:13, fontWeight:600, color:analysis.tier.color, marginBottom:4 }}>{analysis.tier.label}</div>
            <div style={{ display:"inline-block", padding:"4px 14px", borderRadius:20, background:analysis.tier.bg, color:analysis.tier.color, fontSize:11, border:"0.5px solid "+analysis.tier.color+"44" }}>
              {selected} Interview Readiness
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
            {[
              { label:"Topic mastery (50%)",  val:analysis.topicScore, color:"#185FA5", icon:"fa-brain"       },
              { label:"Problem volume (30%)", val:analysis.volScore,   color:"#3B6D11", icon:"fa-layer-group" },
              { label:"Hard problems (20%)",  val:analysis.hardScore,  color:"#A32D2D", icon:"fa-fire"        },
            ].map(({ label, val, color, icon }) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"var(--surface2)", borderRadius:8, border:"0.5px solid var(--border)" }}>
                <i className={"fa-solid "+icon} style={{ color, fontSize:13, flexShrink:0 }} />
                <span style={{ flex:1, fontSize:12, color:"var(--text2)" }}>{label}</span>
                <span style={{ fontSize:16, fontWeight:600, fontFamily:"var(--font-mono)", color }}>{Math.min(100,val)}%</span>
              </div>
            ))}
          </div>

          <div style={{ padding:"12px 14px", background:"var(--surface2)", borderRadius:8, border:"0.5px solid var(--border)" }}>
            <div style={{ fontSize:11, color:"var(--text3)", marginBottom:8, fontWeight:500 }}>{selected} minimum bar</div>
            {[
              { label:"Problems solved", yours:data.solved.total, min:company.minSolved },
              { label:"Hard problems",   yours:data.solved.hard,  min:company.minHard   },
            ].map(({ label, yours, min }) => {
              const met = yours >= min
              return (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6, fontSize:12 }}>
                  <i className={"fa-solid "+(met?"fa-circle-check":"fa-circle-xmark")} style={{ color:met?"#3B6D11":"#A32D2D", fontSize:13, flexShrink:0 }} />
                  <span style={{ flex:1, color:"var(--text2)" }}>{label}</span>
                  <span style={{ fontFamily:"var(--font-mono)", fontWeight:600, color:met?"#3B6D11":"#A32D2D" }}>{yours} / {min}</span>
                </div>
              )
            })}
            <div style={{ marginTop:8, paddingTop:8, borderTop:"0.5px solid var(--border)", fontSize:10, color:"var(--text3)", display:"flex", alignItems:"center", gap:6 }}>
              <i className="fa-solid fa-fire" style={{ color:"#BA7517" }} />
              Targets auto-increase by +5 when you hit them — keeps you improving!
            </div>
          </div>
        </div>

        {/* Right */}
        <div>
          <div style={{ fontSize:12, color:"var(--text3)", marginBottom:4, fontWeight:500 }}>
            Topic coverage for {selected}
          </div>
          <div style={{ fontSize:11, color:"var(--text3)", marginBottom:12 }}>
            Your solved / target · 🔥 = auto-bumped past base target
          </div>
          <div style={{ marginBottom:16 }}>
            {analysis.topicScores.map(t => (
              <GapBar key={t.slug} label={t.label} mastery={t.mastery} color={company.color}
                solved={t.solved} target={t.target} base={t.base} bumped={t.bumped} />
            ))}
          </div>

          {analysis.gaps.length > 0 ? (
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
                        {t.solved} / {t.target} · {t.mastery}% · need {Math.max(0,t.target-t.solved)} more
                      </div>
                    </div>
                    <div style={{ fontSize:11, fontWeight:600, color:"#A32D2D", fontFamily:"var(--font-mono)" }}>
                      {Math.max(0,t.target-t.solved)} left
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:10, fontSize:11, color:"var(--text3)" }}>
                💡 Solve these — highest impact on your {selected} readiness score
              </div>
            </div>
          ) : (
            <div style={{ padding:"14px 16px", background:"rgba(59,109,17,0.08)", border:"0.5px solid rgba(59,109,17,0.2)", borderRadius:10, textAlign:"center" }}>
              <i className="fa-solid fa-trophy" style={{ color:"#3B6D11", fontSize:24, display:"block", marginBottom:8 }} />
              <div style={{ fontSize:13, fontWeight:600, color:"#3B6D11" }}>All topic targets met!</div>
              <div style={{ fontSize:12, color:"var(--text2)", marginTop:4 }}>Keep going — targets will auto-bump by +5! 🚀</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
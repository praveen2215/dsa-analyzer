import React, { useState, useMemo } from "react"

const COMPANY_REQUIREMENTS = {
  // ── FAANG / Top Product ─────────────────────────────────────────────
  Google: {
    color:"#4285F4", logo:"G", tier:"FAANG",
    topics:[
      {slug:"dynamic-programming",weight:22,label:"Dynamic Programming"},
      {slug:"graph",              weight:18,label:"Graphs"             },
      {slug:"array",              weight:15,label:"Arrays"             },
      {slug:"tree",               weight:12,label:"Trees"              },
      {slug:"string",             weight:10,label:"Strings"            },
      {slug:"backtracking",       weight:8, label:"Backtracking"       },
      {slug:"binary-search",      weight:8, label:"Binary Search"      },
      {slug:"heap-priority-queue",weight:7, label:"Heaps"              },
    ],
    minSolved:300, minHard:80,
    desc:"Focuses heavily on DP and graph problems. Expects clean code and optimal complexity.",
  },
  Meta: {
    color:"#0866FF", logo:"f", tier:"FAANG",
    topics:[
      {slug:"array",              weight:20,label:"Arrays"             },
      {slug:"tree",               weight:18,label:"Trees"              },
      {slug:"graph",              weight:15,label:"Graphs"             },
      {slug:"dynamic-programming",weight:12,label:"Dynamic Programming"},
      {slug:"string",             weight:12,label:"Strings"            },
      {slug:"hash-table",         weight:10,label:"Hash Tables"        },
      {slug:"two-pointers",       weight:8, label:"Two Pointers"       },
      {slug:"recursion",          weight:5, label:"Recursion"          },
    ],
    minSolved:250, minHard:60,
    desc:"Loves tree and array problems. Speed and communication matter a lot.",
  },
  Amazon: {
    color:"#FF9900", logo:"a", tier:"FAANG",
    topics:[
      {slug:"array",              weight:20,label:"Arrays"             },
      {slug:"tree",               weight:15,label:"Trees"              },
      {slug:"dynamic-programming",weight:15,label:"Dynamic Programming"},
      {slug:"string",             weight:12,label:"Strings"            },
      {slug:"graph",              weight:12,label:"Graphs"             },
      {slug:"hash-table",         weight:10,label:"Hash Tables"        },
      {slug:"sorting",            weight:8, label:"Sorting"            },
      {slug:"heap-priority-queue",weight:8, label:"Heaps"              },
    ],
    minSolved:200, minHard:40,
    desc:"Broad coverage expected. Leadership principles combined with solid DSA.",
  },
  Microsoft: {
    color:"#00A4EF", logo:"M", tier:"FAANG",
    topics:[
      {slug:"tree",               weight:20,label:"Trees"              },
      {slug:"array",              weight:18,label:"Arrays"             },
      {slug:"string",             weight:15,label:"Strings"            },
      {slug:"dynamic-programming",weight:12,label:"Dynamic Programming"},
      {slug:"linked-list",        weight:10,label:"Linked Lists"       },
      {slug:"graph",              weight:10,label:"Graphs"             },
      {slug:"binary-search",      weight:8, label:"Binary Search"      },
      {slug:"stack",              weight:7, label:"Stacks"             },
    ],
    minSolved:180, minHard:35,
    desc:"Strong emphasis on trees and OOP design. Good for mid-level engineers.",
  },
  Adobe: {
    color:"#FF0000", logo:"Ad", tier:"FAANG",
    topics:[
      {slug:"array",              weight:20,label:"Arrays"             },
      {slug:"string",             weight:18,label:"Strings"            },
      {slug:"dynamic-programming",weight:16,label:"Dynamic Programming"},
      {slug:"tree",               weight:14,label:"Trees"              },
      {slug:"graph",              weight:12,label:"Graphs"             },
      {slug:"hash-table",         weight:10,label:"Hash Tables"        },
      {slug:"sorting",            weight:6, label:"Sorting"            },
      {slug:"binary-search",      weight:4, label:"Binary Search"      },
    ],
    minSolved:200, minHard:45,
    desc:"Heavy focus on arrays and strings. Expects strong coding and design skills.",
  },
  // ── Mid-tier Product ────────────────────────────────────────────────
  Oracle: {
    color:"#F80000", logo:"Or", tier:"Mid",
    topics:[
      {slug:"array",              weight:20,label:"Arrays"             },
      {slug:"string",             weight:16,label:"Strings"            },
      {slug:"tree",               weight:16,label:"Trees"              },
      {slug:"dynamic-programming",weight:14,label:"Dynamic Programming"},
      {slug:"hash-table",         weight:12,label:"Hash Tables"        },
      {slug:"graph",              weight:10,label:"Graphs"             },
      {slug:"sorting",            weight:8, label:"Sorting"            },
      {slug:"binary-search",      weight:4, label:"Binary Search"      },
    ],
    minSolved:180, minHard:30,
    desc:"Focuses on data structures and database-related problem solving. SRM regular recruiter.",
  },
  IBM: {
    color:"#1F70C1", logo:"IBM", tier:"Mid",
    topics:[
      {slug:"array",              weight:22,label:"Arrays"             },
      {slug:"string",             weight:18,label:"Strings"            },
      {slug:"hash-table",         weight:16,label:"Hash Tables"        },
      {slug:"tree",               weight:14,label:"Trees"              },
      {slug:"sorting",            weight:12,label:"Sorting"            },
      {slug:"dynamic-programming",weight:10,label:"Dynamic Programming"},
      {slug:"graph",              weight:8, label:"Graphs"             },
    ],
    minSolved:150, minHard:20,
    desc:"Expects strong fundamentals in arrays, strings and data structures. Visits SRM regularly.",
  },
  Optum: {
    color:"#D9534F", logo:"Op", tier:"Mid",
    topics:[
      {slug:"array",              weight:22,label:"Arrays"             },
      {slug:"string",             weight:18,label:"Strings"            },
      {slug:"hash-table",         weight:14,label:"Hash Tables"        },
      {slug:"tree",               weight:14,label:"Trees"              },
      {slug:"dynamic-programming",weight:12,label:"Dynamic Programming"},
      {slug:"sorting",            weight:10,label:"Sorting"            },
      {slug:"graph",              weight:10,label:"Graphs"             },
    ],
    minSolved:150, minHard:20,
    desc:"United Health Group tech arm. Visits SRM Ramapuram. Focuses on problem solving fundamentals.",
  },
  // ── Service-based (Mass recruiters at SRM) ─────────────────────────
  TCS: {
    color:"#0A2F5E", logo:"TCS", tier:"Service",
    topics:[
      {slug:"array",              weight:25,label:"Arrays"             },
      {slug:"string",             weight:22,label:"Strings"            },
      {slug:"math",               weight:15,label:"Math"               },
      {slug:"sorting",            weight:14,label:"Sorting"            },
      {slug:"hash-table",         weight:12,label:"Hash Tables"        },
      {slug:"dynamic-programming",weight:8, label:"Dynamic Programming"},
      {slug:"tree",               weight:4, label:"Trees"              },
    ],
    minSolved:80, minHard:5,
    desc:"Mass recruiter at SRM. TCS NQT focuses on basic aptitude, arrays, strings and math.",
  },
  Infosys: {
    color:"#007CC3", logo:"In", tier:"Service",
    topics:[
      {slug:"array",              weight:25,label:"Arrays"             },
      {slug:"string",             weight:22,label:"Strings"            },
      {slug:"sorting",            weight:15,label:"Sorting"            },
      {slug:"math",               weight:14,label:"Math"               },
      {slug:"hash-table",         weight:12,label:"Hash Tables"        },
      {slug:"linked-list",        weight:8, label:"Linked Lists"       },
      {slug:"tree",               weight:4, label:"Trees"              },
    ],
    minSolved:80, minHard:5,
    desc:"Major SRM recruiter. Infosys InfyTQ focuses on basic programming and data structures.",
  },
  Wipro: {
    color:"#341C60", logo:"Wi", tier:"Service",
    topics:[
      {slug:"array",              weight:25,label:"Arrays"             },
      {slug:"string",             weight:20,label:"Strings"            },
      {slug:"math",               weight:15,label:"Math"               },
      {slug:"sorting",            weight:15,label:"Sorting"            },
      {slug:"hash-table",         weight:12,label:"Hash Tables"        },
      {slug:"linked-list",        weight:8, label:"Linked Lists"       },
      {slug:"stack",              weight:5, label:"Stacks"             },
    ],
    minSolved:70, minHard:3,
    desc:"Wipro NLTH. Frequent SRM recruiter. Basic DSA, patterns and aptitude.",
  },
  Cognizant: {
    color:"#1252A3", logo:"Co", tier:"Service",
    topics:[
      {slug:"array",              weight:25,label:"Arrays"             },
      {slug:"string",             weight:22,label:"Strings"            },
      {slug:"math",               weight:15,label:"Math"               },
      {slug:"sorting",            weight:13,label:"Sorting"            },
      {slug:"hash-table",         weight:12,label:"Hash Tables"        },
      {slug:"linked-list",        weight:8, label:"Linked Lists"       },
      {slug:"tree",               weight:5, label:"Trees"              },
    ],
    minSolved:70, minHard:3,
    desc:"Top SRM recruiter every year. GenC and GenC Next tracks. Focuses on core DSA.",
  },
  Accenture: {
    color:"#A100FF", logo:"Ac", tier:"Service",
    topics:[
      {slug:"array",              weight:28,label:"Arrays"             },
      {slug:"string",             weight:24,label:"Strings"            },
      {slug:"math",               weight:16,label:"Math"               },
      {slug:"sorting",            weight:14,label:"Sorting"            },
      {slug:"hash-table",         weight:10,label:"Hash Tables"        },
      {slug:"linked-list",        weight:8, label:"Linked Lists"       },
    ],
    minSolved:60, minHard:2,
    desc:"Very high volume SRM recruiter. Accenture ASE test is mostly arrays, strings and aptitude.",
  },
  Capgemini: {
    color:"#0070AD", logo:"Ca", tier:"Service",
    topics:[
      {slug:"array",              weight:28,label:"Arrays"             },
      {slug:"string",             weight:24,label:"Strings"            },
      {slug:"math",               weight:16,label:"Math"               },
      {slug:"sorting",            weight:14,label:"Sorting"            },
      {slug:"hash-table",         weight:10,label:"Hash Tables"        },
      {slug:"linked-list",        weight:8, label:"Linked Lists"       },
    ],
    minSolved:60, minHard:2,
    desc:"Regular SRM recruiter. Game-based assessment + coding. Focus on basics.",
  },
}

const TIER_ORDER  = ["FAANG","Mid","Service"]
const TIER_LABELS = { FAANG:"FAANG / Top Product", Mid:"Mid-tier Product", Service:"Service Based (SRM Regulars)" }
const TIER_COLORS = { FAANG:"#185FA5", Mid:"#BA7517", Service:"#3B6D11" }

const KNOWN_TOTALS = {
  "array":1600,"dynamic-programming":590,"string":590,"math":560,"tree":360,
  "depth-first-search":420,"greedy":410,"binary-search":280,"breadth-first-search":270,
  "graph":290,"sorting":370,"hash-table":590,"two-pointers":230,"bit-manipulation":170,
  "stack":290,"heap-priority-queue":240,"backtracking":210,"sliding-window":200,
  "linked-list":175,"trie":90,"recursion":100,"matrix":210,
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

function getTopicMastery(slug, lookup) {
  const keys = [slug, slug.toLowerCase(), slug.replace(/-/g," ")]
  let solved = null
  for (const k of keys) { if (lookup[k] !== undefined) { solved = lookup[k]; break } }
  if (solved === null) return 0
  const total = KNOWN_TOTALS[slug] || Math.max(50, Math.round(solved * 2.5))
  return Math.min(100, Math.round((solved / total) * 100))
}

function computeReadiness(company, data) {
  const { solved, topics } = data
  const cfg    = COMPANY_REQUIREMENTS[company]
  const lookup = buildTopicLookup(topics)
  const topicScores = cfg.topics.map(t => ({ ...t, mastery: getTopicMastery(t.slug, lookup) }))
  const totalWeight = topicScores.reduce((s,t) => s + t.weight, 0)
  const topicScore  = Math.round(topicScores.reduce((s,t) => s + (t.mastery * t.weight / totalWeight), 0))
  const volScore    = Math.min(100, Math.round((solved.total / cfg.minSolved) * 100))
  const hardScore   = Math.min(100, Math.round((solved.hard  / cfg.minHard)   * 100))
  const overall     = Math.round(topicScore * 0.50 + volScore * 0.30 + hardScore * 0.20)
  const gaps = topicScores
    .filter(t => t.mastery < 70)
    .map(t => ({ ...t, gap:Math.max(0,70-t.mastery), urgency:t.weight*Math.max(0,70-t.mastery) }))
    .sort((a,b) => b.urgency - a.urgency).slice(0,3)
  const tier =
    overall >= 85 ? { label:"Ready to apply! ✓", color:"#3B6D11", bg:"rgba(59,109,17,0.1)"  } :
    overall >= 65 ? { label:"Almost there",       color:"#185FA5", bg:"rgba(24,95,165,0.1)"  } :
    overall >= 45 ? { label:"3–6 months away",    color:"#BA7517", bg:"rgba(186,117,23,0.1)" } :
                   { label:"6–12 months away",    color:"#A32D2D", bg:"rgba(163,45,45,0.1)"  }
  return { overall, topicScore, volScore, hardScore, topicScores, gaps, tier }
}

function GapBar({ label, mastery, color }) {
  const reached = mastery >= 70
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
        <span style={{ color:"var(--text2)" }}>{label}</span>
        <span style={{ fontFamily:"var(--font-mono)", color:reached?"#3B6D11":"var(--text3)" }}>
          {mastery}% {reached?"✓":"/ 70% target"}
        </span>
      </div>
      <div style={{ height:7, background:"var(--surface3)", borderRadius:4, overflow:"hidden" }}>
        <div style={{ height:"100%", background:reached?"#3B6D11":color, borderRadius:4, width:Math.min(100,mastery)+"%", transition:"width 1s ease" }} />
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
      <div className="card-header">
        <div>
          <div className="card-title">Skill gap analyzer</div>
          <div className="card-subtitle">Your real topic mastery vs what companies actually ask — including SRM Ramapuram recruiters</div>
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

        {/* Left — readiness */}
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
              { label:"Problems solved", yours:data.solved.total, min:company.minSolved, color:"#3B6D11" },
              { label:"Hard problems",   yours:data.solved.hard,  min:company.minHard,   color:"#A32D2D" },
            ].map(({ label, yours, min, color }) => {
              const met = yours >= min
              return (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6, fontSize:12 }}>
                  <i className={"fa-solid "+(met?"fa-circle-check":"fa-circle-xmark")} style={{ color:met?"#3B6D11":"#A32D2D", fontSize:13, flexShrink:0 }} />
                  <span style={{ flex:1, color:"var(--text2)" }}>{label}</span>
                  <span style={{ fontFamily:"var(--font-mono)", fontWeight:600, color:met?"#3B6D11":"#A32D2D" }}>{yours} / {min}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right — topic breakdown */}
        <div>
          <div style={{ fontSize:12, color:"var(--text3)", marginBottom:12, fontWeight:500 }}>
            Topic coverage · 70% = target
          </div>
          <div style={{ marginBottom:16 }}>
            {analysis.topicScores.map(t => (
              <GapBar key={t.slug} label={t.label} mastery={t.mastery} color={company.color} />
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
                      <div style={{ fontSize:10, color:"var(--text3)", marginTop:2 }}>Currently {t.mastery}% · Need 70% · Weight {t.weight}%</div>
                    </div>
                    <div style={{ fontSize:11, fontWeight:600, color:"#A32D2D", fontFamily:"var(--font-mono)" }}>+{Math.max(0,70-t.mastery)}%</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:10, fontSize:11, color:"var(--text3)" }}>
                💡 Focus on these topics — highest impact on your {selected} readiness score
              </div>
            </div>
          ) : (
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
import React, { useMemo } from "react"

const LANG_COLORS = {
  python:      "#3B82F6", python3:     "#3B82F6",
  cpp:         "#A32D2D", c:           "#A32D2D",
  java:        "#BA7517", kotlin:      "#BA7517",
  javascript:  "#ECC94B", typescript:  "#ECC94B",
  rust:        "#E55B2B", go:          "#00ADD8",
  swift:       "#F05138", ruby:        "#CC342D",
  csharp:      "#7F77DD", scala:       "#DC322F",
  default:     "#185FA5"
}

function getLangColor(name) {
  const key = name.toLowerCase().replace(/[^a-z]/g, "")
  return LANG_COLORS[key] || LANG_COLORS.default
}

function parseMs(val) {
  if (!val) return null
  const n = parseFloat(val)
  return isNaN(n) ? null : n
}

function parseMb(val) {
  if (!val) return null
  // LeetCode returns "15.2 MB" or "15200 KB"
  const lower = val.toLowerCase()
  if (lower.includes("mb")) return parseFloat(val)
  if (lower.includes("kb")) return parseFloat(val) / 1024
  const n = parseFloat(val)
  return isNaN(n) ? null : n
}

export default function LanguageBreakdown({ languages, recent }) {
  const sorted = useMemo(() =>
    [...(languages || [])].sort((a,b) => b.problemsSolved - a.problemsSolved).slice(0, 8)
  , [languages])

  const max = sorted[0]?.problemsSolved || 1

  // Compute real avg runtime and memory per language from recent submissions
  const langStats = useMemo(() => {
    const map = {}
    for (const s of (recent?.submissions || [])) {
      const lang = (s.lang || "").toLowerCase()
      if (!map[lang]) map[lang] = { runtimes:[], memories:[] }
      const rt = parseMs(s.runtime)
      const mem = parseMb(s.memory)
      if (rt  !== null) map[lang].runtimes.push(rt)
      if (mem !== null) map[lang].memories.push(mem)
    }
    const result = {}
    for (const [lang, stats] of Object.entries(map)) {
      result[lang] = {
        avgRuntime: stats.runtimes.length
          ? Math.round(stats.runtimes.reduce((a,b) => a+b, 0) / stats.runtimes.length)
          : null,
        avgMemory: stats.memories.length
          ? (stats.memories.reduce((a,b) => a+b, 0) / stats.memories.length).toFixed(1)
          : null,
        count: Math.max(stats.runtimes.length, stats.memories.length)
      }
    }
    return result
  }, [recent])

  const totalSolved = sorted.reduce((s, l) => s + l.problemsSolved, 0)

  if (!sorted.length) return (
    <div className="card" style={{ padding:"22px 24px" }}>
      <div className="card-title" style={{ marginBottom:4 }}>Language breakdown</div>
      <div className="card-subtitle">No language data available</div>
    </div>
  )

  return (
    <div className="card" style={{ padding:"22px 24px" }}>
      <div className="card-header">
        <div>
          <div className="card-title">Language breakdown</div>
          <div className="card-subtitle">{totalSolved} problems across {sorted.length} languages</div>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {sorted.map(lang => {
          const color   = getLangColor(lang.languageName)
          const pct     = Math.round((lang.problemsSolved / max) * 100)
          const share   = Math.round((lang.problemsSolved / totalSolved) * 100)
          const key     = lang.languageName.toLowerCase().replace(/[^a-z0-9]/g,"")
          const stats   = langStats[key] || langStats[lang.languageName.toLowerCase()] || null
          const hasData = stats && (stats.avgRuntime !== null || stats.avgMemory !== null)

          return (
            <div key={lang.languageName} style={{ padding:"12px 14px", background:"var(--surface2)", borderRadius:9, border:"0.5px solid var(--border)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:10, height:10, borderRadius:2, background:color, flexShrink:0 }} />
                  <span style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{lang.languageName}</span>
                  <span style={{ fontSize:10, padding:"2px 7px", borderRadius:20, background:color+"18", color, fontWeight:600 }}>{share}%</span>
                </div>
                <span style={{ fontSize:13, fontWeight:500, fontFamily:"var(--font-mono)", color }}>{lang.problemsSolved}</span>
              </div>

              <div style={{ height:5, background:"var(--surface3)", borderRadius:3, overflow:"hidden", marginBottom: hasData ? 10 : 0 }}>
                <div style={{ height:"100%", background:color, borderRadius:3, width:pct+"%", transition:"width 1s ease" }} />
              </div>

              {/* Real runtime and memory data */}
              {hasData && (
                <div style={{ display:"flex", gap:12, marginTop:4 }}>
                  {stats.avgRuntime !== null && (
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <i className="fa-solid fa-bolt" style={{ color:"#BA7517", fontSize:10 }} />
                      <span style={{ fontSize:11, color:"var(--text3)" }}>Avg runtime:</span>
                      <span style={{ fontSize:11, fontFamily:"var(--font-mono)", fontWeight:600, color:"#BA7517" }}>{stats.avgRuntime}ms</span>
                    </div>
                  )}
                  {stats.avgMemory !== null && (
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <i className="fa-solid fa-memory" style={{ color:"#185FA5", fontSize:10 }} />
                      <span style={{ fontSize:11, color:"var(--text3)" }}>Avg memory:</span>
                      <span style={{ fontSize:11, fontFamily:"var(--font-mono)", fontWeight:600, color:"#185FA5" }}>{stats.avgMemory}MB</span>
                    </div>
                  )}
                  {stats.count > 0 && (
                    <div style={{ marginLeft:"auto" }}>
                      <span style={{ fontSize:10, color:"var(--text3)" }}>from {stats.count} recent submission{stats.count>1?"s":""}</span>
                    </div>
                  )}
                </div>
              )}

              {!hasData && (
                <div style={{ fontSize:10, color:"var(--text3)", marginTop:4 }}>
                  Solve problems in {lang.languageName} recently to see runtime & memory stats
                </div>
              )}
            </div>
          )
        })}
      </div>

      {(!recent?.submissions?.length) && (
        <div style={{ marginTop:12, padding:"10px 14px", background:"rgba(24,95,165,0.06)", border:"0.5px solid rgba(24,95,165,0.15)", borderRadius:7, fontSize:11, color:"var(--text3)", display:"flex", alignItems:"center", gap:8 }}>
          <i className="fa-solid fa-circle-info" style={{ color:"#185FA5" }} />
          Runtime and memory stats appear after analyzing a profile with recent accepted submissions
        </div>
      )}
    </div>
  )
}
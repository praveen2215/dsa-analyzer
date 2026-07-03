import React, { useMemo } from "react"

const TIERS = [
  { name:"FAANG+",  min:88, color:"#3B6D11", bg:"rgba(59,109,17,0.1)",   desc:"Google, Meta, Apple, Amazon" },
  { name:"Tier 1",  min:72, color:"#185FA5", bg:"rgba(24,95,165,0.1)",   desc:"Microsoft, Uber, Airbnb"     },
  { name:"Tier 2",  min:55, color:"#BA7517", bg:"rgba(186,117,23,0.1)",  desc:"Mid-size tech, startups"     },
  { name:"Junior",  min:35, color:"#7F77DD", bg:"rgba(127,119,221,0.1)", desc:"Entry level positions"       },
  { name:"Beginner",min:0,  color:"#A32D2D", bg:"rgba(163,45,45,0.1)",   desc:"Keep grinding!"              },
]

const COLORS = ["#3B6D11","#185FA5","#BA7517","#7F77DD"]

function RadialGauge({ score, color }) {
  const r=74, sw=10, norm=r-sw/2, circ=2*Math.PI*norm
  return (
    <div style={{ position:"relative", width:180, height:140, margin:"0 auto" }}>
      <svg width="180" height="180" viewBox="0 0 180 180" style={{ position:"absolute", top:0, left:0 }}>
        <circle cx="90" cy="90" r={norm} fill="none" stroke="var(--surface3)" strokeWidth={sw}
          strokeDasharray={circ*0.75+" "+circ*0.25} strokeDashoffset={circ*0.125}
          strokeLinecap="round" transform="rotate(135 90 90)"/>
        <circle cx="90" cy="90" r={norm} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ*0.75*(score/100)+" "+circ} strokeDashoffset={circ*0.125}
          strokeLinecap="round" transform="rotate(135 90 90)"
          style={{ transition:"stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)" }}/>
      </svg>
      <div style={{ position:"absolute", top:50, left:0, right:0, textAlign:"center" }}>
        <div style={{ fontSize:38, fontWeight:600, fontFamily:"var(--font-mono)", color, lineHeight:1 }}>{score}</div>
        <div style={{ fontSize:11, color:"var(--text3)", marginTop:4, textTransform:"uppercase", letterSpacing:"0.5px" }}>/100</div>
      </div>
    </div>
  )
}

export default function InterviewReadiness({ data }) {
  const { solved, calendar, topics } = data

  const breakdown = useMemo(() => {
    const topicCount = [
      ...(topics?.fundamental   || []),
      ...(topics?.intermediate  || []),
      ...(topics?.advanced      || []),
    ].filter(t => t.problemsSolved >= 5).length

    // Factor 1: Problem Volume (30pts) — max at 500 problems
    const volScore = Math.min(30, Math.round((solved.total / 500) * 30))

    // Factor 2: Hard Problems (30pts) — max at 150 hard
    const hardScore = Math.min(30, Math.round((solved.hard / 150) * 30))

    // Factor 3: Topic Coverage (25pts) — max at 15 topics with 5+ problems
    const topicScore = Math.min(25, Math.round((topicCount / 15) * 25))

    // Factor 4: Consistency (15pts) — streak max at 100 days
    const streak = calendar.streak || 0
    const streakScore = Math.min(15, Math.round((Math.min(streak, 100) / 100) * 15))

    return [
      { key:"totalSolved",   label:"Problem Volume",  weight:30, earned:volScore,    color:COLORS[0], icon:"fa-layer-group", desc:"Based on total problems solved · Max at 500" },
      { key:"hardSolved",    label:"Hard Problems",   weight:30, earned:hardScore,   color:COLORS[1], icon:"fa-fire",        desc:"Hard problems solved · Max at 150"           },
      { key:"topicCoverage", label:"Topic Coverage",  weight:25, earned:topicScore,  color:COLORS[2], icon:"fa-brain",       desc:"Topics with 5+ problems solved · Max at 15"  },
      { key:"streak",        label:"Consistency",     weight:15, earned:streakScore, color:COLORS[3], icon:"fa-calendar",    desc:"Current streak in days · Max at 100"         },
    ]
  }, [solved, calendar, topics])

  const total    = Math.round(breakdown.reduce((s,b) => s + b.earned, 0))
  const tier     = TIERS.find(t => total >= t.min) || TIERS[TIERS.length-1]
  const nextTier = TIERS[TIERS.indexOf(tier) - 1]

  // What to improve next — find biggest gap
  const biggestGap = [...breakdown].sort((a,b) => (b.weight - b.earned) - (a.weight - a.earned))[0]

  return (
    <div className="card" style={{ padding:"22px 24px", marginBottom:24 }}>
      <div className="card-header">
        <div>
          <div className="card-title">Interview readiness score</div>
          <div className="card-subtitle">Based on problem volume, hard problems, topic coverage and consistency</div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:32, alignItems:"start" }}>

        {/* Gauge */}
        <div>
          <RadialGauge score={total} color={tier.color} />
          <div style={{ textAlign:"center", marginTop:8 }}>
            <div style={{ display:"inline-block", padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:600, background:tier.bg, color:tier.color, border:"0.5px solid "+tier.color+"44" }}>
              {tier.name}
            </div>
            <div style={{ fontSize:11, color:"var(--text3)", marginTop:6 }}>{tier.desc}</div>
          </div>

          {nextTier && (
            <div style={{ marginTop:12, padding:"10px 14px", background:"var(--surface2)", borderRadius:8, fontSize:11, color:"var(--text3)", textAlign:"center", border:"0.5px solid var(--border)" }}>
              <span style={{ color:nextTier.color, fontWeight:600 }}>{nextTier.min - total} pts</span> to reach <strong style={{ color:"var(--text2)" }}>{nextTier.name}</strong>
            </div>
          )}

          {/* Real numbers */}
          <div style={{ marginTop:12, padding:"10px 14px", background:"var(--surface2)", borderRadius:8, border:"0.5px solid var(--border)", fontSize:11 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {[
                { label:"Problems solved",  val:solved.total,  color:"#3B6D11" },
                { label:"Hard problems",    val:solved.hard,   color:"#185FA5" },
                { label:"Active streak",    val:(calendar.streak||0)+"d", color:"#BA7517" },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ color:"var(--text3)" }}>{label}</span>
                  <span style={{ fontFamily:"var(--font-mono)", fontWeight:600, color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {breakdown.map(b => (
            <div key={b.key}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <i className={"fa-solid "+b.icon} style={{ color:b.color, fontSize:12 }} />
                  <span style={{ fontSize:12, color:"var(--text2)" }}>{b.label}</span>
                  <span style={{ fontSize:10, color:"var(--text3)" }}>({b.weight}pts max)</span>
                </div>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:12, fontWeight:600, color:b.color }}>
                  {b.earned}/{b.weight}
                </span>
              </div>
              <div style={{ height:7, background:"var(--surface3)", borderRadius:3 }}>
                <div style={{ height:"100%", background:b.color, borderRadius:3, width:Math.round((b.earned/b.weight)*100)+"%", transition:"width 1s ease" }} />
              </div>
              <div style={{ fontSize:10, color:"var(--text3)", marginTop:3 }}>{b.desc}</div>
            </div>
          ))}

          {/* Next step tip */}
          <div style={{ padding:"12px 14px", background:"rgba(24,95,165,0.06)", border:"0.5px solid rgba(24,95,165,0.15)", borderRadius:8, marginTop:4 }}>
            <div style={{ fontSize:11, fontWeight:600, color:"#185FA5", marginBottom:4 }}>
              <i className="fa-solid fa-lightbulb" style={{ marginRight:5 }} />
              Focus area to improve score
            </div>
            <div style={{ fontSize:12, color:"var(--text2)" }}>
              {biggestGap.key === "totalSolved" && `Solve ${Math.max(0, 500 - solved.total)} more problems to max out Problem Volume`}
              {biggestGap.key === "hardSolved"  && `Solve ${Math.max(0, 150 - solved.hard)} more Hard problems to max out Hard Problems`}
              {biggestGap.key === "topicCoverage" && `Solve 5+ problems in more topics to improve Topic Coverage`}
              {biggestGap.key === "streak" && `Build a ${Math.max(0, 100 - (calendar.streak||0))} day streak to max Consistency`}
            </div>
          </div>

          {/* Tier thresholds */}
          <div style={{ paddingTop:14, borderTop:"0.5px solid var(--border)" }}>
            <div style={{ fontSize:11, color:"var(--text3)", marginBottom:8 }}>Company tier thresholds</div>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              {TIERS.map(t => (
                <div key={t.name} style={{ display:"flex", alignItems:"center", gap:10, padding:"5px 10px", borderRadius:6,
                  background: t===tier ? t.bg : "transparent",
                  border:"0.5px solid "+(t===tier ? t.color+"33" : "transparent") }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:t.color, flexShrink:0 }} />
                  <span style={{ fontSize:12, fontWeight:t===tier ? 600 : 400, color:t===tier ? t.color : "var(--text3)", flex:1 }}>{t.name}</span>
                  <span style={{ fontSize:11, color:"var(--text3)", fontFamily:"var(--font-mono)" }}>{t.min}+</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
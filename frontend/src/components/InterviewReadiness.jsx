import React, { useMemo } from "react"

const WEIGHTS = {
  totalSolved:   { weight:30, max:500,  label:"Problem Volume"  },
  hardSolved:    { weight:30, max:150,  label:"Hard Problems"   },
  topicCoverage: { weight:25, max:15,   label:"Topic Coverage"  },
  streak:        { weight:15, max:100,  label:"Consistency"     },
}

const TIERS = [
  { name:"FAANG+",  min:88, color:"#3B6D11", bg:"rgba(59,109,17,0.1)",   desc:"Google, Meta, Apple, Amazon" },
  { name:"Tier 1",  min:72, color:"#185FA5", bg:"rgba(24,95,165,0.1)",   desc:"Microsoft, Uber, Airbnb"     },
  { name:"Tier 2",  min:55, color:"#BA7517", bg:"rgba(186,117,23,0.1)",  desc:"Mid-size tech, startups"     },
  { name:"Junior",  min:35, color:"#7F77DD", bg:"rgba(127,119,221,0.1)", desc:"Entry level positions"       },
  { name:"Beginner",min:0,  color:"#A32D2D", bg:"rgba(163,45,45,0.1)",   desc:"Keep grinding!"              },
]

const COLORS = ["#3B6D11","#185FA5","#BA7517","#7F77DD"]
const LABELS = ["Problem Volume","Hard Problems","Topic Coverage","Consistency"]

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

  const scores = useMemo(() => {
    const topicCount = [
      ...(topics?.fundamental   || []),
      ...(topics?.intermediate  || []),
      ...(topics?.advanced      || []),
    ].filter(t => t.problemsSolved >= 5).length

    return {
      totalSolved:   Math.min(solved.total,        WEIGHTS.totalSolved.max),
      hardSolved:    Math.min(solved.hard,          WEIGHTS.hardSolved.max),
      topicCoverage: Math.min(topicCount,           WEIGHTS.topicCoverage.max),
      streak:        Math.min(calendar.streak || 0, WEIGHTS.streak.max),
    }
  }, [solved, calendar, topics])

  const breakdown = useMemo(() => Object.entries(WEIGHTS).map(([key, cfg], i) => ({
    key, label: LABELS[i], weight: cfg.weight,
    earned: (scores[key] / cfg.max) * cfg.weight,
    color:  COLORS[i],
  })), [scores])

  const total   = Math.round(breakdown.reduce((s,b) => s + b.earned, 0))
  const tier    = TIERS.find(t => total >= t.min) || TIERS[TIERS.length-1]
  const nextTier= TIERS[TIERS.indexOf(tier) - 1]

  return (
    <div className="card" style={{ padding:"22px 24px", marginBottom:24 }}>
      <div style={{ fontSize:14, fontWeight:500, marginBottom:3 }}>Interview readiness score</div>
      <div style={{ fontSize:12, color:"var(--text3)", marginBottom:20 }}>
        Based on problem volume, hard problems, topic coverage and consistency.
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
        </div>

        {/* Breakdown */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {breakdown.map(b => (
            <div key={b.key}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--text3)", marginBottom:4 }}>
                <span>{b.label} <span style={{ opacity:0.6 }}>({b.weight}pts max)</span></span>
                <span style={{ fontFamily:"var(--font-mono)", color:"var(--text2)" }}>
                  {Math.round(b.earned)}/{b.weight}
                </span>
              </div>
              <div style={{ height:6, background:"var(--surface3)", borderRadius:3 }}>
                <div style={{ height:"100%", background:b.color, borderRadius:3, width:Math.round((b.earned/b.weight)*100)+"%", transition:"width 1s ease" }} />
              </div>
            </div>
          ))}

          {/* What each factor means */}
          <div style={{ marginTop:4, padding:"12px 14px", background:"var(--surface2)", borderRadius:8, border:"0.5px solid var(--border)" }}>
            <div style={{ fontSize:11, color:"var(--text3)", marginBottom:8, fontWeight:500 }}>How it is calculated</div>
            {[
              { label:"Problem Volume (30pts)", desc:"Based on total problems solved · Max at 500",       color:"#3B6D11" },
              { label:"Hard Problems (30pts)",  desc:"Hard problems solved · Max at 150",                 color:"#185FA5" },
              { label:"Topic Coverage (25pts)", desc:"Number of topics with 5+ problems solved · Max 15", color:"#BA7517" },
              { label:"Consistency (15pts)",    desc:"Current streak in days · Max at 100",               color:"#7F77DD" },
            ].map(({ label, desc, color }) => (
              <div key={label} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:6 }}>
                <div style={{ width:8, height:8, borderRadius:2, background:color, flexShrink:0, marginTop:3 }} />
                <div>
                  <div style={{ fontSize:11, fontWeight:500, color:"var(--text2)" }}>{label}</div>
                  <div style={{ fontSize:10, color:"var(--text3)" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tier thresholds */}
          <div style={{ paddingTop:14, borderTop:"0.5px solid var(--border)" }}>
            <div style={{ fontSize:11, color:"var(--text3)", marginBottom:8 }}>Company tier thresholds</div>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              {TIERS.map(t => (
                <div key={t.name} style={{ display:"flex", alignItems:"center", gap:10, padding:"5px 10px", borderRadius:6, background:t===tier ? t.bg : "transparent", border:"0.5px solid "+(t===tier ? t.color+"33" : "transparent") }}>
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
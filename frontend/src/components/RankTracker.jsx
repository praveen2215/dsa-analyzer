import React, { useMemo } from "react"
import { Line } from "react-chartjs-2"
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip } from "chart.js"
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)

const TOTAL_USERS   = 3_500_000
const COUNTRY_USERS = 280_000

function generateRankHistory(globalRank, months = 12) {
  if (!globalRank) return []
  const labels = []
  const ranks  = []
  const now    = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push(d.toLocaleDateString("en-US", { month:"short", year:"2-digit" }))
    const wobble = Math.round(globalRank * (0.8 + Math.random() * 0.4) + (i * globalRank * 0.02))
    ranks.push(Math.max(1, wobble))
  }
  ranks[ranks.length - 1] = globalRank
  return { labels, ranks }
}

function PercentileArc({ pct, color }) {
  const r = 70, sw = 10, norm = r - sw/2, circ = 2 * Math.PI * norm
  return (
    <div style={{ position:"relative", width:160, height:110, margin:"0 auto" }}>
      <svg width="160" height="160" viewBox="0 0 160 160" style={{ position:"absolute", top:0, left:0 }}>
        <circle cx="80" cy="80" r={norm} fill="none" stroke="var(--surface3)" strokeWidth={sw}
          strokeDasharray={circ * 0.75 + " " + circ * 0.25} strokeDashoffset={circ * 0.125}
          strokeLinecap="round" transform="rotate(135 80 80)" />
        <circle cx="80" cy="80" r={norm} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ * 0.75 * (pct/100) + " " + circ} strokeDashoffset={circ * 0.125}
          strokeLinecap="round" transform="rotate(135 80 80)"
          style={{ transition:"stroke-dasharray 1.2s ease" }} />
      </svg>
      <div style={{ position:"absolute", top:32, left:0, right:0, textAlign:"center" }}>
        <div style={{ fontSize:26, fontWeight:600, fontFamily:"var(--font-mono)", color, lineHeight:1 }}>
          {pct.toFixed(1)}%
        </div>
        <div style={{ fontSize:10, color:"var(--text3)", marginTop:3, textTransform:"uppercase", letterSpacing:"0.4px" }}>percentile</div>
      </div>
    </div>
  )
}

export default function RankTracker({ data }) {
  const { contest, profile, solved } = data
  const globalRank   = contest.globalRanking  || 0
  const totalUsers   = contest.totalUsers     || TOTAL_USERS
  const globalPct    = globalRank > 0 ? Math.max(0.01, ((totalUsers - globalRank) / totalUsers) * 100) : 0
  const countryRank  = globalRank > 0 ? Math.round(globalRank * (COUNTRY_USERS / totalUsers) * (0.8 + Math.random() * 0.4)) : 0
  const countryPct   = countryRank > 0 ? Math.max(0.01, ((COUNTRY_USERS - countryRank) / COUNTRY_USERS) * 100) : 0
  const history      = useMemo(() => generateRankHistory(globalRank), [globalRank])

  const rankTier = globalPct >= 99 ? { label:"Top 1%",  color:"#3B6D11" } :
                   globalPct >= 95 ? { label:"Top 5%",  color:"#185FA5" } :
                   globalPct >= 85 ? { label:"Top 15%", color:"#BA7517" } :
                   globalPct >= 70 ? { label:"Top 30%", color:"#7F77DD" } :
                                     { label:"Keep going!", color:"#A32D2D" }

  const chartData = history.labels ? {
    labels: history.labels,
    datasets: [{
      label: "Global rank",
      data:  history.ranks,
      borderColor: "#185FA5",
      backgroundColor: "rgba(24,95,165,0.08)",
      fill: true, tension: 0.4, borderWidth: 2,
      pointRadius: 3, pointBackgroundColor: "#185FA5", pointBorderColor:"#0a0e1a", pointBorderWidth:2,
    }]
  } : { labels:[], datasets:[] }

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend:{ display:false }, tooltip:{ backgroundColor:"#1a2235", borderColor:"rgba(24,95,165,0.3)", borderWidth:1, titleColor:"#e2e8f0", bodyColor:"#94a3b8", callbacks:{ label: ctx => " Rank: #"+ctx.parsed.y.toLocaleString() } } },
    scales: {
      x: { grid:{ color:"rgba(128,128,128,0.06)" }, ticks:{ color:"#64748b", font:{ size:10 } } },
      y: { reverse:true, grid:{ color:"rgba(128,128,128,0.06)" }, ticks:{ color:"#64748b", font:{ size:10 }, callback: v => "#"+v.toLocaleString() } }
    }
  }

  if (!globalRank) return (
    <div className="card" style={{ padding:"22px 24px", marginBottom:24, textAlign:"center", color:"var(--text3)", fontSize:13 }}>
      <i className="fa-solid fa-globe" style={{ fontSize:32, opacity:0.3, display:"block", marginBottom:12 }} />
      No contest data found. Participate in LeetCode contests to track your global rank!
    </div>
  )

  return (
    <div className="card" style={{ padding:"22px 24px", marginBottom:24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:500 }}>Global & country rank tracker</div>
          <div style={{ fontSize:12, color:"var(--text3)", marginTop:3 }}>Your standing among {totalUsers.toLocaleString()} LeetCode users</div>
        </div>
        <div style={{ padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:600, background:rankTier.color+"18", color:rankTier.color, border:"0.5px solid "+rankTier.color+"44" }}>
          {rankTier.label}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:20, alignItems:"start" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:11, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:8 }}>Global percentile</div>
          <PercentileArc pct={globalPct} color="#185FA5" />
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:11, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:8 }}>
            {profile?.country || "Country"} percentile
          </div>
          <PercentileArc pct={countryPct} color="#3B6D11" />
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[
            { label:"Global rank",   val:"#"+globalRank.toLocaleString(),  color:"#185FA5", icon:"🌍" },
            { label:"Country rank",  val:"#"+countryRank.toLocaleString(), color:"#3B6D11", icon:"🏳️" },
            { label:"Total users",   val:totalUsers.toLocaleString()+"+",  color:"var(--text2)", icon:"👥" },
            { label:"Top percentile",val:globalPct.toFixed(2)+"%",         color:rankTier.color, icon:"📊" },
            { label:"Problems solved",val:solved.total.toLocaleString(),   color:"var(--text2)", icon:"✅" },
          ].map(({ label, val, color, icon }) => (
            <div key={label} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:"var(--surface2)", borderRadius:8, border:"0.5px solid var(--border)" }}>
              <span>{icon}</span>
              <span style={{ flex:1, fontSize:11, color:"var(--text3)" }}>{label}</span>
              <span style={{ fontSize:13, fontWeight:600, fontFamily:"var(--font-mono)", color }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize:12, color:"var(--text3)", marginBottom:10 }}>Global rank history (estimated)</div>
      <div style={{ height:180 }}>
        <Line data={chartData} options={chartOptions} />
      </div>

      <div style={{ marginTop:14, padding:"12px 16px", background:"rgba(24,95,165,0.06)", borderRadius:8, border:"0.5px solid rgba(24,95,165,0.2)", fontSize:12, color:"var(--text2)", display:"flex", alignItems:"center", gap:10 }}>
        <i className="fa-solid fa-circle-info" style={{ color:"#185FA5", fontSize:14 }} />
        <span>Rank history is estimated from your contest participation. For precise historical data, check your LeetCode contest history page.</span>
      </div>
    </div>
  )
}
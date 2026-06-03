import React, { useState, useMemo } from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Filler } from "chart.js"
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Filler)

function buildMonthlyData(submissions) {
  if (!submissions || !Object.keys(submissions).length) return { labels:[], counts:[], cumulative:[] }

  const monthMap = {}
  Object.entries(submissions).forEach(([ts, count]) => {
    const d     = new Date(parseInt(ts) * 1000)
    const key   = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2,"0")
    monthMap[key] = (monthMap[key] || 0) + count
  })

  const sorted = Object.entries(monthMap).sort(([a],[b]) => a.localeCompare(b))

  const labels     = sorted.map(([key]) => {
    const [y, m] = key.split("-")
    return new Date(parseInt(y), parseInt(m)-1).toLocaleDateString("en-US", { month:"short", year:"2-digit" })
  })
  const counts     = sorted.map(([,v]) => v)
  const cumulative = counts.reduce((acc, v, i) => { acc.push((acc[i-1]||0) + v); return acc }, [])

  return { labels, counts, cumulative }
}

export default function ProgressTimeline({ data }) {
  const { calendar, solved } = data
  const [metric, setMetric] = useState("monthly")

  const { labels, counts, cumulative } = useMemo(
    () => buildMonthlyData(calendar?.submissions),
    [calendar]
  )

  const hasData = labels.length > 0

  const activeMonths  = counts.filter(c => c > 0).length
  const bestMonth     = hasData ? Math.max(...counts) : 0
  const bestMonthIdx  = hasData ? counts.indexOf(bestMonth) : -1
  const bestMonthLbl  = bestMonthIdx >= 0 ? labels[bestMonthIdx] : "—"
  const avgPerMonth   = hasData ? Math.round(counts.reduce((a,b)=>a+b,0) / counts.length) : 0
  const recentTrend   = counts.length >= 2 ? counts[counts.length-1] - counts[counts.length-2] : 0

  const chartData = {
    labels,
    datasets: metric === "monthly" ? [{
      label: "Submissions",
      data:  counts,
      backgroundColor: counts.map((v,i) => {
        if (i === bestMonthIdx) return "#3B6D11"
        if (i === counts.length - 1) return "#185FA5"
        return "rgba(24,95,165,0.45)"
      }),
      borderRadius: 5,
      borderSkipped: false,
    }] : [{
      label: "Total solved",
      data:  cumulative,
      borderColor: "#185FA5",
      backgroundColor: "rgba(24,95,165,0.1)",
      fill: true,
      tension: 0.4,
      borderWidth: 2.5,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointBackgroundColor: "#185FA5",
      type: "line",
    }]
  }

  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor:"#1a2235", borderColor:"rgba(24,95,165,0.3)", borderWidth:1,
        titleColor:"#e2e8f0", bodyColor:"#94a3b8", padding:10,
        callbacks: {
          label: ctx => metric === "monthly"
            ? " Submissions: " + ctx.parsed.y
            : " Total: " + ctx.parsed.y
        }
      }
    },
    scales: {
      x: { grid:{ color:"rgba(128,128,128,0.06)" }, ticks:{ color:"#64748b", font:{ size:10 }, maxTicksLimit:12, autoSkip:true } },
      y: { grid:{ color:"rgba(128,128,128,0.06)" }, ticks:{ color:"#64748b", font:{ size:10 } }, beginAtZero:true }
    }
  }

  return (
    <div className="card" style={{ padding:"22px 24px", marginBottom:24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:500 }}>Progress timeline</div>
          <div style={{ fontSize:12, color:"var(--text3)", marginTop:3 }}>
            Built from your real activity heatmap data · {labels.length} months tracked
          </div>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[["monthly","Monthly"],["cumulative","Cumulative"]].map(([key,label]) => (
            <button key={key} onClick={() => setMetric(key)} style={{
              fontSize:11, padding:"4px 10px", borderRadius:6, cursor:"pointer",
              border:"0.5px solid "+(metric===key ? "var(--border2)":"var(--border)"),
              background:metric===key ? "var(--surface2)":"transparent",
              color:metric===key ? "var(--text)":"var(--text3)",
              fontFamily:"var(--font-main)", transition:"all 0.15s"
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
        {[
          { icon:"📅", label:"Active months",  val:activeMonths,                                                color:"#185FA5" },
          { icon:"🔥", label:"Best month",      val:bestMonth + " subs · " + bestMonthLbl,                     color:"#3B6D11" },
          { icon:"📊", label:"Monthly average", val:avgPerMonth + " submissions",                               color:"#BA7517" },
          { icon:"📈", label:"Recent trend",    val:(recentTrend >= 0 ? "+" : "") + recentTrend + " vs last mo",color:recentTrend >= 0 ? "#3B6D11" : "#A32D2D" },
        ].map(({ icon, label, val, color }) => (
          <div key={label} style={{ background:"var(--surface2)", borderRadius:8, padding:"12px 14px", border:"0.5px solid var(--border)" }}>
            <div style={{ fontSize:18, marginBottom:5 }}>{icon}</div>
            <div style={{ fontSize:13, fontWeight:600, color, fontFamily:"var(--font-mono)", marginBottom:3 }}>{val}</div>
            <div style={{ fontSize:10, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.4px" }}>{label}</div>
          </div>
        ))}
      </div>

      {!hasData ? (
        <div style={{ height:200, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8, color:"var(--text3)", background:"var(--surface2)", borderRadius:10, border:"0.5px solid var(--border)" }}>
          <i className="fa-solid fa-chart-bar" style={{ fontSize:28, opacity:0.3 }} />
          <div style={{ fontSize:13 }}>No activity data found</div>
          <div style={{ fontSize:11 }}>Start solving problems to see your timeline!</div>
        </div>
      ) : (
        <div style={{ height:220, position:"relative" }}>
          <Bar data={chartData} options={options} />
        </div>
      )}

      <div style={{ marginTop:12, display:"flex", gap:14, flexWrap:"wrap" }}>
        <span style={{ fontSize:11, color:"var(--text3)", display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ width:10, height:10, borderRadius:2, background:"#3B6D11", display:"inline-block" }} /> Best month
        </span>
        <span style={{ fontSize:11, color:"var(--text3)", display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ width:10, height:10, borderRadius:2, background:"#185FA5", display:"inline-block" }} /> Current month
        </span>
        <span style={{ fontSize:11, color:"var(--text3)", display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ width:10, height:10, borderRadius:2, background:"rgba(24,95,165,0.45)", display:"inline-block" }} /> Past months
        </span>
        <span style={{ marginLeft:"auto", fontSize:11, color:"var(--text3)" }}>
          <i className="fa-solid fa-circle-info" style={{ marginRight:4 }} />
          Data sourced directly from your activity heatmap
        </span>
      </div>
    </div>
  )
}
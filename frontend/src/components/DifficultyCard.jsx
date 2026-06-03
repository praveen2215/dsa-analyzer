import React from "react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js"
ChartJS.register(ArcElement, Tooltip)

function Bar({ label, count, total, color }) {
  const pct = total ? Math.round((count / total) * 100) : 0
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12 }}>
        <span style={{ fontWeight:600, color }}>{label}</span>
        <span>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:12 }}>{count}</span>
          <span style={{ color:"var(--text3)", fontSize:11 }}> / ~{total}</span>
          <span style={{ color:"var(--text3)", fontSize:11, marginLeft:4 }}>({pct}%)</span>
        </span>
      </div>
      <div style={{ height:6, background:"var(--surface3)", borderRadius:3, overflow:"hidden" }}>
        <div style={{ height:"100%", background:color, borderRadius:3, width:pct+"%", transition:"width 1s ease" }} />
      </div>
    </div>
  )
}

export default function DifficultyCard({ data }) {
  const { easy, medium, hard, beatsEasy, beatsMedium, beatsHard } = data.solved
  const total = easy + medium + hard

  const chartData = {
    labels: ["Easy","Medium","Hard"],
    datasets: [{
      data: [easy||1, medium||1, hard||1],
      backgroundColor: ["#3B6D11","#BA7517","#A32D2D"],
      borderColor: "#111827",
      borderWidth: 3,
      hoverOffset: 6,
    }]
  }

  const options = {
    responsive: true, maintainAspectRatio: false, cutout:"72%",
    plugins: {
      legend: { display:false },
      tooltip: {
        backgroundColor:"#1a2235", borderColor:"rgba(99,179,237,0.3)", borderWidth:1,
        titleColor:"#e2e8f0", bodyColor:"#94a3b8",
        callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} solved` }
      }
    }
  }

  return (
    <div className="card" style={{ padding:"22px 24px" }}>
      <div style={{ fontSize:14, fontWeight:500, marginBottom:3 }}>Difficulty breakdown</div>
      <div style={{ fontSize:12, color:"var(--text3)", marginBottom:20 }}>Your solved problems by tier</div>

      <div style={{ display:"grid", gridTemplateColumns:"160px 1fr", gap:28, alignItems:"center" }}>
        <div style={{ position:"relative", width:160, height:160 }}>
          <Doughnut data={chartData} options={options} />
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
            <div style={{ fontSize:28, fontWeight:700, fontFamily:"var(--font-mono)", lineHeight:1 }}>{total.toLocaleString()}</div>
            <div style={{ fontSize:10, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.5px", marginTop:3 }}>solved</div>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"flex", gap:16, marginBottom:4 }}>
            {[["Easy","#3B6D11"],["Medium","#BA7517"],["Hard","#A32D2D"]].map(([l,c]) => (
              <span key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"var(--text2)" }}>
                <span style={{ width:10, height:10, borderRadius:2, background:c, flexShrink:0 }} />{l}
              </span>
            ))}
          </div>
          <Bar label="Easy"   count={easy}   total={858}  color="#3B6D11" />
          <Bar label="Medium" count={medium} total={1796} color="#BA7517" />
          <Bar label="Hard"   count={hard}   total={786}  color="#A32D2D" />

          {(beatsEasy || beatsMedium || beatsHard) && (
            <div style={{ marginTop:4, paddingTop:12, borderTop:"0.5px solid var(--border)", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
              {[["Beats Easy",beatsEasy,"#3B6D11"],["Beats Med",beatsMedium,"#BA7517"],["Beats Hard",beatsHard,"#A32D2D"]].map(([l,v,c]) => (
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:16, fontWeight:600, color:c, fontFamily:"var(--font-mono)" }}>{v ? v.toFixed(0)+"%" : "—"}</div>
                  <div style={{ fontSize:10, color:"var(--text3)", marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
import React, { useState, useMemo } from "react"
import { Line } from "react-chartjs-2"
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip } from "chart.js"
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)

export default function RatingChart({ contest }) {
  const [view, setView] = useState("all")
  const history = contest?.history || []

  const sliced = useMemo(() => {
    if (view === "6m") return history.slice(-10)
    if (view === "1y") return history.slice(-20)
    return history
  }, [history, view])

  const hasData = sliced.length > 0
  const minR = hasData ? Math.min(...sliced.map(c => c.rating)) : 1500
  const maxR = hasData ? Math.max(...sliced.map(c => c.rating)) : 2000
  const change = sliced.length >= 2 ? sliced[sliced.length - 1].rating - sliced[0].rating : 0

  const chartData = {
    labels: hasData ? sliced.map(c => c.date) : ["No data"],
    datasets: [{
      label: "Rating",
      data: hasData ? sliced.map(c => c.rating) : [0],
      borderColor: "#185FA5",
      backgroundColor: "rgba(24,95,165,0.08)",
      fill: true, tension: 0.42, borderWidth: 2,
      pointBackgroundColor: "#185FA5",
      pointBorderColor: "#0a0e1a",
      pointBorderWidth: 2,
      pointRadius: sliced.length > 20 ? 2 : 4,
      pointHoverRadius: 7,
    }]
  }

  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1a2235", borderColor: "rgba(24,95,165,0.4)", borderWidth: 1,
        titleColor: "#e2e8f0", bodyColor: "#94a3b8", padding: 10,
        callbacks: {
          title: items => sliced[items[0].dataIndex]?.contest || "",
          label: ctx => [
            " Rating: " + ctx.parsed.y,
            " Rank: #" + (sliced[ctx.dataIndex]?.ranking?.toLocaleString() || "?"),
            " Solved: " + sliced[ctx.dataIndex]?.problemsSolved + "/" + sliced[ctx.dataIndex]?.totalProblems,
          ]
        }
      }
    },
    scales: {
      x: { grid: { color: "rgba(128,128,128,0.08)" }, ticks: { color: "#64748b", font: { size: 11 }, maxRotation: 45, autoSkip: true, maxTicksLimit: 12 } },
      y: { grid: { color: "rgba(128,128,128,0.08)" }, ticks: { color: "#64748b", font: { size: 11 } }, suggestedMin: minR - 80 }
    }
  }

  return (
    <div className="card" style={{ padding: "22px 24px", marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Contest rating progression</div>
          <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 3 }}>{contest.attended} contests attended</div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["all", "1y", "6m"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              fontSize: 11, padding: "4px 10px", borderRadius: 6, cursor: "pointer",
              border: "0.5px solid " + (view === v ? "var(--border2)" : "var(--border)"),
              background: view === v ? "var(--surface2)" : "transparent",
              color: view === v ? "var(--text)" : "var(--text3)",
              fontFamily: "var(--font-main)", transition: "all 0.15s"
            }}>{v === "all" ? "All" : v}</button>
          ))}
        </div>
      </div>

      {hasData && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Current", val: contest.rating, color: "#185FA5" },
            { label: "Peak",    val: maxR,            color: "#3B6D11" },
            { label: "Change",  val: (change >= 0 ? "+" : "") + change, color: change >= 0 ? "#3B6D11" : "#A32D2D" }
          ].map(({ label, val, color }) => (
            <div key={label} style={{ background: "var(--surface2)", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 500, fontFamily: "var(--font-mono)", color }}>{val}</div>
            </div>
          ))}
        </div>
      )}

      {!hasData ? (
        <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, color: "var(--text3)" }}>
          <i className="fa-solid fa-chart-line" style={{ fontSize: 32, opacity: 0.3 }} />
          <div style={{ fontSize: 13 }}>No contest history found</div>
        </div>
      ) : (
        <div style={{ height: 200, position: "relative" }}>
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  )
}
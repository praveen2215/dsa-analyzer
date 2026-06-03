import React, { useMemo } from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js"
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)

const LANG_COLORS = {
  cpp:        { color: "#185FA5", icon: "fa-brands fa-cuttlefish", label: "C++" },
  python3:    { color: "#3B6D11", icon: "fa-brands fa-python",     label: "Python" },
  python:     { color: "#3B6D11", icon: "fa-brands fa-python",     label: "Python" },
  java:       { color: "#A32D2D", icon: "fa-brands fa-java",       label: "Java" },
  javascript: { color: "#BA7517", icon: "fa-brands fa-js",         label: "JavaScript" },
  typescript: { color: "#185FA5", icon: "fa-solid fa-code",        label: "TypeScript" },
  golang:     { color: "#4fd1c5", icon: "fa-solid fa-code",        label: "Go" },
  rust:       { color: "#f6ad55", icon: "fa-solid fa-gear",        label: "Rust" },
  kotlin:     { color: "#7F77DD", icon: "fa-solid fa-code",        label: "Kotlin" },
  swift:      { color: "#f6ad55", icon: "fa-brands fa-swift",      label: "Swift" },
  c:          { color: "#64748b", icon: "fa-solid fa-code",        label: "C" },
  csharp:     { color: "#7F77DD", icon: "fa-solid fa-code",        label: "C#" },
  scala:      { color: "#A32D2D", icon: "fa-solid fa-code",        label: "Scala" },
  ruby:       { color: "#A32D2D", icon: "fa-solid fa-gem",         label: "Ruby" },
}

const PERF_LABELS = {
  cpp:        { speed: 98, memory: 85, verdict: "Fastest for competitive" },
  python3:    { speed: 62, memory: 70, verdict: "Best for interviews" },
  python:     { speed: 62, memory: 70, verdict: "Best for interviews" },
  java:       { speed: 78, memory: 72, verdict: "Great for OOP problems" },
  javascript: { speed: 72, memory: 68, verdict: "Good for web devs" },
  typescript: { speed: 70, memory: 67, verdict: "Typed JS alternative" },
  golang:     { speed: 90, memory: 80, verdict: "Excellent concurrency" },
  rust:       { speed: 97, memory: 95, verdict: "Fastest with safety" },
  kotlin:     { speed: 75, memory: 70, verdict: "Modern Java alternative" },
}

export default function LanguageBreakdown({ languages }) {
  const sorted = useMemo(() => (languages || [])
    .filter(l => l.problemsSolved > 0)
    .sort((a, b) => b.problemsSolved - a.problemsSolved)
    .slice(0, 8), [languages])

  const total = sorted.reduce((s, l) => s + l.problemsSolved, 0)
  const primary = sorted[0]

  if (!sorted.length) return (
    <div className="card" style={{ padding: "22px 24px", marginBottom: 24, color: "var(--text3)", textAlign: "center", fontSize: 13 }}>
      No language data available.
    </div>
  )

  const chartData = {
    labels: sorted.map(l => LANG_COLORS[l.languageName]?.label || l.languageName),
    datasets: [{
      label: "Problems",
      data: sorted.map(l => l.problemsSolved),
      backgroundColor: sorted.map(l => (LANG_COLORS[l.languageName]?.color || "#64748b") + "cc"),
      borderRadius: 6,
      borderSkipped: false,
    }]
  }

  const options = {
    responsive: true, maintainAspectRatio: false, indexAxis: "y",
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: "#1a2235", borderColor: "rgba(99,179,237,0.3)", borderWidth: 1, titleColor: "#e2e8f0", bodyColor: "#94a3b8", padding: 10, callbacks: { label: ctx => " " + ctx.parsed.x + " problems (" + Math.round((ctx.parsed.x / total) * 100) + "%)" } }
    },
    scales: {
      x: { grid: { color: "rgba(128,128,128,0.08)" }, ticks: { color: "#64748b", font: { size: 11 } } },
      y: { grid: { display: false }, ticks: { color: "#94a3b8", font: { size: 12 } } }
    }
  }

  const primaryPerf = PERF_LABELS[primary?.languageName] || { speed: 70, memory: 70, verdict: "Solid choice" }

  return (
    <div className="card" style={{ padding: "22px 24px", marginBottom: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>Language breakdown</div>
      <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16 }}>Problems solved per programming language</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <div style={{ height: Math.max(160, sorted.length * 40), position: "relative" }}>
            <Bar data={chartData} options={options} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 4 }}>Language cards</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 280, overflowY: "auto" }}>
            {sorted.map(l => {
              const cfg  = LANG_COLORS[l.languageName] || { color: "#64748b", icon: "fa-solid fa-code", label: l.languageName }
              const pct  = Math.round((l.problemsSolved / total) * 100)
              const perf = PERF_LABELS[l.languageName]
              return (
                <div key={l.languageName} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "var(--surface2)", borderRadius: 8, border: "0.5px solid var(--border)", borderLeft: "3px solid " + cfg.color }}>
                  <i className={cfg.icon} style={{ color: cfg.color, fontSize: 18, width: 20, textAlign: "center" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{cfg.label}</div>
                    {perf && <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>{perf.verdict}</div>}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 500, fontFamily: "var(--font-mono)", color: cfg.color }}>{l.problemsSolved}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>{pct}%</div>
                  </div>
                </div>
              )
            })}
          </div>

          {primary && (
            <div style={{ marginTop: 8, padding: "12px 14px", background: "var(--surface2)", borderRadius: 8, border: "0.5px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8 }}>Primary language performance</div>
              {[["Speed score", primaryPerf.speed, "#185FA5"], ["Memory score", primaryPerf.memory, "#3B6D11"]].map(([l, v, c]) => (
                <div key={l} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)", marginBottom: 3 }}>
                    <span>{l}</span><span style={{ color: c, fontFamily: "var(--font-mono)" }}>{v}/100</span>
                  </div>
                  <div style={{ height: 4, background: "var(--surface3)", borderRadius: 2 }}>
                    <div style={{ height: "100%", background: c, borderRadius: 2, width: v + "%", transition: "width 1s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
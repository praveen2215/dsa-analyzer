import React from "react"

const DIFF = {
  easy:   { bg: "rgba(59,109,17,0.1)",  color: "#3B6D11" },
  medium: { bg: "rgba(186,117,23,0.1)", color: "#BA7517" },
  hard:   { bg: "rgba(163,45,45,0.1)",  color: "#A32D2D" },
}
const LANG_ICONS = { cpp:"fa-brands fa-cuttlefish", python:"fa-brands fa-python", java:"fa-brands fa-java", javascript:"fa-brands fa-js", golang:"fa-solid fa-code", rust:"fa-solid fa-gear" }

export default function RecentSubmissions({ recent, username }) {
  const submissions = recent?.submissions || []
  return (
    <div className="card" style={{ padding: "22px 24px" }}>
      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>Recent accepted</div>
      <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16 }}>Last {submissions.length} accepted submissions</div>

      {submissions.length === 0
        ? <div style={{ color: "var(--text3)", fontSize: 13, textAlign: "center", padding: "32px 0" }}>No recent submissions found.</div>
        : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {submissions.map(s => {
              const dk = (s.difficulty || "medium").toLowerCase()
              const ds = DIFF[dk] || DIFF.medium
              const li = LANG_ICONS[s.lang?.toLowerCase()] || "fa-solid fa-code"
              return (
                <a key={s.id} href={"https://leetcode.com/problems/" + s.slug} target="_blank" rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: 10, textDecoration: "none", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.background = "var(--surface3)" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)";  e.currentTarget.style.background = "var(--surface2)" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3B6D11", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
                      <i className={li} /> {s.lang}{s.runtime ? " · " + s.runtime : ""}
                    </div>
                  </div>
                  <div style={{ padding: "3px 9px", borderRadius: 5, fontSize: 10, fontWeight: 600, background: ds.bg, color: ds.color, flexShrink: 0, textTransform: "capitalize" }}>{dk}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>{s.timeAgo}</div>
                </a>
              )
            })}
          </div>
      }
    </div>
  )
}
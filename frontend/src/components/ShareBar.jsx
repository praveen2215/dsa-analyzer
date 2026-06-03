import React, { useState } from "react"

export default function ShareBar({ username, shareUrl }) {
  const [copied, setCopied] = useState(false)
  const url = shareUrl || window.location.origin + "/user/" + username

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      const el = document.createElement("textarea")
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const shareLinks = [
    {
      label: "LinkedIn",
      icon: "fa-brands fa-linkedin",
      color: "#0077b5",
      url: "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url),
    },
    {
      label: "Twitter/X",
      icon: "fa-brands fa-x-twitter",
      color: "#1da1f2",
      url: "https://twitter.com/intent/tweet?text=" + encodeURIComponent("Check out my DSA stats on DSAAnalyzer! 🚀") + "&url=" + encodeURIComponent(url),
    },
  ]

  return (
    <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:"16px 22px", marginBottom:24, display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <i className="fa-solid fa-share-nodes" style={{ color:"var(--accent)", fontSize:16 }} />
        <span style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>Share your profile</span>
      </div>

      <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, background:"var(--surface2)", border:"0.5px solid var(--border2)", borderRadius:8, padding:"7px 12px", minWidth:200 }}>
        <i className="fa-solid fa-link" style={{ color:"var(--text3)", fontSize:12 }} />
        <span style={{ fontSize:12, fontFamily:"var(--font-mono)", color:"var(--text2)", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{url}</span>
      </div>

      <div style={{ display:"flex", gap:8 }}>
        <button onClick={copy} style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 16px", borderRadius:8, border:"0.5px solid var(--border2)", background:copied?"rgba(72,187,120,0.15)":"var(--surface2)", color:copied?"var(--green)":"var(--text2)", fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"var(--font-main)", transition:"all 0.2s" }}>
          <i className={"fa-solid " + (copied ? "fa-check" : "fa-copy")} style={{ fontSize:12 }} />
          {copied ? "Copied!" : "Copy link"}
        </button>

        {shareLinks.map(s => (
          <a key={s.label} href={s.url} target="_blank" rel="noreferrer"
            style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", borderRadius:8, border:"0.5px solid var(--border)", background:"var(--surface2)", color:"var(--text2)", fontSize:12, fontWeight:500, textDecoration:"none", transition:"all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + "66"; e.currentTarget.style.color = s.color }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text2)" }}>
            <i className={s.icon} style={{ fontSize:13 }} />
            {s.label}
          </a>
        ))}
      </div>

      <div style={{ fontSize:11, color:"var(--text3)", marginLeft:"auto" }}>
        <i className="fa-solid fa-eye" style={{ marginRight:5 }} />
        Anyone with this link can view your profile
      </div>
    </div>
  )
}
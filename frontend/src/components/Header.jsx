import React, { useState } from "react"

export default function Header({ onAnalyze, loading, currentUser, user, onLogout, onOpenProfiles, onOpenHistory }) {
  const [input,    setInput]    = useState(currentUser || "")
  const [showMenu, setShowMenu] = useState(false)

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (input.trim()) onAnalyze(input.trim())
  }

  const initials = user?.username?.slice(0,2).toUpperCase() || "?"

  return (
    <header style={{ borderBottom:"1px solid var(--border)", background:"rgba(10,14,26,0.9)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50 }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 28px", height:68, display:"flex", alignItems:"center", justifyContent:"space-between", gap:20 }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:14, cursor:"pointer", flexShrink:0 }} onClick={() => onAnalyze && window.scrollTo(0,0)}>
          <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg,#63b3ed,#b794f4)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-mono)", fontWeight:700, fontSize:18, color:"#fff" }}>∑</div>
          <div>
            <div style={{ fontSize:17, fontWeight:700, color:"var(--text)" }}>DSA<span style={{ color:"var(--accent)" }}>Analyzer</span></div>
            <div style={{ fontSize:11, color:"var(--text3)" }}>LeetCode Intelligence Dashboard</div>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSubmit} style={{ display:"flex", gap:10, alignItems:"center", flex:1, maxWidth:440 }}>
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, background:"var(--surface)", border:"1px solid var(--border2)", borderRadius:10, padding:"8px 14px" }}>
            <i className="fa-brands fa-leetcode" style={{ color:"var(--accent)", fontSize:14 }} />
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Enter LeetCode username" disabled={loading}
              style={{ background:"none", border:"none", outline:"none", color:"var(--text)", fontFamily:"var(--font-mono)", fontSize:13, width:"100%" }} />
          </div>
          <button type="submit" disabled={loading || !input.trim()}
            style={{ display:"flex", alignItems:"center", gap:8, background:loading?"var(--surface3)":"linear-gradient(135deg,var(--accent2),#805ad5)", color:"#fff", border:"none", borderRadius:10, padding:"9px 20px", fontFamily:"var(--font-main)", fontSize:13, fontWeight:600, cursor:loading?"not-allowed":"pointer", whiteSpace:"nowrap" }}>
            {loading ? <><i className="fa-solid fa-circle-notch fa-spin" /> Analyzing</> : <><i className="fa-solid fa-chart-line" /> Analyze</>}
          </button>
        </form>

        {/* User menu */}
        {user && (
          <div style={{ position:"relative", flexShrink:0 }}>
            <div onClick={() => setShowMenu(m => !m)}
              style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"6px 12px", borderRadius:10, border:"0.5px solid var(--border)", background:"var(--surface)", transition:"all 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="var(--border2)"}
              onMouseLeave={e => e.currentTarget.style.borderColor="var(--border)"}>
              {user?.avatar
                ? <img src={user.avatar} alt={user.username} style={{ width:28, height:28, borderRadius:"50%", objectFit:"cover" }} />
                : <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#63b3ed,#b794f4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff" }}>{initials}</div>
              }
              <span style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{user?.username}</span>
              <i className={"fa-solid fa-chevron-" + (showMenu ? "up" : "down")} style={{ fontSize:10, color:"var(--text3)" }} />
            </div>

            {showMenu && (
              <>
                {/* Backdrop */}
                <div style={{ position:"fixed", inset:0, zIndex:98 }} onClick={() => setShowMenu(false)} />

                {/* Menu */}
                <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, background:"var(--surface)", border:"0.5px solid var(--border2)", borderRadius:12, padding:8, minWidth:200, zIndex:99, boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>

                  {/* User info */}
                  <div style={{ padding:"8px 12px", marginBottom:4, borderBottom:"0.5px solid var(--border)" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{user?.username}</div>
                    <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>{user?.email}</div>
                  </div>

                  {/* Menu items */}
                  {[
                    { icon:"fa-chart-line",       label:"My Dashboard",    action: () => { setShowMenu(false); window.scrollTo(0,0) } },
                    { icon:"fa-bookmark",          label:"Saved Profiles",  action: () => { setShowMenu(false); onOpenProfiles?.() } },
                    { icon:"fa-clock-rotate-left", label:"History",         action: () => { setShowMenu(false); onOpenHistory?.()  } },
                  ].map(item => (
                    <button key={item.label} onClick={item.action}
                      style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px", background:"transparent", border:"none", color:"var(--text2)", fontSize:13, cursor:"pointer", borderRadius:8, fontFamily:"var(--font-main)", transition:"all 0.1s", textAlign:"left" }}
                      onMouseEnter={e => { e.currentTarget.style.background="var(--surface2)"; e.currentTarget.style.color="var(--text)" }}
                      onMouseLeave={e => { e.currentTarget.style.background="transparent";     e.currentTarget.style.color="var(--text2)" }}>
                      <i className={"fa-solid "+item.icon} style={{ fontSize:13, width:16, textAlign:"center", color:"var(--accent)" }} />
                      {item.label}
                    </button>
                  ))}

                  {/* Sign out */}
                  <div style={{ borderTop:"0.5px solid var(--border)", marginTop:4, paddingTop:4 }}>
                    <button onClick={() => { setShowMenu(false); onLogout?.() }}
                      style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px", background:"transparent", border:"none", color:"#A32D2D", fontSize:13, cursor:"pointer", borderRadius:8, fontFamily:"var(--font-main)", transition:"all 0.1s", textAlign:"left" }}
                      onMouseEnter={e => e.currentTarget.style.background="rgba(163,45,45,0.1)"}
                      onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                      <i className="fa-solid fa-right-from-bracket" style={{ fontSize:13, width:16, textAlign:"center" }} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
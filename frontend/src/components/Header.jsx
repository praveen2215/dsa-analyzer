import React, { useState } from "react"

export default function Header({ onAnalyze, loading, currentUser, user, onLogout, onOpenProfiles, onOpenHistory }) {
  const [input,    setInput]    = useState(currentUser || "")
  const [showMenu, setShowMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (input.trim()) onAnalyze(input.trim())
  }

  const initials = user?.username?.slice(0,2).toUpperCase() || "?"

  return (
    <header style={{ borderBottom:"0.5px solid var(--border)", background:"rgba(10,14,26,0.95)", backdropFilter:"blur(16px)", position:"sticky", top:0, zIndex:50 }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 16px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", flexShrink:0 }} onClick={() => window.scrollTo(0,0)}>
          <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#63b3ed,#b794f4)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-mono)", fontWeight:700, fontSize:15, color:"#fff", flexShrink:0 }}>?</div>
          <div style={{ display:"flex", flexDirection:"column" }}>
            <div style={{ fontSize:14, fontWeight:600, color:"var(--text)", lineHeight:1 }}>DSA<span style={{ color:"var(--accent)" }}>Analyzer</span></div>
            <div style={{ fontSize:9, color:"var(--text3)", marginTop:1, letterSpacing:"0.3px", display:"none" }} className="desktop-only">LeetCode Intelligence</div>
          </div>
        </div>

        {/* Search — desktop */}
        <form onSubmit={handleSubmit} style={{ display:"flex", gap:8, alignItems:"center", flex:1, maxWidth:400, margin:"0 12px" }}
          className="desktop-search">
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.05)", border:"0.5px solid var(--border2)", borderRadius:9, padding:"8px 14px", cursor:"text" }}
            onClick={() => document.getElementById("header-search-input")?.focus()}>
            <i className="fa-brands fa-leetcode" style={{ color:"var(--accent)", fontSize:13, flexShrink:0 }} />
            <input
              id="header-search-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="LeetCode username"
              disabled={loading}
              autoComplete="off"
              style={{ background:"none", border:"none", outline:"none", color:"var(--text)", fontFamily:"var(--font-mono)", fontSize:12, width:"100%", minWidth:0, WebkitAppearance:"none" }}
            />
            {input && !loading && (
              <i className="fa-solid fa-xmark" onClick={() => setInput("")}
                style={{ color:"var(--text3)", fontSize:11, cursor:"pointer", flexShrink:0 }} />
            )}
          </div>
          <button type="submit" disabled={loading || !input.trim()}
            style={{ display:"flex", alignItems:"center", gap:6, background:loading?"rgba(255,255,255,0.05)":"linear-gradient(135deg,#185FA5,#3B6D11)", color:loading?"var(--text3)":"#fff", border:"none", borderRadius:9, padding:"8px 16px", fontFamily:"var(--font-main)", fontSize:12, fontWeight:600, cursor:loading?"not-allowed":"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
            {loading
              ? <><i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize:12 }} /></>
              : <><i className="fa-solid fa-chart-line" style={{ fontSize:12 }} /> Analyze</>
            }
          </button>
        </form>

        {/* Right side */}
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>

          {/* Mobile search toggle */}
          <button
            onClick={() => setShowSearch(s => !s)}
            className="mobile-search-btn"
            style={{ display:"none", width:36, height:36, borderRadius:8, background:"rgba(255,255,255,0.05)", border:"0.5px solid var(--border)", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"var(--accent)" }}>
            <i className={`fa-solid ${showSearch ? "fa-xmark" : "fa-magnifying-glass"}`} style={{ fontSize:14 }} />
          </button>

          {/* User menu */}
          {user && (
            <div style={{ position:"relative" }}>
              <div onClick={() => setShowMenu(m => !m)}
                style={{ display:"flex", alignItems:"center", gap:7, cursor:"pointer", padding:"5px 8px", borderRadius:8, border:"0.5px solid var(--border)", background:"rgba(255,255,255,0.03)" }}>
                {user?.avatar
                  ? <img src={user.avatar} alt="" style={{ width:24, height:24, borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
                  : <div style={{ width:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg,#63b3ed,#b794f4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#fff", flexShrink:0 }}>{initials}</div>
                }
                <span style={{ fontSize:12, fontWeight:500, color:"var(--text)", maxWidth:80, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} className="desktop-username">{user?.username}</span>
                <i className={`fa-solid fa-chevron-${showMenu?"up":"down"}`} style={{ fontSize:9, color:"var(--text3)" }} />
              </div>

              {showMenu && (
                <>
                  <div style={{ position:"fixed", inset:0, zIndex:98 }} onClick={() => setShowMenu(false)} />
                  <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, background:"var(--surface)", border:"0.5px solid var(--border2)", borderRadius:12, padding:6, minWidth:180, zIndex:99, boxShadow:"0 8px 32px rgba(0,0,0,0.5)" }}>
                    <div style={{ padding:"8px 12px 10px", borderBottom:"0.5px solid var(--border)", marginBottom:4 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{user?.username}</div>
                      <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>{user?.email}</div>
                    </div>
                    {[
                      { icon:"fa-chart-line",       label:"My dashboard",   action:() => { setShowMenu(false); window.scrollTo(0,0) } },
                      { icon:"fa-bookmark",          label:"Saved profiles", action:() => { setShowMenu(false); onOpenProfiles?.() } },
                      { icon:"fa-clock-rotate-left", label:"History",        action:() => { setShowMenu(false); onOpenHistory?.() } },
                    ].map(item => (
                      <button key={item.label} onClick={item.action}
                        style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:"transparent", border:"none", color:"var(--text2)", fontSize:12, cursor:"pointer", borderRadius:7, fontFamily:"var(--font-main)", textAlign:"left" }}
                        onMouseEnter={e => e.currentTarget.style.background="var(--surface2)"}
                        onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                        <i className={"fa-solid "+item.icon} style={{ fontSize:12, width:14, textAlign:"center", color:"var(--accent)" }} />
                        {item.label}
                      </button>
                    ))}
                    <div style={{ borderTop:"0.5px solid var(--border)", marginTop:4, paddingTop:4 }}>
                      <button onClick={() => { setShowMenu(false); onLogout?.() }}
                        style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:"transparent", border:"none", color:"#fc8181", fontSize:12, cursor:"pointer", borderRadius:7, fontFamily:"var(--font-main)", textAlign:"left" }}
                        onMouseEnter={e => e.currentTarget.style.background="rgba(252,129,129,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                        <i className="fa-solid fa-right-from-bracket" style={{ fontSize:12, width:14, textAlign:"center" }} />
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile search bar — shown when search icon tapped */}
      {showSearch && (
        <div style={{ padding:"8px 16px 12px", borderTop:"0.5px solid var(--border)" }}>
          <form onSubmit={(e) => { handleSubmit(e); setShowSearch(false) }}
            style={{ display:"flex", gap:8 }}>
            <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.05)", border:"0.5px solid var(--border2)", borderRadius:9, padding:"10px 14px" }}>
              <i className="fa-brands fa-leetcode" style={{ color:"var(--accent)", fontSize:13, flexShrink:0 }} />
              <input
                autoFocus
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Enter LeetCode username..."
                autoComplete="off"
                style={{ background:"none", border:"none", outline:"none", color:"var(--text)", fontFamily:"var(--font-mono)", fontSize:14, width:"100%", WebkitAppearance:"none" }}
              />
            </div>
            <button type="submit" disabled={loading || !input.trim()}
              style={{ padding:"10px 16px", borderRadius:9, background:"linear-gradient(135deg,#185FA5,#3B6D11)", color:"#fff", border:"none", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"var(--font-main)", flexShrink:0 }}>
              Go
            </button>
          </form>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-search { display: none !important; }
          .mobile-search-btn { display: flex !important; }
          .desktop-username { display: none !important; }
        }
      `}</style>
    </header>
  )
}

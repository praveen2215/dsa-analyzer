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
    <header style={{ borderBottom:"0.5px solid var(--border)", background:"rgba(10,14,26,0.92)", backdropFilter:"blur(16px)", position:"sticky", top:0, zIndex:50 }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 28px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", gap:20 }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer", flexShrink:0 }} onClick={() => window.scrollTo(0,0)}>
          <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#63b3ed,#b794f4)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-mono)", fontWeight:500, fontSize:16, color:"#fff" }}>∑</div>
          <div>
            <div style={{ fontSize:15, fontWeight:500, color:"var(--text)", lineHeight:1 }}>DSA<span style={{ color:"var(--accent)" }}>Analyzer</span></div>
            <div style={{ fontSize:10, color:"var(--text3)", marginTop:1, letterSpacing:"0.3px" }}>LeetCode Intelligence</div>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSubmit} style={{ display:"flex", gap:8, alignItems:"center", flex:1, maxWidth:400 }}>
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", border:"0.5px solid var(--border2)", borderRadius:9, padding:"7px 14px", transition:"border-color 0.15s" }}
            onFocus={e => e.currentTarget.style.borderColor="rgba(99,179,237,0.4)"}
            onBlur={e  => e.currentTarget.style.borderColor="var(--border2)"}>
            <i className="fa-brands fa-leetcode" style={{ color:"var(--accent)", fontSize:13 }} />
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="LeetCode username" disabled={loading}
              style={{ background:"none", border:"none", outline:"none", color:"var(--text)", fontFamily:"var(--font-mono)", fontSize:12, width:"100%" }} />
            {input && !loading && (
              <i className="fa-solid fa-xmark" onClick={() => setInput("")}
                style={{ color:"var(--text3)", fontSize:11, cursor:"pointer" }} />
            )}
          </div>
          <button type="submit" disabled={loading || !input.trim()}
            style={{ display:"flex", alignItems:"center", gap:7, background:loading?"rgba(255,255,255,0.05)":"linear-gradient(135deg,#185FA5,#3B6D11)", color:loading?"var(--text3)":"#fff", border:"none", borderRadius:9, padding:"8px 18px", fontFamily:"var(--font-main)", fontSize:12, fontWeight:500, cursor:loading?"not-allowed":"pointer", whiteSpace:"nowrap", boxShadow:loading?"none":"0 2px 12px rgba(24,95,165,0.25)", transition:"all 0.2s" }}>
            {loading
              ? <><i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize:12 }} /> Analyzing</>
              : <><i className="fa-solid fa-chart-line" style={{ fontSize:12 }} /> Analyze</>
            }
          </button>
        </form>

        {/* User menu */}
        {user && (
          <div style={{ position:"relative", flexShrink:0 }}>
            <div onClick={() => setShowMenu(m => !m)}
              style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer", padding:"5px 10px", borderRadius:9, border:"0.5px solid var(--border)", background:"rgba(255,255,255,0.03)", transition:"all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.background="rgba(255,255,255,0.06)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)";  e.currentTarget.style.background="rgba(255,255,255,0.03)" }}>
              {user?.avatar
                ? <img src={user.avatar} alt="" style={{ width:26, height:26, borderRadius:"50%", objectFit:"cover" }} />
                : <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#63b3ed,#b794f4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:500, color:"#fff" }}>{initials}</div>
              }
              <span style={{ fontSize:12, fontWeight:500, color:"var(--text)" }}>{user?.username}</span>
              <i className={"fa-solid fa-chevron-"+(showMenu?"up":"down")} style={{ fontSize:9, color:"var(--text3)" }} />
            </div>

            {showMenu && (
              <>
                <div style={{ position:"fixed", inset:0, zIndex:98 }} onClick={() => setShowMenu(false)} />
                <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, background:"var(--surface)", border:"0.5px solid var(--border2)", borderRadius:12, padding:6, minWidth:200, zIndex:99, boxShadow:"0 8px 32px rgba(0,0,0,0.5)" }}>

                  {/* User info */}
                  <div style={{ padding:"8px 12px 10px", borderBottom:"0.5px solid var(--border)", marginBottom:4 }}>
                    <div style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{user?.username}</div>
                    <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>{user?.email}</div>
                  </div>

                  {[
                    { icon:"fa-chart-line",       label:"My dashboard",    action:() => { setShowMenu(false); window.scrollTo(0,0) } },
                    { icon:"fa-bookmark",          label:"Saved profiles",  action:() => { setShowMenu(false); onOpenProfiles?.() } },
                    { icon:"fa-clock-rotate-left", label:"History",         action:() => { setShowMenu(false); onOpenHistory?.()  } },
                  ].map(item => (
                    <button key={item.label} onClick={item.action}
                      style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:"transparent", border:"none", color:"var(--text2)", fontSize:12, cursor:"pointer", borderRadius:7, fontFamily:"var(--font-main)", transition:"all 0.1s", textAlign:"left" }}
                      onMouseEnter={e => { e.currentTarget.style.background="var(--surface2)"; e.currentTarget.style.color="var(--text)" }}
                      onMouseLeave={e => { e.currentTarget.style.background="transparent";     e.currentTarget.style.color="var(--text2)" }}>
                      <i className={"fa-solid "+item.icon} style={{ fontSize:12, width:14, textAlign:"center", color:"var(--accent)" }} />
                      {item.label}
                    </button>
                  ))}

                  <div style={{ borderTop:"0.5px solid var(--border)", marginTop:4, paddingTop:4 }}>
                    <button onClick={() => { setShowMenu(false); onLogout?.() }}
                      style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:"transparent", border:"none", color:"#fc8181", fontSize:12, cursor:"pointer", borderRadius:7, fontFamily:"var(--font-main)", transition:"all 0.1s", textAlign:"left" }}
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
    </header>
  )
}
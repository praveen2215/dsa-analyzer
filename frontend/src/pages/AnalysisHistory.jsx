import React, { useEffect, useState } from "react"
import { getHistory } from "../utils/api"

export default function AnalysisHistory({ onAnalyze, onClose }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistory()
      .then(({ history }) => setHistory(history || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width:"100%", maxWidth:520, padding:"28px 32px", maxHeight:"80vh", overflow:"hidden", display:"flex", flexDirection:"column" }}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:600 }}>Analysis History</div>
            <div style={{ fontSize:12, color:"var(--text3)", marginTop:3 }}>Your recent LeetCode lookups</div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:"var(--surface2)", border:"0.5px solid var(--border)", color:"var(--text2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div style={{ overflowY:"auto", flex:1 }}>
          {loading && (
            <div style={{ textAlign:"center", padding:"32px 0", color:"var(--text3)" }}>
              <div className="spinner" style={{ margin:"0 auto 12px" }} />
              Loading history...
            </div>
          )}

          {!loading && history.length === 0 && (
            <div style={{ textAlign:"center", padding:"40px 0", color:"var(--text3)" }}>
              <i className="fa-solid fa-clock-rotate-left" style={{ fontSize:32, opacity:0.3, display:"block", marginBottom:12 }} />
              <div style={{ fontSize:13 }}>No analysis history yet</div>
              <div style={{ fontSize:12, marginTop:6 }}>Start analyzing LeetCode profiles!</div>
            </div>
          )}

          {!loading && history.length > 0 && (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {history.map((h, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"var(--surface2)", border:"0.5px solid var(--border)", borderRadius:10, cursor:"pointer", transition:"all 0.15s" }}
                  onClick={() => { onAnalyze(h.leetcode_username); onClose() }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.background="var(--surface3)" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)";  e.currentTarget.style.background="var(--surface2)" }}>

                  <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#63b3ed,#b794f4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", flexShrink:0 }}>
                    {h.leetcode_username.slice(0,2).toUpperCase()}
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{h.leetcode_username}</div>
                    <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>
                      {new Date(h.analyzed_at).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric", hour:"2-digit", minute:"2-digit" })}
                    </div>
                  </div>

                  <div style={{ display:"flex", gap:12, flexShrink:0, textAlign:"right" }}>
                    {h.total_solved > 0 && (
                      <div>
                        <div style={{ fontSize:14, fontWeight:600, fontFamily:"var(--font-mono)", color:"#3B6D11" }}>{h.total_solved}</div>
                        <div style={{ fontSize:10, color:"var(--text3)" }}>solved</div>
                      </div>
                    )}
                    {h.rating > 0 && (
                      <div>
                        <div style={{ fontSize:14, fontWeight:600, fontFamily:"var(--font-mono)", color:"#185FA5" }}>{h.rating}</div>
                        <div style={{ fontSize:10, color:"var(--text3)" }}>rating</div>
                      </div>
                    )}
                  </div>

                  <i className="fa-solid fa-arrow-right" style={{ color:"var(--text3)", fontSize:11, flexShrink:0 }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
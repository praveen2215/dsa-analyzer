import React, { useEffect, useState } from "react"
import { getProfiles, deleteProfile } from "../utils/api"

export default function SavedProfiles({ onAnalyze, onClose }) {
  const [profiles, setProfiles] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    getProfiles()
      .then(({ profiles }) => setProfiles(profiles || []))
      .catch(() => setError("Failed to load profiles."))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (username) => {
    try {
      await deleteProfile(username)
      setProfiles(p => p.filter(x => x.leetcode_username !== username))
    } catch {
      alert("Failed to remove profile.")
    }
  }

  const handleAnalyze = (username) => {
    onAnalyze(username)
    onClose()
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width:"100%", maxWidth:520, padding:"28px 32px", position:"relative", maxHeight:"80vh", overflow:"hidden", display:"flex", flexDirection:"column" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:600 }}>Saved Profiles</div>
            <div style={{ fontSize:12, color:"var(--text3)", marginTop:3 }}>LeetCode profiles you have analyzed recently</div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:"var(--surface2)", border:"0.5px solid var(--border)", color:"var(--text2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Content */}
        <div style={{ overflowY:"auto", flex:1 }}>
          {loading && (
            <div style={{ textAlign:"center", padding:"32px 0", color:"var(--text3)" }}>
              <div className="spinner" style={{ margin:"0 auto 12px" }} />
              Loading profiles...
            </div>
          )}

          {error && (
            <div style={{ padding:"12px 16px", background:"rgba(163,45,45,0.1)", border:"0.5px solid rgba(163,45,45,0.3)", borderRadius:8, fontSize:13, color:"#A32D2D" }}>
              {error}
            </div>
          )}

          {!loading && !error && profiles.length === 0 && (
            <div style={{ textAlign:"center", padding:"40px 0", color:"var(--text3)" }}>
              <i className="fa-solid fa-user-slash" style={{ fontSize:32, opacity:0.3, display:"block", marginBottom:12 }} />
              <div style={{ fontSize:13 }}>No saved profiles yet</div>
              <div style={{ fontSize:12, marginTop:6 }}>Analyze any LeetCode profile to save it here</div>
            </div>
          )}

          {!loading && profiles.length > 0 && (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {profiles.map(p => (
                <div key={p.leetcode_username} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"var(--surface2)", border:"0.5px solid var(--border)", borderRadius:10, transition:"border-color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor="var(--border2)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor="var(--border)"}>

                  {/* Avatar */}
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#63b3ed,#b794f4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", flexShrink:0 }}>
                    {p.leetcode_username.slice(0,2).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{p.leetcode_username}</div>
                    <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>
                      {p.last_analyzed ? "Last analyzed: " + new Date(p.last_analyzed).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }) : "Not analyzed yet"}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                    <button onClick={() => handleAnalyze(p.leetcode_username)}
                      style={{ padding:"6px 14px", borderRadius:7, background:"rgba(24,95,165,0.15)", border:"0.5px solid rgba(24,95,165,0.3)", color:"#185FA5", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"var(--font-main)" }}>
                      <i className="fa-solid fa-chart-line" style={{ marginRight:5 }} />Analyze
                    </button>
                    <button onClick={() => handleDelete(p.leetcode_username)}
                      style={{ width:30, height:30, borderRadius:7, background:"rgba(163,45,45,0.1)", border:"0.5px solid rgba(163,45,45,0.2)", color:"#A32D2D", fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <i className="fa-solid fa-trash" style={{ fontSize:11 }} />
                    </button>
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
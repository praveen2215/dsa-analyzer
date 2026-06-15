import React, { useState } from "react"
import { signInWithGoogle } from "../utils/firebase"
import { authFirebase } from "../utils/api"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
  const { login }             = useAuth()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await signInWithGoogle()
      const user   = result.user

      // Send to backend to create session
      const res = await authFirebase({
        uid:    user.uid,
        email:  user.email,
        name:   user.displayName,
        avatar: user.photoURL,
      })

      login(res.user)
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled. Please try again.")
      } else if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError("Sign-in failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"#0a0e1a" }}>
      <div style={{ width:"100%", maxWidth:420 }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ width:64, height:64, borderRadius:16, background:"linear-gradient(135deg,#63b3ed,#b794f4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:700, color:"#fff", margin:"0 auto 16px" }}>∑</div>
          <h1 style={{ fontSize:26, fontWeight:700, letterSpacing:"-0.5px", color:"#e2e8f0" }}>
            DSA<span style={{ color:"#63b3ed" }}>Analyzer</span>
          </h1>
          <p style={{ fontSize:13, color:"#64748b", marginTop:8, lineHeight:1.6 }}>
            Your LeetCode journey, analyzed like a pro
          </p>
        </div>

        {/* Card */}
        <div style={{ background:"#111827", border:"0.5px solid rgba(99,179,237,0.15)", borderRadius:20, padding:"36px 32px" }}>

          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ fontSize:16, fontWeight:600, color:"#e2e8f0", marginBottom:6 }}>Welcome</div>
            <div style={{ fontSize:13, color:"#64748b" }}>Sign in with your Gmail account to continue</div>
          </div>

          {/* Features list */}
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
            {[
              { icon:"fa-chart-line",   text:"Real-time LeetCode analytics"           },
              { icon:"fa-brain",        text:"AI study plan & skill gap analyzer"     },
              { icon:"fa-trophy",       text:"Interview readiness score"              },
              { icon:"fa-share-nodes",  text:"Shareable profile link"                },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display:"flex", alignItems:"center", gap:12, fontSize:13, color:"#94a3b8" }}>
                <div style={{ width:28, height:28, borderRadius:7, background:"rgba(99,179,237,0.1)", border:"0.5px solid rgba(99,179,237,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <i className={"fa-solid "+icon} style={{ color:"#63b3ed", fontSize:12 }} />
                </div>
                {text}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding:"10px 14px", background:"rgba(252,129,129,0.1)", border:"0.5px solid rgba(252,129,129,0.3)", borderRadius:8, fontSize:12, color:"#fc8181", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
              <i className="fa-solid fa-circle-exclamation" style={{ flexShrink:0 }} /> {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button onClick={handleGoogleSignIn} disabled={loading}
            style={{
              width:"100%", padding:"13px", borderRadius:12,
              background: loading ? "rgba(255,255,255,0.05)" : "#fff",
              color: loading ? "#64748b" : "#1a1a1a",
              border:"none", fontSize:14, fontWeight:600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily:"var(--font-main)",
              display:"flex", alignItems:"center", justifyContent:"center", gap:12,
              transition:"all 0.2s",
              boxShadow: loading ? "none" : "0 2px 12px rgba(0,0,0,0.3)"
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none" }}>
            {loading ? (
              <><i className="fa-solid fa-circle-notch fa-spin" style={{ color:"#64748b" }} /> Signing in...</>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div style={{ textAlign:"center", marginTop:20, fontSize:12, color:"#374151", display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }} />
            <span style={{ color:"#64748b" }}>Gmail accounts only</span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }} />
          </div>
        </div>

        <div style={{ textAlign:"center", marginTop:24, fontSize:11, color:"#374151" }}>
          <i className="fa-solid fa-shield-halved" style={{ color:"#3B6D11", marginRight:5 }} />
          <span style={{ color:"#64748b" }}>Secured by Firebase · Your data is never shared</span>
        </div>

      </div>
    </div>
  )
}
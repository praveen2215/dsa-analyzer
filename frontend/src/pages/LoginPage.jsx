import React, { useState } from "react"
import { signInWithGoogle } from "../utils/firebase"
import { authLogin, authRegister, authFirebase } from "../utils/api"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
  const { login }               = useAuth()
  const [mode,    setMode]      = useState("login")
  const [loading, setLoading]   = useState(false)
  const [gLoading,setGLoading]  = useState(false)
  const [error,   setError]     = useState(null)
  const [success, setSuccess]   = useState(null)
  const [form,    setForm]      = useState({ email:"", username:"", password:"" })
  const [showPass,setShowPass]  = useState(false)

  const update = (k, v) => setForm(f => ({ ...f, [k]:v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null); setSuccess(null); setLoading(true)
    try {
      const fn  = mode === "login" ? authLogin : authRegister
      const res = await fn(form)
      setSuccess(res.message)
      login(res.user)
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGLoading(true); setError(null)
    try {
      const result = await signInWithGoogle()
      const u      = result.user
      const res    = await authFirebase({
        uid:    u.uid,
        email:  u.email,
        name:   u.displayName,
        avatar: u.photoURL,
      })
      login(res.user)
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled.")
      } else {
        setError(err.response?.data?.error || "Google sign-in failed.")
      }
    } finally {
      setGLoading(false)
    }
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"#0a0e1a" }}>
      <div style={{ width:"100%", maxWidth:420 }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:60, height:60, borderRadius:14, background:"linear-gradient(135deg,#63b3ed,#b794f4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:700, color:"#fff", margin:"0 auto 14px" }}>∑</div>
          <h1 style={{ fontSize:24, fontWeight:700, letterSpacing:"-0.5px", color:"#e2e8f0" }}>
            DSA<span style={{ color:"#63b3ed" }}>Analyzer</span>
          </h1>
          <p style={{ fontSize:13, color:"#64748b", marginTop:6 }}>Your LeetCode journey, analyzed like a pro</p>
        </div>

        <div style={{ background:"#111827", border:"0.5px solid rgba(99,179,237,0.12)", borderRadius:18, padding:"28px 28px" }}>

          {/* Google Sign In */}
          <button onClick={handleGoogle} disabled={gLoading || loading}
            style={{
              width:"100%", padding:"12px", borderRadius:10, marginBottom:20,
              background: gLoading ? "rgba(255,255,255,0.05)" : "#fff",
              color: gLoading ? "#64748b" : "#1a1a1a",
              border:"none", fontSize:14, fontWeight:600,
              cursor: gLoading ? "not-allowed" : "pointer",
              fontFamily:"var(--font-main)",
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              transition:"all 0.2s",
              boxShadow: gLoading ? "none" : "0 2px 12px rgba(0,0,0,0.25)"
            }}
            onMouseEnter={e => { if (!gLoading) e.currentTarget.style.transform = "translateY(-1px)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none" }}>
            {gLoading ? (
              <><i className="fa-solid fa-circle-notch fa-spin" style={{ color:"#64748b" }} /> Signing in...</>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize:12, color:"#64748b" }}>or use email</span>
            <div style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.08)" }} />
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", background:"rgba(255,255,255,0.04)", borderRadius:10, padding:3, marginBottom:20, gap:3 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(null); setSuccess(null) }}
                style={{
                  flex:1, padding:"7px", borderRadius:7, border:"none", cursor:"pointer",
                  background:  mode===m ? "rgba(255,255,255,0.08)" : "transparent",
                  color:       mode===m ? "#e2e8f0" : "#64748b",
                  fontSize:13, fontWeight: mode===m ? 600 : 400,
                  fontFamily:"var(--font-main)", transition:"all 0.15s"
                }}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>

            <div>
              <label style={{ fontSize:11, color:"#94a3b8", marginBottom:6, display:"block", textTransform:"uppercase", letterSpacing:"0.6px" }}>Email</label>
              <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(99,179,237,0.2)", borderRadius:9, padding:"10px 14px" }}>
                <i className="fa-solid fa-envelope" style={{ color:"#64748b", fontSize:12 }} />
                <input type="email" value={form.email} onChange={e => update("email", e.target.value)}
                  placeholder="your@email.com" required
                  style={{ background:"none", border:"none", outline:"none", color:"#e2e8f0", fontSize:13, width:"100%", fontFamily:"var(--font-main)" }} />
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label style={{ fontSize:11, color:"#94a3b8", marginBottom:6, display:"block", textTransform:"uppercase", letterSpacing:"0.6px" }}>Username</label>
                <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(99,179,237,0.2)", borderRadius:9, padding:"10px 14px" }}>
                  <i className="fa-solid fa-at" style={{ color:"#64748b", fontSize:12 }} />
                  <input type="text" value={form.username} onChange={e => update("username", e.target.value)}
                    placeholder="your_username" required
                    style={{ background:"none", border:"none", outline:"none", color:"#e2e8f0", fontSize:13, width:"100%", fontFamily:"var(--font-main)" }} />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize:11, color:"#94a3b8", marginBottom:6, display:"block", textTransform:"uppercase", letterSpacing:"0.6px" }}>Password</label>
              <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(99,179,237,0.2)", borderRadius:9, padding:"10px 14px" }}>
                <i className="fa-solid fa-lock" style={{ color:"#64748b", fontSize:12 }} />
                <input type={showPass ? "text" : "password"} value={form.password} onChange={e => update("password", e.target.value)}
                  placeholder={mode === "register" ? "Minimum 6 characters" : "Your password"} required
                  style={{ background:"none", border:"none", outline:"none", color:"#e2e8f0", fontSize:13, width:"100%", fontFamily:"var(--font-main)" }} />
                <i className={"fa-solid " + (showPass ? "fa-eye-slash" : "fa-eye")} onClick={() => setShowPass(p => !p)}
                  style={{ color:"#64748b", fontSize:12, cursor:"pointer", flexShrink:0 }} />
              </div>
            </div>

            {error && (
              <div style={{ padding:"10px 14px", background:"rgba(252,129,129,0.1)", border:"0.5px solid rgba(252,129,129,0.3)", borderRadius:8, fontSize:12, color:"#fc8181", display:"flex", alignItems:"center", gap:8 }}>
                <i className="fa-solid fa-circle-exclamation" style={{ flexShrink:0 }} /> {error}
              </div>
            )}
            {success && (
              <div style={{ padding:"10px 14px", background:"rgba(72,187,120,0.1)", border:"0.5px solid rgba(72,187,120,0.3)", borderRadius:8, fontSize:12, color:"#48bb78", display:"flex", alignItems:"center", gap:8 }}>
                <i className="fa-solid fa-circle-check" style={{ flexShrink:0 }} /> {success}
              </div>
            )}

            <button type="submit" disabled={loading || gLoading}
              style={{
                padding:"11px", borderRadius:9, marginTop:2,
                background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#185FA5,#3B6D11)",
                color: loading ? "#64748b" : "#fff",
                border:"none", fontSize:13, fontWeight:600,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily:"var(--font-main)",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                boxShadow: loading ? "none" : "0 4px 16px rgba(24,95,165,0.3)"
              }}>
              {loading
                ? <><i className="fa-solid fa-circle-notch fa-spin" /> Please wait...</>
                : mode === "login"
                  ? <><i className="fa-solid fa-right-to-bracket" /> Sign In</>
                  : <><i className="fa-solid fa-user-plus" /> Create Account</>
              }
            </button>
          </form>

          <div style={{ textAlign:"center", marginTop:18, fontSize:13, color:"#64748b" }}>
            {mode === "login"
              ? <span>No account? <span onClick={() => { setMode("register"); setError(null) }} style={{ color:"#63b3ed", cursor:"pointer", fontWeight:500 }}>Register here</span></span>
              : <span>Already registered? <span onClick={() => { setMode("login"); setError(null) }} style={{ color:"#63b3ed", cursor:"pointer", fontWeight:500 }}>Sign in</span></span>
            }
          </div>
        </div>

        <div style={{ textAlign:"center", marginTop:20, fontSize:11, color:"#374151" }}>
          <i className="fa-solid fa-shield-halved" style={{ color:"#3B6D11", marginRight:5 }} />
          <span style={{ color:"#64748b" }}>Secured by Firebase · Your data is never shared</span>
        </div>

      </div>
    </div>
  )
}
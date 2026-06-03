import React, { useState } from "react"
import { authLogin, authRegister } from "../utils/api"
import { useAuth } from "../context/AuthContext"

export default function LoginPage({ onSuccess }) {
  const { login }               = useAuth()
  const [mode,    setMode]      = useState("login")
  const [loading, setLoading]   = useState(false)
  const [error,   setError]     = useState(null)
  const [success, setSuccess]   = useState(null)
  const [form,    setForm]      = useState({ email:"", username:"", password:"" })

  const update = (k, v) => setForm(f => ({ ...f, [k]:v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null); setSuccess(null); setLoading(true)
    try {
      const fn  = mode === "login" ? authLogin : authRegister
      const res = await fn(form)
      login(res.user)
      setSuccess(res.message)
      setTimeout(() => onSuccess?.(), 800)
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:420 }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:48, marginBottom:12, filter:"drop-shadow(0 0 24px rgba(99,179,237,0.4))" }}>∑</div>
          <h1 style={{ fontSize:26, fontWeight:700, letterSpacing:"-0.5px" }}>
            DSA<span style={{ color:"var(--accent)" }}>Analyzer</span>
          </h1>
          <p style={{ fontSize:13, color:"var(--text3)", marginTop:6 }}>
            {mode === "login" ? "Welcome back! Sign in to continue." : "Create your free account"}
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding:"28px 32px" }}>

          {/* Mode tabs */}
          <div style={{ display:"flex", background:"var(--surface2)", borderRadius:10, padding:4, marginBottom:24, gap:4 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(null); setSuccess(null) }}
                style={{
                  flex:1, padding:"8px", borderRadius:7, border:"none", cursor:"pointer",
                  background:    mode===m ? "var(--surface)" : "transparent",
                  color:         mode===m ? "var(--text)"    : "var(--text3)",
                  fontSize:13, fontWeight: mode===m ? 600 : 400,
                  fontFamily:"var(--font-main)", transition:"all 0.15s",
                  boxShadow: mode===m ? "0 1px 4px rgba(0,0,0,0.3)" : "none"
                }}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Email */}
            <div>
              <label style={{ fontSize:12, color:"var(--text2)", marginBottom:6, display:"block", fontWeight:500 }}>
                Email address
              </label>
              <div style={{ display:"flex", alignItems:"center", gap:10, background:"var(--surface2)", border:"0.5px solid var(--border2)", borderRadius:9, padding:"10px 14px" }}>
                <i className="fa-solid fa-envelope" style={{ color:"var(--text3)", fontSize:13 }} />
                <input type="email" value={form.email} onChange={e => update("email", e.target.value)}
                  placeholder="your@email.com" required
                  style={{ background:"none", border:"none", outline:"none", color:"var(--text)", fontSize:13, width:"100%", fontFamily:"var(--font-main)" }} />
              </div>
            </div>

            {/* Username — register only */}
            {mode === "register" && (
              <div>
                <label style={{ fontSize:12, color:"var(--text2)", marginBottom:6, display:"block", fontWeight:500 }}>
                  Username
                </label>
                <div style={{ display:"flex", alignItems:"center", gap:10, background:"var(--surface2)", border:"0.5px solid var(--border2)", borderRadius:9, padding:"10px 14px" }}>
                  <i className="fa-solid fa-at" style={{ color:"var(--text3)", fontSize:13 }} />
                  <input type="text" value={form.username} onChange={e => update("username", e.target.value)}
                    placeholder="your_username" required
                    style={{ background:"none", border:"none", outline:"none", color:"var(--text)", fontSize:13, width:"100%", fontFamily:"var(--font-main)" }} />
                </div>
                <div style={{ fontSize:11, color:"var(--text3)", marginTop:5 }}>
                  Letters, numbers and underscores only
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label style={{ fontSize:12, color:"var(--text2)", marginBottom:6, display:"block", fontWeight:500 }}>
                Password
              </label>
              <div style={{ display:"flex", alignItems:"center", gap:10, background:"var(--surface2)", border:"0.5px solid var(--border2)", borderRadius:9, padding:"10px 14px" }}>
                <i className="fa-solid fa-lock" style={{ color:"var(--text3)", fontSize:13 }} />
                <input type="password" value={form.password} onChange={e => update("password", e.target.value)}
                  placeholder={mode === "register" ? "Minimum 6 characters" : "Your password"} required
                  style={{ background:"none", border:"none", outline:"none", color:"var(--text)", fontSize:13, width:"100%", fontFamily:"var(--font-main)" }} />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding:"10px 14px", background:"rgba(163,45,45,0.1)", border:"0.5px solid rgba(163,45,45,0.3)", borderRadius:8, fontSize:12, color:"#A32D2D", display:"flex", alignItems:"center", gap:8, lineHeight:1.5 }}>
                <i className="fa-solid fa-circle-exclamation" style={{ flexShrink:0 }} />
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div style={{ padding:"10px 14px", background:"rgba(59,109,17,0.1)", border:"0.5px solid rgba(59,109,17,0.3)", borderRadius:8, fontSize:12, color:"#3B6D11", display:"flex", alignItems:"center", gap:8 }}>
                <i className="fa-solid fa-circle-check" style={{ flexShrink:0 }} />
                {success}
              </div>
            )}

            {/* Submit button */}
            <button type="submit" disabled={loading}
              style={{
                padding:"12px", borderRadius:9, marginTop:4,
                background: loading ? "var(--surface3)" : "linear-gradient(135deg,#185FA5,#3B6D11)",
                color:"#fff", border:"none", fontSize:14, fontWeight:600,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily:"var(--font-main)",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                transition:"all 0.2s",
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
        </div>

        {/* Footer */}
        <div style={{ textAlign:"center", marginTop:20, fontSize:12, color:"var(--text3)" }}>
          {mode === "login"
            ? <>Don'"'"'t have an account?{" "}<span onClick={() => setMode("register")} style={{ color:"var(--accent)", cursor:"pointer", fontWeight:500 }}>Register here</span></>
            : <>Already have an account?{" "}<span onClick={() => setMode("login")} style={{ color:"var(--accent)", cursor:"pointer", fontWeight:500 }}>Sign in</span></>
          }
        </div>

      </div>
    </div>
  )
}
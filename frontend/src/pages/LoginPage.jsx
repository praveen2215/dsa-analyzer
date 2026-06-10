import React, { useState } from "react"
import { authLogin, authRegister } from "../utils/api"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
  const { login }             = useAuth()
  const [mode,    setMode]    = useState("login")
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [success, setSuccess] = useState(null)
  const [form,    setForm]    = useState({ email:"", username:"", password:"" })

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

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"#0a0e1a" }}>
      <div style={{ width:"100%", maxWidth:420 }}>

        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:56, marginBottom:12 }}>∑</div>
          <h1 style={{ fontSize:26, fontWeight:700, color:"#e2e8f0" }}>
            DSA<span style={{ color:"#63b3ed" }}>Analyzer</span>
          </h1>
          <p style={{ fontSize:13, color:"#64748b", marginTop:6 }}>
            {mode === "login" ? "Welcome back! Sign in to continue." : "Create your free account"}
          </p>
        </div>

        <div style={{ background:"#111827", border:"0.5px solid rgba(99,179,237,0.12)", borderRadius:16, padding:"28px 32px" }}>

          <div style={{ display:"flex", background:"rgba(255,255,255,0.04)", borderRadius:10, padding:4, marginBottom:24, gap:4 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(null); setSuccess(null) }}
                style={{ flex:1, padding:"8px", borderRadius:7, border:"none", cursor:"pointer", background: mode===m ? "rgba(255,255,255,0.08)" : "transparent", color: mode===m ? "#e2e8f0" : "#64748b", fontSize:13, fontWeight: mode===m ? 600 : 400, fontFamily:"var(--font-main)", transition:"all 0.15s" }}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label style={{ fontSize:12, color:"#94a3b8", marginBottom:6, display:"block", fontWeight:500 }}>Email address</label>
              <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(99,179,237,0.2)", borderRadius:9, padding:"10px 14px" }}>
                <i className="fa-solid fa-envelope" style={{ color:"#64748b", fontSize:13 }} />
                <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="your@email.com" required
                  style={{ background:"none", border:"none", outline:"none", color:"#e2e8f0", fontSize:13, width:"100%", fontFamily:"var(--font-main)" }} />
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label style={{ fontSize:12, color:"#94a3b8", marginBottom:6, display:"block", fontWeight:500 }}>Username</label>
                <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(99,179,237,0.2)", borderRadius:9, padding:"10px 14px" }}>
                  <i className="fa-solid fa-at" style={{ color:"#64748b", fontSize:13 }} />
                  <input type="text" value={form.username} onChange={e => update("username", e.target.value)} placeholder="your_username" required
                    style={{ background:"none", border:"none", outline:"none", color:"#e2e8f0", fontSize:13, width:"100%", fontFamily:"var(--font-main)" }} />
                </div>
                <div style={{ fontSize:11, color:"#64748b", marginTop:5 }}>Letters, numbers and underscores only</div>
              </div>
            )}

            <div>
              <label style={{ fontSize:12, color:"#94a3b8", marginBottom:6, display:"block", fontWeight:500 }}>Password</label>
              <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(99,179,237,0.2)", borderRadius:9, padding:"10px 14px" }}>
                <i className="fa-solid fa-lock" style={{ color:"#64748b", fontSize:13 }} />
                <input type="password" value={form.password} onChange={e => update("password", e.target.value)} placeholder={mode === "register" ? "Minimum 6 characters" : "Your password"} required
                  style={{ background:"none", border:"none", outline:"none", color:"#e2e8f0", fontSize:13, width:"100%", fontFamily:"var(--font-main)" }} />
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

            <button type="submit" disabled={loading}
              style={{ padding:"12px", borderRadius:9, marginTop:4, background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#185FA5,#3B6D11)", color: loading ? "#64748b" : "#fff", border:"none", fontSize:14, fontWeight:600, cursor: loading ? "not-allowed" : "pointer", fontFamily:"var(--font-main)", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow: loading ? "none" : "0 4px 16px rgba(24,95,165,0.3)" }}>
              {loading ? <><i className="fa-solid fa-circle-notch fa-spin" /> Please wait...</> : mode === "login" ? <><i className="fa-solid fa-right-to-bracket" /> Sign In</> : <><i className="fa-solid fa-user-plus" /> Create Account</>}
            </button>
          </form>
        </div>

        <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:"#64748b" }}>
          {mode === "login"
            ? <span>No account? <span onClick={() => { setMode("register"); setError(null) }} style={{ color:"#63b3ed", cursor:"pointer", fontWeight:500 }}>Register here</span></span>
            : <span>Already registered? <span onClick={() => { setMode("login"); setError(null) }} style={{ color:"#63b3ed", cursor:"pointer", fontWeight:500 }}>Sign in</span></span>
          }
        </div>
      </div>
    </div>
  )
}
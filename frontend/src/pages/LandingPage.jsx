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
  const [showPass,setShowPass]= useState(false)

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
      setError(err.response?.data?.error || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex" }}>

      {/* Left panel — branding */}
      <div style={{ flex:1, background:"linear-gradient(160deg, #0a0e1a 0%, #0f172a 100%)", display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 48px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(99,179,237,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,0.025) 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:-100, right:-100, width:400, height:400, borderRadius:"50%", background:"rgba(99,179,237,0.05)", filter:"blur(80px)", pointerEvents:"none" }} />

        <div style={{ position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:48 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg,#63b3ed,#b794f4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:500, color:"#fff" }}>∑</div>
            <span style={{ fontSize:18, fontWeight:500, color:"#e2e8f0" }}>DSA<span style={{ color:"#63b3ed" }}>Analyzer</span></span>
          </div>

          <h1 style={{ fontSize:32, fontWeight:500, color:"#e2e8f0", lineHeight:1.2, letterSpacing:"-1px", marginBottom:16 }}>
            Track your progress.<br />
            <span style={{ background:"linear-gradient(135deg,#63b3ed,#b794f4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Impress recruiters.
            </span>
          </h1>
          <p style={{ fontSize:14, color:"rgba(148,163,184,0.7)", lineHeight:1.7, marginBottom:40, maxWidth:340 }}>
            The most comprehensive LeetCode analytics dashboard. Understand exactly where you stand and what to study next.
          </p>

          {/* Feature list */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              { icon:"fa-chart-line",       text:"Real-time LeetCode stats & charts"            },
              { icon:"fa-building",         text:"Skill gap vs Google, Meta, Amazon & more"     },
              { icon:"fa-brain",            text:"AI study plan based on your weak topics"      },
              { icon:"fa-trophy",           text:"Interview readiness score for recruiters"     },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:28, height:28, borderRadius:7, background:"rgba(99,179,237,0.1)", border:"0.5px solid rgba(99,179,237,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <i className={"fa-solid "+icon} style={{ color:"#63b3ed", fontSize:12 }} />
                </div>
                <span style={{ fontSize:13, color:"rgba(148,163,184,0.8)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ width:440, background:"#111827", display:"flex", flexDirection:"column", justifyContent:"center", padding:"48px 40px", borderLeft:"0.5px solid rgba(99,179,237,0.1)" }}>
        <div style={{ marginBottom:32 }}>
          <h2 style={{ fontSize:22, fontWeight:500, color:"#e2e8f0", marginBottom:6 }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ fontSize:13, color:"rgba(148,163,184,0.6)" }}>
            {mode === "login" ? "Sign in to access your dashboard" : "Start tracking your LeetCode journey"}
          </p>
        </div>

        {/* Mode tabs */}
        <div style={{ display:"flex", background:"rgba(255,255,255,0.04)", borderRadius:10, padding:4, marginBottom:24, gap:4, border:"0.5px solid rgba(255,255,255,0.06)" }}>
          {["login","register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(null); setSuccess(null) }}
              style={{ flex:1, padding:"8px", borderRadius:7, border:"none", cursor:"pointer",
                background: mode===m ? "rgba(255,255,255,0.08)" : "transparent",
                color: mode===m ? "#e2e8f0" : "rgba(148,163,184,0.5)",
                fontSize:13, fontWeight: mode===m ? 500 : 400,
                fontFamily:"var(--font-main)", transition:"all 0.15s",
              }}>
              {m === "login" ? "Sign in" : "Register"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Email */}
          <div>
            <label style={{ fontSize:11, color:"rgba(148,163,184,0.6)", marginBottom:6, display:"block", textTransform:"uppercase", letterSpacing:"0.5px" }}>Email</label>
            <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(99,179,237,0.15)", borderRadius:9, padding:"10px 14px", transition:"border-color 0.15s" }}
              onFocus={e => e.currentTarget.style.borderColor="rgba(99,179,237,0.4)"}
              onBlur={e  => e.currentTarget.style.borderColor="rgba(99,179,237,0.15)"}>
              <i className="fa-solid fa-envelope" style={{ color:"rgba(148,163,184,0.4)", fontSize:13 }} />
              <input type="email" value={form.email} onChange={e => update("email", e.target.value)}
                placeholder="your@email.com" required
                style={{ background:"none", border:"none", outline:"none", color:"#e2e8f0", fontSize:13, width:"100%", fontFamily:"var(--font-main)" }} />
            </div>
          </div>

          {/* Username — register only */}
          {mode === "register" && (
            <div>
              <label style={{ fontSize:11, color:"rgba(148,163,184,0.6)", marginBottom:6, display:"block", textTransform:"uppercase", letterSpacing:"0.5px" }}>Username</label>
              <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(99,179,237,0.15)", borderRadius:9, padding:"10px 14px" }}>
                <i className="fa-solid fa-at" style={{ color:"rgba(148,163,184,0.4)", fontSize:13 }} />
                <input type="text" value={form.username} onChange={e => update("username", e.target.value)}
                  placeholder="your_username" required
                  style={{ background:"none", border:"none", outline:"none", color:"#e2e8f0", fontSize:13, width:"100%", fontFamily:"var(--font-main)" }} />
              </div>
              <div style={{ fontSize:11, color:"rgba(148,163,184,0.4)", marginTop:5 }}>Letters, numbers and underscores only</div>
            </div>
          )}

          {/* Password */}
          <div>
            <label style={{ fontSize:11, color:"rgba(148,163,184,0.6)", marginBottom:6, display:"block", textTransform:"uppercase", letterSpacing:"0.5px" }}>Password</label>
            <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(99,179,237,0.15)", borderRadius:9, padding:"10px 14px" }}>
              <i className="fa-solid fa-lock" style={{ color:"rgba(148,163,184,0.4)", fontSize:13 }} />
              <input type={showPass ? "text" : "password"} value={form.password} onChange={e => update("password", e.target.value)}
                placeholder={mode === "register" ? "Min. 6 characters" : "Your password"} required
                style={{ background:"none", border:"none", outline:"none", color:"#e2e8f0", fontSize:13, width:"100%", fontFamily:"var(--font-main)" }} />
              <i className={"fa-solid "+(showPass?"fa-eye-slash":"fa-eye")} onClick={() => setShowPass(p=>!p)}
                style={{ color:"rgba(148,163,184,0.4)", fontSize:13, cursor:"pointer" }} />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding:"10px 14px", background:"rgba(163,45,45,0.1)", border:"0.5px solid rgba(163,45,45,0.3)", borderRadius:8, fontSize:12, color:"#fc8181", display:"flex", alignItems:"center", gap:8 }}>
              <i className="fa-solid fa-circle-exclamation" style={{ flexShrink:0 }} /> {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{ padding:"10px 14px", background:"rgba(59,109,17,0.1)", border:"0.5px solid rgba(59,109,17,0.3)", borderRadius:8, fontSize:12, color:"#48bb78", display:"flex", alignItems:"center", gap:8 }}>
              <i className="fa-solid fa-circle-check" style={{ flexShrink:0 }} /> {success}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{ padding:"12px", borderRadius:9, marginTop:4,
              background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#185FA5,#3B6D11)",
              color: loading ? "rgba(148,163,184,0.5)" : "#fff",
              border:"0.5px solid "+(loading?"rgba(255,255,255,0.08)":"transparent"),
              fontSize:14, fontWeight:500,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily:"var(--font-main)",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              transition:"all 0.2s",
              boxShadow: loading ? "none" : "0 4px 16px rgba(24,95,165,0.3)"
            }}>
            {loading
              ? <><i className="fa-solid fa-circle-notch fa-spin" /> Please wait...</>
              : mode === "login"
                ? <><i className="fa-solid fa-right-to-bracket" /> Sign in</>
                : <><i className="fa-solid fa-user-plus" /> Create account</>
            }
          </button>
        </form>

        {/* Switch mode */}
        <div style={{ textAlign:"center", marginTop:24, fontSize:13, color:"rgba(148,163,184,0.5)" }}>
          {mode === "login"
            ? <span>No account?{" "}<span onClick={() => { setMode("register"); setError(null) }} style={{ color:"#63b3ed", cursor:"pointer", fontWeight:500 }}>Register here</span></span>
            : <span>Already registered?{" "}<span onClick={() => { setMode("login"); setError(null) }} style={{ color:"#63b3ed", cursor:"pointer", fontWeight:500 }}>Sign in</span></span>
          }
        </div>

        <div style={{ marginTop:32, paddingTop:24, borderTop:"0.5px solid rgba(255,255,255,0.06)", textAlign:"center", fontSize:11, color:"rgba(148,163,184,0.3)" }}>
          Your data is encrypted and never shared
        </div>
      </div>
    </div>
  )
}
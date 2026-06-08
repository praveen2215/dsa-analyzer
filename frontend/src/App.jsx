import React, { useState } from "react"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Header from "./components/Header"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/Dashboard"
import LoginPage from "./pages/LoginPage"
import SavedProfiles from "./pages/SavedProfiles"
import AnalysisHistory from "./pages/AnalysisHistory"
import { useUserData } from "./hooks/useUserData"

function AppContent() {
  const { user, loading: authLoading, logout } = useAuth()
  const { data, recent, loading, error, username, analyze, clearData } = useUserData(user?.id)
  const [showProfiles, setShowProfiles] = useState(false)
  const [showHistory,  setShowHistory]  = useState(false)

  const handleLogout = async () => {
    clearData()
    await logout()
  }

  // Checking auth
  if (authLoading) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", flexDirection:"column", gap:16, background:"#0a0e1a" }}>
        <div className="spinner" />
        <div style={{ fontSize:13, color:"#64748b", fontFamily:"monospace" }}>Loading...</div>
      </div>
    )
  }

  // NOT logged in — show ONLY login page, nothing else
  if (!user) {
    return <LoginPage />
  }

  // Logged in — full app
  return (
    <>
      <div className="grid-bg" />
      <div className="glow-orb orb1" />
      <div className="glow-orb orb2" />
      <div style={{ position:"relative", zIndex:1, minHeight:"100vh" }}>
        <Header
          onAnalyze={analyze}
          loading={loading}
          currentUser={username}
          user={user}
          onLogout={handleLogout}
          onOpenProfiles={() => setShowProfiles(true)}
          onOpenHistory={()  => setShowHistory(true)}
        />

        {showProfiles && <SavedProfiles onAnalyze={analyze} onClose={() => setShowProfiles(false)} />}
        {showHistory  && <AnalysisHistory onAnalyze={analyze} onClose={() => setShowHistory(false)} />}

        {!data && !loading && !error && <LandingPage onAnalyze={analyze} />}

        {loading && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"calc(100vh - 64px)", gap:20 }}>
            <div className="spinner" />
            <div style={{ fontFamily:"var(--font-mono)", color:"var(--text2)", fontSize:14 }}>
              Fetching <span style={{ color:"var(--accent)", fontWeight:600 }}>{username}</span>
              <span className="pulse">...</span>
            </div>
            <div style={{ fontSize:12, color:"var(--text3)" }}>Querying LeetCode GraphQL API</div>
          </div>
        )}

        {error && !loading && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"calc(100vh - 64px)", gap:16 }}>
            <div style={{ fontSize:48 }}>⚠️</div>
            <div style={{ fontSize:18, fontWeight:500, color:"var(--red)" }}>User Not Found</div>
            <div style={{ fontSize:13, color:"var(--text2)", maxWidth:420, textAlign:"center", background:"var(--surface)", border:"0.5px solid var(--border)", borderRadius:12, padding:"16px 20px", lineHeight:1.6 }}>
              {error}
            </div>
            <button onClick={() => analyze(username)}
              style={{ padding:"10px 24px", borderRadius:10, background:"linear-gradient(135deg,#185FA5,#3B6D11)", color:"#fff", border:"none", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"var(--font-main)" }}>
              Try Again
            </button>
          </div>
        )}

        {data && !loading && <Dashboard data={data} recent={recent} onAnalyze={analyze} />}
      </div>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
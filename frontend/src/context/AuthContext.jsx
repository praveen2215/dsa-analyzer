import React, { createContext, useContext, useState, useEffect } from "react"
import { authMe, authLogout } from "../utils/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authMe()
      .then(res => {
        // Only set user if actually authenticated
        if (res?.user) {
          setUser(res.user)
        } else {
          setUser(null)
        }
      })
      .catch(() => {
        // 401 or any error = not logged in = show login page
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login  = (user) => setUser(user)

  const logout = async () => {
    try { await authLogout() } catch(_) {}
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
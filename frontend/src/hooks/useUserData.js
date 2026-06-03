import { useState, useCallback, useEffect } from "react"
import { fetchUser, fetchRecent } from "../utils/api"

export function useUserData(currentUser) {
  const [data,     setData]     = useState(null)
  const [recent,   setRecent]   = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [username, setUsername] = useState("")

  // Clear all data when the logged-in user changes
  useEffect(() => {
    setData(null)
    setRecent(null)
    setError(null)
    setUsername("")
    setLoading(false)
  }, [currentUser])

  const analyze = useCallback(async (uname) => {
    if (!uname?.trim()) return
    const name = uname.trim()
    setLoading(true)
    setError(null)
    setData(null)
    setRecent(null)
    setUsername(name)

    try {
      const [userData, recentData] = await Promise.allSettled([
        fetchUser(name),
        fetchRecent(name, 8),
      ])

      if (userData.status === "rejected") {
        const msg = userData.reason?.response?.data?.error || "User not found or LeetCode is unavailable."
        throw new Error(msg)
      }

      setData(userData.value)
      if (recentData.status === "fulfilled") setRecent(recentData.value)
    } catch (err) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  const clearData = useCallback(() => {
    setData(null)
    setRecent(null)
    setError(null)
    setUsername("")
  }, [])

  return { data, recent, loading, error, username, analyze, clearData }
}
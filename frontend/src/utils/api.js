import axios from "axios"

const api = axios.create({
  baseURL:         "/api",
  timeout:         20000,
  withCredentials: true,
})

const authApi = axios.create({
  baseURL:         "/auth",
  timeout:         10000,
  withCredentials: true,
})

export const fetchUser    = (username) => api.get(`/user/${username}`).then(r => r.data)
export const fetchRecent  = (username, limit = 10) => api.get(`/user/${username}/recent?limit=${limit}`).then(r => r.data)

export const authMe       = ()     => authApi.get("/me").then(r => r.data)
export const authLogin    = (data) => authApi.post("/login", data).then(r => r.data)
export const authRegister = (data) => authApi.post("/register", data).then(r => r.data)
export const authLogout   = ()     => authApi.post("/logout").then(r => r.data)
export const getProfiles  = ()     => authApi.get("/profiles").then(r => r.data)
export const saveProfile  = (data) => authApi.post("/profiles", data).then(r => r.data)
export const deleteProfile= (u)    => authApi.delete(`/profiles/${u}`).then(r => r.data)
export const getHistory   = ()     => authApi.get("/history").then(r => r.data)

export default api
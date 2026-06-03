require("dotenv").config()
const express        = require("express")
const cors           = require("cors")
const axios          = require("axios")
const NodeCache      = require("node-cache")
const rateLimit      = require("express-rate-limit")
const session        = require("express-session")
const ConnectSQLite  = require("connect-sqlite3")(session)
const bcrypt         = require("bcryptjs")
const { v4: uuidv4 } = require("uuid")
const passport       = require("./auth")
const { userQueries, profileQueries, historyQueries } = require("./database")

const app   = express()
const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL) || 300 })

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}))
app.use(express.json())

app.use(session({
  store:             new ConnectSQLite({ db: "sessions.db", dir: __dirname }),
  secret:            process.env.SESSION_SECRET || "fallback_secret",
  resave:            false,
  saveUninitialized: false,
  cookie: {
    secure:   process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge:   7 * 24 * 60 * 60 * 1000,
  }
}))

app.use(passport.initialize())
app.use(passport.session())

const limiter = rateLimit({ windowMs: 60*1000, max: 30, message: { error: "Too many requests." } })
app.use("/api/", limiter)

// ─── Auth Middleware ──────────────────────────────────────────────────────────
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.status(401).json({ error: "Please log in to continue." })
}

// ─── LeetCode Helper ──────────────────────────────────────────────────────────
const LC_URL  = "https://leetcode.com/graphql"
const HEADERS = {
  "Content-Type": "application/json",
  Referer:        "https://leetcode.com",
  "User-Agent":   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
}

async function lcQuery(query, variables = {}) {
  const res = await axios.post(LC_URL, { query, variables }, { headers: HEADERS, timeout: 15000 })
  if (res.data.errors) throw new Error(res.data.errors[0].message)
  return res.data.data
}

// ─── GraphQL Queries ──────────────────────────────────────────────────────────
const Q_PROFILE = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        ranking userAvatar realName aboutMe school
        websites countryName company jobTitle skillTags
        postViewCount reputation solutionCount
      }
      submitStats: submitStatsGlobal {
        acSubmissionNum { difficulty count submissions }
      }
      badges { id displayName icon creationDate }
      upcomingBadges { name icon }
      activeBadge { displayName icon }
    }
  }`

const Q_SOLVED = `
  query userSolvedProblemsInfo($username: String!) {
    matchedUser(username: $username) {
      submitStats: submitStatsGlobal {
        acSubmissionNum { difficulty count submissions }
      }
      problemsSolvedBeatsStats { difficulty percentage }
    }
    userContestRanking(username: $username) {
      attendedContestsCount rating globalRanking
      totalParticipants topPercentage badge { name }
    }
  }`

const Q_CALENDAR = `
  query userProfileCalendar($username: String!, $year: Int) {
    matchedUser(username: $username) {
      userCalendar(year: $year) {
        activeYears streak totalActiveDays submissionCalendar
      }
    }
  }`

const Q_RECENT = `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id title titleSlug timestamp statusDisplay lang runtime memory
    }
  }`

const Q_TOPIC_TAGS = `
  query skillStats($username: String!) {
    matchedUser(username: $username) {
      tagProblemCounts {
        advanced     { tagName tagSlug problemsSolved }
        intermediate { tagName tagSlug problemsSolved }
        fundamental  { tagName tagSlug problemsSolved }
      }
    }
  }`

const Q_CONTEST = `
  query userContestRankingInfo($username: String!) {
    userContestRanking(username: $username) {
      attendedContestsCount rating globalRanking
      totalParticipants topPercentage badge { name }
    }
    userContestRankingHistory(username: $username) {
      attended trendDirection problemsSolved totalProblems
      finishTimeInSeconds rating ranking
      contest { title startTime }
    }
  }`

const Q_LANGUAGE = `
  query languageStats($username: String!) {
    matchedUser(username: $username) {
      languageProblemCount { languageName problemsSolved }
    }
  }`

// ─── Auth Routes ──────────────────────────────────────────────────────────────

// Register
app.post("/auth/register", async (req, res) => {
  const { email, username, password } = req.body
  if (!email || !username || !password)
    return res.status(400).json({ error: "All fields are required." })
  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters." })
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return res.status(400).json({ error: "Username can only contain letters, numbers and underscores." })

  try {
    if (userQueries.findByEmail.get(email))
      return res.status(409).json({ error: "An account with this email already exists." })
    if (userQueries.findByUsername.get(username))
      return res.status(409).json({ error: "This username is already taken." })

    const hashed = await bcrypt.hash(password, 12)
    const user   = { id: uuidv4(), email, username, password: hashed, google_id: null, avatar: null }
    userQueries.create.run(user)

    const { password: _, ...safeUser } = user
    req.login(safeUser, err => {
      if (err) return res.status(500).json({ error: "Login after register failed." })
      res.json({ user: safeUser, message: "Account created successfully!" })
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Registration failed. Please try again." })
  }
})

// Login
app.post("/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err)   return res.status(500).json({ error: "Login error." })
    if (!user) return res.status(401).json({ error: info?.message || "Invalid credentials." })
    req.login(user, err => {
      if (err) return res.status(500).json({ error: "Session error." })
      res.json({ user, message: "Logged in successfully!" })
    })
  })(req, res, next)
})

// Logout
app.post("/auth/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ error: "Logout failed." })
    req.session.destroy()
    res.json({ message: "Logged out successfully." })
  })
})

// Get current user
app.get("/auth/me", (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ user: null })
  res.json({ user: req.user })
})

// ─── Saved Profiles Routes ────────────────────────────────────────────────────
app.get("/auth/profiles", requireAuth, (req, res) => {
  const profiles = profileQueries.getByUser.all(req.user.id)
  res.json({ profiles })
})

app.post("/auth/profiles", requireAuth, (req, res) => {
  const { leetcode_username, nickname, is_primary } = req.body
  if (!leetcode_username) return res.status(400).json({ error: "LeetCode username required." })
  try {
    profileQueries.save.run({
      id:                uuidv4(),
      user_id:           req.user.id,
      leetcode_username,
      nickname:          nickname || null,
      is_primary:        is_primary ? 1 : 0,
      last_analyzed:     new Date().toISOString(),
    })
    if (is_primary) profileQueries.setPrimary.run(leetcode_username, req.user.id)
    res.json({ message: "Profile saved!" })
  } catch (err) {
    res.status(500).json({ error: "Failed to save profile." })
  }
})

app.delete("/auth/profiles/:username", requireAuth, (req, res) => {
  profileQueries.delete.run(req.user.id, req.params.username)
  res.json({ message: "Profile removed." })
})

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status:"ok", authenticated: req.isAuthenticated(), timestamp: new Date().toISOString() })
})

// ─── LeetCode API Routes ──────────────────────────────────────────────────────
app.get("/api/user/:username", requireAuth, async (req, res) => {
  const { username } = req.params
  const cacheKey = `full_${req.user.id}_${username}`
  const cached   = cache.get(cacheKey)
  if (cached) return res.json({ ...cached, cached: true })

  try {
    const [profileData, solvedData, calendarData, topicData, contestData, langData] =
      await Promise.allSettled([
        lcQuery(Q_PROFILE,    { username }),
        lcQuery(Q_SOLVED,     { username }),
        lcQuery(Q_CALENDAR,   { username, year: new Date().getFullYear() }),
        lcQuery(Q_TOPIC_TAGS, { username }),
        lcQuery(Q_CONTEST,    { username }),
        lcQuery(Q_LANGUAGE,   { username }),
      ])

    const getValue = r => r.status === "fulfilled" ? r.value : null

    const profile  = getValue(profileData)?.matchedUser
    const solved   = getValue(solvedData)
    const calendar = getValue(calendarData)?.matchedUser?.userCalendar
    const topics   = getValue(topicData)?.matchedUser?.tagProblemCounts
    const contest  = getValue(contestData)
    const lang     = getValue(langData)?.matchedUser?.languageProblemCount

    if (!profile) {
      return res.status(404).json({
        error: `User "${username}" does not exist on LeetCode. Please check the username and try again.`
      })
    }

    const acStats = solved?.matchedUser?.submitStats?.acSubmissionNum || []
    const beats   = solved?.matchedUser?.problemsSolvedBeatsStats    || []
    const contestRank    = solved?.userContestRanking || contest?.userContestRanking
    const contestHistory = contest?.userContestRankingHistory || []

    const findAC = diff => acStats.find(s => s.difficulty === diff) || { count:0, submissions:0 }
    const allAC  = findAC("All")
    const easyAC = findAC("Easy")
    const medAC  = findAC("Medium")
    const hardAC = findAC("Hard")

    let calendarParsed = {}
    try { calendarParsed = JSON.parse(calendar?.submissionCalendar || "{}") } catch(_) {}

    const contestChart = contestHistory
      .filter(c => c.attended && c.rating)
      .slice(-30)
      .map(c => ({
        contest:        c.contest?.title || "",
        date:           c.contest?.startTime
          ? new Date(c.contest.startTime * 1000).toLocaleDateString("en-US", { month:"short", year:"2-digit" })
          : "",
        rating:         Math.round(c.rating),
        ranking:        c.ranking,
        problemsSolved: c.problemsSolved,
        totalProblems:  c.totalProblems,
      }))

    const result = {
      username,
      profile: {
        realName:    profile.profile?.realName || username,
        avatar:      profile.profile?.userAvatar || null,
        ranking:     profile.profile?.ranking,
        country:     profile.profile?.countryName,
        company:     profile.profile?.company,
        jobTitle:    profile.profile?.jobTitle,
        school:      profile.profile?.school,
        reputation:  profile.profile?.reputation,
        skills:      profile.profile?.skillTags || [],
        aboutMe:     profile.profile?.aboutMe,
        badges:      profile.badges || [],
        activeBadge: profile.activeBadge,
      },
      solved: {
        total:       allAC.count,
        totalSubs:   allAC.submissions,
        easy:        easyAC.count,
        easySubs:    easyAC.submissions,
        medium:      medAC.count,
        mediumSubs:  medAC.submissions,
        hard:        hardAC.count,
        hardSubs:    hardAC.submissions,
        beatsEasy:   beats.find(b => b.difficulty === "Easy")?.percentage   || 0,
        beatsMedium: beats.find(b => b.difficulty === "Medium")?.percentage || 0,
        beatsHard:   beats.find(b => b.difficulty === "Hard")?.percentage   || 0,
      },
      contest: {
        attended:      contestRank?.attendedContestsCount || 0,
        rating:        Math.round(contestRank?.rating || 0),
        globalRanking: contestRank?.globalRanking || 0,
        totalUsers:    contestRank?.totalParticipants || 0,
        topPercentage: contestRank?.topPercentage?.toFixed(2) || "N/A",
        badge:         contestRank?.badge?.name || null,
        history:       contestChart,
      },
      calendar: {
        streak:          calendar?.streak || 0,
        totalActiveDays: calendar?.totalActiveDays || 0,
        activeYears:     calendar?.activeYears || [],
        submissions:     calendarParsed,
      },
      topics: {
        advanced:     topics?.advanced     || [],
        intermediate: topics?.intermediate || [],
        fundamental:  topics?.fundamental  || [],
      },
      languages: lang || [],
      cached:    false,
    }

    // Save to history & profiles
    try {
      historyQueries.add.run({
        id:                uuidv4(),
        user_id:           req.user.id,
        leetcode_username: username,
        total_solved:      result.solved.total,
        rating:            result.contest.rating,
      })
      profileQueries.save.run({
        id:                uuidv4(),
        user_id:           req.user.id,
        leetcode_username: username,
        nickname:          null,
        is_primary:        0,
        last_analyzed:     new Date().toISOString(),
      })
    } catch(_) {}

    cache.set(cacheKey, result)
    res.json(result)

  } catch (err) {
    console.error(`[ERROR] /api/user/${username}:`, err.message)
    if (err.message?.includes("not found") || err.response?.status === 404) {
      return res.status(404).json({
        error: `User "${username}" does not exist on LeetCode.`
      })
    }
    res.status(500).json({ error: "Failed to fetch data. Please try again." })
  }
})

// Recent submissions
app.get("/api/user/:username/recent", requireAuth, async (req, res) => {
  const { username } = req.params
  const limit    = Math.min(parseInt(req.query.limit) || 10, 20)
  const cacheKey = `recent_${req.user.id}_${username}_${limit}`
  const cached   = cache.get(cacheKey)
  if (cached) return res.json(cached)

  try {
    const data   = await lcQuery(Q_RECENT, { username, limit })
    const result = {
      submissions: (data.recentAcSubmissionList || []).map(s => ({
        id:        s.id,
        title:     s.title,
        slug:      s.titleSlug,
        lang:      s.lang,
        runtime:   s.runtime,
        memory:    s.memory,
        timestamp: parseInt(s.timestamp),
        timeAgo:   timeAgo(parseInt(s.timestamp)),
      }))
    }
    cache.set(cacheKey, result, 60)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recent submissions." })
  }
})

// Analysis history
app.get("/auth/history", requireAuth, (req, res) => {
  const history = historyQueries.getByUser.all(req.user.id)
  res.json({ history })
})

// Cache clear
app.delete("/api/cache/:username", requireAuth, (req, res) => {
  cache.del(`full_${req.params.username}`)
  cache.del(`recent_${req.params.username}_10`)
  res.json({ message: `Cache cleared for ${req.params.username}` })
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(timestamp) {
  const diff = Date.now() / 1000 - timestamp
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return new Date(timestamp * 1000).toLocaleDateString("en-US", { month:"short", day:"numeric" })
}

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`\n🚀 DSA Analyzer Backend running on http://localhost:${PORT}`)
  console.log(`🔐 Auth: Session-based (email + password)`)
  console.log(`🗄️  Database: SQLite\n`)
})


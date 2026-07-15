const { Pool } = require("pg")

// Use PostgreSQL in production, SQLite in development
const isProduction = process.env.NODE_ENV === "production"

let pool, userQueries, profileQueries, historyQueries

if (isProduction) {
  // ── PostgreSQL (Neon) ───────────────────────────────────────────────────
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  // Create tables
  pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          TEXT PRIMARY KEY,
      email       TEXT UNIQUE NOT NULL,
      username    TEXT UNIQUE NOT NULL,
      password    TEXT,
      google_id   TEXT,
      avatar      TEXT,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS saved_profiles (
      id                TEXT PRIMARY KEY,
      user_id           TEXT NOT NULL,
      leetcode_username TEXT NOT NULL,
      nickname          TEXT,
      is_primary        INTEGER DEFAULT 0,
      last_analyzed     TIMESTAMP,
      created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, leetcode_username)
    );
    CREATE TABLE IF NOT EXISTS analysis_history (
      id                TEXT PRIMARY KEY,
      user_id           TEXT NOT NULL,
      leetcode_username TEXT NOT NULL,
      analyzed_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      total_solved      INTEGER,
      rating            INTEGER
    );
  `).then(() => console.log("PostgreSQL tables ready"))
    .catch(err => console.error("Table creation error:", err))

  userQueries = {
    create: async (user) => {
      await pool.query(
        "INSERT INTO users (id,email,username,password,google_id,avatar) VALUES ($1,$2,$3,$4,$5,$6)",
        [user.id, user.email, user.username, user.password, user.google_id, user.avatar]
      )
    },
    findByEmail: async (email) => {
      const r = await pool.query("SELECT * FROM users WHERE email=$1", [email])
      return r.rows[0] || null
    },
    findByUsername: async (username) => {
      const r = await pool.query("SELECT * FROM users WHERE username=$1", [username])
      return r.rows[0] || null
    },
    findById: async (id) => {
      const r = await pool.query("SELECT * FROM users WHERE id=$1", [id])
      return r.rows[0] || null
    },
  }

  profileQueries = {
    save: async (p) => {
      await pool.query(`
        INSERT INTO saved_profiles (id,user_id,leetcode_username,nickname,is_primary,last_analyzed)
        VALUES ($1,$2,$3,$4,$5,$6)
        ON CONFLICT(user_id,leetcode_username) DO UPDATE SET
          last_analyzed=EXCLUDED.last_analyzed,
          nickname=COALESCE(EXCLUDED.nickname,saved_profiles.nickname)
      `, [p.id, p.user_id, p.leetcode_username, p.nickname, p.is_primary, p.last_analyzed])
    },
    getByUser: async (user_id) => {
      const r = await pool.query("SELECT * FROM saved_profiles WHERE user_id=$1 ORDER BY last_analyzed DESC", [user_id])
      return r.rows
    },
    setPrimary: async (username, user_id) => {
      await pool.query("UPDATE saved_profiles SET is_primary=(leetcode_username=$1) WHERE user_id=$2", [username, user_id])
    },
    delete: async (user_id, username) => {
      await pool.query("DELETE FROM saved_profiles WHERE user_id=$1 AND leetcode_username=$2", [user_id, username])
    },
  }

  historyQueries = {
    add: async (h) => {
      await pool.query(
        "INSERT INTO analysis_history (id,user_id,leetcode_username,total_solved,rating) VALUES ($1,$2,$3,$4,$5)",
        [h.id, h.user_id, h.leetcode_username, h.total_solved, h.rating]
      )
    },
    getByUser: async (user_id) => {
      const r = await pool.query("SELECT * FROM analysis_history WHERE user_id=$1 ORDER BY analyzed_at DESC LIMIT 20", [user_id])
      return r.rows
    },
  }

} else {
  // ── SQLite (local development) ────────────────────────────────────────────
  const Database = require("better-sqlite3")
  const path     = require("path")
  const db       = new Database(path.join(__dirname, "dsa_analyzer.db"))
  db.pragma("journal_mode = WAL")

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL, password TEXT,
      google_id TEXT, avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS saved_profiles (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL,
      leetcode_username TEXT NOT NULL, nickname TEXT,
      is_primary INTEGER DEFAULT 0, last_analyzed DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, leetcode_username)
    );
    CREATE TABLE IF NOT EXISTS analysis_history (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL,
      leetcode_username TEXT NOT NULL,
      analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      total_solved INTEGER, rating INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `)

  userQueries = {
    create:         (user) => db.prepare("INSERT INTO users (id,email,username,password,google_id,avatar) VALUES (@id,@email,@username,@password,@google_id,@avatar)").run(user),
    findByEmail:    (email)    => db.prepare("SELECT * FROM users WHERE email=?").get(email),
    findByUsername: (username) => db.prepare("SELECT * FROM users WHERE username=?").get(username),
    findById:       (id)       => db.prepare("SELECT * FROM users WHERE id=?").get(id),
  }

  profileQueries = {
    save: (p) => db.prepare(`
      INSERT INTO saved_profiles (id,user_id,leetcode_username,nickname,is_primary,last_analyzed)
      VALUES (@id,@user_id,@leetcode_username,@nickname,@is_primary,@last_analyzed)
      ON CONFLICT(user_id,leetcode_username) DO UPDATE SET
        last_analyzed=excluded.last_analyzed,
        nickname=COALESCE(excluded.nickname,nickname)
    `).run(p),
    getByUser:  (user_id)           => db.prepare("SELECT * FROM saved_profiles WHERE user_id=? ORDER BY last_analyzed DESC").all(user_id),
    setPrimary: (username, user_id) => db.prepare("UPDATE saved_profiles SET is_primary=(leetcode_username=?) WHERE user_id=?").run(username, user_id),
    delete:     (user_id, username) => db.prepare("DELETE FROM saved_profiles WHERE user_id=? AND leetcode_username=?").run(user_id, username),
  }

  historyQueries = {
    add:       (h)       => db.prepare("INSERT INTO analysis_history (id,user_id,leetcode_username,total_solved,rating) VALUES (@id,@user_id,@leetcode_username,@total_solved,@rating)").run(h),
    getByUser: (user_id) => db.prepare("SELECT * FROM analysis_history WHERE user_id=? ORDER BY analyzed_at DESC LIMIT 20").all(user_id),
  }
}

module.exports = { userQueries, profileQueries, historyQueries, pool }
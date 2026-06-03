const Database = require("better-sqlite3")
const path = require("path")

const db = new Database(path.join(__dirname, "dsa_analyzer.db"))
db.pragma("journal_mode = WAL")

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    email       TEXT UNIQUE NOT NULL,
    username    TEXT UNIQUE NOT NULL,
    password    TEXT,
    google_id   TEXT,
    avatar      TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS saved_profiles (
    id                TEXT PRIMARY KEY,
    user_id           TEXT NOT NULL,
    leetcode_username TEXT NOT NULL,
    nickname          TEXT,
    is_primary        INTEGER DEFAULT 0,
    last_analyzed     DATETIME,
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, leetcode_username)
  );

  CREATE TABLE IF NOT EXISTS analysis_history (
    id                TEXT PRIMARY KEY,
    user_id           TEXT NOT NULL,
    leetcode_username TEXT NOT NULL,
    analyzed_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_solved      INTEGER,
    rating            INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`)

const userQueries = {
  create:         db.prepare("INSERT INTO users (id, email, username, password, google_id, avatar) VALUES (@id, @email, @username, @password, @google_id, @avatar)"),
  findByEmail:    db.prepare("SELECT * FROM users WHERE email = ?"),
  findByUsername: db.prepare("SELECT * FROM users WHERE username = ?"),
  findById:       db.prepare("SELECT * FROM users WHERE id = ?"),
}

const profileQueries = {
  save: db.prepare(`
    INSERT INTO saved_profiles (id, user_id, leetcode_username, nickname, is_primary, last_analyzed)
    VALUES (@id, @user_id, @leetcode_username, @nickname, @is_primary, @last_analyzed)
    ON CONFLICT(user_id, leetcode_username) DO UPDATE SET
      last_analyzed = excluded.last_analyzed,
      nickname = COALESCE(excluded.nickname, nickname)
  `),
  getByUser:  db.prepare("SELECT * FROM saved_profiles WHERE user_id = ? ORDER BY last_analyzed DESC"),
  setPrimary: db.prepare("UPDATE saved_profiles SET is_primary = (leetcode_username = ?) WHERE user_id = ?"),
  delete:     db.prepare("DELETE FROM saved_profiles WHERE user_id = ? AND leetcode_username = ?"),
}

const historyQueries = {
  add:       db.prepare("INSERT INTO analysis_history (id, user_id, leetcode_username, total_solved, rating) VALUES (@id, @user_id, @leetcode_username, @total_solved, @rating)"),
  getByUser: db.prepare("SELECT * FROM analysis_history WHERE user_id = ? ORDER BY analyzed_at DESC LIMIT 20"),
}

module.exports = { db, userQueries, profileQueries, historyQueries }
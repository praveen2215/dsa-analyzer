const passport      = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt        = require("bcryptjs")
const { userQueries } = require("./database")

const isProduction = process.env.NODE_ENV === "production"

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => {
  try {
    const user = isProduction
      ? await userQueries.findById(id)
      : userQueries.findById(id)
    if (!user) return done(null, false)
    const { password, ...safeUser } = user
    done(null, safeUser)
  } catch(err) { done(err) }
})

passport.use(new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const user = isProduction
        ? await userQueries.findByEmail(email)
        : userQueries.findByEmail(email)
      if (!user)          return done(null, false, { message:"No account found with this email." })
      if (!user.password) return done(null, false, { message:"Account error." })
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) return done(null, false, { message:"Incorrect password." })
      const { password: _, ...safeUser } = user
      return done(null, safeUser)
    } catch(err) { return done(err) }
  }
))

module.exports = passport
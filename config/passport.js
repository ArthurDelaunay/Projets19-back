require("dotenv").config()
const passport = require("passport")
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt

const { User } = require("../models/index")

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}

const strategy = new JwtStrategy(options, async (payload, done) => {
    const { id } = payload

    const user = await User.findOne({
        where: {
            id,
        },
        attributes: { exclude: ["password"] },
    })

    if (user) {
        return done(null, user)
    } else {
        return done(null, false)
    }
})

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, user)
})

passport.use(strategy)

module.exports = passport

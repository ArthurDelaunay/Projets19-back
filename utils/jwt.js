require("dotenv").config({ quiet: true })
const jwt = require("jsonwebtoken")

// fonction qui genere un token jwt

const issueJWT = (user) => {
    const payload = { id: user.id } // informations assossiés au token
    const secret = process.env.JWT_SECRET // clef secrète pour signer le token
    const options = {
        expiresIn: 1000 * 60 * 24, // 24 heures
    }

    const token = jwt.sign(payload, secret, options)

    return {
        token: `Bearer ${token}`,
    }
}

module.exports = issueJWT

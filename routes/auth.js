const express = require("express")
const app = express()
const { body, validationResult } = require("express-validator")

const { User } = require("../models/index")
const issueJTW = require("../utils/jwt")
const bcrypt = require("bcrypt")

app.post(
    "/login",
    body("username").exists().withMessage("username is required"),
    body("password").exists().withMessage("password is required"),
    async (req, res) => {
        try {
            const errorResult = validationResult(req).array()
            if (errorResult.length > 0) {
                res.status(400).json({ errors: errorResult })
            } else {
                const { username, password } = req.body
                // logique pour trouver le user avec son username et password
                const user = await User.findOne({ where: { username } })
                if (!user) {
                    // si le user n'existe pas, on renvoie une erreur 404
                    res.status(404).json({
                        errors: [{ msg: "username not found" }],
                    })
                } else {
                    const validPassword = await bcrypt.compare(
                        password,
                        user.password
                    )
                    if (validPassword) {
                        // génération du token
                        const token = issueJTW(user)
                        // réponse de l'API au client avec le user et le token
                        res.status(200).json({
                            token,
                        })
                    } else {
                        res.status(400).json({
                            errors: [{ msg: "incorrect password" }],
                        })
                    }
                }
            }
        } catch (e) {
            res.status(500).json({
                errors: [{ msg: "Internal server problem" }],
            })
        }
    }
)

module.exports = app

const express = require("express")
const app = express()
const { body, validationResult } = require("express-validator")

const { User } = require("../models/index")
const issueJTW = require("../utils/jwt")
const bcrypt = require("bcrypt")

app.post(
    "/login",
    body("email").exists().withMessage("email is required"),
    body("password").exists().withMessage("password is required"),
    async (req, res) => {
        try {
            const errorResult = validationResult(req).array()
            if (errorResult.length > 0) {
                res.status(400).json({ errors: errorResult })
            } else {
                const { email, password } = req.body
                // logique pour trouver le user avec son email et password
                const user = await User.findOne({ where: { email } })
                if (!user) {
                    // si le user n'existe pas, on renvoie une erreur 404
                    res.status(404).json({
                        errors: [{ msg: "user not found" }],
                    })
                } else {
                    if (user.isActive) {
                        const validPassword = await bcrypt.compare(
                            password,
                            user.password
                        )
                        if (validPassword) {
                            // génération du token
                            const token = issueJTW(user)
                            // réponse de l'API au client avec le user et le token
                            res.status(200).json(token)
                        } else {
                            res.status(400).json({
                                errors: [{ msg: "incorrect password" }],
                            })
                        }
                    } else {
                        res.status(400).json({
                            errors: [
                                {
                                    msg: "this account is not active, please contact an admin",
                                },
                            ],
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

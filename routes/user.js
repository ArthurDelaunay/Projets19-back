const express = require("express")
const app = express()
const { body, validationResult } = require("express-validator")
const passport = require("../config/passport")
const bcrypt = require("bcrypt")

const { isEmailTaken } = require("../middlewares/user")

const { User } = require("../models/index")
// route pour créer un compte utilisateur
app.post(
    "/signup",
    isEmailTaken,
    body("email")
        .exists()
        .withMessage("email is required")
        .notEmpty()
        .withMessage("email can't be empty")
        .isLength({ max: 128 })
        .withMessage("email must not exceed 128 characters ")
        .isEmail()
        .withMessage("email should follow the email format (xyz@xyz.xyz)"),
    body("password")
        .exists()
        .withMessage("password is required")
        .isLength({ min: 6 })
        .withMessage("Password is too short (minimun 6 characters")
        .isLength({ max: 16 })
        .withMessage("Password is too long (maximum 16 characters"),
    body("firstName")
        .exists()
        .withMessage("first name is required")
        .notEmpty()
        .withMessage("first name can't be empty")
        .isLength({ max: 128 })
        .withMessage("first name must not exceed 128 characters "),
    body("lastName")
        .exists()
        .withMessage("last name is required")
        .notEmpty()
        .withMessage("last name can't be empty")
        .isLength({ max: 128 })
        .withMessage("last name must not exceed 128 characters "),
    async (req, res) => {
        try {
            const errorResult = validationResult(req).array()
            if (errorResult.length > 0) {
                res.status(400).json({ errors: errorResult })
            } else {
                const { email, password, firstName, lastName } = req.body
                const hashedPassword = await bcrypt.hash(password, 10)
                const user = await User.create({
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    role: "user",
                    isValidate: false,
                })
                res.status(200).json(
                    "User created, wait for an admin validation"
                )
            }
        } catch (e) {
            console.log(e)
            res.status(500).json({
                errors: [{ msg: "Internal server problem" }],
            })
        }
    }
)

// route pour obtenir ses informations de compte utilisateur
// route protégée par l'authentification
app.get("/", passport.authenticate("jwt"), async (req, res) => {
    try {
        const id = req.user.id

        const user = await User.findOne({
            attributes: { exclude: ["password"] },
            where: {
                id,
            },
        })
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(401).json({ errors: [{ msg: "user not found" }] })
        }
    } catch (e) {
        res.status(500).json({
            errors: [{ msg: "Internal server problem" }],
        })
    }
})

// route pour modifier ses informations de compte utilisateur
// route protégée par l'authentification

// route pour désactiver son compte utilisateur
// route protégée par l'authentification

module.exports = app

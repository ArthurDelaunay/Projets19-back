const express = require("express")
const app = express()

const passport = require("../config/passport")
const { body, validationResult } = require("express-validator")

const { User } = require("../models/index")
const { isAdmin } = require("../middlewares/admin")
const { userIdExist } = require("../middlewares/users")

// route pour obtenir la liste des utilisateurs
// route protégée par l'authentification administrateur
app.get("/", passport.authenticate("jwt"), isAdmin, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            order: [["id", "ASC"]],
        })
        res.status(200).json(users)
    } catch (e) {
        res.status(500).json({
            errors: [{ msg: "Internal server problem" }],
        })
    }
})

// route pour modifier un utilisateur
// route protégée par l'authentification administrateur
app.put(
    "/:userId",
    passport.authenticate("jwt"),
    isAdmin,
    userIdExist,
    body("isActive")
        .exists()
        .withMessage("isActive is required")
        .notEmpty()
        .withMessage("isActive can't be empty")
        .isBoolean()
        .withMessage("isActive must be a boolean"),
    async (req, res) => {
        try {
            const errorResult = validationResult(req).array()
            if (errorResult.length > 0) {
                res.status(400).json({ errors: errorResult })
            } else {
                const { isActive } = req.body
                const { userId } = req.params
                await User.update({ isActive }, { where: { id: userId } })
                const updatedUser = await User.findOne({
                    where: { id: userId },
                    attributes: { exclude: ["password"] },
                })
                res.status(200).json(updatedUser)
            }
        } catch (e) {
            res.status(500).json({
                errors: [{ msg: "Internal server problem" }],
            })
        }
    }
)

// route pour supprimer un utilisateur
// route protégée par l'authentification administrateur
app.delete(
    "/:userId",
    passport.authenticate("jwt"),
    isAdmin,
    userIdExist,
    async (req, res) => {
        try {
            const { userId } = req.params
            await User.destroy({ where: { id: userId } })
            res.status(200).json("user deleted")
        } catch (e) {
            res.status(500).json({
                errors: [{ msg: "Internal server problem" }],
            })
        }
    }
)

module.exports = app

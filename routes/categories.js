const express = require("express")
const app = express()

const passport = require("../config/passport")
const { body, validationResult } = require("express-validator")

const { Category } = require("../models/index")
const { isAdmin } = require("../middlewares/admin")
const {
    categoryIdExistByParams,
    categoryLabelNotExist,
} = require("../middlewares/categories")

// route pour obtenir la liste des categories des liens
// route protégée par l'authentification
app.get("/", passport.authenticate("jwt"), async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: ["id", "label"],
        })
        if (categories) {
            res.status(200).json(categories)
        } else {
            res.status(404).json({ errors: [{ msg: "no category found" }] })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            errors: [{ msg: "Internal server problem" }],
        })
    }
})

// route pour créer une catégorie des liens
// route protégée par l'authentification administrateur
app.post(
    "/",
    passport.authenticate("jwt"),
    isAdmin,
    categoryLabelNotExist,
    body("label")
        .exists()
        .withMessage("label is required")
        .notEmpty()
        .withMessage("label can't be empty"),
    async (req, res) => {
        try {
            const errorResult = validationResult(req).array()
            if (errorResult.length > 0) {
                res.status(400).json({ errors: errorResult })
            } else {
                const { label } = req.body
                const newCategory = await Category.create({
                    label,
                })
                res.status(201).json(newCategory)
            }
        } catch (e) {
            res.status(500).json({
                errors: [{ msg: "Internal server problem" }],
            })
        }
    }
)

// route pour supprimer une catégorie des liens
// route protégée par l'authentification administrateur
app.delete(
    "/:categoryId",
    passport.authenticate("jwt"),
    isAdmin,
    categoryIdExistByParams,
    async (req, res) => {
        try {
            const { categoryId } = req.params
            await Category.destroy({
                where: { id: categoryId },
            })
            res.status(200).json("category and associated links deleted")
        } catch (e) {
            res.status(500).json({
                errors: [{ msg: "Internal server problem" }],
            })
        }
    }
)

module.exports = app

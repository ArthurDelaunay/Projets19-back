const express = require("express")
const app = express()
const { body, validationResult } = require("express-validator")
const passport = require("../config/passport")
const { atLeastOneTrueAnswer } = require("../middlewares/questions")
const { Question } = require("../models/index")

// route pour obtenir la liste de toutes les questions et leurs réponses associées
// route protégé par l'authentification
app.get("/", passport.authenticate("jwt"), async (req, res) => {
    try {
        const questions = await Question.findAll({
            attributes: ["id", "text"],
            include: [
                {
                    association: "answers",
                    attributes: ["id", "text", "isCorrect"],
                },
            ],
        })
        res.status(200).json(questions)
    } catch (e) {
        res.status(500).json({
            errors: [{ msg: "Internal server problem" }],
        })
    }
})

// route pour créer une question avec ses réponses
// route protégé par l'authentification

app.post(
    "/",
    passport.authenticate("jwt"),
    body("text")
        .exists()
        .withMessage("text is required")
        .notEmpty()
        .withMessage("text can't be empty")
        .isLength({ max: 128 })
        .withMessage("text must not exceed 128 characters "),
    body("answers")
        .exists()
        .withMessage("answers is required")
        .isArray({ min: 2, max: 8 })
        .withMessage(
            "answers must be an array of minimun 2 elements and maximum 8 elements"
        ),
    body("answers.*.text")
        .exists()
        .withMessage("text of answer is required")
        .notEmpty()
        .withMessage("text of answer can't be empty"),
    body("answers.*.isCorrect")
        .exists()
        .withMessage("isCorrect of answer is required")
        .notEmpty()
        .withMessage("isCorrect of answer can't be empty")
        .isBoolean()
        .withMessage("isCorrect must be a boolean"),
    atLeastOneTrueAnswer,
    async (req, res) => {
        try {
            const errorResult = validationResult(req).array()
            if (errorResult.length > 0) {
                res.status(400).json({ errors: errorResult })
            } else {
                // on crée la question et les réponses à cette question
                const { text, answers } = req.body
                const newQuestion = await Question.create(
                    {
                        text,
                        answers,
                        userId: req.user.id,
                    },
                    {
                        include: [
                            {
                                association: "answers",
                                attributes: ["text", "isCorrect"],
                            },
                        ],
                    }
                )

                res.status(201).json(newQuestion)
            }
        } catch (e) {
            res.status(500).json({
                errors: [{ msg: "Internal server problem" }],
            })
        }
    }
)

// route pour mettre à jour les questions et réponses
// route protégé par l'authentification

// route pour supprimer une question et ses réponses
// route protégé par l'authentification administrateur
module.exports = app

const express = require("express")
const app = express()
const { body, validationResult } = require("express-validator")

const { Question } = require("../models/index")
const { generateQuestionsListRandomlyOrder } = require("../utils/quiz")
// route pour obtenir un quiz de n questions
app.get(
    "/",
    body("number")
        .exists()
        .withMessage("number is required")
        .notEmpty()
        .withMessage("number can't be empty")
        .isInt({ min: 1 })
        .withMessage("number must be a positive integer"),
    async (req, res) => {
        try {
            const errorResult = validationResult(req).array()
            if (errorResult.length > 0) {
                res.status(400).json({ errors: errorResult })
            } else {
                const { number } = req.body
                const maximumQuestions = await Question.findAll({
                    attributes: ["id", "text"],
                    include: [
                        {
                            association: "answers",
                            attributes: ["id", "text", "isCorrect"],
                        },
                    ],
                })

                // on vérifie que le nombre de questions demandé est inférieur à notre total de questions disponible
                // dans le cas où il est trop grand on le bloque au maximum disponible
                let howManyQuestions = 0
                if (number > maximumQuestions.length) {
                    howManyQuestions = maximumQuestions.length
                } else {
                    howManyQuestions = number
                }

                // on génère notre quiz avec un nombre spécifié de questions et leurs réponses
                const quiz = generateQuestionsListRandomlyOrder(
                    maximumQuestions,
                    howManyQuestions
                )
                res.status(200).json(quiz)
            }
        } catch (e) {
            res.status(500).json({
                errors: [{ msg: "Internal server problem" }],
            })
        }
    }
)

module.exports = app

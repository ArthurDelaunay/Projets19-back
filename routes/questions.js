const express = require("express")
const app = express()
const { body, validationResult } = require("express-validator")

const passport = require("../config/passport")

const { isAdmin } = require("../middlewares/admin")

const {
    atLeastOneTrueAnswer,
    questionIdExist,
    answerIdExist,
    answerIdIsOwnByQuestionId,
    stillOneTrueAnswer,
} = require("../middlewares/questions")

const { Question, Answer } = require("../models/index")

// route pour obtenir la liste de toutes les questions et leurs réponses associées
// route protégée par l'authentification
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
// route protégée par l'authentification

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

// route pour mettre à jour une question par son id
// route protégée par l'authentification
app.put(
    "/:questionId",
    passport.authenticate("jwt"),
    questionIdExist,
    body("text")
        .exists()
        .withMessage("text is required")
        .notEmpty()
        .withMessage("text can't be empty")
        .isLength({ max: 128 })
        .withMessage("text must not exceed 128 characters "),
    async (req, res) => {
        try {
            const errorResult = validationResult(req).array()
            if (errorResult.length > 0) {
                res.status(400).json({ errors: errorResult })
            } else {
                const { questionId } = req.params
                const { text } = req.body

                // mise à jour de la question
                await Question.update(
                    {
                        text,
                        lastUpdateBy: req.user.id,
                    },
                    {
                        where: { id: questionId },
                    }
                )
                const updatedQuestion = await Question.findOne({
                    where: { id: questionId },
                    attributes: ["id", "text"],
                    include: [
                        {
                            association: "answers",
                            attributes: ["text", "isCorrect", "id"],
                        },
                    ],
                })
                res.status(200).json(updatedQuestion)
            }
        } catch (e) {
            res.status(500).json({
                errors: [{ msg: "Internal server problem" }],
            })
        }
    }
)

// route pour modifier une réponse existante à une question par son id
// route protégée par authentification
app.put(
    "/:questionId/answers/:answerId",
    passport.authenticate("jwt"),
    questionIdExist,
    answerIdExist,
    answerIdIsOwnByQuestionId,
    stillOneTrueAnswer,
    body("text")
        .exists()
        .withMessage("text is required")
        .notEmpty()
        .withMessage("text can't be empty")
        .isLength({ max: 128 })
        .withMessage("text must not exceed 128 characters "),
    body("isCorrect")
        .exists()
        .withMessage("isCorrect is required")
        .notEmpty()
        .withMessage("isCorrect can't be empty")
        .isBoolean()
        .withMessage("isCorrect must be a boolean"),
    async (req, res) => {
        try {
            const errorResult = validationResult(req).array()
            if (errorResult.length > 0) {
                res.status(400).json({ errors: errorResult })
            } else {
                const { answerId, questionId } = req.params
                const { text, isCorrect } = req.body
                await Answer.update(
                    {
                        text,
                        isCorrect,
                        lastUpdateBy: req.user.id,
                    },
                    {
                        where: { id: answerId },
                    }
                )
                const updatedQuestion = await Question.findOne({
                    where: { id: questionId },
                    attributes: ["id", "text"],
                    include: [
                        {
                            association: "answers",
                            attributes: ["text", "isCorrect", "id"],
                        },
                    ],
                })
                res.status(200).json(updatedQuestion)
            }
        } catch (e) {
            res.status(500).json({
                errors: [{ msg: "Internal server problem" }],
            })
        }
    }
)

// route pour ajouter une réponse à une question existante
// route protégée par l'authentification
app.post(
    "/:questionId/answers",
    passport.authenticate("jwt"),
    questionIdExist,
    body("text")
        .exists()
        .withMessage("text is required")
        .notEmpty()
        .withMessage("text can't be empty")
        .isLength({ max: 128 })
        .withMessage("text must not exceed 128 characters "),
    body("isCorrect")
        .exists()
        .withMessage("isCorrect is required")
        .notEmpty()
        .withMessage("isCorrect can't be empty")
        .isBoolean()
        .withMessage("isCorrect must be a boolean"),
    async (req, res) => {
        try {
            const errorResult = validationResult(req).array()
            if (errorResult.length > 0) {
                res.status(400).json({ errors: errorResult })
            } else {
                const { text, isCorrect } = req.body
                const { questionId } = req.params
                await Answer.create({
                    text,
                    isCorrect,
                    questionId,
                })
                const updatedQuestion = await Question.findOne({
                    where: { id: questionId },
                    attributes: ["id", "text"],
                    include: [
                        {
                            association: "answers",
                            attributes: ["text", "isCorrect", "id"],
                        },
                    ],
                })
                res.status(200).json(updatedQuestion)
            }
        } catch (e) {
            res.status(500).json({
                errors: [{ msg: "Internal server problem" }],
            })
        }
    }
)

// route pour supprimer une réponse à une question existante
// route protégée par l'authentification
app.delete(
    "/:questionId/answers/:answerId",
    passport.authenticate("jwt"),
    questionIdExist,
    answerIdExist,
    answerIdIsOwnByQuestionId,
    async (req, res) => {
        try {
            const { answerId, questionId } = req.params
            await Answer.destroy({
                where: {
                    id: answerId,
                },
            })
            const updatedQuestion = await Question.findOne({
                where: { id: questionId },
                attributes: ["id", "text"],
                include: [
                    {
                        association: "answers",
                        attributes: ["text", "isCorrect", "id"],
                    },
                ],
            })
            res.status(200).json(updatedQuestion)
        } catch (e) {
            res.status(500).json({
                errors: [{ msg: "Internal server problem" }],
            })
        }
    }
)

// route pour supprimer une question et ses réponses
// route protégée par l'authentification administrateur
app.delete(
    "/:questionId",
    passport.authenticate("jwt"),
    isAdmin,
    questionIdExist,
    async (req, res) => {
        try {
            const { questionId } = req.params
            await Question.destroy({
                where: { id: questionId },
            })
            res.status(200).json("question and associated answers deleted")
        } catch (e) {
            res.status(500).json({
                errors: [{ msg: "Internal server problem" }],
            })
        }
    }
)

module.exports = app

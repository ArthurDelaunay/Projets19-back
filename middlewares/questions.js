const { Question, Answer } = require("../models/index")
const { Op } = require("sequelize")

const atLeastOneTrueAnswer = (req, res, next) => {
    const { answers } = req.body
    // on vérifie qu'au moins une réponse reçue soit correcte
    const foundOneTrue = answers.find((answer) => {
        return answer.isCorrect
    })
    if (foundOneTrue) {
        next()
    } else {
        res.status(404).json({ errors: [{ msg: "one answer must be true" }] })
    }
}

const questionIdExist = async (req, res, next) => {
    const { questionId } = req.params
    const existingQuestionId = await Question.findOne({
        where: {
            id: questionId,
        },
    })
    if (existingQuestionId) {
        next()
    } else {
        res.status(404).json({ errors: [{ msg: "question Id not found" }] })
    }
}

const answerIdExist = async (req, res, next) => {
    const { answerId } = req.params
    const existingAnswerId = await Answer.findOne({
        where: {
            id: answerId,
        },
    })
    if (existingAnswerId) {
        next()
    } else {
        res.status(404).json({ errors: [{ msg: "answer Id not found" }] })
    }
}

const stillOneTrueAnswer = async (req, res, next) => {
    const { questionId, answerId } = req.params
    if (!req.body.isCorrect) {
        const trueAnswer = await Answer.findOne({
            where: { questionId, isCorrect: true, id: { [Op.not]: answerId } },
        })
        if (trueAnswer) {
            next()
        } else {
            res.status(404).json({
                errors: [{ msg: "one answer must be true" }],
            })
        }
    } else {
        next()
    }
}
const answerIdIsOwnByQuestionId = async (req, res, next) => {
    const { questionId, answerId } = req.params
    const matchedQuestionAndAnswer = await Answer.findOne({
        where: {
            id: answerId,
        },
    })
    if (matchedQuestionAndAnswer.dataValues.questionId == questionId) {
        next()
    } else {
        res.status(404).json({
            errors: [{ msg: "answer must match her question " }],
        })
    }
}

module.exports = {
    atLeastOneTrueAnswer,
    questionIdExist,
    answerIdExist,
    stillOneTrueAnswer,
    answerIdIsOwnByQuestionId,
}

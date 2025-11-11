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

module.exports = {
    atLeastOneTrueAnswer,
}

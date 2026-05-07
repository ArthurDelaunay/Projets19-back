const { User } = require("../models/index")

const isEmailTaken = async (req, res, next) => {
    const { email } = req.body
    const alreadyTakenEmail = await User.findOne({
        where: { email },
    })
    if (alreadyTakenEmail) {
        res.status(409).json({ errors: [{ msg: "email already taken" }] })
    } else {
        next()
    }
}

module.exports = { isEmailTaken }

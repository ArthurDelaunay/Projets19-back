const { User } = require("../models/index")

const userIdExist = async (req, res, next) => {
    const { userId } = req.params
    const user = await User.findOne({
        where: {
            id: userId,
        },
    })
    if (user) {
        next()
    } else {
        res.status(404).json({ errors: [{ msg: "user not found" }] })
    }
}

module.exports = { userIdExist }

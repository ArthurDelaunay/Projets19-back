const { User } = require("../models/user")

const isAdmin = (req, res, next) => {
    const role = req.user.role
    if (role == "admin") {
        next()
    } else {
        res.status(401).json({
            errors: [{ msg: "unauthorized" }],
        })
    }
}

module.exports = { isAdmin }

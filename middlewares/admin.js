const isAdmin = (req, res, next) => {
    const role = req.user.role
    if (role == "admin") {
        next()
    } else {
        res.status(401).send("Unauthorized")
    }
}

module.exports = { isAdmin }

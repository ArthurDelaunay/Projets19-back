const bcrypt = require("bcrypt")
const { User } = require("../../models")
require("dotenv").config()

const runSeeding = async () => {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

    console.log("Tentative de création Admin")
    await User.create({
        username: "admin",
        password: hashedPassword,
        role: "admin",
    })
    console.log("done")
}

module.exports = runSeeding

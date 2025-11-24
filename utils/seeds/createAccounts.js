const bcrypt = require("bcrypt")
const { User } = require("../../models")
require("dotenv").config({ quiet: true })

const createAdminAccount = async () => {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

    console.log("Tentative de création Admin")
    await User.create({
        username: "admin",
        password: hashedPassword,
        role: "admin",
    })
    console.log("done")
}
const createTestUserAccount = async () => {
    const hashedPassword = await bcrypt.hash(process.env.TESTUSER_PASSWORD, 10)

    console.log("Tentative de création de compte utilisateur de test")
    await User.create({
        username: "testUser",
        password: hashedPassword,
        role: "testuser",
    })
    console.log("done")
}

const createAccounts = async () => {
    const existingAdmin = await User.findOne({ where: { role: "admin" } })
    const existingTestUser = await User.findOne({ where: { role: "testuser" } })
    if (!existingAdmin) {
        await createAdminAccount()
    }
    if (!existingTestUser) {
        await createTestUserAccount()
    }
}

module.exports = createAccounts

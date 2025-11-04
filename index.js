const express = require("express")
const app = express()
const cors = require("cors")
const session = require("express-session")
const authRoutes = require("./routes/auth")
const websitesLinksRoutes = require("./routes/websitesLinks")
require("dotenv").config({ quiet: true })
require("./models")
const port = process.env.PORT
const sessionSecret = process.env.SESSION_SECRET

app.use(express.json())
app.use(cors("*"))

app.use(
    session({
        secret: sessionSecret,
        resave: true,
        saveUninitialized: false,
    })
)

// création d'un compte admin au lancement du serveur
const createAccounts = require("./utils/seeds/createAccounts")
createAccounts()
app.use("/auth", authRoutes)
app.use("/websitesLinks", websitesLinksRoutes)

app.listen(port, () => {
    console.log("Server started on port: " + port)
})

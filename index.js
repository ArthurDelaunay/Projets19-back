const express = require("express")
const app = express()
const cors = require("cors")
const session = require("express-session")

const authRoutes = require("./routes/auth")
const websitesLinksRoutes = require("./routes/websitesLinks")
const quizRoutes = require("./routes/quiz")
const questionsRoutes = require("./routes/questions")
const usersRoutes = require("./routes/users")
const userRoutes = require("./routes/user")
const categoriesRoutes = require("./routes/categories")

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

// création de comptes admin et utilisateur test au lancement du serveur
const createAccounts = require("./utils/seeds/createAccounts")
createAccounts()

app.use("/auth", authRoutes)
app.use("/websitesLinks", websitesLinksRoutes)
app.use("/quiz", quizRoutes)
app.use("/questions", questionsRoutes)
app.use("/users", usersRoutes)
app.use("/user", userRoutes)
app.use("/categories", categoriesRoutes)

app.listen(port, () => {
    console.log("Server started on port: " + port)
})

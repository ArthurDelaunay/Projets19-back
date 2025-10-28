const express = require("express")
const app = express()
const cors = require("cors")
// const session = require("express-session")
const authRoutes = require("./routes/auth")
require("dotenv").config()
require("./models")
const port = process.env.PORT
// const sessionSecret = process.env.SESSION_SECRET

app.use(express.json())
app.use(cors("*"))

// app.use(
//     session({
//         secret: sessionSecret,
//         resave: true,
//         saveUninitialized: false,
//     })
// )

// création d'un compte admin au lancement du serveur
// const runSeeding = require("./utils/seeds/createAdminAccount")
// runSeeding()
app.use("/auth", authRoutes)
app.listen(port, () => {
    console.log("Server started on port: " + port)
})

const express = require("express")
const app = express()
const cors = require("cors")

require("dotenv").config()
require("./models")

const port = process.env.PORT
app.use(cors(""))
app.listen(port, () => {
    console.log("Server started on port: " + port)
})

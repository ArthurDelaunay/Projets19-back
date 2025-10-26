const { Sequelize } = require("sequelize")
require("dotenv").config()

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.USERDB,
    process.env.PASSWORD,
    {
        host: process.env.HOST,
        dialect: "mysql",
    }
)

const connectDb = async () => {
    try {
        await sequelize.authenticate()
        console.log("Connection has been established")
    } catch (error) {
        console.error("Unable to connect to the database" + error)
    }
}

connectDb()

const Answer = require("./answer")(sequelize)
const CV = require("./cv")(sequelize)
const Question = require("./question")(sequelize)
const User = require("./user")(sequelize)
const WebsiteLink = require("./websiteLink")(sequelize)

Answer.belongsTo(Question)
Question.hasMany(Answer)

Question.belongsTo(User)
User.hasMany(Question)

CV.belongsTo(User)
User.hasMany(CV)

WebsiteLink.belongsTo(User)
User.hasMany(WebsiteLink)

sequelize.sync({ alter: true })

const db = {
    sequelize,
    Answer,
    CV,
    Question,
    User,
    WebsiteLink,
}

module.exports = db

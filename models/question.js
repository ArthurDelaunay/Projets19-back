const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const Question = sequelize.define("question", {
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    return Question
}

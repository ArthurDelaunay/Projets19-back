const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const Answer = sequelize.define("answer", {
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isCorrect: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    })
    return Answer
}

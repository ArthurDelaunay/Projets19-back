const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const User = sequelize.define("user", {
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    return User
}

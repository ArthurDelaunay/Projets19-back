const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const User = sequelize.define("user", {
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
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

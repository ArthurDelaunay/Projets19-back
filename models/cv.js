const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const CV = sequelize.define("cv", {
        label: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        downloadUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    return CV
}

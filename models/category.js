const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const Category = sequelize.define("category", {
        label: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    return Category
}

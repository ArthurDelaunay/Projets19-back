const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const WebsiteLink = sequelize.define("websiteLink", {
        label: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    return WebsiteLink
}

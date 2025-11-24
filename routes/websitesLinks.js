const express = require("express")
const app = express()

const passport = require("../config/passport")
const { body, validationResult } = require("express-validator")

const {
    websiteLinkUrlNotExist,
    websiteLinkLabelNotExist,
    websiteLinkExist,
} = require("../middlewares/websitesLinks")
const { isAdmin } = require("../middlewares/admin")
const { WebsiteLink } = require("../models/index")

// route pour obtenir la liste des liens des sites utiles pour l'association
// route protégée par l'authentification
app.get("/", passport.authenticate("jwt"), async (req, res) => {
    try {
        const links = await WebsiteLink.findAll({
            attributes: ["label", "url", "id"],
        })
        if (links) {
            res.status(200).json(links)
        } else {
            res.status(404).json({ errors: [{ msg: "no link found" }] })
        }
    } catch (e) {
        res.status(500).json({
            errors: [{ msg: "Internal server problem" }],
        })
    }
})

// route pour créer un lien des sites utiles pour l'association
// route protégée par l'authentification
app.post(
    "/",
    passport.authenticate("jwt"),
    websiteLinkUrlNotExist,
    websiteLinkLabelNotExist,
    body("label")
        .exists()
        .withMessage("label is required")
        .notEmpty()
        .withMessage("label can't be empty"),
    body("url")
        .exists()
        .withMessage("url is required")
        .notEmpty()
        .withMessage("url can't be empty"),
    async (req, res) => {
        try {
            const errorResult = validationResult(req).array()
            if (errorResult.length > 0) {
                res.status(400).json({ errors: errorResult })
            } else {
                const { url, label } = req.body
                const { id } = req.user.dataValues
                const newWebsiteLink = await WebsiteLink.create({
                    url,
                    label,
                    userId: id,
                })
                res.status(201).json(newWebsiteLink)
            }
        } catch (e) {
            res.status(500).json({
                errors: [{ msg: "Internal server problem" }],
            })
        }
    }
)

// route pour mettre à jour un lien des sites utiles pour l'association
// route protégée par l'authentification
app.put(
    "/:websiteLinkId",
    passport.authenticate("jwt"),
    websiteLinkExist,
    body("url")
        .exists()
        .withMessage("url is required")
        .notEmpty()
        .withMessage("url can't be empty"),

    body("label")
        .exists()
        .withMessage("label is required")
        .notEmpty()
        .withMessage("label can't be empty"),

    async (req, res) => {
        try {
            const errorResult = validationResult(req).array()
            if (errorResult.length > 0) {
                res.status(400).json({ errors: errorResult })
            } else {
                const { websiteLinkId } = req.params
                const { url, label } = req.body
                const { id } = req.user.dataValues
                const websiteLink = await WebsiteLink.findOne({
                    where: { id: websiteLinkId },
                })
                if (websiteLink.dataValues.url == url) {
                    if (websiteLink.dataValues.label == label) {
                        res.status(409).json({
                            errors: [
                                { msg: "url already taken", value: url },
                                { msg: "label already taken", value: label },
                            ],
                        })
                    } else {
                        await WebsiteLink.update(
                            {
                                label,
                                lastUpdateBy: id,
                            },
                            { where: { id: websiteLinkId } }
                        )
                        const updatedWebsiteLink = await WebsiteLink.findOne({
                            where: {
                                id: websiteLinkId,
                            },
                        })
                        res.status(200).json(updatedWebsiteLink)
                    }
                } else {
                    if (websiteLink.dataValues.label == label) {
                        await WebsiteLink.update(
                            {
                                url,
                                lastUpdateBy: id,
                            },
                            { where: { id: websiteLinkId } }
                        )
                        const updatedWebsiteLink = await WebsiteLink.findOne({
                            where: {
                                id: websiteLinkId,
                            },
                        })
                        res.status(200).json(updatedWebsiteLink)
                    } else {
                        await WebsiteLink.update(
                            {
                                url,
                                label,
                                lastUpdateBy: id,
                            },
                            { where: { id: websiteLinkId } }
                        )
                        const updatedWebsiteLink = await WebsiteLink.findOne({
                            where: {
                                id: websiteLinkId,
                            },
                        })
                        res.status(200).json(updatedWebsiteLink)
                    }
                }
            }
        } catch (e) {
            res.status(500).json({
                errors: [{ msg: "Internal server problem" }],
            })
        }
    }
)

// route pour supprimer un lien des sites utiles pour l'association
// route protégée par l'authentification administrateur
app.delete(
    "/:websiteLinkId",
    passport.authenticate("jwt"),
    isAdmin,
    websiteLinkExist,
    async (req, res) => {
        try {
            const { websiteLinkId } = req.params
            await WebsiteLink.destroy({
                where: { id: websiteLinkId },
            })
            res.status(200).json("link deleted")
        } catch (e) {
            res.status(500).json({
                errors: [{ msg: "Internal server problem" }],
            })
        }
    }
)

module.exports = app

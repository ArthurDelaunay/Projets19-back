const { WebsiteLink } = require("../models/index")

const websiteLinkUrlNotExist = async (req, res, next) => {
    const { url } = req.body
    if (url) {
        const existingWebsiteLinkUrl = await WebsiteLink.findOne({
            where: {
                url,
            },
        })
        if (existingWebsiteLinkUrl) {
            res.status(409).json({
                errors: [{ msg: "this url is already taken" }],
            })
        } else {
            next()
        }
    } else {
        next()
    }
}
const websiteLinkLabelNotExist = async (req, res, next) => {
    const { label } = req.body
    if (label) {
        const existingWebsiteLinkLabel = await WebsiteLink.findOne({
            where: {
                label,
            },
        })
        if (existingWebsiteLinkLabel) {
            res.status(409).json({
                errors: [{ msg: "this label is already taken" }],
            })
        } else {
            next()
        }
    } else {
        next()
    }
}

const websiteLinkExist = async (req, res, next) => {
    const { websiteLinkId } = req.params
    const existingWebsiteLink = await WebsiteLink.findOne({
        where: {
            id: websiteLinkId,
        },
    })
    if (existingWebsiteLink) {
        next()
    } else {
        res.status(404).json({ errors: [{ msg: "website link not found" }] })
    }
}

module.exports = {
    websiteLinkUrlNotExist,
    websiteLinkLabelNotExist,
    websiteLinkExist,
}

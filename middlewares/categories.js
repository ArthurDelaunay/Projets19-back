const { Category } = require("../models/index")

const categoryLabelNotExist = async (req, res, next) => {
    const { label } = req.body
    if (label) {
        const existingCategoryLabel = await Category.findOne({
            where: {
                label,
            },
        })
        if (existingCategoryLabel) {
            res.status(409).json({
                errors: [{ msg: "this category label is already taken" }],
            })
        } else {
            next()
        }
    } else {
        next()
    }
}

// const categoryLabelExist = async (req, res, next) => {
//     const { label } = req.body
//     const existingCategoryLabel = await Category.findOne({
//         where: {
//             label,
//         },
//     })
//     if (existingCategoryLabel) {
//         next()
//     } else {
//         res.status(409).json({
//             errors: [{ msg: "this label is already taken" }],
//         })
//     }
// }

const categoryIdExistByParams = async (req, res, next) => {
    const { categoryId } = req.params
    const existingCategoryId = await Category.findOne({
        where: {
            id: categoryId,
        },
    })
    if (existingCategoryId) {
        next()
    } else {
        res.status(404).json({ errors: [{ msg: "category not found" }] })
    }
}
const categoryIdExistByBody = async (req, res, next) => {
    const { categoryId } = req.body
    const existingCategoryId = await Category.findOne({
        where: {
            id: categoryId,
        },
    })
    if (existingCategoryId) {
        next()
    } else {
        res.status(404).json({ errors: [{ msg: "category not found" }] })
    }
}
module.exports = {
    categoryLabelNotExist,
    categoryIdExistByParams,
    categoryIdExistByBody,
}

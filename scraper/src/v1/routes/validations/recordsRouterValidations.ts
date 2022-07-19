import { body } from 'express-validator'
import { regularExpressionCheck, arrOfUniqueIntCheck } from './customExpressValidations'

export const createNewRecordValidation = [
    body('url').isURL(),
    body('label').notEmpty().withMessage("Label can't be empty")
    .isLength({min: 4, max: 16}).withMessage("Label's length must be in following range: [4, 32]"),
    body('boundary').custom(regularExpressionCheck).withMessage("Invalid regular expression"),
    body('periodicity').isNumeric().withMessage("Periodicity must be a number.")
    .isInt({max: 256, min: 0}).withMessage("Periodicity must be a number in range [0, 256]"), // todo: reset the proper upper boundary
    body('active').isBoolean().withMessage("Active must be a boolean"),
    body('tags').optional().custom(arrOfUniqueIntCheck)
    .isArray({max: 5}).withMessage("Too many tags ids, maximum is 5")
];

export const updateOneRecordValidation = [
    body('url').optional().isURL(),
    body('label').optional().notEmpty().withMessage("Label can't be empty")
    .isLength({min: 4, max: 16}).withMessage("Label's length must be in following range: [4, 32]"),
    body('boundary').optional().custom(regularExpressionCheck).withMessage("Invalid regular expression"),
    body('periodicity').optional().isNumeric().withMessage("Periodicity must be a number.")
    .isInt({max: 256, min: 0}).withMessage("Periodicity must be a number in range [0, 256]"), // todo: reset the proper upper boundary
    body('active').optional().isBoolean().withMessage("Active must be a boolean"),
    body('tags').optional().custom(arrOfUniqueIntCheck)
    .isArray({max: 5}).withMessage("Too many tags ids, maximum is 5")
];
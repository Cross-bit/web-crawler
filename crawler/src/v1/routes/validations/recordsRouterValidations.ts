import { body } from 'express-validator'
import { regularExpressionCheck, arrOfUniqueIntCheck } from './customExpressValidations'

const getCrawlerTesterUrl = () => {
    return (/*process.env.CRAWLER_TESTER_BASE_URL || */"crawler_tester");
}

export const createNewRecordValidation = [

    body('url').if( (value:any) => !value.includes(getCrawlerTesterUrl())).isURL().withMessage("Is not URL"),
    body('label').notEmpty().withMessage("Label can't be empty")
    .isLength({min: 4, max: 16}).withMessage("Label's length must be in following range: [4, 32]"),
    body('boundary').custom(regularExpressionCheck).withMessage("Invalid regular expression"),
    body('periodicity_min').isNumeric().withMessage("Periodicity must be a number.")
    .isInt({max: 60, min: 0}).withMessage("Periodicity must be a number in range [0, 60]"),
    body('periodicity_hour').isNumeric().withMessage("Periodicity must be a number.")
    .isInt({max: 23, min: 0}).withMessage("Periodicity must be a number in range [0, 23]"),
    body('periodicity_day').isNumeric().withMessage("Periodicity must be a number.")
    .isInt({max: 365, min: 0}).withMessage("Periodicity must be a number in range [0, 365]"),
    body('active').isBoolean().withMessage("Active must be a boolean"),
    body('tags').optional().isArray({max: 5}).custom((data) => arrOfUniqueIntCheck(data))
];

export const updateOneRecordValidation = [
    // TODO: since we no longer send partial data this we should probably change this should be same as the above(without the optional clause)
    body('url').if( (value:any) => !value.includes(getCrawlerTesterUrl())).isURL().withMessage("Is not URL"),
    body('label').optional().notEmpty().withMessage("Label can't be empty")
    .isLength({min: 4, max: 16}).withMessage("Label's length must be in following range: [4, 32]"),
    body('boundary').optional().custom(regularExpressionCheck).withMessage("Invalid regular expression"),
    body('periodicity_min').isNumeric().withMessage("Periodicity must be a number.")
    .isInt({max: 60, min: 0}).withMessage("Periodicity must be a number in range [0, 60]"),
    body('periodicity_hour').isNumeric().withMessage("Periodicity must be a number.")
    .isInt({max: 23, min: 0}).withMessage("Periodicity must be a number in range [0, 23]"),
    body('periodicity_day').isNumeric().withMessage("Periodicity must be a number.")
    .isInt({max: 365, min: 0}).withMessage("Periodicity must be a number in range [0, 365]"),
    body('active').optional().isBoolean().withMessage("Active must be a boolean"),
    body('tags').optional().isArray({max: 5}).custom((data) => arrOfUniqueIntCheck(data))
];
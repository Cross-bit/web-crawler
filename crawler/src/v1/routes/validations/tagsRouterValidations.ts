import {body} from 'express-validator'


export const createNewTagValidation = [
    body('name').isLength( {min: 3, max: 10} ).withMessage("Tag length must be in following range: [3, 10]")
    .custom(val => !/\s/.test(val)).withMessage("No whitespaces allowed")
    .custom(val => !/\d/.test(val)).withMessage("No numbers allowed")
    .isAlpha().withMessage("Only alpha characters allowed")
    .notEmpty().withMessage("Field is empty"),
];
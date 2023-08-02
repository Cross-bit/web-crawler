import { body } from "express-validator";
import BadRequestError from "../../../Errors/BadRequestError"

export const regularExpressionCheck = (input: string ) => {
    try {
        new RegExp(input);
    }
    catch {
        throw new BadRequestError(`${input} is not valid regular expression!`);
    }

    return true;
}

export const arrOfUniqueIntCheck = (input: Array<number>, options: {max?: number, min?: number} | boolean = false) => {
    if(input === undefined)
        return true;
    const visitedVals = new Set();

    input.forEach((val) => {
        if (!Number.isInteger(val))
            throw new BadRequestError(`All ids must be a number!`);
        visitedVals.add(val);
    })

    if(visitedVals.size != input.length)
        throw new BadRequestError("Elements must be all unique!");

    if (options !== false) {
        const {min, max} = options as {max?: number, min?: number};
        if ( min && input.length < min)
            throw new BadRequestError("Number of elements is less than min!");
        if (max && input.length >= max)
            throw new BadRequestError("Number of elements is larger than max!");
    }

    return true;

}
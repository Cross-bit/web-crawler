import { body } from "express-validator";


export const regularExpressionCheck = (input: string ) => {
    try {
        new RegExp(input);
    }
    catch {
        throw new Error(`${input} is not valid regular expression!`);
    }

    return true;
}

export const arrOfUniqueIntCheck = (input: Array<number>, options: {max?: number, min?: number} | boolean = false) => {
    if(input === undefined)
        return true;
    const visitedVals = new Set();

    input.forEach((val) => {
        if (!Number.isInteger(val))
            throw new Error(`All ids must be a number!`);
        visitedVals.add(val);
    })

    if(visitedVals.size != input.length)
        throw new Error("Elements must be all unique!");

    if (options !== false) {
        const {min, max} = options as {max?: number, min?: number};
        if ( min && input.length < min)
            throw new Error("Number of elements is smaller than min!");
        if (max && input.length >= max)
            throw new Error("Number of elements is larger than max!");
    }

    return true;

}
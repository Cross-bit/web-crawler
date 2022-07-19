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

export const arrOfUniqueIntCheck = (input: Array<number>) => {

    if(input === undefined)
        return true;

    const visitedIds = new Set();
    input.forEach((val)=>{

        if (!Number.isInteger(val))
            throw new Error(`All ids must be a number!`);
        visitedIds.add(val);
    })

    if(visitedIds.size != input.length)
        throw new Error("Ids must be unique!");

    return true;

}
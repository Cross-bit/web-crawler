import * as dbInterface from '../interface';
import sdk from "./connection"


export const GetAllPlannedExecutions = async () => {
    return await sdk.GetAllPlannedExecutions();
}

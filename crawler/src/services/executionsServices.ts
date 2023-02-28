//import ""
import { executionsScheduler } from "./webCrawling/CrawlingServices"
import { ExecutionData } from "../database/interface"
import { insertExecution } from "../database/postgress/executionsDatabase"

const createNewExecution = async (execution: ExecutionData) => {
    try
    {
        // create execution in db
        await insertExecution(execution);

        // plan execution timer
        executionsScheduler.SetExecutionWaiting(execution);
    }
    catch (err)
    {

    }
}

const planExecution = async (execution: ExecutionData) => {
    try
    {


    }
    catch (err)
    {

    }
}
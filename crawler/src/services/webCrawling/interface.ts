import { ExecutionDataWithRecord, RecordData } from "../../database/interface";
import { ProcessWrapper } from "./crawlersPool";


export default interface IExecutionsScheduler {

    SetExecutionWaiting(executionData: ExecutionDataWithRecord): void;
    SynchronizeData(): void;
    RescheduleExecution(executionData: ExecutionDataWithRecord): void;
    GetDateTimeOfNextExecution(executionData: ExecutionDataWithRecord): number;
}

export interface IProcessWrapper {

    IsKilled(): boolean;

    GetPID(): number;

    SetStdoutCallback(psCallback: (data: any) => void): void;

    SetStdinCallback(psCallback: (data: any) => void): void;

    SetStderrCallback(psCallback: (data: any) => void): void;
}

export interface ICrawlersPool {

    AddNewProcessToThePool(): boolean;
    GetProcessFromPool(): IProcessWrapper | undefined;
    IsPoolFull(): boolean;
    DisposePool(): void;
    ReturnProcessToThePool(childProcess: IProcessWrapper): void;
}
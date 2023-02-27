import { ExecutionData } from "../../database/interface";
import { ProcessWrapper } from "./crawlersPool";



export default interface IExecutionsScheduler {

    SetExecutionWaiting(executionData: ExecutionData): void;
    SynchronizeData(): void;
    RescheduleExecution(executionData: ExecutionData): void;
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
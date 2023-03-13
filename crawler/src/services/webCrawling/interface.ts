import { ExecutionDataWithRecord, RecordData } from "../../database/interface";
import { ProcessWrapper } from "./crawlersPool";
import ExecutionsRecord from "./executionRecord";
import ExecutionsPriorityQueue from "./executionsQueue";


export default interface IExecutionsScheduler {

    SetExecutionWaiting(executionData: ExecutionDataWithRecord): void;
    SynchronizeData(): void;
    RescheduleExecution(executionData: ExecutionDataWithRecord): void;
    CreateNewExecutionForRecord(recordData: RecordData, isTimed: boolean): Promise<void>;
    CalculateNextExecutionTime(executionData: ExecutionDataWithRecord): number;
}

export interface IProcessWrapper {

    IsKilled(): boolean;

    GetPID(): number;

    SetStdoutCallback(psCallback: (data: any) => void): void;

    SetStdinCallback(psCallback: (data: any) => void): void;

    SetStderrCallback(psCallback: (data: any) => void): void;

    WriteToStdin(dataToWrite: string): boolean;
}


export interface ICrawlersPool {

    AddNewProcessToThePool(): boolean;
    GetProcessFromPool(): IProcessWrapper | undefined;
    IsPoolFull(): boolean;
    DisposePool(): void;
    ReturnProcessToThePool(childProcess: IProcessWrapper): void;
}

export interface IExecutionQueuesManager {
    InsertExecutionRecord(executionRec: ExecutionsRecord): void;
    RemoveQueue(recordId:number): boolean;
    GetNextQueue(): Generator<ExecutionsPriorityQueue>;
    TryToGetNextItem(): ExecutionsRecord | undefined;
    GetQueuesCount(): number;
    GetSize(): number;
}
import { RecordData } from "../../database/interface";
import ExecutionsRecord from "./CrawlingExecution/executionRecord";
import ExecutionsPriorityQueue from "./CrawlingExecution/ExecutionScheduling/executionsQueue";


export default interface IExecutionsScheduler {
    SynchronizeData(): void;
    CreateNewExecutionForRecord(recordData: RecordData, isTimed: boolean): Promise<void>;
    CancleTimedExecutionsForRecord(recordID: number): Promise<void>;
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
    ReleaseQueue(recordId: number): void
    GetQueuesCount(): number;
    GetSize(): number;
}
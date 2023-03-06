
import { exec, execFile, fork, spawn, ChildProcess } from "child_process";
import { access, constants } from 'node:fs';
import { ICrawlersPool, IProcessWrapper } from  './interface'

/**
 * Custom process wrapper with custom rights for client. (e.g. not to kill it from the outside etc...)
 */
export class ProcessWrapper implements IProcessWrapper
{

    private ps: ChildProcess

    constructor(ps: ChildProcess) {
        this.ps = ps;
    }

    IsKilled = (): boolean => this.ps.killed;
    GetPID = (): number => this.ps.pid as number;

    SetStdoutCallback(psCallback: (data: any) => void): void {
        this.ps.stdout?.on('data', psCallback);
    }

    SetStdinCallback(psCallback: (data: any) => void): void {
        this.ps.stdin?.on('data', psCallback);
    }

    SetStderrCallback(psCallback: (data: any) => void): void {
        this.ps.stderr?.on('data', psCallback);
    }

    WriteToStdin(data: string): boolean {
        if (this.ps.stdin?.writable){
            const res = this.ps.stdin?.write(data);
            this.ps.stdin?.end();
            return res;
        }
        return false;
    }
}

/**
 * Pool of web crawlers
 */
export default class CrawlersPool implements ICrawlersPool
{
    private allProcesses: ChildProcess[]; // list of all "naked" ps for process pool
    private processesUsed: IProcessWrapper[]
    private processPool: IProcessWrapper[]
    private maxPoolSize: number
    private crawlerSource: string

    /**
     *
     * @param initSize How many crawlers to create at the beginning.
     * @param maxPoolSize How many crawlers can be created.
     * @param crawlerExePath Path to crawler executable.
     */
    constructor (initSize: number, maxPoolSize = Number.MAX_SAFE_INTEGER, crawlerExePath = "") {
        this.processPool = [];
        this.processesUsed = [];
        this.allProcesses = [];
        this.maxPoolSize = maxPoolSize;
        this.crawlerSource = crawlerExePath;

        if (this.crawlerSource == undefined)
            throw new Error("Crawler application not found! Path: " + this.crawlerSource);

        access(this.crawlerSource, constants.X_OK, (err) => {
            if (err)
                throw new Error(`${this.crawlerSource} is not executable!`);
        });

        // init the processes in the pool
        this.InitializeProcessPool(initSize);
    }

    private InitializeProcessPool(poolSize: number) {
        for (let i = 0; i < poolSize; i++) {
            if (!this.AddNewProcessToThePool())
                throw new Error("Pool max size exceeded while initialisation!")

        }
    }

    IsPoolFull () : boolean {
        return this.processPool.length >= this.maxPoolSize
    }

    /**
     * Ads new process to the pool.
     * @param initRootUrl
     * @param initRegexBoundary
     * @returns True if success.
     */
    AddNewProcessToThePool(initRootUrl = "", initRegexBoundary = ""): boolean {
        if (this.IsPoolFull())
            return false;

        const spawnedProcess = spawn(this.crawlerSource, [ initRootUrl, initRegexBoundary ]);
        const customProcess = new ProcessWrapper(spawnedProcess);

        this.processPool.push(customProcess);
        this.allProcesses.push(spawnedProcess);

        return true;
    }

    GetProcessFromPool(): IProcessWrapper | undefined {

        const nextProcess = this.processPool.pop();

        if (!nextProcess)
            return undefined;

        this.processesUsed.push(nextProcess);

        return nextProcess;
    }

    /**
     * Kills all processes in the pool.
     */
    DisposePool() { // todo: set up at the beginning
        for (const ps of this.allProcesses) {
            ps.kill();
        }
    }

    ReturnProcessToThePool(childProcess: IProcessWrapper): void {

        let processId = -1;

        for (const el of this.processesUsed) {
            if (process.pid == childProcess.GetPID()) {
                processId = process.pid;
                break;
            }
        }

        if (processId == -1)
            return;

        this.processPool.push(childProcess);
    }
}

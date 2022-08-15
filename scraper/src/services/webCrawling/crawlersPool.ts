
import { exec, execFile, fork, spawn, ChildProcess } from "child_process";
import { access, constants } from 'node:fs';

export class CrawlersPool
{
    private processPool: ChildProcess[]
    private maxPoolSize: number
    private crawlerSource: string

    constructor(initSize: number, maxPoolSize = Number.MAX_SAFE_INTEGER) {
        this.processPool = [];
        this.maxPoolSize = maxPoolSize;
        this.InitializeProcessPool(initSize);
        this.crawlerSource = process.env.CRAWLER_EXE_LOCATION || "";

        if (this.crawlerSource == undefined)
            throw new Error("Crawler application not found! Path: " + this.crawlerSource);

        access(this.crawlerSource, constants.X_OK, (err) => {
            if (err)
                throw new Error(`${this.crawlerSource} is not executable!`);
        });
    }

    private InitializeProcessPool(poolSize: number) {
        for (let i = 0; i < poolSize; i++) {
            this.AddNewProcessToThePool();
        }
    }

    AddNewProcessToThePool(initRootUrl = "", initRegexBoundary = ""): boolean {
        if (this.processPool.length >= this.maxPoolSize)
            return false;

        const spawnedProcess = spawn(this.crawlerSource, [ initRootUrl, initRegexBoundary ]);
        this.processPool.push(spawnedProcess);

        return true;
    }

    GetProcessFromPool(): ChildProcess | undefined {
        return this.processPool.pop();
    }

    ReturnProcessToThePool(childProcess: ChildProcess): void {
        this.processPool.push(childProcess);
    }

}

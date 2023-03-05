import { Worker } from "worker_threads"

class CrawlingWorker extends Worker
{
    
    constructor() {
        super(__filename);
        this.on('message', this.HandleMessage)
    }

    private HandleMessage(message: any) {
        // 
    }

    public run(){
        // my worker implementation
    }



}


import { Worker } from "worker_threads"
import { ExecutionDataWithRecord } from "../../database/interface";
import ExecutionsRecord from "./executionRecord";
import { ICrawlersPool, IProcessWrapper } from "./interface";
/*interface CrawledDataProcessor {
    void ProcessData();
}*/

enum DataProcessorState {
    IDLE,
    CRAWLING,
    READING_CHUNK,
    CHUNK_ACCEPTED


}

class CrawledDataProcessor { 

    currentState: DataProcessorState;

    currentDataChunk: string;

    /*const T_START_DELIMITER = '<<<T_START>>>';
    const T_END_DELIMITER = '<<<T_END>>>';*/
    C_START_DELIMITER = '<<<C_START>>>';
    C_END_DELIMITER = '<<<C_END>>>';

   // chunksQueue: string[]

    constructor() {
        this.currentState = DataProcessorState.IDLE;
        this.currentDataChunk = "";
        this.isCrawling = false;
      //  this.chunksQueue = []
    }

    isCrawling: boolean;
    incomingData = "";

    public ProcessIncomingData(data: string) {

        this.incomingData += data;

        const startIndex =  this.incomingData.indexOf(this.C_START_DELIMITER);
          if (startIndex !== -1) {
              const endIndex =  this.incomingData.indexOf(this.C_END_DELIMITER, startIndex + this.C_START_DELIMITER.length);
                        
            if (endIndex !== -1) {
                 const chunk =  this.incomingData.substring(startIndex + this.C_START_DELIMITER.length, endIndex);
                  this.ProcessDataChunk(chunk);

                  this.incomingData = this.incomingData.substring(endIndex + this.C_END_DELIMITER.length);
              }
          }
        
        //const chunkStart = this.incomingData.indexOf(C_START_DELIMITER);
       // chunkDataSegmented = 

        /*switch(this.currentState)
        {
            case DataProcessorState.IDLE:
                if (data == "###") {
                    this.currentState = DataProcessorState.CRAWLING;
                }
            break;
            case DataProcessorState.CRAWLING:
                if (data == "c_start") {
                    this.currentState = DataProcessorState.READING_CHUNK;
                }
                else if(data == "#") 
                {
                    console.log("Crawled data accepted.");
                    this.currentState = DataProcessorState.IDLE;
                }
            break;
            case DataProcessorState.READING_CHUNK:
                if (data == "c_end") {
                    this.currentState = DataProcessorState.CHUNK_ACCEPTED;
                }
                else
                    this.currentDataChunk += data;
                
            break;
            case DataProcessorState.CHUNK_ACCEPTED:
                console.log("accepted");
                this.ProcessDataChunk(this.currentDataChunk);
                this.currentState = DataProcessorState.CRAWLING;
            break;
        }*/
    }

    ProcessDataChunk(dataChunk:string) {
        console.log(dataChunk);
    }

}

export default class CrawlingWorker extends Worker
{
    crawlersPool: ICrawlersPool;

    dataProcessor: CrawledDataProcessor;

    
    constructor(crawlerPool: ICrawlersPool) {
        super(__filename);
        this.on('message', this.HandleMessage)
        this.crawlersPool = crawlerPool;
        this.dataProcessor = new CrawledDataProcessor();
    }

    private HandleMessage(message: any) {
        // 
    }

    public async run(executionToRun: ExecutionDataWithRecord) {
        console.log("crawling started");
        const crawler = this.crawlersPool.GetProcessFromPool();

        if (!crawler) {
            // todo: throw Error ... max number of crawlers processes reached
            return;
        }



        const dataProcessor = new CrawledDataProcessor();
        console.log("start");
        //crawler.SetStderrCallback();
        crawler.SetStdinCallback(this.StdinCallback);
        crawler.SetStdoutCallback((data)=>{  
            const dataStr = data.toString('utf-8');
            dataProcessor.ProcessIncomingData(dataStr);
        });

        const url = executionToRun.record.url.trim();
        const boundary = executionToRun.record.boundary.trim();
        const crawlerInput = url + " " + boundary + "\n";



        const res = crawler.WriteToStdin(crawlerInput)
        // todo: handle if not recieved correctly...
    }

    private StderrCallback() { }


    /*private StdoutCallback(data: Buffer) {
        console.log(typeof this);
        console.log(typeof dataProcessor);
        const dataStr = data.toString('utf-8');
        dataProcessor.ProcessIncomingData(dataStr);
    }*/



    private StdinCallback() { }

}


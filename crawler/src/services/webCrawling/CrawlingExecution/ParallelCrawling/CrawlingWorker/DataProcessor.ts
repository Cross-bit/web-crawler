import EventEmitter from "events";
import { ExecutionNodeWithErrors, IDatabaseWrapper } from "../../../../../database/interface";
import { ExecutionDataWithRecord } from "../../../../../database/interface";

/**
 * Parses data from crawling service and hands over it to the database.
 */

export default class CrawledDataProcessor { 
    
    currentDataChunk: string;
    database: IDatabaseWrapper;

    totalChunksCount: number;
    totalChunksSendToDb: number;
    public eventEmitter: EventEmitter = new EventEmitter();
    
    totalCrawlTime: number;
    executionRecord: ExecutionDataWithRecord

    chunkPromises: Promise<void>[]
    T_START_DELIMITER = '<<<T_START>>>';
    T_END_DELIMITER = '<<<T_END>>>';
    C_START_DELIMITER = '<<<C_START>>>';
    C_END_DELIMITER = '<<<C_END>>>';

    constructor(database: IDatabaseWrapper, executionRecord: ExecutionDataWithRecord) {
        this.currentDataChunk = "";
        this.isRecieving = false;
        this.database = database
        this.totalChunksCount = 0;
        this.totalChunksSendToDb = 0;
        this.chunkPromises = [];
        this.totalCrawlTime = 0;
        this.executionRecord = executionRecord;
    }

    isRecieving: boolean;
    incomingData = "";


    public ProcessIncomingData(data: string) {
       
        this.incomingData += data;
        if (this.T_START_DELIMITER === this.incomingData.slice(0, (this.T_START_DELIMITER.length))) {
            this.isRecieving = true
        }
        else if (this.T_END_DELIMITER === this.incomingData.slice(-(this.T_END_DELIMITER.length))) {
            
            while (this.incomingData.length > this.T_END_DELIMITER.length) // handle last chunk
            {
                const startIndex =  this.incomingData.indexOf(this.C_START_DELIMITER);
                const endIndex =  this.incomingData.indexOf(this.C_END_DELIMITER, startIndex + this.C_START_DELIMITER.length);
                const chunk = this.incomingData.substring(startIndex + this.C_START_DELIMITER.length, endIndex);
                this.totalChunksCount++;
                this.chunkPromises.push(this.ProcessDataChunk(chunk)); 
                this.incomingData = this.incomingData.substring(endIndex + this.C_END_DELIMITER.length);

                // TODO: fix DRY...
            }

            this.ProcessAcceptedData();
            this.isRecieving = false;
        }
        

          const startIndex = this.incomingData.indexOf(this.C_START_DELIMITER);
          
          if (startIndex !== -1) {
              const endIndex =  this.incomingData.indexOf(this.C_END_DELIMITER, startIndex + this.C_START_DELIMITER.length);
            if (endIndex !== -1) {
                const chunk = this.incomingData.substring(startIndex + this.C_START_DELIMITER.length, endIndex);
                this.totalChunksCount++;

                this.chunkPromises.push(this.ProcessDataChunk(chunk));
                this.incomingData = this.incomingData.substring(endIndex + this.C_END_DELIMITER.length);
              }
          }
    }

    /**
     * Waits until all asynchronous data processings are succesfully finished
    */
    private async ProcessAcceptedData() {
        await Promise.all(this.chunkPromises);
        this.totalChunksCount = 0; // TODO: !!! reset class!!
        this.OnChunkDBTransDone();
    }

    /**
    * Raised event once all the datas are parsed 
    */
    private OnChunkDBTransDone() {
        this.eventEmitter.emit("allChunksProcessed", this.totalCrawlTime);
    }

    /**
     * 
     * @param dataChunk 
     */
    async ProcessDataChunk(dataChunk: string) {
        this.eventEmitter.emit("newDataChunkReady", dataChunk);

        const chunkParsed = JSON.parse(dataChunk);  
        const nodeData: ExecutionNodeWithErrors = {
            title: chunkParsed.title,
            url: chunkParsed.baseUrl,
            crawlTime: chunkParsed.crawlTime,
            recordId: this.executionRecord?.record?.id, // TODO: try catch if undefined
            errors: ['ok'] // TODO: !!!
        };

        this.totalCrawlTime += +(chunkParsed.crawlTime);
     //   console.log(dataChunk);

        await this.database.NodesDatabase?.InsertNewNode(nodeData);
    }

}
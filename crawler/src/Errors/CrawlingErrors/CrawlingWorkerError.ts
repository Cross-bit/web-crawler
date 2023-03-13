export enum CrawlErrorsCodes {
    crawlerInputStreamFailed = "Crawler couldn't read data from input stream.",

}

export default class CrawlingError extends Error {
    public readonly status: CrawlErrorsCodes;
    public readonly message: string;
    public details?: any;
  
    constructor(status: CrawlErrorsCodes, message?: string) {
      super((message || status).toString());
      this.status = status;
      this.message = (message || status).toString();
    }
}
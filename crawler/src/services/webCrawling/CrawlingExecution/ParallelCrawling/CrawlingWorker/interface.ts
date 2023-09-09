
// crawled data interface

export enum linkErrorType { OK, REGEX, EXTENSION, INVALID_URI }

export interface LinkData {
    Errors: linkErrorType[],
    url: string
}

export default interface CrawledDataChunk
{
    baseUrl: string,
    title: string,
    crawlTime: number,
    links: LinkData[]
    errors: number[]
}


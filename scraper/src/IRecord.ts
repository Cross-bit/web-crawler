export interface Record {
    db_id: number; // id in db
    time_out_id: number;
    timeout: number; // when to crawl, special -1 immediatelly
    link: string; // link to crawl
    regex: string; // pattern to match
}
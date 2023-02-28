import express, { Application } from "express";
import { router as v1RecordsRouter } from "./v1/routes/recordsRoutes";
import { router as v1TagsRouter } from "./v1/routes/tagsRouter";
import cors from "cors";
import swaggerDocs  from './v1/swagger'
import cron from 'node-cron'
import clientErrorHandler from './middleware/ErrorHandler'
//import { parentPort, isMainThread, } from 'worker_threads';
import CrawlersPool from './services/webCrawling/crawlersPool'
import ExecutionQueue from './services/webCrawling/executionsQueue'
import ExecutionsScheduler from "./services/webCrawling/executionScheduler";

/**
 *
 *
 * todo: clean up this front file
 *
 *
 *
 */

const app: Application = express();
const PORT: number = +(process.env.CRAWLER_PORT || '5000');

app.use(cors());
app.use(express.json());
app.use("/api/v1/records", v1RecordsRouter );
app.use("/api/v1/tags", v1TagsRouter );

app.use(clientErrorHandler); // last middleware!

app.listen(PORT, () => {
    swaggerDocs(app, PORT);
});
import express, { Application } from "express";
import { router as v1RecordsRouter } from "./v1/routes/recordsRoutes";
import { router as v1TagsRouter } from "./v1/routes/tagsRouter";
import cors from "cors";
import swaggerDocs  from './v1/swagger'
import cron from 'node-cron'
//import { parentPort, isMainThread, } from 'worker_threads';

const scheduledTask = cron.schedule('*/10 * * * * *', () => {
    console.log("tadá every minut");
});




const app: Application = express();
const PORT: number = +(process.env.SCRAPPER_PORT || '5000');

app.use(cors());
app.use(express.json());

app.use("/api/v1/records", v1RecordsRouter );

app.use("/api/v1/tags", v1TagsRouter );

app.listen(PORT, () => {
    console.log("Listening on 5000.")
    swaggerDocs(app, PORT);
});
import express from "express";
import { router as v1RecordsRouter } from "./v1/routes/recordsRoutes";
import cors from "cors";


const app = express();
const PORT = process.env.SCRAPPER_PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/v1/records", v1RecordsRouter );

app.listen(PORT, () => console.log("Listening on 5000."));
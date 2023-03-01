import express, { Application } from "express";
import cors from "cors";

const expressApp:Application = express();

const PORT = +(process.env.APPLICATION_PORT || 6000);

expressApp.use(cors());
expressApp.use(express.json());

// TODO: implement creation of random graphs using:
// https://graphology.github.io/

expressApp.get("/", (req, res)=>{
    res.send("<h1>Testing api for crawler</h2>");
})

expressApp.listen(PORT, () => {
    console.log(`listenning on port: ${ PORT }`);
});

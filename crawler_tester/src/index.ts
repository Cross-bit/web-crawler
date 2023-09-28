import express, { Application, Request, Response } from "express";
import cors from "cors";
import RandomGraphGenerator from "./services/RandomGraphGenerator"
import HTMLGenerator from "./services/HTMLGenerator"
import {GenerateOptionsDTO, RandomGraphOptions, GrapDataAdjency, GraphDataDTO} from './services/interface'
import path from "path"
import fs from "fs";
import http from "http"

const expressApp:Application = express();

const PORT = +(process.env.APPLICATION_PORT || 6000);

expressApp.use(cors());
expressApp.use(express.json());


// this maps to generated graph html
expressApp.use(express.static(path.join(__dirname, 'public', 'graph_html')));

expressApp.get("/generate/html", (req: Request, res: Response) => {

    const graphJsonOutput = path.join(__dirname, "public", "graph_data", "graph.json");


    if (!fs.existsSync(graphJsonOutput)) {
        res.status(404).send('Unable generate HTML graph. Missing graph.json file. (First call /generate/{size_of_the_graph})');
        return;
    }

    const gDataRaw = fs.readFileSync(graphJsonOutput, 'utf-8');
    const gData = JSON.parse(gDataRaw) as GraphDataDTO;

    const adjecyList: number[][] = new Array(gData.nodes.length);

    for (let index = 0; index < adjecyList.length; index++) {
        adjecyList[index] =  [];

    }

    gData.edges.forEach((edge) => {
        adjecyList[edge.source].push(edge.target);
    });


    const htmlGenerator = new HTMLGenerator(adjecyList, true);
    htmlGenerator.Generate();

    res.status(201).send(`Graph generated based on: ${graphJsonOutput}`);
})


expressApp.get("/generate/:graph_size", (req: Request, res: Response) => {

    const {
        params: { graph_size },
    } = req;

    if (!graph_size || isNaN(+graph_size)) {
        res.status(404).send("Graph size must be a number!");
        return;
    }

    const graphOptions:RandomGraphOptions =  {
        multigraph: true,
        identity: true,
        initialTreeBranching: 5
    }

    const graphGenerator = new RandomGraphGenerator(+graph_size, 10, graphOptions);
    graphGenerator.Generate();
    const graphData = graphGenerator.GetGraphDTO();

    const graphDataPath = path.join(__dirname, "public", "graph_data");

    fs.mkdir(graphDataPath, { recursive: true }, (err) => {
        if (err) throw err;
    });

    const graphJsonOutput = path.join(graphDataPath, "graph.json");

    fs.writeFile(graphJsonOutput, JSON.stringify(graphData), (err) => {
        if (err) throw err;

        console.log(`Graph data succesfully created.`);
    });

    console.log(`Generating HTML pages...`);

    const adjecyList: number[][] = new Array(graphData.nodes.length);
    for (let index = 0; index < adjecyList.length; index++) {
        adjecyList[index] =  [];

    }

    graphData.edges.forEach(edge => {

        adjecyList[edge.source].push(edge.target);
    });

    const htmlGenerator = new HTMLGenerator(adjecyList, true);
    htmlGenerator.Generate();

    res.status(201).send(graphData);
})

expressApp.get("/data", (req: Request, res: Response) => {

    const graphJsonOutput = path.join(__dirname, "public", "graph_data", "graph.json");

    if (!fs.existsSync(graphJsonOutput)) {
        res.status(404).send('Unable generate HTML graph. Missing graph.json file. (First call /generate/{size_of_the_graph})');
        return;
    }

    if (fs.existsSync(graphJsonOutput)) {
        return res.status(200).sendFile(graphJsonOutput);
    }

    return res.status(404).send({error: "No data found"});

})

expressApp.get("/graph", (req: Request, res: Response)=>{

    res.sendFile(__dirname + "/public/visualisation/graphVisualisation.html");
})


const server = http.createServer(expressApp);
const MAX_CONNECTIONS = 100000;
server.maxConnections = MAX_CONNECTIONS;

server.listen(PORT, () => {
    console.log(`listenning on port: ${ PORT }`);
});

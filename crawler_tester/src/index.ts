import express, { Application } from "express";
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

expressApp.get("/generate/:graph_size", (req, res) => {

    const {
        params: { graph_size },
    } = req;

    const graphOptions:RandomGraphOptions =  {
        multigraph: true,
        identity: true,
        initialTreeBranching: 5
    }

    const graphGenerator = new RandomGraphGenerator(+graph_size, 10, graphOptions);
    graphGenerator.Generate();
    const graphData = graphGenerator.GetGraphDTO();

    const graphJsonOutput = path.join(__dirname, "public", "graph_data", "graph.json");
    
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

expressApp.get("/generate/html", (req, res) =>{

    const gDataRaw = fs.readFileSync('./public/graph_data/graph.json', 'utf-8');
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

    res.status(201).send('ok');
})


expressApp.get("/data", (req, res) => {

    const pathToData = path.join(__dirname, "public", "graph_data", "graph.json")
    console.log(pathToData);
    
    if (fs.existsSync(pathToData)) {
        return res.status(200).sendFile(pathToData);
    }

    return res.status(404).send({error: "No data found"});

})

expressApp.get("/graph", (req, res)=>{
    res.sendFile(__dirname + "/public/visualisation/graphVisualisation.html");
})


const server = http.createServer(expressApp);
const MAX_CONNECTIONS = 100000;
server.maxConnections = MAX_CONNECTIONS;

server.listen(PORT, () => {
    console.log(`listenning on port: ${ PORT }`);
});

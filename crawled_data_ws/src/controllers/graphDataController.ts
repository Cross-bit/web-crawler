import { NextFunction, Request, Response } from "express";


export function sendGraphDataSSE(req: Request, res: Response) {

    const {
        params: { recordId },
    } = req;
    
    const headers = { 
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Content-Encoding': 'none',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    }

    res.writeHead(200, headers);

    const intervalId = setInterval(() => {
      const date = new Date().toLocaleString();
      res.write(`data: ${ JSON.stringify({name: date})}  \n\n`);
    }, 1000)

    res.on('close', () => {
      console.log("Client closed");
      clearInterval(intervalId);
      res.end();
    })
}
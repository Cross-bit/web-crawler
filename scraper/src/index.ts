import express, { Request, Response } from "express";

///import {req_test} from "./crawler";

const app = express();

app.get("/", (req: Request, res: Response) => {
  //console.log({a: 42});
  console.log("tohle je get");
  return res.send({a: 42});

});

app.use(express.json());
app.post("/post", (req: Request, res: Response) => {
  console.log(req.body);
  res.send(req.body);
  //return res.send({a: "post"});
});

app.listen(5000, ()=>console.log("Listening on 5000."));
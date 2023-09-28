import { EdgeDTO, GrapDataAdjency, GraphDataDTO } from "./interface"
import ejs from "ejs"
import fs from "fs"
import path from "path"
import {LoremIpsum} from "lorem-ipsum"

export class HTMLGenerator
{
    graphData: number[][]
    addRandomText: boolean
    maxParagrapsBetweenLinks:number
    appBaseUrl: string

    constructor(graphAdjency: number[][], addRandomText: boolean) {
        this.graphData = graphAdjency;
        this.addRandomText = addRandomText;
        this.appBaseUrl = (process.env.APP_BASE_URL || "http://crawler_tester:7000");
        this.maxParagrapsBetweenLinks = 4;
    }

    private getHTMLBeginning(nodeIndex:number): string {

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${this.getPageName(nodeIndex)}</title>
        </head>`
    }

    private getHTMLEnding() {
        return "</html>"
    }

    private getPageName(index:number) {
        return `node-${index}`
    }

    private getRandomText(paragraphsCount:number){
        const lorem = new LoremIpsum({
            sentencesPerParagraph: {
              max: 8,
              min: 4
            },
            wordsPerSentence: {
              max: 16,
              min: 4
            }
          });

        return lorem.generateParagraphs(paragraphsCount);
    }

    private GenerateHtmlBody(nodeIndex:number) {
        let htmlBody = "<body>"

        if (this.addRandomText && this.graphData[nodeIndex].length === 0) {
            htmlBody += "<p>"
            const paragraphCount = Math.max(Math.floor(Math.random() * this.maxParagrapsBetweenLinks), 1);

            htmlBody += this.getRandomText(paragraphCount);

            htmlBody += "</p>"
        }

        this.graphData[nodeIndex].forEach(neighbourIndex => {
            htmlBody += "<p>"

            if (this.addRandomText) {
                const paragraphCount = Math.floor(Math.random() * this.maxParagrapsBetweenLinks);
                htmlBody += this.getRandomText(paragraphCount);
            }

            const pageName = `${this.getPageName(neighbourIndex)}.html`;
            const nextPageUrl = `${this.appBaseUrl}/${pageName}`;

            htmlBody += `<a href="${nextPageUrl}">${pageName}</a>`
            htmlBody += "</p>" // todo add this from env variable...
        });

       htmlBody += "</body>"
       return htmlBody;
    }

    private GeneratePage(nodeIndex: number) {

        let pageHtml = this.getHTMLBeginning(nodeIndex);
        pageHtml += this.GenerateHtmlBody(nodeIndex);
        pageHtml += this.getHTMLEnding();

        return pageHtml;
    }

    public Generate() {

        for(let i = 0; i < this.graphData.length; i++){
            const resultHtml:string = this.GeneratePage(i);

            const fileName = `${this.getPageName(i)}.html`

            const htmlOuputDir =path.join(__dirname, "..", "public", "graph_html");

            const outputPath = path.join(htmlOuputDir, fileName);

            fs.mkdir(htmlOuputDir, { recursive: true }, (err) => {
                if (err) throw err;
            });

            fs.writeFile(outputPath, resultHtml, (err) => {
                if (err) throw err;

            //    console.log(`Test page ${fileName} generated.`);
            });
        }


    }
}


export default HTMLGenerator;



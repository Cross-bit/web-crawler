import swaggerJSDoc from 'swagger-jsdoc';
import swaggerJs from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Application, Request, Response } from 'express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {title: 'Crawler API', version: '1.0.0'},
        tags: [
          { name: 'Records', description: 'Endpoints related to records' },
          { name: 'Tags', description: 'Endpoints related to tags' },
          { name: 'Executions', description: 'Endpoints related to executions' }
      ],
    },
    apis: [
      './src/v1/routes/recordsRoutes.ts',
      './src/v1/routes/executionsRoutes.ts',
      './src/v1/routes/tagsRouter.ts',
      './src/services/DTOInterface.ts',
      './src/middleware/ErrorHandler.ts'
    ]
};

const swaggerSpec = swaggerJSDoc(options);

export default function swaggerDocs (app: Application, port: number) {
    // docs route
    app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/api/v1/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  console.log(
    `Version 1 Docs are available on http://localhost:${port}/api/v1/docs`
  );
}
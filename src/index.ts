import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 9000;
// const port = process.env.SERVER_PORT;

app.use(bodyParser.json({ limit: '1mb' }));

app.use('/', routes)

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

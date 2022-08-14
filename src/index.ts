import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 9000;
// const port = process.env.SERVER_PORT;

// app.use(cors); /* NEW */

app.use(express.json());
// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = ['http://localhost:3000', ''];

const options: cors.CorsOptions = {
    origin: allowedOrigins
};

app.use(cors(options));
app.use(bodyParser.json({ limit: '1mb' }));

app.use('/', routes)

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

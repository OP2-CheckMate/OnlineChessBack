import { Request, Response } from "express";
import routes from './deprecated/index';
import logger from "./utils/logger";

//Gets port from deployment server (heroku) or uses 8080
const PORT = process.env.PORT || 8080;

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
/*
const { Server } = require("socket.io");
const io = new Server(server);

// */

// Log incoming requests
app.use((req: Request, res: Response, next: Function) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Log outgoing responses
app.use((req: Request, res: Response, next: Function) => {
    /*
    res.on('finish', () => {
        logger.info(`${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`);
    });
    next();
    */
});

var helmet = require('helmet');
app.use(helmet({
    crossOriginResourcePolicy: false
}));
app.use(express.json());
app.use(express.urlencoded({
    limit: '5mb',
    extended: true
}));
const cors = require('cors');
app.use(cors());


app.listen(PORT, () => {
    logger.info(`App is running on port ${PORT}`);
});

//use endpoints from routes folder with prefix /api
app.use('/api', routes)

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server for online mobile chess');
});


/*
//Socket.io
io.on('connection', (socket: any) => {
    console.log('a user connected');
});

//*/

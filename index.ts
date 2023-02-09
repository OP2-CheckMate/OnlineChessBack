//Simple REST service made with Express
//For some reason API fetches for drones and pilots actually return data

import { Request, Response } from "express";
import routes from './routes/index';

const express = require('express');
const app = express();

//security?
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

//Gets port from deployment server (heroku) or uses 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App is running on port ${ PORT }`);
});

// #############    ACTIONS     ##############

//use routes FOLDER with prefix /api
app.use('/api', routes)

//Index
app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server for online mobile chess');
});

//Test json return
app.get('/jsontest', (req: Request, res: Response, err: Error) => {
    return res.json({
        "testSuccess" : true
    })
});

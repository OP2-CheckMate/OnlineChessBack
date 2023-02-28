const express = require('express')
import { Request, Response } from "express";
const games = express.Router()
games.use(express.json())
import {LOBBIES} from './queuing'

games.get('/lobbylist', (req: Request, res: Response, err: Error) => {
    return res.json(LOBBIES)
});

export default games
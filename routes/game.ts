const express = require('express')
import { Request, Response } from "express";
const games = express.Router()
games.use(express.json())
import {LOBBIES} from './queuing'

//Get all lobbies
games.get('/lobbylist', (req: Request, res: Response, err: Error) => {
    return res.json(LOBBIES)
});

//Get data for a single lobby
games.get('/lobby/:id', (req: Request, res: Response, err: Error) => {
    const id = req.params.id
    const LOBBY = LOBBIES.find(lobby => lobby.lobbyId === parseInt(id))
    if (LOBBY === undefined) return res.json({message: 'lobby not found'})
    return res.json(LOBBY)
});

//Move 1 piece
games.get('/lobby/:id/:recentMove', (req: Request, res: Response, err: Error) => {
    const {id, recentMove} = req.params
    const LOBBY = LOBBIES.find(lobby => lobby.lobbyId === parseInt(id))
    if(LOBBY === undefined) return res.json({message: 'lobby not found'})
    else LOBBY.recentMove = recentMove
    return res.json(LOBBY)
});

export default games
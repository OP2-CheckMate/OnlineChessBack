const express = require('express')
import { Request, Response } from "express";
const queuing = express.Router()
queuing.use(express.json())
import {Player, Lobby} from '../types/types'



let queue: Player[] = [] //All players looking to play
let currentPlayerId = 0 //Current userID, distributes "guest ids"

//GAMES AND LOBBIES
let lobbies: Lobby[] = []
let currentLobbyId = 1000

//xxxx/api/queuing/findgame, body: {name: "xxx"}
//Join queue
queuing.post('/findgame', (req: Request, res: Response, err: Error) => {

    const PLAYERNAME: string = req.body.name
    const PLAYERQUEUING: Player = {
        id: currentPlayerId,
        name: PLAYERNAME
    }

    queue.push(PLAYERQUEUING)
    currentPlayerId ++

    console.log('QUEUE:')
    console.table(queue)

    return res.json(PLAYERQUEUING)
});

//xxxx/api/queuing/createlobby, body: {name: "xxx"}
//Join queue
queuing.post('/createlobby', (req: Request, res: Response, err: Error) => {

    const PLAYERNAME: string = req.body.name
    const PLAYER1: Player = {id: currentPlayerId, name: PLAYERNAME}
    
    const LOBBY: Lobby = {
        lobbyId: currentLobbyId,
        player1: PLAYER1,
    }

    lobbies.push(LOBBY)
    currentLobbyId++
    
    return res.json(LOBBY)
});

queuing.post('/joinlobby', (req: Request, res: Response, err: Error) => {

    const PLAYERNAME: string = req.body.name
    const LOBBYID: number = req.body.lobbyId

    const LOBBY = lobbies.find((lobby) => lobby.lobbyId === LOBBYID)
    if (LOBBY != undefined) LOBBY.player2 = {id: currentPlayerId, name: PLAYERNAME}

    console.log(LOBBY)

    return res.json(LOBBY)
});

export default queuing
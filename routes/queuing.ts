const express = require('express')
import { Request, Response } from "express";
const queuing = express.Router()
queuing.use(express.json())
import {Player, Lobby} from '../types/types'

//PLAYER HANDLING
let queue: Player[] = [] //All players looking to play
let currentPlayerId = 0 //Current userID, distributes "guest ids"

//GAMES AND LOBBIES
export const LOBBIES: Lobby[] = [] //trying to export this to other route to see if it updates
let currentLobbyId = 1000

//xxxx/api/queuing/findgame, body: {name: "xxx"}
//Join queue
//###################### NOT IN USE ######################
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

//xxxx/api/queuing/createlobby, body: { name: "xxx" }
//Join queue
queuing.post('/createlobby', (req: Request, res: Response, err: Error) => {

    const PLAYERNAME: string = req.body.name
    const PLAYER1: Player = {id: currentPlayerId, name: PLAYERNAME}
    
    const LOBBY: Lobby = {
        lobbyId: currentLobbyId,
        player1: PLAYER1,
    }

    LOBBIES.push(LOBBY)
    currentLobbyId++
    currentPlayerId++
    
    return res.json(LOBBY)
});

//xxxx/api/queuing/joinlobby, body: { lobbyId: 0000, name: "xxx" }
//JOIN already created lobby
queuing.post('/joinlobby', (req: Request, res: Response, err: Error) => {

    const PLAYERNAME: string = req.body.name
    const LOBBYID: number = req.body.lobbyId

    //Find correct lobby based on id
    const LOBBY = LOBBIES.find((lobby) => lobby.lobbyId === LOBBYID)
    const NOT_FOUND = undefined
    if (LOBBY != NOT_FOUND) LOBBY.player2 = {id: currentPlayerId, name: PLAYERNAME}
    else return res.status(400).json({message: 'Lobby does not exist'})

    return res.json(LOBBY)
});

export default queuing
const express = require('express')
import { Request, Response } from "express";
const queuing = express.Router()
queuing.use(express.json())

interface player{
    id: number;
    name: string;
}
let queue: player[] = [] //All players looking to play
let currentId = 0 //Current userID, distributes "guest ids"

//xxxx/api/queuing/findgame
//Join queue
queuing.get('/findgame', (req: Request, res: Response, err: Error): any => {

    const PLAYERQUEUING: player = {
        id: currentId,
        name: "Guest-" + currentId
    }
    queue.push(PLAYERQUEUING)
    currentId ++
    
    return res.json(PLAYERQUEUING)
});

export default queuing
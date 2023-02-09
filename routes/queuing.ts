const express = require('express')

const queuing = express.Router()
queuing.use(express.json())

interface player{
    id: number;
}
let queue: player[] = []
let currentId = 0

//xxxx/api/queuing/findgame
//Join queue
queuing.get('/findgame', (req: Request, res: Response, err: Error): any => {

    const PLAYERQUEUING: player = {
        id: currentId
    }
    queue.push(PLAYERQUEUING)
    currentId ++
    
    return res.json(PLAYERQUEUING)
});

export default queuing
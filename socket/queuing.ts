import { Player, Lobby, Move } from '../types/types'
import logger from "../utils/logger";

//PLAYER HANDLING
let queue: Player[] = [] //All players looking to play
let currentPlayerId = 0 //Current userID, distributes "guest ids"

//GAMES AND LOBBIES
export const LOBBIES: Lobby[] = []
let currentLobbyId = 1000

export function updateLobby(lobbyId: number, recentMove: Move, gameOver: boolean) {
  const lobby = LOBBIES.find((lobby) => lobby.lobbyId === lobbyId);
  if (lobby) {
    lobby.recentMove = recentMove;
    lobby.isGameOver = gameOver;
  }
}
/*

//Join queue
queuing.post('/findgame', (req: Request, res: Response, err: Error) => {
//xxxx/api/queuing/findgame, body: {name: "xxx"}
  const PLAYERNAME: string = req.body.name
  const PLAYERQUEUING: Player = {
    id: currentPlayerId,
    name: PLAYERNAME
  }

  queue.push(PLAYERQUEUING)
  currentPlayerId++

  logger.info('QUEUE:')
  console.table(queue)

  return res.json(PLAYERQUEUING)
});
*/

/** endpoint /createlobby for socket */
export const createlobby = (name: string) => {
    const PLAYERNAME: string = name
    const PLAYER1: Player = { id: currentPlayerId, name: PLAYERNAME }

    const LOBBY: Lobby = {
        lobbyId: currentLobbyId,
        player1: PLAYER1,
        isGameOver: false
    }
    
    logger.info(`Creating lobby with id ${currentLobbyId}...`);
    
    LOBBIES.push(LOBBY)
    currentLobbyId++
    currentPlayerId++
    
    return LOBBY
}

/** endpoint /joinlobby for socket */
export const joinlobby = (lobbyId: number, name: string) => {
    const PLAYERNAME: string = name
    const LOBBYID: number = lobbyId

    //Find correct lobby based on id
    logger.info(`Finding lobby with id ${LOBBYID}...`);
    const LOBBY = LOBBIES.find((lobby) => lobby.lobbyId === LOBBYID)
    const NOT_FOUND = undefined
    if (LOBBY != NOT_FOUND) LOBBY.player2 = { id: currentPlayerId, name: PLAYERNAME }
    else {
        logger.error(`Failed to join lobby with id ${LOBBYID}: lobby does not exist`);
        return { message: 'Lobby does not exist', lobbyId: 0 }
    }

    return LOBBY
}


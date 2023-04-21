import { LOBBIES, updateLobby } from './queuing'
import logger from "../utils/logger";
import { Move, OneMove } from '../types/types'

/** GET /api/games/lobbylist SOCKET.IO */
export const getLobbies = () => {
    return LOBBIES
}

/** GET /api/games/lobby/:id SOCKET.IO */
export const getLobby = (id: string) => {
    let LOBBY = LOBBIES.find(lobby => lobby.lobbyId === parseInt(id))
    if (LOBBY === undefined) {
      logger.error(`Lobby not found for id ${id}`);
      return { message: 'lobby not found', lobbyId: 0 }
    }
    logger.info(`Get data for a single lobby for id ${id}`);
    return LOBBY
}

/** POST /api/games/lobby/:id SOCKET.IO */
export const movePiece = (id: string, body: OneMove) => {
    const LOBBY = LOBBIES.find(lobby => lobby.lobbyId === parseInt(id))
    const NOT_FOUND = undefined
    
    if (LOBBY === NOT_FOUND) {
      logger.error(`Lobby not found for id ${id}`);
      return { message: 'lobby not found', lobbyId: 0 };
    }
  
    //Validate request body and update lobby to include move
    if (body && body.recentMove !== undefined) {
      const move: Move = body.recentMove;
      const gameOver: boolean = body.gameOver;
      updateLobby(parseInt(id), move, gameOver);
    } else {
      logger.error(`Move not found for id ${id}`)
      return { message: 'move not found', lobbyId: 0 }
    }
  
    logger.info(`Moved 1 piece for lobby id ${id}`);
    return LOBBY
}

export const openBoards: { [key: number]: Set<string> } = {};
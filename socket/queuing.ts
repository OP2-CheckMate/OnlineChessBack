import { Player, Lobby, Move } from '../types/types'
import logger from "../utils/logger";

//PLAYER HANDLING
let queue: Player[] = [] //All players looking to play

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

//Join queue
export const joinqueue = (name: string, playerId: string) => {
  const player: Player = {id: playerId, name: name }
  queue.push(player)
  return true //Successfully queued
}

export const checkQueue = () => {
  if(queue.length >= 2){
    const players = queue.splice(0,2)
    const lobby: Lobby = {
      lobbyId: currentLobbyId,
      player1: players[0],
      player2: players[1],
      isGameOver: false
    }
    return lobby
  }
}

/** endpoint /createlobby for socket */
export const createlobby = (name: string, playerId: string) => {
    const PLAYERNAME: string = name
    const PLAYER1: Player = { id: playerId, name: PLAYERNAME }

    const LOBBY: Lobby = {
        lobbyId: currentLobbyId,
        player1: PLAYER1,
        isGameOver: false
    }
    
    logger.info(`Creating lobby with id ${currentLobbyId}...`);
    
    LOBBIES.push(LOBBY)
    currentLobbyId++
    
    return LOBBY
}

/** endpoint /joinlobby for socket */
export const joinlobby = (lobbyId: number, name: string, playerId: string) => {
    const PLAYERNAME: string = name
    const LOBBYID: number = lobbyId

    //Find correct lobby based on id
    logger.info(`Finding lobby with id ${LOBBYID}...`);
    const LOBBY = LOBBIES.find((lobby) => lobby.lobbyId === LOBBYID)
    const NOT_FOUND = undefined
    if (LOBBY != NOT_FOUND) LOBBY.player2 = { id: playerId, name: PLAYERNAME }
    else {
        logger.error(`Failed to join lobby with id ${LOBBYID}: lobby does not exist`);
        return { message: 'Lobby does not exist', lobbyId: 0 }
    }

    return LOBBY
}


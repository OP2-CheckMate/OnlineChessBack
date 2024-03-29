import { Player, Lobby, Move } from '../types/types'
import logger from "../utils/logger";

//PLAYER HANDLING
let queue: Player[] = [] //All players looking to play

//GAMES AND LOBBIES
export const LOBBIES: Lobby[] = []
let currentLobbyId = 1000

/** If changes are made for a single lobby (player 2 joins) update the lobby accordingly */
export const updateLobby = (lobbyId: number, recentMove: Move, gameOver: boolean) => {
  const lobby = LOBBIES.find((lobby) => lobby.lobbyId === lobbyId);
  if (lobby) {
    lobby.recentMove = recentMove;
    lobby.isGameOver = gameOver;
  }
}

/** Join server side queue for finding other players */
export const joinQueue = (name: string, playerId: string, socketId: string) => {
  const player: Player = { id: playerId, socketId: socketId, name: name }
  //console.log(player)
  const duplicate = queue.find(e => e.id === playerId)
  if (!duplicate) {
    queue.push(player)
  }
  return true //Ok
}

/** Checks if there are enough players in queue and match them against each other */
export const checkQueue = () => {
  if (queue.length >= 2) {
    const players = queue.splice(0, 2)
    const lobby: Lobby = {
      lobbyId: currentLobbyId,
      player1: players[0],
      player2: players[1],
      isGameOver: false,
      timestamp: new Date()
    }
    LOBBIES.push(lobby)
    currentLobbyId++
    return lobby
  }
}

/** Player leaves queue and is deleted from array */
export const leaveQueue = (playerId: string) => {
  const foundPlayer = queue.find(e => e.id = playerId)
  if (foundPlayer) {
    queue.splice(queue.indexOf(foundPlayer), 1)
  }
}

/** Create a new lobby/chess match and set creator as player 1 */
export const createLobby = (name: string, playerId: string, socketId: string) => {
  const PLAYERNAME: string = name
  const PLAYER1: Player = { id: playerId, socketId: socketId, name: PLAYERNAME }

  const lobby: Lobby = {
    lobbyId: currentLobbyId,
    player1: PLAYER1,
    isGameOver: false,
    timestamp: new Date()
  }

  logger.info(`Creating lobby with id ${currentLobbyId}...`);

  LOBBIES.push(lobby)
  currentLobbyId++

  return lobby
}

/** 2nd player looking to join an existing lobby thats missing player 2 */
export const joinlobby = (lobbyId: number, name: string, playerId: string, socketId: string) => {
  const PLAYERNAME: string = name
  const LOBBYID: number = lobbyId

  //Find correct lobby based on id
  logger.info(`Finding lobby with id ${LOBBYID}...`);
  const lobby = LOBBIES.find((lobby) => lobby.lobbyId === LOBBYID)
  const NOT_FOUND = undefined
  if (lobby != NOT_FOUND && !lobby.player2) lobby.player2 = { id: playerId, socketId: socketId, name: PLAYERNAME }
  else {
    logger.error(`Failed to join lobby with id ${LOBBYID}: lobby does not exist`);
    return { message: 'Lobby does not exist or is full', lobbyId: 0 }
  }

  return lobby
}

 // Find the lobbyId for the given playerId (returns null if not found)
export const findLobbyIdByPlayerId = (playerId: string): number | null => {
  const lobby = LOBBIES.find(
    (lobby) => (lobby.player1 && lobby.player1.id === playerId) || (lobby.player2 && lobby.player2.id === playerId)
  );
  return lobby ? lobby.lobbyId : null;
}

export const findLobbyIdBySocketId = (playerId: string): number | null => {
  const lobby = LOBBIES.find(
    (lobby) => (lobby.player1 && lobby.player1.socketId === playerId) || (lobby.player2 && lobby.player2.socketId === playerId)
  );
  return lobby ? lobby.lobbyId : null;
}

// Find the opponent's id for the given playerId and lobbyId (returns null if not found)
export const findOpponentId = (playerId: string, lobbyId: number): string | null => {
  const lobby = LOBBIES.find((lobby) => lobby.lobbyId === lobbyId);

  if (!lobby) {
    return null;
  }

  // Check if the playerId matches player1's id, if so, return player2's id
  if (lobby.player1 && lobby.player1.id === playerId) {
    return lobby.player2 ? lobby.player2.socketId : null;
  }

  // Check if the playerId matches player2's id, if so, return player1's id
  if (lobby.player2 && lobby.player2.id === playerId) {
    return lobby.player1 ? lobby.player1.socketId : null;
  }

  return null;
}

export const deleteLobby = (lobbyId: number) => {
  const lobbyToDelete = LOBBIES.find(item => item.lobbyId === lobbyId)
  const deleteIndex = LOBBIES.indexOf(lobbyToDelete!)
  LOBBIES.splice(deleteIndex, 1)
}

export const updateTimestamp = (lobbyId: number) => {
  const lobby = LOBBIES.find(lobby => lobby.lobbyId === lobbyId)
  lobby!.timestamp = new Date()
}

export const findLobbyAfterReconnect = (id: string) => {
  const timestamp = new Date()
  const lobby = LOBBIES.find(lobby => {
    if(lobby.player1?.id === id || lobby.player2?.id === id){
      console.log('findLobby function: ', lobby)
      if(lobby.timestamp?.getTime() && timestamp.getTime() - lobby.timestamp?.getTime() < 60000){
        return lobby
      }
    }
  })
  return lobby
}

export const findPlayerIdBySocket = (id: string, lobbyId: number) => {
  const lobby = LOBBIES.find(lobby => lobby.lobbyId === lobbyId)
  if (lobby?.player1?.socketId === id) return lobby.player1.id
  return lobby?.player2!.id
}
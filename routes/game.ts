const express = require('express')
import { Request, Response } from "express";
const games = express.Router()
games.use(express.json())
import { LOBBIES, updateLobby } from './queuing'
import logger from "../utils/logger";
import { Move } from '../types/types'

//Get all lobbies
games.get('/lobbylist', (req: Request, res: Response, err: Error) => {
  logger.info('Get all lobbies');
  return res.json(LOBBIES)
});

//Get data for a single lobby
games.get('/lobby/:id', (req: Request, res: Response, err: Error) => {
  const id = req.params.id
  let LOBBY = LOBBIES.find(lobby => lobby.lobbyId === parseInt(id))
  if (LOBBY === undefined) {
    logger.error(`Lobby not found for id ${id}`);
    return res.json({ message: 'lobby not found' });
  }
  logger.info(`Get data for a single lobby for id ${id}`);
  return res.json(LOBBY)
});

// Move 1 piece
games.post('/lobby/:id/', (req: Request, res: Response, err: Error) => {
  const { id } = req.params
  const LOBBY = LOBBIES.find(lobby => lobby.lobbyId === parseInt(id))
  if (LOBBY === undefined) {
    logger.error(`Lobby not found for id ${id}`);
    return res.json({ message: 'lobby not found' });
  } else {
    if (req.body && req.body.recentMove !== undefined) {
      const move: Move = req.body.recentMove;
      updateLobby(parseInt(id), move);
      if (req.body.isGameOver) {
        return res.json({ message: 'Game over!' })
      }
    } else {
      logger.error(`Move not found for id ${id}`)
      return res.json({ message: 'move not found' })
    }
    logger.info(`Moved 1 piece for lobby id ${id}`);
    return res.json(LOBBY);
  }
});

export default games
const express = require('express')
import { Request, Response } from "express";
const games = express.Router()
games.use(express.json())
import { LOBBIES, updateLobby } from './queuing'
import logger from "../utils/logger";
import { Move } from '../types/types'

// Log incoming requests
games.use((req: Request, res: Response, next: Function) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Log outgoing responses
games.use((req: Request, res: Response, next: Function) => {
  res.on('finish', () => {
    logger.info(`${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`);
  });
  next();
});


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
games.post('/lobby/:id', (req: Request, res: Response, err: Error) => {
  const { id } = req.params
  const LOBBY = LOBBIES.find(lobby => lobby.lobbyId === parseInt(id))
  const NOT_FOUND = undefined
  
  if (LOBBY === NOT_FOUND) {
    logger.error(`Lobby not found for id ${id}`);
    return res.json({ message: 'lobby not found' });
  }

  //Validate request body and update lobby to include move
  if (req.body && req.body.recentMove !== undefined) {
    const move: Move = req.body.recentMove;
    const gameOver: boolean = req.body.isGameOver;
    updateLobby(parseInt(id), move, gameOver);
  } else {
    logger.error(`Move not found for id ${id}`)
    return res.json({ message: 'move not found' })
  }

  logger.info(`Moved 1 piece for lobby id ${id}`);
  return res.json(LOBBY);
});

export default games
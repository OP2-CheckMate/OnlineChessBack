import { getLobbies, getLobby, movePiece, openBoards } from './socket/game'
import {
  checkQueue,
  createLobby,
  deleteLobby,
  findLobbyIdByPlayerId,
  findOpponentId,
  joinlobby,
  joinQueue,
  leaveQueue,
} from './socket/queuing'
import { Lobby, OneMove } from './types/types'

const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
//Gets port from deployment server (heroku) or uses 8080
const PORT = process.env.PORT || 8080;

// cors handling for socket to test application on expo web
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:19006",
    methods: ["GET", "POST"]
  }
});
// const { Server } = require('socket.io')
// const io = new Server(server)

app.get('/', (req: Request, res: Response) => {
  return res.json()
})


io.on('connection', (socket: any) => {
  console.log(socket.rooms)

  socket.on('createLobby', (playerName: string) => {
    const result = createLobby(playerName, socket.id)
    io.to(socket.id).emit('createdLobby', result)
  })

  socket.on('joinroom', (roomName: string) => {
    socket.join(roomName)
  })

  socket.on('joinlobby', (lobbyId: number, name: string) => {
    const result = joinlobby(lobbyId, name, socket.id)
    const lobbyNotFound = 0
    if (result.lobbyId !== lobbyNotFound) {
      socket.join(result.lobbyId)
      socket.to(result.lobbyId).emit('playerJoined', result)
      io.to(socket.id).emit('createdLobby', result)
    }
  })

  socket.on('getLobbies', () => {
    const result = getLobbies()
    io.to(socket.id).emit('returnLobbies', result)
  })

  socket.on('getLobby', (id: string) => {
    const result = getLobby(id)
    io.to(socket.id).emit('returnLobby', result)
  })

  socket.on('updateGame', (game: any, opponentId: string) => {
    io.to(opponentId).emit('gameUpdate', game)
  })

  socket.on('joinqueue', (playerName: string) => {
    if (joinQueue(playerName, socket.id)) {
      const lobby: Lobby = checkQueue() || { lobbyId: 0 }
      if (lobby.lobbyId !== 0) {
        io.to(lobby.player1?.id).emit('gamefound', lobby)
        io.to(lobby.player2?.id).emit('gamefound', lobby)
      } else {
        io.to(socket.id).emit('joinedQueue')
      }
    }
  })

  socket.on('chat-message', (msg: string, lobbyId: number) => {
    const author = socket.id
    socket.to(lobbyId).emit('chat-message', msg, author)
  }
  )

  socket.on('leaveQueue', () => {
    leaveQueue(socket.id)
  })

  socket.on('boardOpened', (lobbyId: number) => {
    if (!openBoards[lobbyId]) {
      openBoards[lobbyId] = new Set();
    }

    openBoards[lobbyId].add(socket.id);

    // If both players have opened the board, emit the "bothBoardsOpen" event
    if (openBoards[lobbyId].size === 2) {
      io.to(lobbyId).emit('bothBoardsOpen');
    }
  });

  // This triggers when a player is disconnected from the server
  socket.on('disconnect', () => {
    const lobbyId = findLobbyIdByPlayerId(socket.id);
    if (lobbyId) {
      const opponentId = findOpponentId(socket.id, lobbyId);
      if (opponentId) {
        io.to(opponentId).emit('opponentDisconnected');
      }
    }
  });

  // Players exits the game by pressing back button
  socket.on('playerExited', (playerId: string) => {
    const lobbyId = findLobbyIdByPlayerId(playerId);
    if (lobbyId) {
      const opponentId = findOpponentId(playerId, lobbyId);
      if (opponentId) {
        io.to(opponentId).emit('opponentExited');
      }
    }
  });

  socket.on('gameOver', (lobbyId: number) => {
    deleteLobby(lobbyId)
    console.log('lobby deleted')
  })

})

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`)
})

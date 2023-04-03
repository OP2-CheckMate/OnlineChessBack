import { getLobbies, getLobby, movePiece } from './socket/game'
import {
  checkQueue,
  createlobby,
  joinlobby,
  joinqueue,
  leaveQueue,
} from './socket/queuing'
import { Lobby, OneMove } from './types/types'

const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
// cors handling for socket to test application on expo web
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:19006",
    methods: ["GET", "POST"]
  }
});

app.get('/', (req: Request, res: Response) => {
  return res.json()
})

io.on('connection', (socket: any) => {
  console.log(socket.rooms)

  socket.on('createLobby', (playerName: string) => {
    const result = createlobby(playerName, socket.id)
    io.to(socket.id).emit('createdLobby', result)
  })

  socket.on('joinroom', (roomId: number) => {
    socket.join(roomId)
  })

  socket.on('joinlobby', (lobbyId: number, name: string) => {
    const result = joinlobby(lobbyId, name, socket.id)
    const lobbyNotFound = 0
    if (result.lobbyId === lobbyNotFound) {
    } else {
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
    if (joinqueue(playerName, socket.id)) {
      const lobby: Lobby = checkQueue() || { lobbyId: 0 }
      if (lobby.lobbyId !== 0) {
        io.to(lobby.player1?.id).emit('gamefound', lobby)
        io.to(lobby.player2?.id).emit('gamefound', lobby)
      } else {
        io.to(socket.id).emit('joinedQueue')
      }
    }
  })

  socket.on('chat-message', (msg: string) => {
    socket.broadcast.emit('chat-message', msg)
  })

  socket.on('leaveQueue', () => {
    leaveQueue(socket.id)
  })
})

server.listen(8080, () => {
  console.log('listening on *:8080')
})

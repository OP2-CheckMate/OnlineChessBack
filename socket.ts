import { getLobbies, getLobby, movePiece } from "./socket/game";
import { createlobby, joinlobby } from "./socket/queuing";
import { OneMove } from "./types/types";

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req: Request, res: Response) => {
  return res.json()
});

io.on('connection', (socket:any) => {
  console.log(socket.rooms);

  socket.on('createLobby', (playerName:string) => {
    const result = createlobby(playerName)
    io.to(socket.id).emit('createdLobby', result)
  })

  socket.on('joinroom', (roomId:number) => {
    socket.join(roomId)
  })
  
  socket.on('joinlobby', (lobbyId: number, name: string) => {
    const result = joinlobby(lobbyId, name)
    const lobbyNotFound = 0
    if (result.lobbyId === lobbyNotFound){
    }else{
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

  socket.on('movePiece', (roomId: string, body: OneMove) => {
    //console.log(io.in(id).fetchSockets())
    console.log(body)
    Promise.resolve(io.in(roomId).fetchSockets()).then(res => {
      console.log(res[0].id, socket.id)
      const opponent = res.find((mover: any) => mover.id != socket.id)
      const result = movePiece(roomId, body)
      if(result.lobbyId > 0){
        io.to(opponent.id).emit('pieceMoved', result)
      }
    })
  })

  socket.on('updateGame', (roomId: string, game: any) => {
    Promise.resolve(io.in(roomId).fetchSockets()).then(res => {
      //console.log(res[0].id, socket.id)
      const opponent = res.find((mover: any) => mover.id != socket.id)
      io.to(opponent.id).emit('gameUpdate', game)
    })
    //socket.to(roomId).emit('gameUpdate', game)
  })
});



server.listen(8080, () => {
  console.log('listening on *:8080');
});
# OnlineChessBack

Node.js server that uses Express and Socket.io libraries to create a real-time multiplayer game server. Connects players and redirects moves made in the frontend. Frontend repository can be found [here](https://github.com/OP2-CheckMate/OnlineChessFront).

The server uses Express to handle HTTP requests, and Socket.io to handle real-time communication between clients and the server.

For logging the server uses Winston logger.

## Socket Endpoints
| Endpoint | Use |
| -------- | --- |
| ``'connection'`` | Connect player to backend when application is opened |
| ``'createLobby'`` | Creates a new lobby |
|``'joinroom'`` | Join room inside socket |
|``'joinlobby'`` | Takes lobbyId as parameter and tries to find and connect player to that lobby |
|``'getLobbies'`` | Returns all lobbies |
|``'getLobby'`` | Get a single lobby data by id |
|``'joinqueue'`` | Player can join a queue and when there are two players in queue they are connected to game |
|``'chat-message'`` | Emits chat messages from player to chatbox |
|``'leaveQueue'`` | Player has left from queue |
|``'boardOpened'`` | Checks that both players have board open and emits event when they have |
|``'disconnect'`` | Notify the other player if the opponent disconnects from the server |
|``'playerExited'`` | Notify the other player if the opponent exits the game |
|``'gameOver'`` | Deletes the lobby when game is over |

## Run the app
### Clone it
``git clone https://github.com/OP2-CheckMate/OnlineChessBack.git``
### Install npm packages:
``npm install``
### Run development version that refreshes when changes are made
``npm run dev``
### If command above doesnt start server, it still should compile into dist/index.js -> to run that:
``npm start``
### Stop program:
``ctrl + c``

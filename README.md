# OnlineChessBack
Back end that connects players and redirects moves made in a chessgame (front)
We start with trying Node and express for simplicity. The backend is built as a REST-service, and at this point, players can create a new lobby or connect to an existing one with lobby id, and while in a lobby they can play the game against an opponent and moves are updated to backend when they are done

## Endpoints
### Create new lobby
POST /api/queuing/createlobby
body:

    { 
      name: "xxx"
    }

### Join existing lobby
POST /api/queuing/joinlobby

body: 

    {
      lobbyId: 1001,
      name: "xxx"
    }

### Join queue - FOR FUTURE ITERATIONS
POST /api/queuing/findgame

body: 

    {
      name: "xxx"
    }

### Get all created lobbies
GET /api/games/lobbylist

### Get data for a single lobby
GET /api/games/lobby/:id

### Move 1 piece in 1 game (make 1 turn)
POST /api/games/lobby/:id

body: 

    {
      recentMove: {
        from: "a2",
        to: "a3"
      },
      gameOver: false
    }
    
## Plan for future iterations

### CURRENT Polling:  

 - Express 

 - Free 

 - Easy development 

 - Requires refreshing or short/long polling (bad) - Currently refreshing

 - Do we need DB? 

### Socket.io, extends polling:  

 - Express 

 - Free 

 - Hard Development, new technology 

 - Real time 

 - Do we need DB? 

## Run the app
### install packages:
npm install
### Run development version that refreshes when changes are made
npm run dev
### If command above doesnt start server, it still should compile into dist/index.js -> to run that:
npm start
### Stop program:
ctrl + c

y

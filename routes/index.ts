import express from "express";
import games from "./game";
import queuing from "./queuing";

const routes = express.Router()
//xxxx/api/queuing
routes.use('/queuing', queuing)
routes.use('/games', games)

export default routes
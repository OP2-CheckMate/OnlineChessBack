import express from "express";
import queuing from "./queuing";

const routes = express.Router()
//xxxx/api/queuing
routes.use('/queuing', queuing)

export default routes
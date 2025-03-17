import * as express from "express";
import { AuthRouter } from "./auth";
import { Middleware } from "../services/middleware";
import { UserRouter } from "./user";


export const api = express.Router();

//👉open routes
api.use("/auth", new AuthRouter().router);

//👉completely authenticated routes
api.use(new Middleware().authenticateUser);     //login check
api.use("/user", new UserRouter().router);


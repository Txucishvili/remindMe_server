import express from 'express';
import AuthController from "./Auth/AuthController";
import {routerExporter} from "./TheaterController/TheaterController";
import {authRouterExporter} from "./Auth/Authorization";

const Routers = express.Router();

// Routers.use(AuthController);
// Routers.use(authRouterExporter.router, authRouterExporter.handling);
Routers.use(routerExporter.router, routerExporter.middleware, routerExporter.handling);
Routers.use(authRouterExporter.router, authRouterExporter.middleware, authRouterExporter.handling);

export default Routers;

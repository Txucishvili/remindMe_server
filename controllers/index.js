import express from 'express';
import AuthController from "./Auth/AuthController";
import {routerExporter} from "./TheaterController/TheaterController";
import {authRouterExporter} from "./Auth/Authorization";
import {homeRouter} from "./home/HomeController";

const Routers = express.Router();

// Routers.use(AuthController);
// Routers.use(routerExporter.router, routerExporter.middleware, routerExporter.handling);
Routers.use(authRouterExporter.router, authRouterExporter.middleware, authRouterExporter.handling);
// Routers.use(homeRouter.router, homeRouter.middleware, homeRouter.handling);

export default Routers;

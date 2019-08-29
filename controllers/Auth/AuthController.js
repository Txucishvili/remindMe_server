import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const AuthController = (req, res, next) => {
  const headerToken = req.headers['authorization'];

  if (typeof headerToken !== "undefined") {
    const bearer = headerToken.split(' ');
    const bearerTokne = bearer[1];
    req.token = bearerTokne;
    next();
  } else {
    res.sendStatus(403);
  }
};

export default AuthController;

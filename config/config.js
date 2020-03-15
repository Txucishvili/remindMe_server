import dotenv from 'dotenv';
import path from 'path';

const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const { parsed: envs } = result;
const config = result.parsed;

let confVars, environment;

environment = {
  isDevelopment: config.NODE_ENV === 'development'
};

export {config, confVars, environment};


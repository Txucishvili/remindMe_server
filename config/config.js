import dotenv from 'dotenv';

const result = dotenv.config({path: '.env.' + process.env.NODE_ENV});

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

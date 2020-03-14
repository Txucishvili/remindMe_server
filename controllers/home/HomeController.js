import AuthenticationService from "../../services/Authentication.service";
import {config} from "../../config/config";

export const HomeController = async (req, res) => {
  console.log('hhhh', config);
  res.send(`Hello ${config.NODE_ENV}  ${config.MONGO_URL}`);
};


export const homeRouter = {
  router: '/',
  middleware: [],
  handling: HomeController
};


import jwt from 'jsonwebtoken';
import AuthenticationService from "../../services/Authentication.service";

// External API for refreshing expired token
// TODO: need clean up
// TODO: add db validation for user fetching

export const AuthorizationController = async (req, res) => {

  const {query: {oldToken}} = req;

  const tokenDecode = await AuthenticationService.jsonDecode(oldToken);

  if (!tokenDecode) {
    res.send({token: null});
  }

  const tokenConfiguration = {
    id: tokenDecode.id,
    roles: tokenDecode.rules
  };

  const tokenExpDate = Math.floor(Date.now() / 1000) + (60 * 60);
  const genToken = await AuthenticationService.genToken(tokenConfiguration, tokenExpDate);

  res.send({token: genToken});
};

export const authRouterExporter = {
  router: '/api/auth/refreshToken',
  middleware: [],
  handling: AuthorizationController
};

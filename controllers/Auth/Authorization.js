import jwt from 'jsonwebtoken';

export const AuthorizationController = async (req, res) => {
  const user = {
    id: 1,
    password: 'test',
    username: 'user'
  };


  await jwt.sign({user}, 'secretkey', {expiresIn: '5m'}, (err, token) => {
    res.send({token});
  });
};

export const authRouterExporter = {
  router: '/api/auth',
  middleware: [],
  handling: AuthorizationController
};

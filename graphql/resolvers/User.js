import AuthenticationService from "../../services/Authentication.service";
import {authenticated, validateRole} from "../helpers/Auth.guard";

const UserResolver = {
  Query: {
    AllUsers: authenticated(
      validateRole('ADMIN')
      (async (parent, args, {db}) => {
        const users = await db.Users.find();

        let allUsers = users.map(user => {
          user._id = user._id.toString();

          return user;
        });

        return allUsers;
      })),
    getUser: authenticated(
      validateRole('ADMIN')(async (parent, args, {db}) => {
        const user = await db.Users.findById(args.id);

        const model = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          l_visit: user.l_visit
        };

        return model;
      })),
    me: authenticated(async (root, args, context) => {
      const userDB = await context.db.Users.findById(context.user.id);
      const token = context.user ? AuthenticationService.genToken({id: context.user.id}) : '';

      const model = {
        firstName: userDB.firstName,
        lastName: userDB.lastName,
        email: userDB.email,
        auth: {
          token: token
        },
        l_visit: userDB.l_visit
      };

      return model;
    })
  },
  Mutation: {
  }
};

export default UserResolver;

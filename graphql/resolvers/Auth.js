import {UserInputError} from "apollo-server-express";
import AuthenticationService from "../../services/Authentication.service";

const AuthResolvers = {
  Mutation: {
    signUp: async (parent, {data}, {user, db}) => {
      console.log('hit');
      let {firstName, lastName, email, password} = data;
      const userExists = await db.Users.findOne({email});

      if (userExists) {
        throw new Error('User already exist');
      }

      let passwordHash = await AuthenticationService.genHash(password, AuthenticationService.genSalt(saltRounds));
      const saveData = {
        firstName,
        lastName,
        password: passwordHash,
        email
      };

      const _user = await new db.Users(saveData).save();
      _user._id = _user._id.toString();

      if (!_user) {
        throw new UserInputError('Invalid credentials');
      }

      const token = AuthenticationService.genToken({id: _user._id});

      return {
        firstName: _user.firstName,
        lastName: _user.lastName,
        email: _user.email,
        l_visit: _user.l_visit,
        auth: {token},
      }
    },
    signIn: async (parent, {data}, {db}) => {
      const {email, password} = data;
      const user = await db.Users.findOne({email: email});
      console.log('user', user);

      if (!user) {
        throw new UserInputError('Invalid credentials');
      } else if(!AuthenticationService.comparePassword(password, user.password)) {
        throw new UserInputError('Invalid credentials');
      }

      const token = user ? AuthenticationService.genToken({id: user._id}) : 'nullls';

      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        l_visit: user.l_visit,
        auth: {token},
      }
    }
  }
};

export default AuthResolvers;

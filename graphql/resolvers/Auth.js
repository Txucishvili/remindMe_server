import {UserInputError} from "apollo-server-express";
import AuthenticationService from "../../services/Authentication.service";

const AuthResolvers = {
  Query: {
    logOut: async (parent, {args}, {user, db}) => {
      const tokenDB = db.Tokens;
      const findToken = await tokenDB.find({userId: user.id});
      console.log('findToken', findToken);
      console.log('user._id', user);
      if (findToken.length) {
        findToken[0].remove();
      }

      return {
        data: 'successfully logged out'
      }

    }
  },
  Mutation: {
    signUp: async (parent, {data}, {user, db}) => {
      console.log('hit');
      let {firstName, lastName, email, password} = data;
      const userExists = await db.Users.findOne({email});

      if (userExists) {
        throw new Error('User already exist');
      }

      let passwordHash = await AuthenticationService.genHash(password);

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

      const tokenDB = await db.Tokens.find({userId: _user._id});
      console.log('is token found', tokenDB);

      const token = AuthenticationService.genToken({id: _user._id});

      const tokenData = {
        token,
        userId: _user._id
      };

      const saveToken = await new db.Tokens(tokenData).save();

      return {
        firstName: _user.firstName,
        lastName: _user.lastName,
        email: _user.email,
        l_visit: _user.l_visit,
        auth: {
          token: saveToken
        },
      }
    },
    signIn: async (parent, {data}, {db}) => {
      const {email, password} = data;
      const user = await db.Users.findOne({email: email});
      console.log('user', user);

      if (!user) {
        throw new UserInputError('Invalid credentials');
      } else if (!AuthenticationService.comparePassword(password, user.password)) {
        throw new UserInputError('Invalid credentials');
      }

      const tokenDB = db.Tokens;

      const token = user ? AuthenticationService.genToken({id: user._id}) : 'nullls';
      const tokenData = {
        token,
        userId: user._id
      };

      const findToken = await tokenDB.find({userId: user._id});

      if (findToken.length) {
        findToken[0].remove();
      }

      const newToken = await new tokenDB(tokenData).save();

      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        l_visit: user.l_visit,
        auth: {
          token: newToken.token
        },
      }
    }
  }
};

export default AuthResolvers;

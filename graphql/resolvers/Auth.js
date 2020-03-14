import {UserInputError} from "apollo-server-express";
import AuthenticationService from "../../services/Authentication.service";

const AuthResolvers = {
  Query: {
    logOut: async (parent, {args}, {user, db}) => {
      // const tokenDB = db.Tokens;
      // const findToken = await tokenDB.find({userId: user.id});
      // console.log('findToken', findToken);
      console.log('user._id', user);

      // if (findToken.length) {
      //   findToken[0].remove();
      // }

      return {
        data: 'successfully logged out'
      }
    }
  },
  Mutation: {
    signUp: async (parent, {data}, {user, db}) => {
      console.log('signUp Hit');
      let {firstName, lastName, email, password} = data;
      const userExists = await db.Users.findOne({email});

      if (userExists) {
        throw new Error({
          type: 1,
          message: 'User already exist'
        });
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
        throw new UserInputError('Smth goes wrong');
      }

      // const tokenDB = await db.Tokens.find({userId: _user._id});
      // console.log('is token found', tokenDB);

      const tokenConfiguration = {
        id: _user._id,
        roles: []
      };
      const tokenExpDate = Math.floor(Date.now() / 1000) + (60 * 60);
      const genToken = await AuthenticationService.genToken(tokenConfiguration, tokenExpDate);

      const token = _user ? genToken : null;

      // const saveToken = await new db.Tokens(tokenData).save();

      return {
        firstName: _user.firstName,
        lastName: _user.lastName,
        email: _user.email,
        l_visit: _user.l_visit,
        auth: {
          token: token
        },
      }
    },
    signIn: async (parent, {data}, {db}) => {
      const {email, password} = data;
      const user = email ? await db.Users.findOne({email: email}) : false;
      const passwordMatches = user ? await AuthenticationService.comparePassword(password, user.password) : false;

      console.log('passwordMatches', passwordMatches);

      if (!user) {
        return new UserInputError('User not found');
      } else if (!passwordMatches) {
        return new UserInputError('Invalid credentials');
      }

      // const tokenDB = db.Tokens;
      const tokenConfiguration = {
        id: user._id,
        roles: []
      };
      const tokenExpDate = Math.floor(Date.now() / 1000) + (60 * 60);
      const genToken = await AuthenticationService.genToken(tokenConfiguration, tokenExpDate);

      const token = user ? genToken : null;


      // const findToken = await tokenDB.find({userId: user._id});
      //
      // if (findToken.length) {
      //   findToken[0].remove();
      // }

      // const newToken = await new tokenDB(tokenData).save();

      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        l_visit: user.l_visit,
        auth: {
          token: token
        },
      }
    }
  }
};

export default AuthResolvers;

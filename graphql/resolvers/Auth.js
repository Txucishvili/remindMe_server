import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';

const saltRounds = 10;

const secret = 'secret_code_area';
const issuer = 'app_init';
const audience = 'app_record';

const genSalt = (salt) => {
  return bcrypt.genSaltSync(salt);
};

const genHash = (password, salt) => {
  return bcrypt.hashSync(password, salt);
};

const comparePassword = (password, compare) => {
  return bcrypt.compareSync(password, compare);
};

const genToken = (data) => {
  return jwt.sign(data, secret, {
    issuer,
    audience,
  });
};


const AuthResolvers = {
  Mutation: {
    signUp: async (parent, {data}, {db}) => {
      let {firstName, lastName, email, password} = data;

      const userExists = await db.Users.findOne({email});

      if (userExists) {
        throw new Error('User already exist');
      }

      let passwordHash = await genHash(password, genSalt(saltRounds));
      const saveData = {
        firstName,
        lastName,
        password: passwordHash,
        email
      };

      const user = await new db.Users(saveData).save();
      user._id = user._id.toString();

      if (!user) {
        throw new Error('Invalid credentials')
      }

      const token = genToken({id: user._id});

      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        l_visit: user.l_visit,
        auth: {token},
      }
    },
    signIn: async (parent, {data}, {db}) => {
      const {email, password} = data;
      const user = await db.Users.findOne({email: email});
      console.log('user', user);

      if (!user) {
        throw new Error('Invalid credentials');
      } else if(!comparePassword(password, user.password)) {
        throw new Error('Invalid credentials');
      }

      const token = user ? genToken({id: user._id}) : 'nullls';

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

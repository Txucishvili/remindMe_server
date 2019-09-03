import jwt from "jsonwebtoken";
import {Users} from "../mongoose/schemas";
import bcrypt from "bcrypt-nodejs";

class AuthenticationService {
  static saltRounds = 10;

  static secret = 'secret_code_area';
  static issuer = 'app_init';
  static audience = 'app_record';

  constructor(props) {
  }

  static jsonDecode = async (token) => {
    let decoded = {};

    jwt.verify(token, this.secret, {
      issuer: this.issuer,
      audience: this.audience,
    },  (err, dec) => {
      decoded = dec;
    });

    return decoded;
  };

  static getUser = async (headers, db) => {
    const token = headers.authorization || '';
    const checkTokenDB = await db.Tokens.findOne({token});
    const decodedToken = await this.jsonDecode(token);

    if (!checkTokenDB) {
      return null;
    } else if (!decodedToken) {
      return null;
    }

    const user = await db.Users.findById(decodedToken.id);
    const {firstName, lastName, _id, email, l_status} = user;

    const userModel = {
      firstName,
      lastName,
      email,
      l_status,
      id: _id.toString()
    };

    return userModel;
  };

  static genSalt = (salt) => {
    return bcrypt.genSaltSync(salt);
  };

  static genHash = (password, salt = this.saltRounds) => {
    const genSalt = AuthenticationService.genSalt(salt);
    return bcrypt.hashSync(password, genSalt);
  };

  static comparePassword = (password, compare) => {
    return bcrypt.compareSync(password, compare);
  };

  static genToken = (data) => {
    return jwt.sign(data, this.secret, {
      issuer: this.issuer,
      audience: this.audience
    });
  };

}

export default AuthenticationService;

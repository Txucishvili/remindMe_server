import jwt from "jsonwebtoken";
import bcrypt from "bcrypt-nodejs";
import {config} from "../config/config";

class AuthenticationService {
  static saltRounds = config.TOKEN_SALT;

  static secret = config.TOKEN_SECRET;
  static issuer = config.TOKEN_ISSUER;
  static audience = config.TOKEN_AUDIENCE;

  constructor(props) {
  }

  static jsonDecode = async (token) => {
    let decoded = {};

    decoded = await jwt.decode(token, this.secret, {
      issuer: this.issuer,
      audience: this.audience,
    }, (err, dec) => {
      return dec;
    });

    return decoded;
  };

  static checkUser = async (headers, db) => {
    const token = headers.authorization || '';
    let returnData, returnObject, decodeToken;

    if (token === 'null') {
      returnObject = {
        error: true,
        type: 0
      }
    } else {
      decodeToken = await this.jsonDecode(token);
      const user = decodeToken ? await db.Users.findById(decodeToken.id) : false;
      const tokenNotValidDate = decodeToken ? Date.now() >= decodeToken.exp * 1000 : false;

      if (!decodeToken) {
        returnObject = {
          error: true,
          type: 1
        }
      } else if (tokenNotValidDate) {
        returnObject = {
          error: true,
          type: 2
        }
      } else if (!user) {
        returnObject = {
          error: true,
          type: 3
        }
      } else {
        const {firstName, lastName, _id, email, l_status} = user;

        returnObject = {
          error: false,
          type: null,
          data: {
            firstName,
            lastName,
            email,
            l_status,
            id: _id.toString()
          }
        };
      }
    }


    return new Promise((resolve) => {
      resolve(returnObject);
    });
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

  static genToken = (data, expires) => {
    expires = Math.floor(Date.now() / 1000) + (60 * 60);
    const expires5Min = '10m';

    return jwt.sign(
      data,
      this.secret,
      {
        issuer: this.issuer,
        audience: this.audience,
        expiresIn: expires5Min
      });
  };
}

export default AuthenticationService;

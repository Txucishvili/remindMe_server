import {SchemaDirectiveVisitor} from 'apollo-server-express';
import {defaultFieldResolver} from "graphql";

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const {resolve = defaultFieldResolver} = field;

    field.resolve = async (...args) => {
      let user;
      [root, {}, {user}] = args;

      // console.log('args', args);

      if (!user) {
        console.warn('User not authenticated');
        return {};
      }

      const result = await resolve.apply(this, args);
      return result;
    };
  }
}

export default AuthDirective;

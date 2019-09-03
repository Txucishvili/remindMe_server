import {gql} from 'apollo-server-express';

const AuthTypes = gql`
    directive @isAuth on FIELD_DEFINITION
    directive @roles(
        requires: Roles = ADMIN,
    ) on OBJECT | FIELD_DEFINITION

    enum Roles {
        ADMIN
        USER
        FRIEND
    }

    input SignInInput {
        email: String!
        password: String!
    }

    input SignUpInput {
        firstName: String!,
        lastName: String!
        email: String!,
        password: String!
        created: String!
    }

    type Token {
        token: String!
    }

    type SignInResponse {
        firstName: String!,
        lastName: String!
        email: String!,
        auth: Token,
        l_status: String
    }
    
    type LogOutResponse {
        data: String
    }
    
    type Query {
        logOut: LogOutResponse
    }

    type Mutation {
        signUp(data: SignUpInput!): SignInResponse!
        signIn(data: SignInInput!): SignInResponse!
    }
`;

export default AuthTypes;

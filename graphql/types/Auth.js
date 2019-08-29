import {gql} from 'apollo-server-express';

const AuthTypes = gql`
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

    type Mutation {
        signUp(data: SignUpInput!): SignInResponse!
        signIn(data: SignInInput!): SignInResponse!
    }
    
    type Query {
        me: SignInResponse!,
    }
`;

export default AuthTypes;

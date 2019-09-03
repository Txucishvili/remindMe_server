import {gql} from 'apollo-server-express';

const UserTypes = gql`
    type User {
        _id: String
        firstName: String
        lastName: String
        email: String
        password: String
        created: String
        modified: String
    }

    type UserResponse {
        firstName: String!,
        lastName: String!
        email: String!,
        auth: Token,
        l_status: String
    }

    type Query {
        AllUsers: [User]! @isAuth @roles(requires: ADMIN)
        getUser(id: String!): UserResponse  @isAuth @roles(requires: ADMIN)
        me: UserResponse @isAuth
    }

    type SignInResponse {
        firstName: String!,
        lastName: String!
        email: String!,
        auth: Token,
        l_status: String
    }

    input SignUpInput {
        firstName: String!,
        lastName: String!
        email: String!,
        password: String!
        created: String!
    }
`;

export default UserTypes;

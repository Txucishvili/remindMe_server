import {gql} from 'apollo-server-express';

const UserTypes = gql`
    directive @isAuth on FIELD_DEFINITION

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
        AllUsers: [User]! @isAuth,
        getUser(token: String!): UserResponse
    }

    type Mutation {
        CreateUser (
            firstName: String
            lastName: String
            email: String
            password: String
            created: String
            modified: String
        ): User,
        RemoveUser(id: String): User
    }
`;

export default UserTypes;

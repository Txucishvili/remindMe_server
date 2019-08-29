import {gql} from 'apollo-server-express';

const PostTypes = gql`
    type Post {
        _id: String!
        authorId: String!
        title: String!
        description: String!
        created: String!
        modified: String
        author: User
    }

    type Query {
        allPosts(userId: String): [Post]!
    }

    input addPostInput {
        authorId: String!
        title: String!
        description: String!
        created: String!
        modified: String
    }

    type Mutation {
        addPost (data: addPostInput) : Post!,
        removePost(id: String!, userId: String!): Post
    }
`;

export default PostTypes;

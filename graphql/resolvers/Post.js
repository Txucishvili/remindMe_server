const PostResolvers = {
  Query: {
    allPosts: async (parent, args, {Posts, Users}) => {
      const postDB = args.userId ? await Posts.find({authorId: args.userId}) : await Posts.find();

      return postDB.map(async (post) => {
        post._id = post._id.toString();
        const user = await Users.findById(post.authorId);

        if (!user) {
          post.author = null;
        } else {
          post.author = user;
          post.author._id = post.author._id.toString();
        }

        return post;
      });
    }
  },

  Mutation: {
    addPost: async (parent, {data: data}, {Posts, Users}) => {
      const {authorId, title, description, created} = data;

      const user = await Users.findById(authorId);

      if (!user) {
        throw new Error('No user found');
      }

      const saveData = {
        title,
        authorId,
        description,
        created
      };

      const post = await new Posts(saveData).save();

      post._id = post._id.toString();
      return post;
    },

    removePost: async (parent, args, {Posts, Users}) => {
      const post = await Posts.findById(args.id);

      if (post.authorId !== args.userId) {
        throw Error('No user matchs');
      }

      post.remove();
      return post;
    }
  }
};

export default PostResolvers;

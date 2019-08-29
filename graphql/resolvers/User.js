const UserResolver = {
  Query: {
    AllUsers: async (parent, args, {db}) => {
      const users = await db.Users.find();

      let allUsers = users.map(user => {
        user._id = user._id.toString();

        return user;
      });

      return allUsers;
    },
    getUser: async (parent, args, {db}) => {
      const user = await db.Users.findById(args.id);
      console.log('HIIIIIIIIT');
      return {
        user
      };
    }
  },

  Mutation: {
    CreateUser: async (parent, args, {Users}) => {
      console.log('hittt');
      const user = await new Users(args).save();
      user._id = user._id.toString();

      return user
    },
    RemoveUser: async (parent, args, {Users}) => {
      const users = await Users.findById(args.id);
      users.remove();

      return users;
    }
  }
};

export default UserResolver;

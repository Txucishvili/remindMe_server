import {authenticated} from "../../graphql/auth-guard";

const TheaterControlResolvers = {
  Query: {
    me: authenticated((root, args, context, info) => context.user),
    fetchMovieList: authenticated((root, args,context, info) => fetchTheater(root, args,context))
  }
};

export default TheaterControlResolvers;

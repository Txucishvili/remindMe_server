import User from "./resolvers/User";
import Post from "./resolvers/Post";
import AuthResolvers from "./resolvers/Auth";
import TheaterResolvers from "./resolvers/Theater";
import TheaterControlResolvers from "./resolvers/TheaterControl";

export default [User, Post, AuthResolvers, TheaterResolvers, TheaterControlResolvers];

import {mergeTypes} from "merge-graphql-schemas";

import UserTypes from "./types/User";
import PostTypes from "./types/Post";
import AuthTypes from "./types/Auth";
import TheaterTypes from "./types/Theater";

const typeDefs = [UserTypes, PostTypes, AuthTypes, TheaterTypes];

export default mergeTypes(typeDefs, {all: true});

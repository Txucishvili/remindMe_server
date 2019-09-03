import {mergeTypes} from "merge-graphql-schemas";

import UserTypes from "./types/User";
import AuthTypes from "./types/Auth";
import TheaterTypes from "./types/Theater";

const typeDefs = [UserTypes, AuthTypes, TheaterTypes];

export default mergeTypes(typeDefs, {all: true});

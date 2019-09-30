import {mergeTypes} from "merge-graphql-schemas";

import UserTypes from "./types/User";
import AuthTypes from "./types/Auth";
import TheaterTypes from "./types/Theater";
import ReminderTypes from "./types/Reminder";
import FinderTypes from "./types/Finder";

const typeDefs = [UserTypes, AuthTypes, TheaterTypes, FinderTypes, ReminderTypes];

export default mergeTypes(typeDefs, {all: true});

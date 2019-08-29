import mongoose from "mongoose";

const Users = mongoose.model('Users', {
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  created: String,
  modified: String
});

export default Users;

import mongoose from "mongoose";

const Tokens = mongoose.model('Tokens', {
  userId: String,
  token: String,
  createdAt: String,
  updatedAt: String
});

export default Tokens;

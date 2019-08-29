import mongoose from "mongoose";

const Posts = mongoose.model('Posts', {
  title: String,
  authorId: String,
  description: String,
  created: String,
  modified: String
});

export default Posts;

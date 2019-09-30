import mongoose from "mongoose";

const Reminders = mongoose.model('Reminders', {
  userId: String,
  movieId: Object,
  showable: Boolean,
  configuration: Object,
  createdAt: String,
  updatedAt: String
});

export default Reminders;

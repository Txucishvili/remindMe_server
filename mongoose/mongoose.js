import mongoose from 'mongoose';

class Mongoose {
  constructor() {
    this.DatabaseURL = null;
    this.db = mongoose.connection;
    // console.log('constructon Mongoose');
  }

  init(url) {
    // console.log('Mongoose init', url);
    this.DatabaseURL = url;
    mongoose.connect(this.DatabaseURL, {useNewUrlParser: true});

    this.db.once("open", () => console.log("🗂 MongoDB connected"));
    this.db.on("error", console.error.bind(console, "MongoDB connection error:"));
  };
}

// hello share

export default Mongoose;

import mongoose from 'mongoose';

const Theater = mongoose.model('Theater', {
  id: String,
  poster_path: String,
  release_date: String,
  result: {
    adjaranet: Object,
    iMDb: String,
    iMovie: Object
  },
  title: String
});

export default Theater;

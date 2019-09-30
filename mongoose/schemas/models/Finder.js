import mongoose from 'mongoose';

const FinderModel = mongoose.model('Finder', {
  movieId: String,
  iMDb: String,
  adjaranet: Object,
  iMovie: Object,
});

export default FinderModel;

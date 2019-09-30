import mongoose from 'mongoose';

const Theater = mongoose.model('Theater', {
  movieId: String,
  adult: String,
  backdrop_path: String,
  original_language: String,
  original_title: String,
  title: String,
  overview: String,
  popularity: String,
  release_date: String,
  video: String,
  vote_average: String,
  vote_count: String,
  poster_path: String,
  posters: Array,
  trailers: Array,
  genre_ids: Array,
  isAvailable: Boolean,
  color: String,
});

export default Theater;

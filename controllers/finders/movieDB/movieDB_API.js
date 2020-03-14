import fetch from "node-fetch";

const fetchHandler = (url, config = {}) => {
  if (config.keywords) {
    console.log('config is' - config);
  }
  return new Promise(async (resolve, reject) => {
    const data = await fetch(url, config)
      .then(resp => resp)
      .catch(error => error);

    const response = data ? await data.json() : [];
    const status = data.status;

    if (status === 200) {
      resolve(response);
    } else {
      reject(response);
    }

  });
};

const MovieDB_key = 'def8e81a2062de92fa98fd4763e2c128';
const forTesting = `https://api.themoviedb.org/3/movie/now_playing?api_key=def8e81a2062de92fa98fd4763e2c128&language=en-US&page=1`;
const MovieDB_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${MovieDB_key}&language=en-US&page=1`;

const movieDBconfig = {
  key: 'def8e81a2062de92fa98fd4763e2c128',
  lang: 'en',
  trailerType: 'Trailer'
};

const movieURLGenerator = (params, end = '') => {
  const api = `https://api.themoviedb.org/3${params}?api_key=${movieDBconfig.key}&language=${movieDBconfig.lang}${end}`;
  return api;
};

const fetchMovieImages = async (data) => {
  const returnData = await fetchHandler(movieURLGenerator(`/movie/${data.id}/images`))
    .then(resp => {
      console.log('fetchMovieImages', resp, data.title);
      return {error: false, data: resp};
    })
    .catch(e => {
      console.log('fetchMovieImages [error]', e, data.title);
      return {error: true, data: e};
    });

  return new Promise((resolve, reject) => {
    if (returnData.error) {
      resolve(returnData);
    } else {
      reject(returnData)
    }
  })
};

const fetchMovieTrailers = async (data) => {
  const returnData = await fetchHandler(movieURLGenerator(`/movie/${singleItem.id}/videos`))
    .then(resp => {
      return {error: false, data: resp};
    })
    .catch(e => {
      return {error: true, data: e};
    });

  return new Promise((resolve, reject) => {
    if (returnData.error) {
      resolve(returnData);
    } else {
      reject(returnData)
    }
  })
};

const fetchSingleMovie_API = async (props) => {
  const {id, target} = props;

  const returnData = await fetchHandler(movieURLGenerator(`/movie/${id}/${target}`))
    .then(resp => {
      console.log(`[fetchHandler] fetched data - ${target} - `, resp);
      return {error: false, data: resp};
    })
    .catch(e => {
      console.log(`[fetchHandler] error on - ${target} - `, e);
      return {error: true, data: e};
    });

  return new Promise((resolve, reject) => {
    if (!returnData.error) {
      resolve(returnData);
    } else {
      reject(returnData)
    }
  })
};

export {fetchSingleMovie_API, movieURLGenerator, fetchHandler, movieDBconfig};

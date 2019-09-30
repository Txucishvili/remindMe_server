import {checkTitle} from "./finder";
import fetch from "node-fetch";
import {sleep} from "../../utils/funcs";

const MovieDB_key = 'def8e81a2062de92fa98fd4763e2c128';
const forTesting = `https://api.themoviedb.org/3/movie/now_playing?api_key=def8e81a2062de92fa98fd4763e2c128&language=en-US&page=1`;

const movieDBconfig = {
  key: 'def8e81a2062de92fa98fd4763e2c128',
  lang: 'en',
  trailerType: 'Trailer'
};

const movieURLGenerator = (params, end = '') => {
  const api = `https://api.themoviedb.org/3${params}?api_key=${movieDBconfig.key}&language=${movieDBconfig.lang}${end}`;
  return api;
};

const MovieDB_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${MovieDB_key}&language=en-US&page=1`;

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

export const FetchAndCollectData = async () => {
  let allPagesCollect = [];

  const FirstLevelData = await fetchHandler(movieURLGenerator('/movie/now_playing', '&page=1'))
    .then(resp => resp)
    .catch(error => error);
  FirstLevelData.results.map(itm => allPagesCollect.push(itm));

  if (FirstLevelData && FirstLevelData.total_pages && false) {
    for (let i = 1; i < 4; i++) {
      if (i > 1) {
        console.log('requesting page', i);
        const nextPageData = await fetchHandler(movieURLGenerator('/movie/now_playing', '&page=' + i))
          .then(resp => resp)
          .catch(error => error);
        nextPageData.results.map(itm => allPagesCollect.push(itm));
      }
    }
  }

  // attach all posters and trailers
  for (let singleItem of allPagesCollect) {
    const i = allPagesCollect.indexOf(singleItem);
    let movieImages;
    let movieVideos;
    const sleepTimer = 300;

    await sleep(sleepTimer);

    movieImages = await fetchHandler(movieURLGenerator(`/movie/${singleItem.id}/images`))
      .then(resp => resp)
      .catch(e => e);

    await sleep(sleepTimer);

    movieVideos = await fetchHandler(movieURLGenerator(`/movie/${singleItem.id}/videos`))
      .then(resp => resp)
      .catch(e => e);

    allPagesCollect[i].posters = movieImages.posters;
    allPagesCollect[i].trailers = movieVideos.results.filter(itm => {
      if (itm.type.toLowerCase() === movieDBconfig.trailerType.toLowerCase()) {
        return itm;
      }
    });
  }

  console.log('allPagesCollect', allPagesCollect);

  return allPagesCollect;
};

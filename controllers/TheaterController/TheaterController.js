import fetch from 'node-fetch';
import {checkItems} from "../finders/finder";

const MovieDB_key = 'def8e81a2062de92fa98fd4763e2c128';
const MOVIEdb_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZWY4ZTgxYTIwNjJkZTkyZmE5OGZkNDc2M2UyYzEyOCIsInN1YiI6IjVkNGFkOGViNTNmODMzMTRkNWQyOTdjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Da--6Hi9_EpBa3-Jm0qIz3shq-Lkwxcm_kkR-ZoadDQ';
const forTesting = `https://api.themoviedb.org/3/movie/now_playing?api_key=def8e81a2062de92fa98fd4763e2c128&language=en-US&page=1`;

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

export const Fetch_Movie_Data = async (req, res, next) => {
  await fetchHandler(MovieDB_URL)
    .then(resp => {
      req.data = resp;
      next();
    }).catch(error => res.send(error));
};

export const TheaterFetch = async (req, res) => {
  const body = req.data.results;

  const respItems = await checkItems(body);

  const filterData = respItems.filter(i => {
    if (i.result.iMovie && !i.result.iMovie.isAdded && i.result.adjaranet && !i.result.adjaranet.isAdded) {
      return i;
    } else {
      // console.log('not valid', i);
    }
  });

  console.log('-----------------------------', ' - DONE');

  res.send(respItems);
};

export const routerExporter = {
  router: '/api/theater',
  middleware: [Fetch_Movie_Data],
  handling: TheaterFetch
};

export const FetchAndCollectData = async () => {
  const FirstLevelData = await fetchHandler(MovieDB_URL)
    .then(resp => resp)
    .catch(error => error);

  const collectPirateData = await checkItems(FirstLevelData.results);

  return collectPirateData;
};

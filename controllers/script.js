const MOVIEdb_KEY = 'def8e81a2062de92fa98fd4763e2c128';
const MOVIEdb_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZWY4ZTgxYTIwNjJkZTkyZmE5OGZkNDc2M2UyYzEyOCIsInN1YiI6IjVkNGFkOGViNTNmODMzMTRkNWQyOTdjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Da--6Hi9_EpBa3-Jm0qIz3shq-Lkwxcm_kkR-ZoadDQ';
const forTesting = `https://api.themoviedb.org/3/movie/now_playing?api_key=def8e81a2062de92fa98fd4763e2c128&language=en-US&page=1`;

const iMDB_SEARCH_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${MOVIEdb_KEY}&language=en-US&page=1`;

const IMOVIE_SEARCH_URL_ = 'https://api.imovies.cc/api/v1/search';
const IMOVIE_SEARCH_URL = 'https://api.imovies.cc/api/v1/search-advanced';
const IMOVIE_SINGLE_MOVIE_URL = 'https://api.imovies.cc/api/v1/movies/';

// iMDb area
const iMDb_URL = (title) => {
  const firstChar = title.charAt(0).toString().toLowerCase();
  const fullTitle = title.replace(/–/, '-').replace(':', ' ').replace(/\s+/g, '_').toString().toLowerCase().substring(0, 19);
  return `https://v2.sg.media-imdb.com/suggestion/${firstChar}/${fullTitle}.json`;
};

const iMDbID_merge = async (url, data) => {
  let fetchedItems = [];
  let matchedItem;
  let errorThrow;
  let returnObj;
  let filteredData;

  // TODO: need better match effect

  await fetchHandler(url).then(resp => fetchedItems = resp && resp['d'] ? resp['d'] : []).catch(error => errorThrow = error);

  if (fetchedItems.length) {
    // const names = resp['d'].map(itm => itm.l);
    // console.log('------------------------------------------------');
    // console.log('Requesting for title - ', data.title);
    // console.log('Fetched titles - ', names);

    // const name = item.l.toLowerCase().replace(/\.+/g, '').replace(/\s+/g, '|').toString();
    // const regEx = new RegExp(name);
    // console.log('to Regex', data.title.toLowerCase().replace(/\.+/g, '').localeCompare(item.l.toLowerCase().replace(/\.+/g, '')), name);

    // --------

    // if (!returnData.error) {
    //   const {l, id, y} = returnData;
    //   filteredData = {l, id, y, type: 2};
    // } else {
    //   filteredData = {
    //     ...returnData.data,
    //     type: 1,
    //   };
    // }
    //
    // returnObj = filteredData;

    matchedItem = fetchedItems.find(item => {
      if (item.i && (item.q === 'feature' || item.q === 'TV movie')
        && item.l
          .toLowerCase()
          .replace(/\.+/g, ' ')
          .replace(/\s+/g, '_')
          .includes(data.title.toLowerCase()
            .replace(/w!+/g, '')
            .replace(/\s+/g, '_'))
        && item.y === data.release_date) {
        return item;
      }
    });
  } else {
    // no search result handling
  }

  if (matchedItem) {
    returnObj = {...data, imdbID: matchedItem.id};
  } else {
    // TODO: handling to unmatched search results
    returnObj = {...data, imdbID: null};
  }

  return new Promise((resolve, reject) => {
    if (errorThrow) {
      reject(errorThrow);
    } else {
      resolve(returnObj);
    }
  });
};

const iMDb_fetch = async (data) => {
  const list = [];

  await data.forEach(item => {
    const iMDB_result = iMDbID_merge(iMDb_URL(item.title), item);

    list.push(iMDB_result);
  });

  return list;
};

const toCollect = (data, demension = 2) => {
  let returnObj = JSON.parse(JSON.stringify(data));
  const numberCollections = Math.ceil(returnObj.length / demension);
  const resultArray = [];

  for (let i = 0; i < numberCollections; i++) {
    const group = returnObj.splice(0, demension);
    if (group.length) {
      resultArray.push(group);
    }
  }

  return resultArray;
};

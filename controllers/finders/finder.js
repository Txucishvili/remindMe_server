import axios from "axios/index";
import request from "request";
import cheerio from "cheerio";


// iMovie area

const iMovie_single_check = (id) => {
  const url = 'https://api.imovies.cc/api/v1/movies/' + id;

  return new Promise(async (resolve, reject) => {
    return await axios.get(url)
      .then(resp => {
        resolve(resp.data.data);
      }).catch(error => {
        reject(error);
      });
  });
};

const iMovie_search = async (item) => {
  const paramsConfig = {
    without_watched_movies: 'no',
    countries_related: 'no',
    genres_related: 'no',
    filter_type: 'movie',
    keywords: encodeURIComponent(item.title),
    page: 1,
    per_page: 9
  };
  const iMovie_search_url = (config) => {
    const URL = '' +
      'https://api.imovies.cc/api/v1/search-advanced?' +
      'movie_filters%5Bgenres_related%5D=' +
      config.genres_related +
      '&movie_filters%5Bcountries_related%5D=' +
      config.countries_related +
      '&movie_filters%5Bwithout_watched_movies%5D=' +
      config.without_watched_movies +
      '&filters%5Btype%5D=' +
      config.filter_type +
      '&keywords=' +
      config.keywords +
      '&page=' +
      config.page +
      '&per_page=' +
      config.per_page +
      '';
    return JSON.parse(JSON.stringify(URL));
  };
  const url = iMovie_search_url(paramsConfig);

  return new Promise(async (resolve, reject) => {
    return await axios.get(url)
      .then(resp => {
        const data = resp && resp.data ? resp.data.data : [];
        const handling = data
          ? {error: false, errorType: 0, data: data}
          : {error: true, errorType: 1, data: []};
        resolve(handling);
      }).catch(error => {
        reject({error: true, errorType: 1, data: error});
      });
  });
};

const iMovie_find = async (data) => {
  let matchedItem;
  let returnData;

  const iMovie_search_result = await iMovie_search(data);

  returnData = iMovie_search_result;

  if (!iMovie_search_result.error && iMovie_search_result.data) {
    matchedItem = iMovie_search_result.data.find(itm => {
      if (itm.id && itm.secondaryName
          .toLowerCase()
          .replace(/\.+/g, ' ')
          .replace(/\s+/g, '_')
          .includes(data.title.toLowerCase()
            .replace(/w!+/g, '')
            .replace(/\s+/g, '_'))
        && itm.year === data.release_date) {
        return itm;
      }
    });

    if (matchedItem) {
      returnData.data = await iMovie_single_check(matchedItem.id);
      returnData.errorType = 0;
    } else {
      returnData.error = true;
      returnData.errorType = 2;
      returnData.data = [];
    }
  }

  return new Promise((resolve) => {
    resolve({...returnData, id: data.id});
  });
};

// adjaranet area
const adjaranet_search_advanced = (data) => {
  const url = 'http://net.adjara.com/Home/quick_search?ajax=1&search=' +
    encodeURIComponent(data.title.toLowerCase());

  return new Promise(async (resolve, reject) => {
    await axios.get(url)
      .then(resp => {
        const data = resp && resp.data && resp.data.movies ? resp.data.movies.data : [];
        const handling = data
          ? {error: false, errorType: 0, data: data}
          : {error: true, errorType: 1, data: []};
        resolve(handling);
      }).catch(error => {
        reject({error: true, errorType: 1, data: error});
      });
  });
};

const adjaranet_single_check = (url) => {
  const URL = url + '&js=1';
  const wordToMatch = 'გამოშვების წელი:';

  return new Promise(async (resolve, reject) => {
    await request(URL, async (error, response, body) => {
      const statusCode = response && response.statusCode;
      const $ = cheerio.load(body);
      let yearMatch;

      // TODO: need add error handling
      if (error) {
        console.log('error occured');
        reject(error);
      }

      const isAdded = !!!$('.movieHiddenMessage').find('img').length;
      const yearTarget = $('.movie-full-list').find('span');

      $(yearTarget).each(function (i, elem) {
        const textString = $(this).text();
        const siblingAtag = $(this).next('a').text();

        if (textString && siblingAtag && textString.includes(wordToMatch)) {
          yearMatch = siblingAtag.replace(/\s/g, '');
        }
      });

      const returnObj = {
        isAdded,
        year: yearMatch
      };

      resolve(returnObj);
    });
  });
};

const adjaranet_find = async (data) => {
  let matchedItem;
  let returnData;

  const search_result = await adjaranet_search_advanced(data);

  returnData = search_result;

  if (!search_result.error && search_result.data) {
    matchedItem = search_result.data.find(itm => {
      if (itm.id && itm.title_en
        .toLowerCase()
        .replace(/\.+/g, ' ')
        .replace(/\s+/g, '_')
        .includes(data.title.toLowerCase()
          .replace(/w!+/g, '')
          .replace(/\s+/g, '_'))) {
        return itm;
      }
    });

    let isFullMatch = false;
    let adjaraSingleTargetResult;

    if (matchedItem) {
      adjaraSingleTargetResult = await adjaranet_single_check(matchedItem.link);
      const target_year = parseInt(adjaraSingleTargetResult.year, 10);

      isFullMatch = target_year === parseInt(data.release_date, 10);
    }

    if (isFullMatch) {
      returnData.isAdded = adjaraSingleTargetResult.isAdded;
      returnData.errorType = 0;
      returnData.data = matchedItem;
    } else {
      returnData.error = true;
      returnData.errorType = 2;
      returnData.data = [];
    }
  }

  return new Promise((resolve) => {
    resolve({...returnData, id: data.id});
  });
};

// checker init
const checkTitle = async (data) => {
  let returnObj = {
    id: data.id,
    iMovie: null,
    iMDb: null,
    adjaranet: null,
    valid: false,
    error: false,
  };

  const iMovie_result = await iMovie_find(data);
  const adjaranetResult = await adjaranet_find(data);

  // console.log(adjaranetResult);

  if (!iMovie_result.error && iMovie_result.data.id) {
    returnObj.iMovie = {
      id: iMovie_result.data.id,
      isAdded: !!(iMovie_result.data.seasons && iMovie_result.data.seasons.data.length),
    };
    returnObj.iMDb = iMovie_result.data.imdbUrl;
  } else {
    returnObj.iMovie = null;
    returnObj.iMDb = null;
  }

  if (!adjaranetResult.error && adjaranetResult.data.id) {
    returnObj.adjaranet = {
      id: adjaranetResult.data.id,
      isAdded: adjaranetResult.isAdded,
    };
  } else {
    returnObj.adjaranet = null;
  }

  return returnObj;
};

const checkItems = async (data) => {
  let returnData = [];

  for (const item of data) {
    const {id, title, release_date} = item;
    let returnObj = [];

    const findData = {
      id,
      title,
      release_date: parseInt(release_date.split('-')[0], 10)
    };

    const responseObject = await checkTitle(findData);

    if (id === responseObject.id) {
      returnObj = {
        id: item.id,
        title: item.title.replace(/–/, '-'),
        release_date: parseInt(item.release_date.split('-')[0], 10),
        poster_path: item.poster_path,
        result: {
          iMovie: responseObject.iMovie,
          iMDb: responseObject.iMDb,
          adjaranet: responseObject.adjaranet,
        }
      };

      returnData.push(returnObj);
    }
  }

  return returnData;
};

export {checkTitle, checkItems};

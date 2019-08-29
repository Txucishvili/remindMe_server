import fetch from 'node-fetch';
import {checkItems} from "../finders/finder";

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

export const FetchData = async (req, res, next) => {
  await fetchHandler(iMDB_SEARCH_URL)
    .then(resp => {
      req.data = resp;
      next();
    }).catch(error => res.send(error));
};

export const FetchRouter = async (req, res) => {
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

  res.send(filterData);
};

export const routerExporter = {
  router: '/api',
  middleware: [],
  handling: FetchRouter
};

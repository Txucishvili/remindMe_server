import {checkItems, checkTitle} from "./finder";
import {sleep} from "../../utils/funcs";
import {fetchSingleMovie_API, movieURLGenerator, fetchHandler, movieDBconfig} from "./movieDB/movieDB_API";

const PAGE_LENGTH = 4;

export const FetchAndCollectData = async () => {
  let allPagesCollect = [];

  const FirstLevelData = await fetchHandler(movieURLGenerator('/movie/now_playing', '&page=1'))
    .then(resp => resp)
    .catch(error => error);
  FirstLevelData.results.map(itm => allPagesCollect.push(itm));

  if (FirstLevelData && FirstLevelData.total_pages) {
    for (let i = 1; i < PAGE_LENGTH; i++) {
      if (i > 1) {
        const nextPageData = await fetchHandler(movieURLGenerator('/movie/now_playing', '&page=' + i))
          .then(resp => resp)
          .catch(error => error);

        if (nextPageData.results) {
          console.log('- catch next page - ', i,  nextPageData.results.length);
          nextPageData.results.map(itm => allPagesCollect.push(itm));
        }

      }
    }
  }

  // attach all posters and trailers
  for (let singleItem of allPagesCollect) {
    const i = allPagesCollect.indexOf(singleItem);
    const sleepTimer = 300;

    let movieImages;
    let movieVideos;
    let movieCast;

    await sleep(sleepTimer);

    movieImages = await fetchSingleMovie_API({id: singleItem.id, target: 'images'})
      .then(resp => resp.data)
      .catch(e => []);

    await sleep(sleepTimer);

    movieVideos = await fetchSingleMovie_API({id: singleItem.id, target: 'videos'})
      .then(resp => resp.data)
      .catch(e => []);

    await sleep(sleepTimer);

    movieCast = await fetchSingleMovie_API({id: singleItem.id, target: 'credits'})
      .then(resp => resp.data.cast.filter(i => i.order < 9))
      .catch(e => []);

    allPagesCollect[i].posters = movieImages.posters;
    allPagesCollect[i].trailers = movieVideos.results.filter(itm => {
      if (itm.type.toLowerCase() === movieDBconfig.trailerType.toLowerCase()) {
        return itm;
      }
    });
    // allPagesCollect[i].cast = movieCast;
  }

  console.log('allPagesCollect - ', allPagesCollect);

  return allPagesCollect;
};

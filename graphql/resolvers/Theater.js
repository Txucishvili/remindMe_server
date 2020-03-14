import {authenticated} from "../helpers/Auth.guard";
import {FetchAndCollectData} from "../../controllers/finders/movieDB-fetch";
import ColorThief from 'color-thief';
import axios from 'axios';
import fs from 'fs';
import {generateColor} from "../../utils/imageColor";
import {fetchSingleMovie_API} from "../../controllers/finders/movieDB/movieDB_API";

const FileSaver = require('file-saver');

const TheaterResolvers = {
  Query: {
    updateTheater: authenticated(async (root, args, {user, db}) => {
      const fetchedCollection = await FetchAndCollectData();
      let itemDB;
      const ValidDataNames = fetchedCollection.map(item => {
        item.movieId = item.id;
        delete item.id;

        return item;
      });

      for (let item of ValidDataNames) {
        const movieId = item.movieId;
        console.log('item [CATCH] - ', item);

        itemDB = await db.Theater.findOne({movieId});

        const saveTarget = item;

        saveTarget.isAvailable = false; // default

        if (item.poster_path) {
          const imageURL = `https://image.tmdb.org/t/p/original${item.poster_path}`;
          const colorResult = await generateColor(imageURL).then(im => im);
          colorResult.filter(color => color.isLight);
          saveTarget.color = colorResult[0].hex;
        } else {
          saveTarget.color = null;
        }

        if (!!!itemDB) {
          console.log('item not found in DB - ', item.title);
          itemDB = await new db.Theater(saveTarget).save();
        }
      }

      const theaterDB = await db.Theater.find();
      console.log('------- DONE');

      return theaterDB;
    }),
    fetchTheater: authenticated(async (root, args, {user, db}) => {
      let returnItems = [];
      // temporary
      const foundItems = await db.Theater.find();
      // console.log('fetchTheater', args.data);


      if (args.data && !!args.data.finder) {
        const finderItemsDB = await db.FinderModel.find();
        // console.log('hit A');

        for (let item of finderItemsDB) {
          if (item.adjaranet.isAdded || item.iMovie.isAdded) {
            const movieId = item.movieId;
            const foundItem = await db.Theater.findOne({movieId});
            if (foundItem) {
              const obj = JSON.parse(JSON.stringify(foundItem));
              // console.log('foundItem', foundItem);
              obj.searchResult = item;
              returnItems.push(obj);
            }

          }
        }

        // returnItems = await db.Theater.find({isAvailable: true});
      } else {
        // console.log('hit B');
        returnItems = await db.Theater.find({isAvailable: false});
      }

      return returnItems;
    }),
    fetchItem: authenticated(async (root, args, {user, db}) => {
      let returnData = {};
      const movieId = args.id;
      const foundItems = await db.Theater.findOne({movieId});
      console.log("args", args);

      if  (!foundItems) {
        throw new Error("No movie found");
      }

      console.log('movie id', args);
      console.log('foundItems', foundItems);

      const movieCast = await fetchSingleMovie_API({id: movieId, target: 'credits'})
        .then(resp => resp.data.cast.filter(i => i.order < 9))
        .catch(e => []);

      returnData = foundItems;
      returnData.cast = movieCast;

      return returnData;
    })
  }
};

export default TheaterResolvers;

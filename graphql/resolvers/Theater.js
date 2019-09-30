import {authenticated} from "../helpers/Auth.guard";
import {FetchAndCollectData} from "../../controllers/finders/movieDB-fetch";
import ColorThief from 'color-thief';
import axios from 'axios';
import fs from 'fs';
import {generateColor} from "../../utils/imageColor";

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
        itemDB = await db.Theater.findOne({movieId});
        const saveTarget = item;

        saveTarget.isAvailable = false; // default

        const imageURL = `https://image.tmdb.org/t/p/original${item.poster_path}`;
        const colorResult = await generateColor(imageURL).then(im => im);
        colorResult.filter(color => color.isLight);
        saveTarget.color = colorResult[0].hex;

        if (!itemDB) {
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


      if (args.data && args.data.finder && false) {
        const finderItemsDB = await db.FinderModel.find();

        for (let item of finderItemsDB) {
          if (item.adjaranet.isAdded || item.iMovie.isAdded) {
            const movieId = item.movieId;
            const foundItem = await db.Theater.findOne({movieId});
            const obj = JSON.parse(JSON.stringify(foundItem));
            obj.searchResult = item;

            returnItems.push(obj);
          }
        }

      } else {
        returnItems = await db.Theater.find({isAvailable: false});
      }

      return foundItems;
    })
  }
};

export default TheaterResolvers;

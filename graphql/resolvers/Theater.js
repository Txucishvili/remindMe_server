import {FetchAndCollectData} from "../../controllers/TheaterController/TheaterController";
import {combineResolvers} from 'graphql-resolvers';
import {authenticated} from "../helpers/Auth.guard";

const TheaterResolvers = {
  Query: {
    updateTheater: authenticated(async (root, args, {user, db}) => {
      const collectedData = await FetchAndCollectData();
      const ValidData = collectedData.filter(item => item.result.adjaranet && item.result.iMovie);

      console.log('Done Fetching');

      const theaterDB = await context.db.Theater.find();
      console.log('Done DB Loading', theaterDB.length);

      if (!theaterDB.length) {
        for (let item of ValidData) {
          await new context.db.Theater(item).save();
        }
        console.log('Done DB Saving');
      }

      console.log('Start DB Receiving');

      const theaterItems = await context.db.Theater.find();

      theaterItems.map((item, i) => {
        const newTarget = ValidData[i];

        if (!item.result.adjaranet.isAdded && newTarget.result.adjaranet.isAdded) {
          console.log('item Added on: adjaranet - ', item.title);
          item.result.adjaranet.isAdded = newTarget.result.adjaranet.isAdded;
          item.save();
        }

        // if (!item.id !== newTarget.id) {
        //   console.log('not same ID items - ', newTarget.id);
        //   item.id = newTarget.id;
        //   item.save();
        // }

        return item;
      });

      return theaterItems;
    }),
    fetchTheater: authenticated(async (root, args, {user, db}) => {
        const theaterItems = db.Theater ? await db.Theater.find() : null;

        if (theaterItems) theaterItems.map(item => {
          item._id = item._id.toString();
          return item;
        });

        return theaterItems;
      }),
  }
};

export default TheaterResolvers;

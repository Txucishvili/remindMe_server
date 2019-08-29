import {FetchAndCollectData} from "../../controllers/TheaterController/TheaterController";
import {Theater} from "../../mongoose/schemas";

const TheaterResolvers = {
  Query: {
    updateTheater: async (parent, args, context) => {
      const collectedData = await FetchAndCollectData();
      const ValidData = collectedData.filter(item => item.result.adjaranet && item.result.iMovie);

      console.log('Done Fetching');

      const theaterDB = await context.Theater.find();
      console.log('Done DB Loading', theaterDB.length);

      if (!theaterDB.length) {
        for (let item of ValidData) {
          await new context.Theater(item).save();
        }
        console.log('Done DB Saving');
      }

      console.log('Start DB Receiving');

      const theaterItems = await context.Theater.find();

      theaterItems.map((item, i) => {
        const newTarget = ValidData[i];

        if (!item.result.adjaranet.isAdded && newTarget.result.adjaranet.isAdded) {
          console.log('item Added on: adjaranet - ', item.title);
          item.result.adjaranet.isAdded = newTarget.result.adjaranet.isAdded;
          item.save();
        }

        if (!item.id !== newTarget.id) {
          console.log('not same ID items - ', newTarget.id);
          item.id = newTarget.id;
          item.save();
        }

        return item;
      });

      return theaterItems;
    },
    fetchTheater: async (parent, args, context) => {
      const theaterItems = await Theater.find();

      theaterItems.map(item => {
        item._id = item._id.toString();
        return item;
      });

      return theaterItems;
    },
  }
};

export default TheaterResolvers;

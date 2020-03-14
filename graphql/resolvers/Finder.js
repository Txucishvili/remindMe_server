import {authenticated} from "../helpers/Auth.guard";
import {FetchAndCollectData} from "../../controllers/finders/movieDB-fetch";
import {checkTitle} from "../../controllers/finders/finder";

const FinderResolvers = {
  Query: {
    updateFinder: authenticated(async (root, args, {user, db}) => {
      const theaterData = await db.Theater.find();

      for (let item of theaterData) {
        const movieId = item.movieId;
        let finderTargetDB = await db.FinderModel.findOne({movieId});
        let finderData;
        const checkTitleConfig = {
          id: item.movieId,
          title: item.title,
          release_date: parseInt(item.release_date.split('-')[0], 10)
        };
        finderData = await checkTitle(checkTitleConfig);

        // region:: example

        if (finderData.id === "423204") {
          finderData.adjaranet = {
            isAdded: true
          };
        } else if (finderData.id === "423204") {
          finderData.iMovie = {
            isAdded: true
          };
        }

        // endregion

        const finderDataSave = {
          movieId: finderData.id,
          adjaranet: finderData.adjaranet,
          iMovie: finderData.iMovie,
          iMDb: finderData.iMDb,
        };

        if (!finderTargetDB) {
          finderTargetDB = await new db.FinderModel(finderDataSave).save();
        }

        if (!!finderTargetDB.adjaranet.isAdded || !!finderTargetDB.iMovie.isAdded) {
          console.log('catch updates', movieId);
          await db.Theater.update(
            {movieId},
            {
              isAvailable: true
            },
            (error, resp) => {
              if (error) {
                console.log('err', error);
              }
              console.log('resp', resp);
            }
          );
        }

        // Update if movie has added catches!!!
        // TODO: notification add
        // TODO: notification type sends (sms, email)

        if (!finderTargetDB.adjaranet.isAdded && finderDataSave.adjaranet.isAdded) {
          console.log('adjaranet catches ', item.title);
        } else if (!finderTargetDB.iMovie.isAdded && finderDataSave.iMovie.isAdded) {
          console.log('iMovie catches ', item.title);
        }
      }

      const finderDb = await db.FinderModel.find();

      return finderDb;
    })
  }
};

export default FinderResolvers;

import {authenticated} from "../helpers/Auth.guard";

const ReminderResolvers = {
  Query: {
    getReminders: authenticated(async (par, args, {user, db}) => {
      const userDB = await db.Reminders.find({userId: user.id});

      const returnObj = userDB.map(obj => {
         obj._id = obj._id.toString();
        return obj._doc;
      });

      return returnObj;
    })
  },
  Mutation: {
    setReminder: authenticated(async (par, args, {user, db}) => {
      let saveReminder;

      const movieObject = {
        userId: user.id,
        movieId: args.data.movieId,
        showable: args.data.showable,
        configuration: args.data.configuration,
        createdAt: new Date().getTime(),
        updatedAt: null
      };

      const returnObj = {
        data: {}
      };

      const userDB = await db.Reminders.find({userId: user.id});
      const hasAdded = await userDB.find(obj => obj.movieId === movieObject.movieId);

      if (!hasAdded) {
        saveReminder = await db.Reminders(movieObject).save();
        returnObj.message = 'saved';
      } else {
        saveReminder = hasAdded;
        returnObj.message = 'you have added this movie in ReminderList';
      }

      console.log('saveReminder', saveReminder);

      returnObj.data = {
        userId: saveReminder.userId,
        movieId: saveReminder.movieId,
        configuration: saveReminder.configuration,
        createdAt: saveReminder.createdAt,
        showable: saveReminder.showable,
      };

      return returnObj;
    })
  }
};

export default ReminderResolvers;

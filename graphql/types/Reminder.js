import {gql} from 'apollo-server-express';

const ReminderTypes = gql`
    input SetReminderConfigurations {
        sms: Boolean,
        email: Boolean
    }

    type SetReminderConfigurationsType {
        sms: Boolean,
        email: Boolean
    }

    input setReminderInput {
        movieId: String!,
        showable: Boolean,
        configuration: SetReminderConfigurations!,
    }
    
    type setReminderOutput {
        userId: String
        movieId: String,
        configuration: SetReminderConfigurationsType,
        createdAt: String,
        updatedAt: String
    }
    
    type AvaialablePlatformItem {
        id: String,
        url: String,
        isAdded: Boolean
    }
    
    type AvaialablePlatformsObject {
        adjaranet: AvaialablePlatformItem,
        iMovie: AvaialablePlatformItem
    }
    
    type getReminderOutput {
        _id: String,
        userId: String
        movieId: String,
        showable: Boolean,
        configuration: SetReminderConfigurationsType,
        isAvaialable: Boolean,
        platforms: AvaialablePlatformsObject,
        createdAt: String,
        updatedAt: String
    }

    type setReminder_response {
        data: setReminderOutput,
        message: String
    }

    type Mutation {
        setReminder(data: setReminderInput): setReminder_response
    }
    
    type Query {
        getReminders: [getReminderOutput]
    }
`;

export default ReminderTypes;

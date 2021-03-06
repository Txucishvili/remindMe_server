import {gql} from 'apollo-server-express';

const FinderTypes = gql`  
    type FinderResultItemObject {
        global_id: String,
        id: String,
        isAdded: Boolean,
    }

    type FinderResultObject {
        movieId: String,
        adjaranet: FinderResultItemObject,
        iMDb: String,
        iMovie: FinderResultItemObject
    }

    type Query {
        updateFinder: [FinderResultObject]! @isAuth @roles(requires: ADMIN)
    }
`;

export default FinderTypes;

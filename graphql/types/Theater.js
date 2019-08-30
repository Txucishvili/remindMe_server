import {gql} from 'apollo-server-express';

const TheaterTypes = gql`  
    type ResultObjItem {
        id: String,
        isAdded: Boolean
    }

    type ResultObj {
        adjaranet: ResultObjItem,
        iMDb: String,
        iMovie: ResultObjItem
    }
    
    type TheaterItem {
        id: String,
        poster_path: String,
        release_date: String,
        result: ResultObj,
        title: String
    }

    type Query {
        updateTheater: [TheaterItem]!
        fetchTheater: [TheaterItem]!  @isAuth @roles(requires: ADMIN)
        fetchMovieList: [TheaterItem]!
    }
`;

export default TheaterTypes;

import {gql} from 'apollo-server-express';

const TheaterTypes = gql`
    directive @lower on FIELD_DEFINITION
    directive @isAuth on FIELD_DEFINITION
    directive @hasRole(role: Role = USER) on OBJECT | FIELD_DEFINITION
    
    enum Role {
        ADMIN
        OWNER
        USER
    }
    
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
        fetchTheater: [TheaterItem]!
        fetchMovieList: [TheaterItem]! @isAuth
    }
`;

export default TheaterTypes;

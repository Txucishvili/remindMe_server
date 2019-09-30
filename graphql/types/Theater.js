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

    type PostersObject {
        aspect_ratio: String,
        file_path: String,
        height: String,
        width: String,
    }


    type TrailerObject {
        key: String,
        name: String,
        site: String,
        size: String,
        type: String,
    }
    
    type TheaterItem {
        movieId: String,
        adult: String,
        backdrop_path: String,
        original_language: String,
        original_title: String,
        title: String,
        overview: String,
        popularity: String,
        release_date: String,
        video: String,
        vote_average: String,
        vote_count: String,
        poster_path: String,
        posters: [PostersObject],
        trailers: [TrailerObject],
        genre_ids: [String],
        isAvailable: Boolean,
        color: String,
        searchResult: FinderResultObject
    }
    
    input fetchInputConfig {
        finder: Boolean
    }

    type Query {
        updateTheater: [TheaterItem]! @isAuth @roles(requires: ADMIN)
        fetchTheater(data: fetchInputConfig): [TheaterItem]! @isAuth
        fetchMovieList: [TheaterItem]! @isAuth
    }
`;

export default TheaterTypes;

import {
    FETCH_RESOURCES,
    GET_DATA_FAILED_RESOURCES,
    GET_DATA_REQUESTED_RESOURCES,
} from "../ActionsTypes";

let initialState = {isLoading: false, isError: false, resources: []};

const resourcesReducer = (state = initialState, action) => {
    console.log(action)
    switch (action.type) {
        case GET_DATA_REQUESTED_RESOURCES:
            return {...state, isLoading: true};
        case GET_DATA_FAILED_RESOURCES:
            return {...state, isLoading: false, isError: true};
        case FETCH_RESOURCES:
            return {...state, isLoading: false, resources: action.payload};
        default:
            return state
    }
}

export default resourcesReducer

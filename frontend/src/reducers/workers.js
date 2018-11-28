import {FETCH_WORKERS, GET_DATA_FAILED, GET_DATA_REQUESTED} from "../ActionsTypes";

var initialState = {isLoading: false, isError: false, workers: [] }

const workersReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA_REQUESTED:
            return {...state, isLoading: true};
        case FETCH_WORKERS:
            return {...state, isLoading: false, workers: action.payload};
        case GET_DATA_FAILED:
            return {...state, isLoading: false, isError: true}
        default:
            return state
    }
}

export default workersReducer

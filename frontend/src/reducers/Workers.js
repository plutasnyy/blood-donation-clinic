import {
    ADD_WORKER_SUCCESS,
    DELETE_WORKER_SUCCESS,
    FETCH_WORKERS,
    GET_DATA_FAILED,
    GET_DATA_REQUESTED, UPDATE_WORKER_SUCCESS
} from "../ActionsTypes";

var initialState = {isLoading: false, isError: false, workers: []}

const workersReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA_REQUESTED:
            return {...state, isLoading: true};
        case FETCH_WORKERS:
            return {...state, isLoading: false, workers: action.payload};
        case GET_DATA_FAILED:
            return {...state, isLoading: false, isError: true};
        case ADD_WORKER_SUCCESS:
            return {...state, isLoading: false, isError: false, workers: [...state.workers, action.payload]}
        case DELETE_WORKER_SUCCESS:
            return {...state, isLoading: false, isError: false, workers: state.workers.filter(worker => worker.pesel !== action.payload)}
        case UPDATE_WORKER_SUCCESS:
            return {...state, isLoading: false, isError: false, workers: [...state.workers.filter(worker => worker.pesel !== action.payload.pesel),action.payload]}
        default:
            return state
    }
}

export default workersReducer

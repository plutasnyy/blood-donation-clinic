import {
    ADD_SAMPLE_SUCCESS,
    DELETE_SAMPLE_SUCCESS,
    FETCH_SAMPLE,
    GET_DATA_FAILED_SAMPLE,
    GET_DATA_REQUESTED_SAMPLE, UPDATE_SAMPLE_SUCCESS
} from "../ActionsTypes";

let initialState = {isLoading: false, isError: false, samples: []};

const samplesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA_REQUESTED_SAMPLE:
            return {...state, isLoading: true};
        case GET_DATA_FAILED_SAMPLE:
            return {...state, isLoading: false, isError: true};
        case FETCH_SAMPLE:
            return {...state, isLoading: false, samples: action.payload};
        case ADD_SAMPLE_SUCCESS:
            return {...state, isLoading: false, isError: false, samples: [...state.samples, action.payload]};
        case DELETE_SAMPLE_SUCCESS:
            return {...state, isLoading: false, isError: false, samples: state.samples.filter(sample => sample.id !== action.payload)};
        case UPDATE_SAMPLE_SUCCESS:
            return {...state, isLoading: false, isError: false, samples: [...state.samples.filter(sample => sample.id !== action.payload.id),action.payload]};
        default:
            return state
    }
}

export default samplesReducer

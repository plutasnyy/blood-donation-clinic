import {
    ADD_BLOOD_TYPE_SUCCESS,
    DELETE_BLOOD_TYPE_SUCCESS,
    FETCH_BLOOD_TYPES, GET_DATA_FAILED_BLOOD, GET_DATA_REQUESTED_BLOOD,
    UPDATE_BLOOD_TYPE_SUCCESS,
} from "../ActionsTypes";

let initialState = {isLoading: false, isError: false, departures: []};

const bloodTypesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA_REQUESTED_BLOOD:
            return {...state, isLoading: true};
        case GET_DATA_FAILED_BLOOD:
            return {...state, isLoading: false, isError: true};
        case FETCH_BLOOD_TYPES:
            return {...state, isLoading: false, departures: action.payload};
        case ADD_BLOOD_TYPE_SUCCESS:
            return {...state, isLoading: false, isError: false, departures: [...state.departures, action.payload]};
        case DELETE_BLOOD_TYPE_SUCCESS:
            return {...state, isLoading: false, isError: false, departures: state.departures.filter(blood => blood.id !== action.payload)};
        case UPDATE_BLOOD_TYPE_SUCCESS:
            return {...state, isLoading: false, isError: false, departures: [...state.departures.filter(blood => blood.id !== action.payload.id),action.payload]};
        default:
            return state
    }
}

export default bloodTypesReducer

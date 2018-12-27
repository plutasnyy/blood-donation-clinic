import {
    ADD_DEPARTURE_SUCCESS,
    DELETE_DEPARTURE_SUCCESS,
    FETCH_DEPARTURES,
    GET_DATA_FAILED_DEPARTURE,
    GET_DATA_REQUESTED_DEPARTURE,
    UPDATE_DEPARTURE_SUCCESS
} from "../ActionsTypes";

let initialState = {isLoading: false, isError: false, departures: []};

const departureReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA_REQUESTED_DEPARTURE:
            return {...state, isLoading: true};
        case GET_DATA_FAILED_DEPARTURE:
            return {...state, isLoading: false, isError: true};
        case FETCH_DEPARTURES:
            return {...state, isLoading: false, departures: action.payload};
        case ADD_DEPARTURE_SUCCESS:
            return {...state, isLoading: false, isError: false, departures: [...state.departures, action.payload]};
        case DELETE_DEPARTURE_SUCCESS:
            return {...state, isLoading: false, isError: false, departures: state.departures.filter(departure => departure.id !== action.payload)};
        case UPDATE_DEPARTURE_SUCCESS:
            return {...state, isLoading: false, isError: false, departures: [...state.departures.filter(departure => departure.id !== action.payload.id),action.payload]};
        default:
            return state
    }
}

export default departureReducer

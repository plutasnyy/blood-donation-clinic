import {
    ADD_PRESENCE_SUCCESS, DELETE_PRESENCE_SUCCESS,
    FETCH_PRESENCE,
    GET_DATA_FAILED_PRESENCE,
    GET_DATA_REQUESTED_PRESENCE, UPDATE_PRESENCE_SUCCESS
} from "../ActionsTypes";

let initialState = {isLoading: false, isError: false, presences: []};

const presencesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA_REQUESTED_PRESENCE:
            return {...state, isLoading: true};
        case GET_DATA_FAILED_PRESENCE:
            return {...state, isLoading: false, isError: true};
        case FETCH_PRESENCE:
            return {...state, isLoading: false, presences: action.payload};
        case ADD_PRESENCE_SUCCESS:
            return {...state, isLoading: false, isError: false, presences: [...state.presences, action.payload]};
        case DELETE_PRESENCE_SUCCESS:
            return {...state, isLoading: false, isError: false, presences: state.presences.filter(presence => presence.id !== action.payload)};
        case UPDATE_PRESENCE_SUCCESS:
            return {...state, isLoading: false, isError: false, presences: [...state.presences.filter(presence => presence.id !== action.payload.id),action.payload]};
        default:
            return state
    }
}

export default presencesReducer

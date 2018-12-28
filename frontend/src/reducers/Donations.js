import {
    ADD_DONATION_SUCCESS, DELETE_DONATION_SUCCESS,
    FETCH_DONATION,
    GET_DATA_FAILED_DONATION,
    GET_DATA_REQUESTED_PATIENTS, UPDATE_DONATION_SUCCESS
} from "../ActionsTypes";

let initialState = {isLoading: false, isError: false, donations: []};

const donationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA_REQUESTED_PATIENTS:
            return {...state, isLoading: true};
        case GET_DATA_FAILED_DONATION:
            return {...state, isLoading: false, isError: true};
        case FETCH_DONATION:
            return {...state, isLoading: false, donations: action.payload};
        case ADD_DONATION_SUCCESS:
            return {...state, isLoading: false, isError: false, donations: [...state.donations, action.payload]};
        case DELETE_DONATION_SUCCESS:
            return {...state, isLoading: false, isError: false, donations: state.donations.filter(donation => donation.id !== action.payload)};
        case UPDATE_DONATION_SUCCESS:
            return {...state, isLoading: false, isError: false, donations: [...state.donations.filter(donation => donation.id !== action.payload.id),action.payload]};
        default:
            return state
    }
}

export default donationReducer

import {
    ADD_BLOOD_TYPE_SUCCESS,
    DELETE_BLOOD_TYPE_SUCCESS,
    FETCH_BLOOD_TYPES,
    GET_DATA_FAILED,
    GET_DATA_REQUESTED, UPDATE_BLOOD_TYPE_SUCCESS,
} from "../ActionsTypes";

var initialState = {isLoading: false, isError: false, bloodTypes: []}

const bloodTypesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA_REQUESTED:
            return {...state, isLoading: true};
        case FETCH_BLOOD_TYPES:
            return {...state, isLoading: false, bloodTypes: action.payload};
        case GET_DATA_FAILED:
            return {...state, isLoading: false, isError: true};
        case ADD_BLOOD_TYPE_SUCCESS:
            return {...state, isLoading: false, isError: false, bloodTypes: [...state.bloodTypes, action.payload]};
        case DELETE_BLOOD_TYPE_SUCCESS:
            return {...state, isLoading: false, isError: false, bloodTypes: state.bloodTypes.filter(blood => blood.id !== action.payload)};
        case UPDATE_BLOOD_TYPE_SUCCESS:
            return {...state, isLoading: false, isError: false, bloodTypes: [...state.bloodTypes.filter(blood => blood.id !== action.payload.id),action.payload]};
        default:
            return state
    }
}

export default bloodTypesReducer

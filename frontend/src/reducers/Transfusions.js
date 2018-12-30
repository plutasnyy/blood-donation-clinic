import {
    ADD_TRANSFUSION_SUCCESS, DELETE_TRANSFUSION_SUCCESS,
    FETCH_TRANSFUSION,
    GET_DATA_FAILED_TRANSFUSION,
    GET_DATA_REQUESTED_TRANSFUSION, UPDATE_TRANSFUSION_SUCCESS
} from "../ActionsTypes";

let initialState = {isLoading: false, isError: false, transfusions: []};

const transfusionReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA_REQUESTED_TRANSFUSION:
            return {...state, isLoading: true};
        case GET_DATA_FAILED_TRANSFUSION:
            return {...state, isLoading: false, isError: true};
        case FETCH_TRANSFUSION:
            return {...state, isLoading: false, transfusions: action.payload};
        case ADD_TRANSFUSION_SUCCESS:
            return {...state, isLoading: false, isError: false, transfusions: [...state.transfusions, action.payload]};
        case DELETE_TRANSFUSION_SUCCESS:
            return {...state, isLoading: false, isError: false, transfusions: state.transfusions.filter(transfusion => transfusion.id !== action.payload)};
        case UPDATE_TRANSFUSION_SUCCESS:
            return {...state, isLoading: false, isError: false, transfusions: [...state.transfusions.filter(transfusion => transfusion.id !== action.payload.id),action.payload]};
        default:
            return state
    }
}

export default transfusionReducer

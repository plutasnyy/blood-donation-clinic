import {
    ADD_PATIENTS_SUCCESS, DELETE_PATIENTS_SUCCESS,
    FETCH_PATIENTS,
    GET_DATA_FAILED_PATIENTS,
    GET_DATA_REQUESTED_PATIENTS, UPDATE_PATIENTS_SUCCESS
} from "../ActionsTypes";

let initialState = {isLoading: false, isError: false, patients: []};

const patientsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA_REQUESTED_PATIENTS:
            return {...state, isLoading: true};
        case GET_DATA_FAILED_PATIENTS:
            return {...state, isLoading: false, isError: true};
        case FETCH_PATIENTS:
            return {...state, isLoading: false, patients: action.payload};
        case ADD_PATIENTS_SUCCESS:
            return {...state, isLoading: false, isError: false, patients: [...state.patients, action.payload]}
        case DELETE_PATIENTS_SUCCESS:
            return {...state, isLoading: false, isError: false, patients: state.patients.filter(patient => patient.pesel !== action.payload)}
        case UPDATE_PATIENTS_SUCCESS:
            return {...state, isLoading: false, isError: false, patients: [...state.patients.filter(patient => patient.pesel !== action.payload.pesel),action.payload]}
        default:
            return state
    }
}

export default patientsReducer

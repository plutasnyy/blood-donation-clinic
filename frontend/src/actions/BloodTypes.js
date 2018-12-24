import {client} from "./Client";
import {
    ADD_BLOOD_TYPE_SUCCESS,
    DELETE_BLOOD_TYPE_SUCCESS,
    FETCH_BLOOD_TYPES,
    GET_DATA_FAILED,
    GET_DATA_REQUESTED, UPDATE_BLOOD_TYPE_SUCCESS,
} from "../ActionsTypes";

let apiUrl = 'blood/';


export function getDataRequested() {
    return {
        type: GET_DATA_REQUESTED
    };
}

export function fetchBloodTypesSuccess(data) {
    return {
        type: FETCH_BLOOD_TYPES,
        payload: data
    };
}

export function getDataFailed(error) {
    return {
        type: GET_DATA_FAILED,
        payload: error.message
    };
}

export function fetchAllBloodTypes() {
    return dispatch => {
        dispatch(getDataRequested());
        client.get(apiUrl)
            .then(response => {
                dispatch(fetchBloodTypesSuccess(response.data));
            })
            .catch(response => {
                dispatch(getDataFailed(response.error));
            })
    }
}


export function addBloodTypeSuccess(data) {
    return ({type: ADD_BLOOD_TYPE_SUCCESS, payload: data})

}

export function addBloodType(payload) {
    return (dispatch) => {
        dispatch(getDataRequested());
        client.post(apiUrl, payload).then(response => {
            dispatch(addBloodTypeSuccess(response.data))
        }).catch((response) => {
            getDataFailed(response.error)
        })
    }
}

export function deleteBloodTypeSuccess(id) {
    return ({type: DELETE_BLOOD_TYPE_SUCCESS, payload: id})
}

export function deleteBloodType(id) {
    return (dispatch) => {
        dispatch(getDataRequested());
        client.delete(apiUrl + id + '/')
            .then(response => dispatch(deleteBloodTypeSuccess(id)))
            .catch(response => dispatch(getDataFailed(response)));
    }
}

export function updateBloodTypeSuccess(data) {
    return ({type: UPDATE_BLOOD_TYPE_SUCCESS, payload: data})

}

export function updateBloodType(payload) {
    return (dispatch) => {
        dispatch(getDataRequested());
        client.put(apiUrl+payload.id+'/', payload).then(response => {
            dispatch(updateBloodTypeSuccess(response.data))
        }).catch((response) => {
            getDataFailed(response.error)
        })
    }
}
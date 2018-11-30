import {client} from "./Client";
import {
    ADD_WORKER_SUCCESS,
    DELETE_WORKER_SUCCESS,
    FETCH_WORKERS,
    GET_DATA_FAILED,
    GET_DATA_REQUESTED, UPDATE_WORKER_SUCCESS
} from "../ActionsTypes";

let apiUrl = 'workers/';


export function getDataRequested() {
    return {
        type: GET_DATA_REQUESTED
    };
}

export function fetchWorkersSuccess(data) {
    return {
        type: FETCH_WORKERS,
        payload: data
    };
}

export function getDataFailed(error) {
    return {
        type: GET_DATA_FAILED,
        payload: error.message
    };
}

export function fetchAllWorkers() {
    return dispatch => {
        dispatch(getDataRequested());
        client.get(apiUrl)
            .then(response => {
                dispatch(fetchWorkersSuccess(response.data));
            })
            .catch(response => {
                dispatch(getDataFailed(response.error));
            })
    }
}


export function addWorkerSuccess(data) {
    return ({type: ADD_WORKER_SUCCESS, payload: data})

}

export function addWorker(payload) {
    return (dispatch) => {
        dispatch(getDataRequested());
        client.post(apiUrl, payload).then(response => {
            dispatch(addWorkerSuccess(response.data))
        }).catch((response) => {
            getDataFailed(response.error)
        })
    }
}

export function deleteWorkerSuccess(pesel) {
    return ({type: DELETE_WORKER_SUCCESS, payload: pesel})
}

export function deleteWorker(pesel) {
    return (dispatch) => {
        dispatch(getDataRequested());
        client.delete(apiUrl + pesel + '/')
            .then(response => dispatch(deleteWorkerSuccess(pesel)))
            .catch(response => dispatch(getDataFailed(response)));
    }
}

export function updateWorkerSuccess(data) {
    return ({type: UPDATE_WORKER_SUCCESS, payload: data})

}

export function updateWorker(payload) {
    return (dispatch) => {
        dispatch(getDataRequested());
        client.put(apiUrl+payload.pesel+'/', payload).then(response => {
            dispatch(updateWorkerSuccess(response.data))
        }).catch((response) => {
            getDataFailed(response.error)
        })
    }
}
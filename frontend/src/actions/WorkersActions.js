import {client} from "./Client";
import {FETCH_WORKERS, GET_DATA_FAILED, GET_DATA_REQUESTED} from "../ActionsTypes";

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
        payload: error
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
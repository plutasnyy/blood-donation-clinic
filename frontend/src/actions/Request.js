import {client} from "./Client";

export function getDataRequested(requestAction) {
    return {
        type: requestAction
    };
}

export function fetchSuccess(data, actionType) {
    return {
        type: actionType,
        payload: data
    };
}

export function getDataFailed(error, failedAction) {
    return {
        type: failedAction,
        payload: error.message
    };
}

export function fetchAllItems(apiUrl, actionType, requestAction, failedAction) {
    return dispatch => {
        dispatch(getDataRequested(requestAction));
        console.log(actionType);
        client.get(apiUrl)
            .then(response => {
                dispatch(fetchSuccess(response.data, actionType));
            })
            .catch(response => {
                dispatch(getDataFailed(response.error, failedAction));
            })
    }
}


export function addSuccess(data, actionType) {
    return ({type: actionType, payload: data})

}

export function addItem(payload, apiUrl, actionType, requestAction, failedAction) {
    return (dispatch) => {
        dispatch(getDataRequested(requestAction));
        client.post(apiUrl, payload).then(response => {
            dispatch(addSuccess(response.data, actionType))
        }).catch((response) => {
            getDataFailed(response.error, failedAction)
        })
    }
}

export function deleteSuccess(id, actionType) {
    return ({type: actionType, payload: id})
}

export function deleteItem(id, apiUrl, actionType, requestAction, failedAction) {
    return (dispatch) => {
        dispatch(getDataRequested(requestAction));
        client.delete(apiUrl + id + '/')
            .then(response => dispatch(deleteSuccess(id, actionType)))
            .catch(response => dispatch(getDataFailed(response, failedAction)));
    }
}

export function updateSuccess(data, actionType) {
    return ({type: actionType, payload: data})
}

export function updateItem(payload, apiUrl, actionType, requestAction, failedAction) {
    return (dispatch) => {
        dispatch(getDataRequested(requestAction));
        client.put(apiUrl+payload.id+'/', payload).then(response => {
            dispatch(updateSuccess(response.data, actionType))
        }).catch((response) => {
            getDataFailed(response.error, failedAction)
        })
    }
}
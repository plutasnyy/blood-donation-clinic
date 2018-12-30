import {UPDATE_SAMPLE_SUCCESS} from "../ActionsTypes";

export function updateSample(data) {
    return ({type: UPDATE_SAMPLE_SUCCESS, payload: data})
}
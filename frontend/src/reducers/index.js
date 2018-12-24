import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import workersReducer from './Workers'
import bloodTypesReducer from "./BloodTypes";

const rootReducer = (history) => combineReducers({
  workersAPI: workersReducer,
  bloodTypesAPI: bloodTypesReducer,
  router: connectRouter(history)
})

export default rootReducer

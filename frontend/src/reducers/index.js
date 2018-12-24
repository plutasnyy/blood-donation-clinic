import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import workersReducer from './Workers'
import bloodTypesReducer from "./BloodTypes";
import departureReducer from "./Departure";

const rootReducer = (history) => combineReducers({
  workersAPI: workersReducer,
  bloodTypesAPI: bloodTypesReducer,
  departureAPI: departureReducer,
  router: connectRouter(history)
});

export default rootReducer

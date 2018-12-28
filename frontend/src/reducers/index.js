import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import workersReducer from './Workers'
import bloodTypesReducer from "./BloodTypes";
import departureReducer from "./Departure";
import patientsReducer from "./Patients";
import presencesReducer from "./Presence";
import resourcesReducer from "./Resources";

const rootReducer = (history) => combineReducers({
  workersAPI: workersReducer,
  bloodTypesAPI: bloodTypesReducer,
  departureAPI: departureReducer,
  patientsAPI: patientsReducer,
  presencesAPI: presencesReducer,
  resourcesAPI: resourcesReducer(),
  router: connectRouter(history)
});

export default rootReducer

import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import workersReducer from './Workers'
import bloodTypesReducer from "./BloodTypes";
import departureReducer from "./Departure";
import patientsReducer from "./Patients";

const rootReducer = (history) => combineReducers({
  workersAPI: workersReducer,
  bloodTypesAPI: bloodTypesReducer,
  departureAPI: departureReducer,
  patientsAPI: patientsReducer,
  router: connectRouter(history)
});

export default rootReducer

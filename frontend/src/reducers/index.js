import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import workersReducer from './Workers'

const rootReducer = (history) => combineReducers({
  workersAPI: workersReducer,
  router: connectRouter(history)
})

export default rootReducer

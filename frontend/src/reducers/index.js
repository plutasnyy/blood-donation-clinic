import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import workersReducer from './workers'

const rootReducer = (history) => combineReducers({
  workersAPI: workersReducer,
  router: connectRouter(history)
})

export default rootReducer

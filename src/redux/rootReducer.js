// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import adminReducer from './adminReducer';

const rootReducer = {
  auth,
  navbar,
  layout,
  adminReducer
}

export default rootReducer

// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import adminReducer from './adminReducer';
import userReducer from './userReducer';

const rootReducer = {
  auth,
  navbar,
  layout,
  adminReducer,
  userReducer
}

export default rootReducer

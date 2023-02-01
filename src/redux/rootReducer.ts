import { combineReducers } from 'redux'
import enumReducer from './enums/enumsSlice'
import globalReducer from './global/globalSlice'

import userReducer from './user/userSlice'

const rootReducer = combineReducers({
  user: userReducer,
  global: globalReducer,
  enums: enumReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer

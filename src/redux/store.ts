import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import rootReducer, { RootState } from './rootReducer'

// import logger from "redux-logger";

// if (process.env.NODE_ENV === "development") {
//   const { logger } = require(`redux-logger`);
//   middlewares.push(logger as any);
// }

const store = configureStore({
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production', //TODO vypnout ? funguje to ?
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>() // Export a hook that can be reused to resolve types

export default store

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

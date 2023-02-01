import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { iUserActiveData } from '../../interfaces/iUserData'

interface IUserState {
  userData?: iUserActiveData
  init: boolean
  logedIn: boolean
  loading: boolean
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: undefined,
    init: false,
    logedIn: false,
    loading: false,
  } as IUserState,
  reducers: {
    setUser: (state, action: PayloadAction<iUserActiveData>) => {
      state.userData = action.payload
      state.logedIn = true
    },
    setUserInit: (state) => {
      state.init = true
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    clearUser: (state) => {
      state.userData = undefined
      state.logedIn = false
    },
  },
})

const { actions, reducer } = userSlice
export const { setUser, setUserInit, clearUser, setUserLoading } = actions

export default reducer

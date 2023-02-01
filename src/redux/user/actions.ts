import { toast } from 'react-toastify'
import IamApi from '../../api/IamApi'
import KeycloakApi from '../../api/KeycloakApi'
import { tokensClear, tokensGetToken, tokensSave } from '../../utils/tokens'
import { AppThunk } from '../store'
import { setUser, setUserInit, setUserLoading } from './userSlice'

export const logIn = (name: string, pass: string): AppThunk => {
  return async (dispatch) => {
    dispatch(setUserLoading(true))
    KeycloakApi.getToken(name, pass)
      .then((data) => {
        console.log('login sueccess', data)
        tokensSave(data)

        IamApi.getLogedUserDetail()
          .then((data) => {
            // toast.success('Uživatel přihlášen')
            dispatch(setUser(data))
          })
          .catch((err) => {
            console.log(err.response)
            if (err.response?.data?.error?.code === 1400) {
              toast.error('Uživatel není aktivován nebo má pozastavený účet')
            } else {
              toast.error('Chyba ziskání informací o uživatli')
            }
            console.log('login user data', err)
          })
          .finally(() => {
            dispatch(setUserLoading(false))
          })
      })
      .catch((err) => {
        toast.error('Chyba přihlášení')
        console.log('login error', err)
        dispatch(setUserLoading(false))
      })
  }
}

export const loginFromStore = (): AppThunk => {
  return async (dispatch) => {
    console.log('check login from store, token:', tokensGetToken())

    if (tokensGetToken()) {
      IamApi.getLogedUserDetail()
        .then((data) => {
          // toast.success('Uživatel přihlášen')
          dispatch(setUser(data))
        })
        .finally(() => {
          dispatch(setUserInit())
        })
    } else {
      dispatch(setUserInit())
    }
  }
}

export const logOutAction = (errMsg?: string): AppThunk => {
  return async (dispatch) => {
    tokensClear()
    if (errMsg) {
      toast.error(errMsg)
    } else {
      toast.success('Uživatel byl odhlášen')
    }
    // dispatch(clearUser()) // neni potreba protoze probehne reload ktery smaze sotre
    window.location.replace('/')
  }
}

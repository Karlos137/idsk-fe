import React from 'react'
import IamApi from '../../api/IamApi'
import { useAppDispatch } from '../../redux/store'
import { useSelector } from 'react-redux'
import { selectUserData } from '../../redux/user/selectors'
import { tokensGet, tokensSave } from '../../utils/tokens'
import { toast } from 'react-toastify'
import { setUser } from '../../redux/user/userSlice'

const UserDebug = () => {
  const user = useSelector(selectUserData)

  const dispatch = useAppDispatch()

  const clearToken = () => {
    const tokens = tokensGet()
    tokens.access_token = 'aaaa'
    tokensSave(tokens)
  }

  const clearRefresh = () => {
    const tokens = tokensGet()
    tokens.refresh_token = 'aaaa'
    tokensSave(tokens)
  }

  const reloadUser = () => {
    IamApi.getLogedUserDetail()
      .then((data) => {
        // toast.success('Uživatel přihlášen')
        dispatch(setUser(data))
      })
      .catch((err) => {
        toast.error('Chyba ziskání informací o uživatli')
        console.log('login user data', err)
      })
  }

  return (
    <>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <button type='button' onClick={clearToken}>
        Clear token
      </button>

      <button type='button' onClick={clearRefresh}>
        Clear refresh
      </button>

      <button type='button' onClick={reloadUser}>
        Reload user
      </button>
    </>
  )
}

export default UserDebug

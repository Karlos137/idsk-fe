import React from 'react'
import { useSelector } from 'react-redux'
import { useEffectStart } from '../../hooks/useEffectStart'
import { fetchOrganizationTypes, fetchUserRolesTypes } from '../../redux/enums/actions'
import {
  selectOrganizationTypesError,
  selectOrganizationTypesLoading,
  selectUserRolesTypesError,
  selectUserRolesTypesLoading,
} from '../../redux/enums/selectors'
import { useAppDispatch } from '../../redux/store'
import Error from '../Error/Error'
import Loading from '../Loading/Loading'

interface iInitDataWrap {
  children?: React.ReactNode
}

const InitDataWrap = ({ children }: iInitDataWrap) => {
  const dispatch = useAppDispatch()

  //TODO catche - mozna az do fetch Akci
  const orgTypesLoading = useSelector(selectOrganizationTypesLoading)
  const orgTypesError = useSelector(selectOrganizationTypesError)
  const userRolesTypesLoading = useSelector(selectUserRolesTypesLoading)
  const userRolesTypesError = useSelector(selectUserRolesTypesError)

  //TODO nacist default subjekt pro IDSK a ROPID

  useEffectStart(() => {
    dispatch(fetchOrganizationTypes())
    dispatch(fetchUserRolesTypes())
  })

  if (orgTypesError) {
    return <Error msg={orgTypesError} />
  }
  if (userRolesTypesError) {
    return <Error msg={userRolesTypesError} />
  }
  if (orgTypesLoading || userRolesTypesLoading) {
    return <Loading />
  }

  return <>{children}</>
}

export default InitDataWrap

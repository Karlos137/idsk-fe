import IamApi from '../../api/IamApi'
import { iOrgData } from '../../interfaces/IOrgData'
import { iOrgTypesData } from '../../interfaces/iOrgTypesData'
import { iUserRolesTypesData } from '../../interfaces/iUserRolesTypesData'
import { AppThunk } from '../store'
import {
  setMainOrgs,
  setMainOrgsError,
  setMainOrgsLoading,
  setOrganizationTypes,
  setOrganizationTypesError,
  setOrganizationTypesLoading,
  setUserRolesTypes,
  setUserRolesTypesError,
  setUserRolesTypesLoading,
} from './enumsSlice'

//TODO fetch kdyz neni nacteno - CACHE

export const fetchOrganizationTypes = (): AppThunk => {
  return async (dispatch) => {
    console.log('fetch orgtypes')
    dispatch(setOrganizationTypesLoading(true))
    IamApi.getOrgTypes()
      .then((data: iOrgTypesData[]) => {
        dispatch(setOrganizationTypes(data))
      })
      .catch((err) => {
        console.log('Chyba načtení typů subjektů')
        dispatch(setOrganizationTypesError('Chyba načtení typů subjektů'))
      })
      .finally(() => {
        dispatch(setOrganizationTypesLoading(false))
      })
  }
}

export const fetchMainOrgs = (orgTypeIdIdsk?: string, orgTypeIdRopid?: string): AppThunk => {
  return async (dispatch) => {
    if (!orgTypeIdIdsk || !orgTypeIdRopid) {
      dispatch(setMainOrgsError('Nejsou definované typy pro hlavni organizace'))
      return
    }

    console.log('fetch main orgs')
    dispatch(setMainOrgsLoading(true))
    IamApi.searchOrgs(undefined, [orgTypeIdIdsk, orgTypeIdRopid])
      .then((data: iOrgData[]) => {
        const idsk = data.find((org) => org.organizationType.id === orgTypeIdIdsk)
        const ropid = data.find((org) => org.organizationType.id === orgTypeIdRopid)

        if (!idsk || !ropid) {
          dispatch(setMainOrgsError('Nejsou definované hlavni organizace'))
          return
        }

        dispatch(setMainOrgs({ idsk, ropid }))
      })
      .catch((err) => {
        console.log('Chyba načtení hlavnich organizaci')
        dispatch(setMainOrgsError('Chyba načtení hlavních organizací'))
      })
      .finally(() => {
        dispatch(setMainOrgsLoading(false))
      })
  }
}

export const fetchUserRolesTypes = (): AppThunk => {
  return async (dispatch) => {
    console.log('fetch user roles')
    dispatch(setUserRolesTypesLoading(true))
    IamApi.getRoles()
      .then((data: iUserRolesTypesData[]) => {
        dispatch(setUserRolesTypes(data.sort((a, b) => a.level - b.level)))
      })
      .catch((err) => {
        console.log('Chyba načtení user roles')
        dispatch(setUserRolesTypesError('Chyba načtení uživatelských rolí'))
      })
      .finally(() => {
        dispatch(setUserRolesTypesLoading(false))
      })
  }
}

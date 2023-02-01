import { useSelector } from 'react-redux'
import { fetchMainOrgs } from '../redux/enums/actions'
import { setMainOrgsLoading } from '../redux/enums/enumsSlice'
import {
  selectMainOrgsError,
  selectMainOrgsIdsk,
  selectMainOrgsLoading,
  selectMainOrgsRopid,
} from '../redux/enums/selectors'
import { useAppDispatch } from '../redux/store'
import { useEffectStart } from './useEffectStart'
import { useOrgTypes } from './useOrgTypes'
import { useUserAuth } from './useUserAuth'

export const useMainOrgs = () => {
  const { orgTypesId } = useOrgTypes()
  const { isReferent } = useUserAuth()

  const dispatch = useAppDispatch()

  const mainOrgIdLoading = useSelector(selectMainOrgsLoading)
  const mainOrgIdError = useSelector(selectMainOrgsError)
  const mainOrgIdIdsk = useSelector(selectMainOrgsIdsk)?.id || undefined
  const mainOrgIdRopid = useSelector(selectMainOrgsRopid)?.id || undefined

  useEffectStart(() => {
    if (isReferent) {
      if (!mainOrgIdRopid && !mainOrgIdIdsk) {
        dispatch(fetchMainOrgs(orgTypesId.idsk, orgTypesId.ropid))
      }
    } else {
      dispatch(setMainOrgsLoading(false))
    }
  })

  return { mainOrgIdIdsk, mainOrgIdRopid, mainOrgIdLoading, mainOrgIdError }
}

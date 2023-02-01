import { useSelector } from 'react-redux'
import { IDSK_SUBJEKT_TYPES } from '../enums/enumSubjektTypes'
import { IDSK_ROLES } from '../enums/enumUserRolesTypes'
import { selectUserOrg, selectUserRolesDynamic } from '../redux/user/selectors'

export const useUserAuth = () => {
  const allRolesDynamic = useSelector(selectUserRolesDynamic)
  const org = useSelector(selectUserOrg)

  const isAdmin = allRolesDynamic?.includes(IDSK_ROLES.ADMIN)
  const isReferent = allRolesDynamic?.includes(IDSK_ROLES.REFERENT) || allRolesDynamic?.includes(IDSK_ROLES.ADMIN)
  const isOrgAdmin =
    allRolesDynamic?.includes(IDSK_ROLES.SUBJEKT_PODEPISUJICI) ||
    allRolesDynamic?.includes(IDSK_ROLES.IDSK_PODEPISUJICI)
  const isKlient = allRolesDynamic?.includes(IDSK_ROLES.SUBJEKT_KLIENT)
  const isNahlizejici =
    allRolesDynamic?.includes(IDSK_ROLES.SUBJEKT_NAHLIZEJICI) || allRolesDynamic?.includes(IDSK_ROLES.IDSK_NAHLIZEJICI)

  const isUserIdsk = org?.organizationType.identifier === IDSK_SUBJEKT_TYPES.IDSK
  const isUserRopid = org?.organizationType.identifier === IDSK_SUBJEKT_TYPES.ROPID

  return { isAdmin, isReferent, isOrgAdmin, isKlient, isNahlizejici, isUserIdsk, isUserRopid }
}

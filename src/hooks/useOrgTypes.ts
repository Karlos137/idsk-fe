import { useSelector } from 'react-redux'
import { IDSK_SUBJEKT_TYPES } from '../enums/enumSubjektTypes'
import { selectOrganizationTypes } from '../redux/enums/selectors'

export const useOrgTypes = () => {
  const orgTypesFull = useSelector(selectOrganizationTypes)

  const orgTypesOptions = orgTypesFull
    // .filter((d) => d.identifier !== ORG_TYPE_DSO)
    .map((d) => ({ label: d.name, value: d.id }))

  const findIdByOrgTypeName = (name: string) => orgTypesFull.find((o) => o.identifier === name)?.id || ''

  const orgTypesId = {
    dso: findIdByOrgTypeName(IDSK_SUBJEKT_TYPES.DSO),
    ropid: findIdByOrgTypeName(IDSK_SUBJEKT_TYPES.ROPID),
    obec: findIdByOrgTypeName(IDSK_SUBJEKT_TYPES.OBEC),
    idsk: findIdByOrgTypeName(IDSK_SUBJEKT_TYPES.IDSK),
    zeleznice: findIdByOrgTypeName(IDSK_SUBJEKT_TYPES.ZELEZNICE),
    dopravce: findIdByOrgTypeName(IDSK_SUBJEKT_TYPES.DOPRAVCE),
    kraj: findIdByOrgTypeName(IDSK_SUBJEKT_TYPES.KRAJ),
    ostatni: findIdByOrgTypeName(IDSK_SUBJEKT_TYPES.OSTATNI),
  }

  return { orgTypesOptions, orgTypesId, findIdByOrgTypeName }
}

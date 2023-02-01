import { toast } from 'react-toastify'
import IamApi from '../api/IamApi'
import { IDSK_SUBJEKT_TYPES } from '../enums/enumSubjektTypes'
import { IDSK_ROLES, IDSK_ROLES_LABEL } from '../enums/enumUserRolesTypes'
import { useOrgTypes } from '../hooks/useOrgTypes'
import { useUserRolesTypes } from '../hooks/useUserRolesTypes'

export const CreateOrgTypes = () => {
  const { orgTypesOptions } = useOrgTypes()

  const createType = () => {
    ;[
      { label: 'Obec', value: IDSK_SUBJEKT_TYPES.OBEC },
      { label: 'Dopravce', value: IDSK_SUBJEKT_TYPES.DOPRAVCE },
      { label: 'Železniční dopravce', value: IDSK_SUBJEKT_TYPES.ZELEZNICE },
      { label: 'Kraj', value: IDSK_SUBJEKT_TYPES.KRAJ },
      { label: 'IDSK', value: IDSK_SUBJEKT_TYPES.IDSK },
      { label: 'ROPID', value: IDSK_SUBJEKT_TYPES.ROPID },
      { label: 'DSO', value: IDSK_SUBJEKT_TYPES.DSO },
      { label: 'Ostatní subjekty', value: IDSK_SUBJEKT_TYPES.OSTATNI },
    ].forEach(({ label, value }) => {
      IamApi.addOrgType(value, label).then((_) => {
        toast.success('Typ subjektu vytvoren')
      })
    })
  }

  const deleteTypes = () => {
    orgTypesOptions.forEach(({ value }) => {
      IamApi.deleteOrgType(value.split('/')[2]).then((_) => {
        toast.success('Typy subjektu smazany')
      })
    })
  }

  return (
    <>
      <pre>{JSON.stringify(orgTypesOptions, null, 2)}</pre>
      <button onClick={createType}>createType</button>
      <button onClick={deleteTypes}>delete AllTypes</button>
    </>
  )
}

export const CreateUserRolesTypes = () => {
  const { userRolesTypesFull } = useUserRolesTypes()

  const createRoles = () => {
    ;[
      { label: IDSK_ROLES_LABEL[IDSK_ROLES.ADMIN], value: IDSK_ROLES.ADMIN },
      { label: IDSK_ROLES_LABEL[IDSK_ROLES.REFERENT], value: IDSK_ROLES.REFERENT },
      { label: IDSK_ROLES_LABEL[IDSK_ROLES.IDSK_PODEPISUJICI], value: IDSK_ROLES.IDSK_PODEPISUJICI },
      { label: IDSK_ROLES_LABEL[IDSK_ROLES.SUBJEKT_PODEPISUJICI], value: IDSK_ROLES.SUBJEKT_PODEPISUJICI },
      { label: IDSK_ROLES_LABEL[IDSK_ROLES.SUBJEKT_KLIENT], value: IDSK_ROLES.SUBJEKT_KLIENT },
      { label: IDSK_ROLES_LABEL[IDSK_ROLES.IDSK_NAHLIZEJICI], value: IDSK_ROLES.IDSK_NAHLIZEJICI },
      { label: IDSK_ROLES_LABEL[IDSK_ROLES.SUBJEKT_NAHLIZEJICI], value: IDSK_ROLES.SUBJEKT_NAHLIZEJICI },
    ].forEach(({ label, value }, index) => {
      IamApi.addRole(value, label, index).then((_) => {
        toast.success('Role vytovrena')
      })
    })
  }

  const deleteRole = () => {
    userRolesTypesFull.forEach(({ id }) => {
      IamApi.deleteRole(id).then((_) => {
        toast.success('Role smazany')
      })
    })
  }

  return (
    <>
      <h1>Roles</h1>
      <pre>{JSON.stringify(userRolesTypesFull, null, 2)}</pre>
      <button onClick={createRoles}>createRoles</button>
      <button onClick={deleteRole}>delete Allroles</button>
    </>
  )
}

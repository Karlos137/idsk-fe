import { joiResolver } from '@hookform/resolvers/joi/dist/joi'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import IamApi, { REACT_APP_IAM_ISSUER_ID } from '../api/IamApi'
import { LINKS } from '../components/App/LINKS'
import { mapIDSKtoIAMrole } from '../enums/enumUserRolesTypes'
import { iSchemaUser, schemaUser } from '../forms/FormUser/SchemeUser'
import { joiResolverOptions } from '../forms/joiResolverOptions'
import { iUserData } from '../interfaces/iUserData'
import { iUserRolesData } from '../interfaces/iUserRolesData'
import { isErrorResponseUserExist } from '../utils/isErrorResponse'
import { useUserAuth } from './useUserAuth'
import { useUserRolesTypes } from './useUserRolesTypes'

export const useFormActionsUser = (id?: string) => {
  const [dataLoading, setDataLoading] = useState(!!id)
  const { isReferent, isOrgAdmin } = useUserAuth()

  const methods = useForm<iSchemaUser>({
    resolver: joiResolver(schemaUser, joiResolverOptions),
    // shouldUnregister: true // nesmi byt zapnute jniak se nebere user state not_active
  })

  const setFormData = (data?: iUserData) => {
    if (data) {
      const fomVal: iSchemaUser = {
        stateBox: {
          activeFrom: data.activeFrom || undefined,
          state: data.accountStatus,
        },
        basicInfo: {
          subject: data.organization?.id,

          login: data.username,
          name: data.firstName,
          surname: data.lastName,
          email: data.email,
          phone: data.phone,

          ...data.attributes?.basicInfo,
        },
        roleBox: {
          role: data.dynamicRoles[0] || '',
        },
      }
      console.log('SET VALUE', data, ' TO ', fomVal)
      methods.reset(fomVal)
      setDataLoading(false)
    }
  }

  const navigate = useNavigate()
  const { findUserRoleByName } = useUserRolesTypes()

  const onSubmitAction = async (data: iSchemaUser, isProfil?: boolean) => {
    const dynamicRole = data.roleBox?.role || ''
    const dynamicRoleId = findUserRoleByName(dynamicRole)?.id
    const iamRole = mapIDSKtoIAMrole[dynamicRole]
    const rolesStatic = iamRole ? [iamRole] : []
    console.log('role', dynamicRole, '->', rolesStatic)

    const setUserRole = (userId: string) => {
      IamApi.getUserRoles(userId)
        .then((userRolesActive: iUserRolesData[]) => {
          console.log('userRolesActive', userRolesActive)
          const activeRoleDynamic = userRolesActive?.map((d) => ({
            roleId: d?.role.split('/')[2],
            id: d.id,
          }))

          if (activeRoleDynamic && activeRoleDynamic.length === 1 && activeRoleDynamic[0]?.roleId === dynamicRoleId) {
            return
          }
          activeRoleDynamic?.forEach((userRole: any) => {
            IamApi.deleteUserRole(userRole.id)
          })
          if (dynamicRoleId) {
            IamApi.addUserRole(userId, dynamicRoleId)
          }
        })
        .catch((err) => {
          toast.error('Chyba nastavení role uživatele')
        })
    }

    const { login, name, surname, email, phone, ...others } = data.basicInfo
    const state = data.stateBox?.state
    const activeFrom = data.stateBox?.activeFrom

    const userData: Partial<iUserData> = {
      issuer: isReferent || isOrgAdmin ? `/iam_issuer_configurations/${REACT_APP_IAM_ISSUER_ID}` : undefined,
      organization: isReferent
        ? ((data.basicInfo.subject ? `/organizations/${data.basicInfo.subject}` : null) as any)
        : undefined,
      username: login,
      firstName: name,
      lastName: surname,
      email: email,
      phone: phone,
      accountStatus: state,
      activeFrom: activeFrom || null,
      attributes: {
        basicInfo: others,
      },
      roles: isReferent || isOrgAdmin ? rolesStatic : undefined,
    }
    console.log(data)

    if (id) {
      IamApi.editUser(id, userData)
        .then((_) => {
          toast.success('Uživatel upraven')
          setUserRole(id)
          navigate(isProfil ? LINKS.profil : LINKS.uzivatele)
        })
        .catch((err) => {
          console.log('chyba upraveni uživatele', err)
          toast.error('Chyba úpravy uživatele')
        })
    } else {
      IamApi.addUser(userData)
        .then((data) => {
          toast.success('Uživatel vytvořen')
          setUserRole(data.id)
          navigate(isProfil ? LINKS.profil : LINKS.uzivatele)
        })
        .catch((err) => {
          console.log('chyba vytvoreni uživatele', err)
          if (isErrorResponseUserExist(err)) {
            toast.error('Uživatel s tímto přihlašovacím jménem už existuje')
          } else {
            toast.error('Chyba vytvoření uživatele')
          }
        })
    }
  }

  return { onSubmitAction, setFormData, methods, dataLoading }
}

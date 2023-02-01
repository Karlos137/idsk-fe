import { joiResolver } from '@hookform/resolvers/joi/dist/joi'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import IamApi, { REACT_APP_IAM_ISSUER_ID } from '../api/IamApi'
import { LINKS } from '../components/App/LINKS'
import { IAM_ROLES, IDSK_ROLES } from '../enums/enumUserRolesTypes'
import { iSchemaSubject, schemaSubject } from '../forms/FormSubject/SchemeSubject'
import { joiResolverOptions } from '../forms/joiResolverOptions'
import { iOrgData } from '../interfaces/IOrgData'
import { iUserData } from '../interfaces/iUserData'
import { isErrorResponseUserExist } from '../utils/isErrorResponse'
import { useUserRolesTypes } from './useUserRolesTypes'

const setLinkDsoSubject = (dsoId: string, childsId: string[]) => {
  childsId.forEach((childId) => {
    IamApi.addOrgOrg(dsoId, childId)
  })
}

const removeLinkDsoSubject = (orgOrgIds: string[]) => {
  orgOrgIds.forEach((orgOrgId) => {
    IamApi.deleteOrgOrg(orgOrgId)
  })
}

export const useFormActionsSubject = (id?: string) => {
  const [dataLoading, setDataLoading] = useState(!!id)

  const methods = useForm<iSchemaSubject>({
    resolver: joiResolver(schemaSubject, joiResolverOptions),
    shouldUnregister: true, // nesmi byt zapnute jniak se po nacteni nebere opakovani contactPersons a isStatutory
  })

  const setFormData = (data?: iOrgData) => {
    if (data) {
      const fomVal: iSchemaSubject = {
        basicInfo: {
          subjectType: data.organizationType.id,
          ic: data.identifications?.ic || '',
          name: data.name,
          note: data.attributes?.note,
        },
        address: data.addresses,
        contactPersons: data.contacts,
      }
      methods.reset(fomVal)
      setDataLoading(false)
    }
  }

  const navigate = useNavigate()
  const { findUserRoleByName } = useUserRolesTypes()

  const onSubmitAction = async (data: iSchemaSubject, orgTypeId: string, childOrgs: iOrgData[], isDso?: boolean) => {
    const persons = data.contactPersons
    const statutPersons = persons?.filter((p) => p.isStatutory) || []
    if (statutPersons.length > 1) {
      toast.error('Statutární zástupce může být pouze jedna osoba')
      return
    }
    const newUser = statutPersons[0]?.establishAccount ? statutPersons[0] : undefined

    const addUser = (orgId: string) => {
      if (!newUser) {
        return
      }

      const dynamicRoleId = findUserRoleByName(IDSK_ROLES.SUBJEKT_PODEPISUJICI)?.id
      const rolesStatic = [IAM_ROLES.ORGANIZATION_ADMIN]
      const { login, name, surname, email, phone, ...others } = newUser

      const userData: Partial<iUserData> = {
        issuer: `/iam_issuer_configurations/${REACT_APP_IAM_ISSUER_ID}`,
        organization: `/organizations/${orgId}` as any,
        username: login,
        firstName: name,
        lastName: surname,
        email: email,
        phone: phone,
        attributes: {
          basicInfo: others,
        },
        roles: rolesStatic,
      }
      console.log(data)

      IamApi.addUser(userData)
        .then((data) => {
          toast.success('Uživatel vytvořen')
          if (dynamicRoleId) {
            IamApi.addUserRole(data.id, dynamicRoleId).catch((e) => {
              toast.error('Chyba nastavení dynamické role uživateli')
            })
          } else {
            toast.error('Chybná dynamické role uživatele')
          }
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
    const setChildOrgs = (dsoId: string) => {
      const actualChildIds = isDso ? childOrgs.map((org) => org.id) : []

      IamApi.getOrgOrg(dsoId)
        .then((data) => {
          const prevOrgOrgs: { id: string; childId: string }[] = data.map((line: any) => ({
            childId: line.childOrganization.split('/')[2],
            id: line.id,
          }))

          const addChildIds = actualChildIds.filter((orgId) => prevOrgOrgs.every((orgOrg) => orgOrg.childId !== orgId))
          const removeOrgOrgIds = prevOrgOrgs
            .filter((orgOrg) => actualChildIds.every((orgId) => orgId !== orgOrg.childId))
            .map((orgOrg) => orgOrg.id)

          //TODO pockat na vykonani dotazu
          removeLinkDsoSubject(removeOrgOrgIds)
          setLinkDsoSubject(dsoId, addChildIds)
        })
        .catch((err) => {
          toast.error('Chyba úpravy organizací v DSO')
        })
    }

    const orgData: Partial<iOrgData> = {
      organizationType: ('/organization_types/' + orgTypeId) as any,
      name: data.basicInfo.name,
      identifications: {
        ic: data.basicInfo.ic,
      },
      addresses: data.address,
      contacts: data.contactPersons,
      attributes: {
        note: data.basicInfo.note,
      },
    }
    console.log(data)

    if (id) {
      IamApi.editOrg(id, orgData)
        .then((data) => {
          toast.success(isDso ? 'DSO subjekt upraven' : 'Subjekt upraven')
          setChildOrgs(id)
          navigate(isDso ? LINKS.subjektyDso : LINKS.subjekty)
        })
        .catch((err) => {
          console.log('chyba upraveni subjektu', err)
          toast.error('Chyba úpravy subjektu')
        })
    } else {
      IamApi.addOrg(orgData)
        .then((data) => {
          toast.success(isDso ? 'DSO subjekt vytvořen' : 'Subjekt vytvořen')
          addUser(data.id)
          setChildOrgs(data.id)
          navigate(LINKS.subjekty + '/' + data.id)
        })
        .catch((err) => {
          console.log('chyba vytvoreni subjektu', err)
          toast.error('Chyba vytvoření subjektu')
        })
    }
  }

  return { onSubmitAction, setFormData, methods, dataLoading }
}

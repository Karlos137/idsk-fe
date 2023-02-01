import { useState } from 'react'
import IamApi from '../api/IamApi'
import { iOrgData } from '../interfaces/IOrgData'
import { useFetch } from './useFetch'

export const useOrganizations = (id?: string) => {
  const [organizations, setOrganizations] = useState<{ [id: string]: iOrgData }>({})

  const orgOption = (org: iOrgData) => ({
    label: `${org.name} (${org.organizationType.name}, ${org.identifications?.ic})`,
    value: org.id,
  })

  const searchOrganizations = (orgTypeIri?: string[]) => (query?: string) =>
    IamApi.searchOrgs(query, orgTypeIri).then((data: iOrgData[]) => {
      const newOrgs = data.reduce((p: any, c) => ({ ...p, [c.id]: c }), {})
      setOrganizations((organizations) => ({ ...organizations, ...newOrgs }))
      return data.map(orgOption)
    })

  //TOD memo na id
  const defOrganization = useFetch<iOrgData>(
    id
      ? () =>
          IamApi.getOrg(id).then((data) => {
            setOrganizations((organizations) => ({ ...organizations, [data.id]: data }))
            return data
          })
      : undefined,
  )

  const defOrganizationOptions = defOrganization.data ? [orgOption(defOrganization.data)] : undefined

  return { searchOrganizations, organizations, defOrganization, defOrganizationOptions }
}

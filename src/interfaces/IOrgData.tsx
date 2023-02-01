export interface iOrgData {
  id: string
  organizationType: {
    createdAt: string
    id: string
    identifier: string
    name: string
    updatedAt: string
  }
  name: string
  slug: string
  description?: string

  identifications?: {
    ic?: string
  }
  addresses?: {
    street?: string
    landRegistryNumber?: string
    houseNumber?: string
    psc?: string
    municipality?: string
    stateCode?: string
  }
  contacts?: {
    isStatutory?: boolean
    isMainContact?: boolean
    titleBefore?: string
    name?: string
    name2?: string
    surname?: string
    titleAfter?: string
    email?: string
    phone?: string
  }[]
  attributes?: {
    note?: string
  }

  enabled?: boolean
  updatedAt?: string
  createdAt?: string
  createdBy?: string

  organizationGroups: any[]
  childrenOrganizations: any[]
  parentOrganizations: any[]
}

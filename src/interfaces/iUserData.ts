import { iOrgData } from './IOrgData'

export interface iUserData {
  id: string
  accountStatus: string
  activeFrom?: string | null
  username: string
  firstName: string
  lastName: string
  name: string
  email: string
  phone: string
  roles: string[]
  dynamicRoles: string[]
  allRoles: string[]
  attributes: any
  organization: iOrgData
  issuer: string
  updatedAt: string
  createdAt: string
  createdBy: string
}

export interface iUserActiveData {
  username: string
  firstName: string
  lastName: string
  allRoles: string[]
  accountStatus: string
  dynamicRoles?: string[]
  email?: string[]
  externalId?: string
  id?: string
  issuer?: string
  roles?: any
  organization: iOrgData
}

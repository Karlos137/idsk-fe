import React from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import Error from '../Error/Error'

interface iPermissionRoute {
  children: JSX.Element
  forReferent?: boolean
  forOrgAdmin?: boolean
}

const PermissionRoute = ({ children, forReferent, forOrgAdmin }: iPermissionRoute) => {
  const { isReferent, isOrgAdmin } = useUserAuth()

  const userCan = (forReferent && isReferent) || (forOrgAdmin && isOrgAdmin)

  if (!userCan) {
    return <Error msg={'Na tuto stránku nemáte oprávnění'} />
  }

  return children
}

export default PermissionRoute

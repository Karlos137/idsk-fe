import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectUserInit, selectUserIsLoged } from '../../redux/user/selectors'
import Loading from '../Loading/Loading'
import { LINKS } from './LINKS'

interface iProtectedRoute {
  children: JSX.Element
}

const ProtectedRoute = ({ children }: iProtectedRoute) => {
  const initialized = useSelector(selectUserInit)
  const userIsAuthenticated = useSelector(selectUserIsLoged)

  const location = useLocation()

  if (!initialized) {
    return <Loading />
  }

  if (!userIsAuthenticated) {
    return <Navigate to={LINKS.login} replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute

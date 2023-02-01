import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { LINKS } from '../../components/App/LINKS'
import LoginForm from '../../components/FormsSmall/LoginForm'
import { useSelector } from 'react-redux'
import { selectUserIsLoged, selectUserLoading } from '../../redux/user/selectors'
import Loading from '../../components/Loading/Loading'

const LoginPage = () => {
  const location = useLocation() as any

  const origin = location.state?.from?.pathname || LINKS.home
  // navigate(origin);
  // navigate(origin, { replace: true });

  const userIsAuthenticated = useSelector(selectUserIsLoged)
  const userLoading = useSelector(selectUserLoading)

  if (userLoading) {
    return <Loading />
  }

  if (userIsAuthenticated) {
    return <Navigate to={origin} />
  }

  return (
    <>
      <LoginForm />
    </>
  )
}

export default LoginPage

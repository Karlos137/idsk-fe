import React from 'react'
import { Link } from 'react-router-dom'
import IamApi from '../../api/IamApi'
import { useFetch } from '../../hooks/useFetch'
import { iUserData } from '../../interfaces/iUserData'
import { LINKS } from '../App/LINKS'
import Loading from '../Loading/Loading'

const UserLink = ({ user }: { user?: string }) => {
  const { data, loading } = useFetch<iUserData>(
    user && user.startsWith('/') ? () => IamApi.getUser(user?.split('/')[2]) : undefined,
  )

  if (!user) {
    return null
  }
  if (loading) {
    return <Loading />
  }

  if (!data) {
    return <span>{user}</span>
  }
  return (
    <Link to={LINKS.uzivatele + '/' + data.id}>
      {data.name} ({data.username})
    </Link>
  )
}

export default UserLink

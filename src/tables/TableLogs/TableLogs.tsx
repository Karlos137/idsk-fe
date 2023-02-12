import React from 'react'
import { Link } from 'react-router-dom'
import { LINKS } from '../../components/App/LINKS'
import Error from '../../components/Error/Error'
import Loading from '../../components/Loading/Loading'
import NoData from '../../components/NoData/NoData'
import PaginatorPerPage from '../../components/PaginatorPerPage/PaginatorPerPage'
import { IDSK_ROLES_LABEL } from '../../enums/enumUserRolesTypes'
import { USER_STATES_LABEL } from '../../enums/enumUserStates'
import { useContextMenuApp } from '../../hooks/useContextMenuApp'
import { useFetchUsers } from '../../hooks/useFetchUsers'
import { useUserAuth } from '../../hooks/useUserAuth'
import SortTableHeader from '../sort/SortTableHeader'

const TableLogs = () => {
  const { data, loading, error, totalCount } = useFetchLogs()
  const { showContextMenu } = useContextMenuApp()

  const { isReferent } = useUserAuth()

  if (error) {
    return <Error msg={error} />
  }
  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className='gov-table-cover'>
        {/*<Table striped bordered hover responsive size="sm">*/}
        <table className='gov-table gov-table--tablet-block'>
          <thead>
            <tr>
              <th>
                <SortTableHeader name='username'> Login </SortTableHeader>
              </th>
              <th className='gov-table__cell--wide'>
                <SortTableHeader name='organization.name'> Subjekt </SortTableHeader>
              </th>
              <th>
                <SortTableHeader name='firstName'> Akce </SortTableHeader>
              </th>
              <th>
                <SortTableHeader name='lastName'> Čas </SortTableHeader>
              </th>
              <th>
                <SortTableHeader name='accountStatus'> Stav </SortTableHeader>
              </th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody className='gov-table__body'>
            {data?.map((user, index) => (
              <tr key={index} onContextMenu={showContextMenu({ id: user.id })}>
                <td>
                  <Link to={user.id}>{user.username}</Link>
                </td>
                <td className='gov-table__cell--wide'>
                  {isReferent ? (
                    <Link to={LINKS.subjekty + '/' + user.organization?.id}>{user.organization?.name}</Link>
                  ) : (
                    user.organization?.name
                  )}
                </td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{USER_STATES_LABEL[user.accountStatus]}</td>
                <td>{user.dynamicRoles.map((role) => IDSK_ROLES_LABEL[role] || '').join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!data?.length && <NoData />}

      <PaginatorPerPage totalCount={totalCount} />
    </>
  )
}

export default TableLogs

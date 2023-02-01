import React from 'react'
import { Link } from 'react-router-dom'
import { LINKS } from '../../components/App/LINKS'
import Error from '../../components/Error/Error'
import Loading from '../../components/Loading/Loading'
import NoData from '../../components/NoData/NoData'
import PaginatorPerPage from '../../components/PaginatorPerPage/PaginatorPerPage'
import { useContextMenuApp } from '../../hooks/useContextMenuApp'
import { useFetchSubjects } from '../../hooks/useFetchSubjects'
import SortTableHeader from '../sort/SortTableHeader'

const TableSubjects = () => {
  const { data, loading, error, totalCount } = useFetchSubjects()
  const { showContextMenu } = useContextMenuApp()

  if (error) {
    return <Error msg={error} />
  }
  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className='gov-table-cover'>
        <table className='gov-table gov-table--tablet-block'>
          <thead>
            <tr>
              <th className='gov-table__cell--wide'>
                <SortTableHeader name='name'> Název </SortTableHeader>
              </th>
              <th>
                <SortTableHeader name='organizationType.name'> Typ </SortTableHeader>
              </th>
              <th>IČ</th>
              <th>Adresa</th>
              <th>Hlavní osoba pro komunikaci</th>
            </tr>
          </thead>
          <tbody className='gov-table__body'>
            {data?.map((subject, index) => (
              <tr key={index} onContextMenu={showContextMenu({ id: subject.id })}>
                <td className='gov-table__cell--wide'>
                  <Link to={LINKS.subjekty + '/' + subject.id}>{subject.name}</Link>
                </td>
                <td>{subject.organizationType.name}</td>
                <td>{subject.identifications?.ic}</td>
                <td>
                  {subject.addresses?.street}, {subject.addresses?.landRegistryNumber}
                </td>
                <td>
                  {subject.contacts?.[0]?.name} {subject.contacts?.[0]?.surname}
                </td>
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

export default TableSubjects

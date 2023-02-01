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

const TableDso = () => {
  const { data, loading, error, totalCount } = useFetchSubjects(true)
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
        {/*<Table striped bordered hover responsive size="sm">*/}
        <table className='gov-table gov-table--tablet-block'>
          <thead>
            <tr>
              <th className='gov-table__cell--wide'>
                <SortTableHeader name='name'> Název </SortTableHeader>
              </th>
              <th>IČ</th>
              <th>Obce</th>
            </tr>
          </thead>
          <tbody className='gov-table__body'>
            {data?.map((dso, index) => (
              <tr key={index} onContextMenu={showContextMenu({ id: dso.id })}>
                <td className='gov-table__cell--wide'>
                  <Link to={LINKS.subjekty + '/' + dso.id}>{dso.name}</Link>
                </td>
                <td>{dso.identifications?.ic}</td>
                {/*todo vypis subjektu child */}
                <td>
                  {dso.childrenOrganizations.map((org: any, index: number) => (
                    <span key={index}>
                      <Link to={LINKS.subjekty + '/' + org.id}>{org.name}</Link>
                      {index < dso.childrenOrganizations.length - 1 ? ', ' : ''}
                    </span>
                  ))}
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

export default TableDso

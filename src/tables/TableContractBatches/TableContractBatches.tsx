import React from 'react'
import { Link } from 'react-router-dom'
import { SLUG_FORM_DAVKA } from '../../api/EformsApi'
import Error from '../../components/Error/Error'
import Loading from '../../components/Loading/Loading'
import NoData from '../../components/NoData/NoData'
import PaginatorPerPage from '../../components/PaginatorPerPage/PaginatorPerPage'
import { useContextMenuApp } from '../../hooks/useContextMenuApp'
import { useFetchContracts } from '../../hooks/useFetchContracts'
import { iSubmissionDataContractBatch } from '../../interfaces/ISubmissionData'
import { dateFormatFull, dateFormatShort } from '../../utils/dateFormat'
import SortTableHeader from '../sort/SortTableHeader'

const TableContractBatches = () => {
  const { data, loading, error, totalCount } = useFetchContracts<iSubmissionDataContractBatch[]>(SLUG_FORM_DAVKA, true)
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
              <th>
                <SortTableHeader name={'createdAt'}>Vytvořeno</SortTableHeader>
              </th>
              <th className='gov-table__cell--wide'>
                <SortTableHeader name={'data.davkaInfo.nazev'}>Název dávky</SortTableHeader>
              </th>
              <th></th>
              <th>
                <SortTableHeader name={'data.davkaInfo.datumPlatnostiOd'}>Platí od</SortTableHeader>
              </th>
              <th>
                <SortTableHeader name={'data.davkaInfo.cisloUsneseniKraj'}>Číslo usnesení z kraje</SortTableHeader>
              </th>
              <th>
                <SortTableHeader name={'data.davkaInfo.datumUsneseniKraj'}>Datum usnesení z kraje</SortTableHeader>
              </th>
              <th>
                <SortTableHeader name={'workflowPlace'}>Stav</SortTableHeader>
              </th>
            </tr>
          </thead>
          <tbody className='gov-table__body'>
            {data?.map((cb, index) => (
              <tr key={index} onContextMenu={showContextMenu({ id: cb.id })}>
                <td className='date-col'>{dateFormatFull(cb.createdAt)}</td>
                <td className='gov-table__cell--wide'>
                  <Link to={cb.id}>{cb.data.davkaInfo.nazev}</Link>
                </td>
                <td>{cb.data.smlouvy?.length}</td>
                <td>{dateFormatShort(cb.data.davkaInfo?.datumPlatnostiOd)}</td>
                <td>{cb.data.davkaInfo?.cisloUsneseniKraj}</td>
                <td>{dateFormatShort(cb.data.davkaInfo?.datumUsneseniKraj)}</td>
                <td>{cb.workflowPlaceCode}</td>
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

export default TableContractBatches

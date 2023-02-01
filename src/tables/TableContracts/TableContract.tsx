import React from 'react'
import { Link } from 'react-router-dom'
import { SLUG_FORM_SMLOUVA } from '../../api/EformsApi'
import { LINKS } from '../../components/App/LINKS'
import Error from '../../components/Error/Error'
import Loading from '../../components/Loading/Loading'
import NoData from '../../components/NoData/NoData'
import PaginatorPerPage from '../../components/PaginatorPerPage/PaginatorPerPage'
import { useContextMenuApp } from '../../hooks/useContextMenuApp'
import { useFetchContracts } from '../../hooks/useFetchContracts'
import { iSubmissionDataContract } from '../../interfaces/ISubmissionData'
import { dateFormatFull } from '../../utils/dateFormat'
import SortTableHeader from '../sort/SortTableHeader'

const TableContract = () => {
  const { data, loading, error, totalCount } = useFetchContracts<iSubmissionDataContract[]>(SLUG_FORM_SMLOUVA)
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
              <th>
                <SortTableHeader name={'data.smlouvaInfo.nazev'}>Název smlouvy</SortTableHeader>
              </th>
              <th>
                <SortTableHeader name={'data.subjektStranyA.cisloSmlouvyStranyA'}>Číslo smlouvy</SortTableHeader>
              </th>
              <th>
                <SortTableHeader name={'data.subjektStranyB.nazev'}>Sml. strana B</SortTableHeader>
              </th>
              <th>
                <SortTableHeader name={'data.subjektStranyC.nazev'}>Sml. strana C</SortTableHeader>
              </th>
              <th>
                <SortTableHeader name={'data.typ'}>Typ</SortTableHeader>
              </th>
              <th>
                <SortTableHeader name={'workflowPlace'}>Stav</SortTableHeader>
              </th>
              <th>Referent</th>
            </tr>
          </thead>
          <tbody className='gov-table__body'>
            {data?.map((contract, index) => (
              <tr key={index} onContextMenu={showContextMenu({ id: contract.id })}>
                <td className='date-col'>{dateFormatFull(contract.createdAt)}</td>
                <td className='gov-table__cell--wide'>
                  <Link to={LINKS.prehledSmluv + '/' + contract.id}>{contract.data.smlouvaInfo?.nazev}</Link>
                </td>
                <td>{contract.data.subjektStranyA?.cisloSmlouvyStranyA}</td>
                <td>{contract.data.subjektStranyB?.nazev}</td>
                <td>{contract.data.subjektStranyC?.nazev || ''}</td>
                <td>{contract.data.typ}</td>
                <td>{contract.workflowPlaceCode}</td>
                <td>{contract.createdBy?.name}</td>
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

export default TableContract

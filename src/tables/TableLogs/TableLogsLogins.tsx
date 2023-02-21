import Error from '../../components/Error/Error'
import Loading from '../../components/Loading/Loading'
import SortTableHeader from '../sort/SortTableHeader'
import useSWRInfinite from 'swr/infinite'
import { fetcher } from '../../api/LogsApi'
import ButtonGov from '../../components/Btns/ButtonGov'
import * as _ from 'lodash'

const getKey = (pageIndex: any, previousPageData: any) => {
  if (previousPageData && !previousPageData.length) return null // reached the end
  return `application_logs?page=${
    pageIndex + 1
  }&limit=20&type=SECURITY&logData.securityType=LOGIN&logData.securityResult=SUCCESS&order%5BcreatedAt%5D=desc` // SWR key
}

const TableLogsLogins = () => {
  const { data, error, isLoading, size, setSize } = useSWRInfinite(getKey, fetcher, {
    initialSize: 1,
    onSuccess: (data) => console.log('DATA', data),
  })

  if (error) {
    return <Error msg='Chyba při načítání dat' />
  }
  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div className='gov-table-cover'>
        <table className='gov-table gov-table--tablet-block'>
          <thead>
            <tr>
              <th>
                <SortTableHeader name='userId'> ID uživatele </SortTableHeader>
              </th>
              <th className='gov-table__cell--wide'>
                <SortTableHeader name='userIpAddress'> IP Adresa uživatele </SortTableHeader>
              </th>
            </tr>
          </thead>
          <tbody className='gov-table__body'>
            {data &&
              Object.keys(data).map((key) => {
                return _.sortBy(data[Number(key)], 'userId').map((log: any) => {
                  return (
                    <tr key={log.id}>
                      <td>{log.userId}</td>
                      <td>{log.userIpAddress}</td>
                    </tr>
                  )
                })
              })}
          </tbody>
        </table>
      </div>

      <ButtonGov variant='primary' className='me-3' onClick={() => setSize(size + 1)}>
        Načíst další
      </ButtonGov>
    </>
  )
}

export default TableLogsLogins


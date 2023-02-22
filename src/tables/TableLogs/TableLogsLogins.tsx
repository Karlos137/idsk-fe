import Error from '../../components/Error/Error'
import Loading from '../../components/Loading/Loading'
import SortTableHeader from './SortTableHeader'
import useSWRInfinite from 'swr/infinite'
import { fetcher } from '../../api/LogsApi'
import ButtonGov from '../../components/Btns/ButtonGov'
import * as _ from 'lodash'
import { useEffect, useState } from 'react'

const TableLogsLogins = ({ result }: { result: 'SUCCESS' | 'FAILURE' }) => {
  const [sort, setSort] = useState(['', ''])
  const [moreData, setMoreData] = useState(true)

  const getKey = (pageIndex: any, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) {
      setMoreData(false)
      return null
    } // reached the end
    return `application_logs?page=${
      pageIndex + 1
    }&limit=20&type=SECURITY&logData.securityType=LOGIN&logData.securityResult=${result}&order%5BcreatedAt%5D=desc` // SWR key
  }

  const { data, error, isLoading, size, setSize } = useSWRInfinite(getKey, fetcher, {
    initialSize: 1,
    onSuccess: (data) => console.log('DATA', data),
  })

  useEffect(() => {
    console.log('DATA', data && data.length > 0 && data[data.length - 1].length === 0)
    if (data && data.length > 0 && data[data.length - 1].length === 0) {
      console.log('DATA LENGTH', data[data.length - 1])
      setMoreData(false)
    }
  }, [data])

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
                <SortTableHeader
                  order={sort[0] === 'userId' ? sort[1] : ''}
                  onClick={() => {
                    setSort(['userId', sort[1] === 'asc' ? 'desc' : 'asc'])
                  }}
                >
                  ID uživatele
                </SortTableHeader>
              </th>
              <th className='gov-table__cell--wide'>
                <SortTableHeader
                  order={sort[0] === 'userIpAddress' ? sort[1] : ''}
                  onClick={() => {
                    setSort(['userIpAddress', sort[1] === 'asc' ? 'desc' : 'asc'])
                  }}
                >
                  IP Adresa uživatele
                </SortTableHeader>
              </th>
            </tr>
          </thead>
          <tbody className='gov-table__body'>
            {data &&
              Object.keys(data).map((key) => {
                const sortedArr =
                  sort[1] === 'desc'
                    ? _.sortBy(data[Number(key)], sort[0]).reverse()
                    : _.sortBy(data[Number(key)], sort[0])

                return sortedArr.map((log: any) => {
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

      {moreData && (
        <ButtonGov variant='primary' className='me-3' onClick={() => setSize(size + 1)}>
          Načíst další
        </ButtonGov>
      )}
    </>
  )
}

export default TableLogsLogins


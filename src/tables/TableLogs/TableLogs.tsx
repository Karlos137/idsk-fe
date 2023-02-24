import Error from '../../components/Error/Error'
import Loading from '../../components/Loading/Loading'
import SortTableHeader from './SortTableHeader'
import useSWRInfinite from 'swr/infinite'
import { fetcher } from '../../api/LogsApi'
import ButtonGov from '../../components/Btns/ButtonGov'
import * as _ from 'lodash'
import { useEffect, useState } from 'react'
import { PAGE_LIMIT } from './TableLogs.constants'
import { formatDate } from './TableLogs.helpers'

const TableLogs = ({
  logType = 'successLogin',
}: {
  logType: 'successLogin' | 'failedLogin' | 'logout' | 'entityDeletion'
}) => {
  const [sort, setSort] = useState(['', ''])
  const [moreData, setMoreData] = useState(true)

  const getApiURL = () => {
    switch (logType) {
      case 'successLogin':
        return '&type=SECURITY&logData.securityType=LOGIN&logData.securityResult=SUCCESS'
      case 'failedLogin':
        return '&type=SECURITY&logData.securityType=LOGIN&logData.securityResult=FAILURE'
      case 'logout':
        return '&type=SECURITY&logData.securityType=LOGOUT'
      case 'entityDeletion':
        return '&type=ENTITY_AUDIT&logData.auditAction=DELETE'
      default:
        return ''
    }
  }

  const getKey = (pageIndex: any, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) {
      setMoreData(false)
      return null
    } // reached the end

    return `application_logs?page=${pageIndex + 1}&limit=${PAGE_LIMIT}${getApiURL()}` // SWR key
  }

  const { data, error, isLoading, size, setSize } = useSWRInfinite(getKey, fetcher, {
    initialSize: 1,
    onSuccess: (data) => console.log('DATA', data),
  })

  useEffect(() => {
    if (data && data.length > 0 && data[data.length - 1].length < 50) {
      setMoreData(false)
    } else {
      setMoreData(true)
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
              {logType !== 'entityDeletion' && (
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
              )}

              {logType === 'entityDeletion' && (
                <th className='gov-table__cell--wide'>
                  <SortTableHeader
                    order={sort[0] === 'logData.entityId' ? sort[1] : ''}
                    onClick={() => {
                      setSort(['logData.entityId', sort[1] === 'asc' ? 'desc' : 'asc'])
                    }}
                  >
                    ID subjektu
                  </SortTableHeader>
                </th>
              )}
              <th>
                <SortTableHeader
                  order={sort[0] === 'userIpAddress' ? sort[1] : ''}
                  onClick={() => {
                    setSort(['userIpAddress', sort[1] === 'asc' ? 'desc' : 'asc'])
                  }}
                >
                  IP Adresa uživatele
                </SortTableHeader>
              </th>

              <th>
                <SortTableHeader
                  order={sort[0] === 'createdAt' ? sort[1] : ''}
                  onClick={() => {
                    setSort(['createdAt', sort[1] === 'asc' ? 'desc' : 'asc'])
                  }}
                >
                  Vytvořeno
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
                      {logType !== 'entityDeletion' && <td>{log.userId}</td>}
                      {logType === 'entityDeletion' && <td>{log.logData?.entityId}</td>}
                      <td>{log.userIpAddress}</td>
                      <td>{formatDate(log.createdAt)}</td>
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

export default TableLogs


import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EformsApi from '../../api/EformsApi'
import { LINKS } from '../../components/App/LINKS'
import Error from '../../components/Error/Error'
import Loading from '../../components/Loading/Loading'
import PaginatorPerPage from '../../components/PaginatorPerPage/PaginatorPerPage'
import { useFilterContext } from '../../context/FilterContext'
import { useEffectStart } from '../../hooks/useEffectStart'
import { iVersionsData } from '../../interfaces/IVersionsData'
import { dateFormatFull } from '../../utils/dateFormat'

interface iHistoryBlock {
  id: string
  version?: string
}

const HistoryBlock = ({ id }: iHistoryBlock) => {
  const [data, setData] = useState<iVersionsData[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { page, limit } = useFilterContext()

  const fetchData = useCallback(() => {
    setLoading(true)
    setError('')
    EformsApi.getVersions(id, page, limit)
      .then((res) => {
        setData(res.data)
        setTotalCount(res.totalCount)
      })
      .catch((err) => setError(err.toString()))
      .finally(() => setLoading(false))
  }, [page, limit])

  useEffectStart(() => {
    fetchData()
  })

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (error) {
    return <Error msg='Chyba načtení historie' />
  }
  if (loading) {
    return <Loading />
  }

  return (
    <>
      <table>
        <tbody>
          {data?.map((versionData, index) => (
            <tr key={index}>
              <td>{versionData.version}</td>
              <td>{versionData.workflowPlaceCode}</td>
              <td>{dateFormatFull(versionData.createdAt)}</td>
              <td>
                <Link to={LINKS.prehledSmluv + '/' + id + LINKS.prehledSmluvHistorie + '/' + versionData.id}>
                  Zobrazit detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PaginatorPerPage totalCount={totalCount} maxPerPage={50} />
    </>
  )
}

export default HistoryBlock

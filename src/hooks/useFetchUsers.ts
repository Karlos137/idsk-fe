import { useCallback, useEffect, useState } from 'react'
import IamApi from '../api/IamApi'
import { useFilterContext } from '../context/FilterContext'
import { iUserData } from '../interfaces/iUserData'

export const useFetchUsers = () => {
  const [data, setData] = useState<iUserData[]>()
  const [totalCount, setTotalCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { sort, page, limit, activeFilters } = useFilterContext()

  const fetchData = useCallback(() => {
    setError('')
    setLoading(true)

    const params = { ...activeFilters }
    if (sort.field) {
      params['order[' + sort.field + ']'] = sort.order ? 'asc' : 'desc'
    }

    IamApi.getUsers(page, limit, params)
      .then((result) => {
        console.log('fetch users', page, limit, result)
        setData(result.data)
        setTotalCount(result.totalCount)
      })
      .catch((error) => {
        setError(error.toString())
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, limit, activeFilters, sort])

  // useEffectStart(() => {
  //   console.log('change first start')
  //   fetchData()
  // })
  // useEffect(() => {
  //   fetchData()
  // }, [page, limit])

  useEffect(() => {
    console.log('change first start')
    fetchData()
  }, [fetchData])

  return { data, loading, error, totalCount, fetchData }
}

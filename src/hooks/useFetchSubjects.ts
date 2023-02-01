import { useCallback, useEffect, useState } from 'react'
import IamApi from '../api/IamApi'
import { useFilterContext } from '../context/FilterContext'
import { iOrgData } from '../interfaces/IOrgData'
import { useOrgTypes } from './useOrgTypes'

export const useFetchSubjects = (isDso?: boolean) => {
  const [data, setData] = useState<iOrgData[]>()
  const [totalCount, setTotalCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { orgTypesId, findIdByOrgTypeName } = useOrgTypes()
  const { dso, ...withoutDso } = orgTypesId
  const { sort, page, limit, activeFilters, variant } = useFilterContext()

  const fetchData = useCallback(() => {
    setError('')
    setLoading(true)

    const params = { ...activeFilters }
    if (sort.field) {
      params['order[' + sort.field + ']'] = sort.order ? 'asc' : 'desc'
    }

    let orgTypes = isDso ? [dso] : variant ? [findIdByOrgTypeName(variant)] : Object.values(withoutDso)

    IamApi.getOrgs(page, limit, orgTypes, params)
      .then((result) => {
        console.log('fetch subjects', page, limit, result)
        setData(result.data)
        setTotalCount(result.totalCount)
      })
      .catch((error) => {
        setError(error.toString())
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, limit, activeFilters, sort, variant])

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

import { useCallback, useEffect, useState } from 'react'
import EformsApi from '../api/EformsApi'
import { useFilterContext } from '../context/FilterContext'
import { createFilterParams, createOrderParams } from '../utils/createParams'
import { useWorkflowsByVariantRole } from './useWorkflowsByVariantRole'

export const useFetchContracts = <T>(formSlug: string, isBatch?: boolean) => {
  const [data, setData] = useState<T>()
  const [totalCount, setTotalCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { sort, activeFilters, page, limit, variant } = useFilterContext()
  const validWorkflow = useWorkflowsByVariantRole(isBatch)

  const fetchData = useCallback(() => {
    setError('')
    setLoading(true)

    const filterParams = createFilterParams(activeFilters)
    const filterOrderParams = createOrderParams(sort.field, sort.order)

    const agendaParams = {
      workflowPlace: validWorkflow,
    }

    const params = { ...agendaParams, ...filterParams, ...filterOrderParams }
    EformsApi.getSubmissionsSearch(formSlug, page, limit, params)
      .then((result) => {
        console.log('fetch contracts', page, limit, result)
        setData(result.data)
        setTotalCount(result.totalCount)
      })
      .catch((error) => {
        setError(error.toString())
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, limit, formSlug, variant, sort, activeFilters])

  useEffect(() => {
    console.log('change first start')
    fetchData()
  }, [fetchData])

  return { data, loading, error, totalCount, fetchData }
}

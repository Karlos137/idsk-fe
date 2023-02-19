import { useCallback, useEffect, useState } from "react";
import IdskApi from "../api/IdskApi";
import { useFilterContext } from "../context/FilterContext";

export const useFetchLogs = () => {
    const [data, setData] = useState<Array<any> | undefined>()
    const [totalCount, setTotalCount] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const {page, limit} = useFilterContext()

    const fetchData = useCallback(() => {
        setError('')
        setLoading(true)

        IdskApi.getApplicationLogs(page, limit)
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
    }, [page, limit])


    useEffect(() => {
        console.log('change first start')
        fetchData()
      }, [fetchData])

      return { data, loading, error, totalCount, fetchData }
}
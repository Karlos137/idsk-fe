import { useCallback, useState } from 'react'
import { useEffectStart } from './useEffectStart'

export const useFetch = <T>(fetchFn?: () => Promise<T>) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState<T>()

  const fetchData = useCallback(() => {
    if (!fetchFn) {
      setLoading(false)
      return
    }
    setError('')
    setLoading(true)
    fetchFn()
      .then((result) => {
        setData(result)
      })
      .catch((error) => {
        setError(error.toString())
      })
      .finally(() => {
        setLoading(false)
      })
  }, [fetchFn])

  useEffectStart(() => {
    fetchData()
  })

  return { data, loading, error, fetchData }
}

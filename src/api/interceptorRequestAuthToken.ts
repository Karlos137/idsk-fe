import { AxiosInstance } from 'axios'
import { tokensGetToken } from '../utils/tokens'

export const interceptorRequestAuthToken = (axiosApiInstance: AxiosInstance) => {
  axiosApiInstance.interceptors.request.use((config) => {
    const token = tokensGetToken()

    if (token && config.headers?.['Authorization'] !== 'none') {
      if (!config.headers) {
        config.headers = {}
      }
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  })
}

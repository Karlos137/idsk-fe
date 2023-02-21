import axios from 'axios'
import { tokensGetToken } from '../utils/tokens'
import { interceptorRequestAuthToken } from './interceptorRequestAuthToken'
import { interceptorResponseAuthToken } from './interceptorResponseAuthToken'

const token = tokensGetToken()

export const alberaApi = axios.create({
  baseURL: process.env.REACT_APP_ALBERA_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token || ''}`,
    'x-api-key': process.env.REACT_APP_ALBERA_API_KEY || '',
  },
})

interceptorRequestAuthToken(alberaApi)
interceptorResponseAuthToken(alberaApi)

export const logTypeEndpoint = '/application_logs?page=1&limit=20'

export const fetcher = async (url: string) => {
  const reponse = await alberaApi.get(url)
  return reponse.data
}


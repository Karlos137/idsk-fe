import axios from 'axios'
import { tokensGetToken } from '../utils/tokens'

const token = tokensGetToken()

const alberaApi = axios.create({
  baseURL: process.env.REACT_APP_ALBERA_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token ?? ''}`,
    'x-api-key': 'MEkwU3LntEDa6exhHZKDmxsp',
  },
})

export const logTypeEndpoint = '/application_logs?page=1&limit=20'

export const fetcher = async (url: string) => {
  const reponse = await alberaApi.get(url)
  return reponse.data
}


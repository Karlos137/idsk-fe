import axios from 'axios'

const API_URL = process.env.REACT_APP_KEYCLOAK_URL
const REALM = process.env.REACT_APP_KEYCLOAK_REALM
const CLIENT_ID = process.env.REACT_APP_KEYCLOAK_CLIENT_ID || ''

export interface iTokens {
  access_token: string
  refresh_token: string
  expires_in: number
  refresh_expires_in: number
  scope: string
}

const HEADER_FORM_URLENCODED = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
}

class KeycloakApi {
  api = axios.create({
    baseURL: API_URL,
  })

  getToken = (username: string, password: string): Promise<iTokens> =>
    this.api
      .post(
        `realms/${REALM}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: CLIENT_ID,
          username: username,
          password: password,
          grant_type: 'password',
          scope: 'offline_access',
        }),
        HEADER_FORM_URLENCODED,
      )
      .then((res) => res.data)

  refreshToken = (refreshToken: string): Promise<iTokens> =>
    this.api
      .post(
        `realms/${REALM}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: CLIENT_ID,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
        HEADER_FORM_URLENCODED,
      )
      .then((res) => res.data)
}

export default new KeycloakApi()

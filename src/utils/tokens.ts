import { iTokens } from '../api/KeycloakApi'

const TOKEN_KEY = 'tokens'

export const tokensSave = (tokens: iTokens) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))
}

export const tokensClear = () => {
  localStorage.setItem(TOKEN_KEY, '{}')
}

export const tokensGet = (): iTokens => {
  return JSON.parse(localStorage.getItem(TOKEN_KEY) || '{}')
}

export const tokensGetToken = () => {
  return tokensGet()?.access_token
}

export const tokensGetRefreshToken = () => {
  return tokensGet()?.refresh_token
}

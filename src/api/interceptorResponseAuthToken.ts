import axios, { AxiosInstance } from 'axios'
import store from '../redux/store'
import { logOutAction } from '../redux/user/actions'
import { tokensGetRefreshToken, tokensGetToken, tokensSave } from '../utils/tokens'
import KeycloakApi from './KeycloakApi'

let refreshTokenPromise: Promise<any> | null // this holds any in-progress token refresh requests
export const interceptorResponseAuthToken = (axiosApiInstance: AxiosInstance) => {
  const interceptor = axiosApiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // if (error.response?.status === 503) {
      //   redirectServiceUnavailable();
      //   return Promise.reject(error);
      // }

      // Reject promise if usual error
      if (error.response?.status !== 401) {
        return Promise.reject(error)
      }

      /*
       * When response code is 401, try to refresh the token.
       * Eject the interceptor so it doesn't loop in case
       * token refresh causes the 401 response
       */
      axiosApiInstance.interceptors.response.eject(interceptor)

      const originalRequest = error.config
      const refreshToken = tokensGetRefreshToken()

      if (!refreshTokenPromise) {
        refreshTokenPromise = KeycloakApi.refreshToken(refreshToken)
          .then((data) => {
            console.log('token refreshed', data)
            tokensSave(data)
          })
          .catch((error) => {
            console.log('ERR refreshtoken ', error)
            // const errMsg = `Uživatel byl odhlášen. ${error.response?.status === 401 ? 'Relace vypršela.' : 'Chyba obnovení tokenu.'}`
            const errMsg = `Uživatel byl odhlášen. Relace vypršela.`
            store.dispatch(logOutAction(errMsg))
          })
          .finally(() => {
            refreshTokenPromise = null // clear state
          })
      }

      return refreshTokenPromise
        .then((data) => {
          const token = tokensGetToken()
          originalRequest.headers['Authorization'] = `Bearer ${token}`
          // axiosApiInstance.defaults.headers["Authorization"] = `Bearer ${keycloak.token}`;
          return axios(originalRequest)
        })
        .catch((error) => {
          console.log('ERR refreshtoken promise', error)

          // if (error.response?.status === 401) {
          //     toast.error("Uživatel byl odhlášen. Relace vypršela.");
          // } else {
          //     toast.error("Uživatel byl odhlášen. Chyba obnovení tokenu.");
          // }
          // const errMsg = `Uživatel byl odhlášen. ${error.response?.status === 401 ? 'Relace vypršela.' : 'Chyba obnovení tokenu.'}`
          // store.dispatch(logOutAction(errMsg))

          return Promise.reject(error)
        })
        .finally(() => {
          interceptorResponseAuthToken(axiosApiInstance)
        })
    },
  )
}

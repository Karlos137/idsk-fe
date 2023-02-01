import axios from 'axios'
import { iGetDataToSignRequestBody } from './StckApi'

const API_URL = 'http://127.0.0.1:15741/'

interface iAppStatusData {
  signingCertificate: string
  appName: string
  appVersion: string
}

interface iSignData {
  content?: string
  mimeType?: string
  name?: string
}

class EsignerApi {
  api = axios.create({
    baseURL: API_URL,
  })

  getAppStatus = () => this.api.get<iAppStatusData>('/').then((res) => res.data)

  sign = (getDataToSignRequestBody: iGetDataToSignRequestBody, dataToSign: string): Promise<iSignData> =>
    this.api
      .post('/sign', {
        getDataToSignRequestBody: getDataToSignRequestBody,
        dataToSign: dataToSign,
      })
      .then((res) => res.data)
}

export default new EsignerApi()

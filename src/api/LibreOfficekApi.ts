import axios from 'axios'

const API_URL = process.env.REACT_APP_LIBREOFFICE_API_URL

class LibreOfficekApi {
  api = axios.create({
    baseURL: API_URL,
  })

  convertToPdf = (fileData: Blob) =>
    this.api
      .post(`/convert-to-pdf`, fileData, {
        params: {
          exportFilters: { SelectPdfVersion: '2' },
        },
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      })
      .then((res) => res.data)
}

export default new LibreOfficekApi()

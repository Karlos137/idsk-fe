import axios from "axios";

class IdskApi {
  api = axios.create({
    baseURL: 'https://albera.idsk.qcm.cz/', //process.env.IDSK_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.IDSK_API_KEY ?? ''}`,
      'x-api-key': 'MEkwU3LntEDa6exhHZKDmxsp',//process.env.IDSK_API_KEY ?? '',
    }
    });

    getApiKeys() {
        return this.api.get('/api_keys?page=1&limit=100').then((response) => response.data);
    }

    getApplicationLogs(page: number, limit: number) {
        return this.api.get(`/application_logs?page=${page}&limit=${limit}`).then((res) => ({
          data: res.data,
          totalCount: parseInt(res.headers['x-total-count']),
        }))
    }

    
}

export default new IdskApi();
import type { AxiosInstance } from 'axios'
import { clearLS, getAccessTokenFromLS, setAccessTokenToLS } from './auth'
import axios from 'axios'
import config from '../constants/config'
import { URL_LOGIN, URL_LOGOUT } from '../apis/profile.api'

export class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use((response) => {
      const { url } = response.config
      if (url === URL_LOGIN) {
        const data = response.data
        this.accessToken = data.data.access_token
        setAccessTokenToLS(this.accessToken)
      } else if (url === URL_LOGOUT) {
        this.accessToken = ''
        clearLS()
      }
      return response
    })
  }
}

const http = new Http().instance
export default http

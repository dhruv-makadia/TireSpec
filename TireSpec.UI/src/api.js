import axios from 'axios'
import { getSessionCookie } from './session.js'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

export const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const session = getSessionCookie()
  if (session?.jwt) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${session.jwt}`,
    }
  }
  return config
})

export async function startSession(websiteId) {
  const response = await api.post('/api/sessions/create', { websiteId })
  return response.data
}

export async function identifyTire(payload) {
  const response = await api.post('/api/tire-scan', payload)
  return response.data
}

export async function fetchQuote(payload) {
  const response = await api.post('/api/quotes', payload)
  return response.data
}

export async function sendContact(payload) {
  const response = await api.post('/api/contact', payload)
  return response.data
}

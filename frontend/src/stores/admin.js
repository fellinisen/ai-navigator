import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

export const useAdminStore = defineStore('admin', {
  state: () => ({ responses: [], loading: false, error: null, adminKey: localStorage.getItem('adminKey') || '' }),
  actions: {
    setAdminKey(key) { this.adminKey = key; localStorage.setItem('adminKey', key) },
    async fetchResponses({ limit = 50, skip = 0 } = {}) {
      if (!this.adminKey) { this.error = 'Admin key required'; return [] }
      this.loading = true; this.error = null
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/responses`, { headers: { 'X-Admin-Key': this.adminKey }, params: { limit, skip } })
        this.responses = response.data.responses || []
        return this.responses
      } catch (error) {
        this.error = error.response?.data?.detail || error.message
        console.error('Error fetching responses:', error)
        throw error
      } finally { this.loading = false }
    }
  }
})
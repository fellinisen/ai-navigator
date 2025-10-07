<template>
  <div class="admin">
    <div class="container">
      <h1 class="title">Admin: Responses</h1>
      <div class="admin-key">
        <input v-model="adminKey" type="text" placeholder="Enter admin key" class="key-input" />
        <button @click="saveKey" class="save-btn">Save Key</button>
        <button @click="loadResponses" class="refresh-btn">Refresh</button>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="loading" class="loading">Loading responses...</div>
      <table v-else class="responses-table">
        <thead>
          <tr>
            <th>Created</th>
            <th>Email</th>
            <th>Questionnaire</th>
            <th>Score</th>
            <th>Tier 1</th>
            <th>Tier 2</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in responses" :key="r.id">
            <td>{{ r.created_at }}</td>
            <td>{{ r.user_email }}</td>
            <td>{{ r.questionnaire_id }}</td>
            <td>{{ r.score ?? '-' }}</td>
            <td>
              <div v-if="r.tier1" class="tier-box">
                <div v-for="(v,k) in r.tier1" :key="k" class="tier-item">{{ k }}: {{ formatTierValue(v) }}</div>
              </div>
              <span v-else>-</span>
            </td>
            <td>
              <div v-if="r.tier2" class="tier-box">
                <div v-for="(v,k) in r.tier2" :key="k" class="tier-item">{{ k }}: {{ formatTierValue(v) }}</div>
              </div>
              <span v-else>-</span>
            </td>
            <td>
              <button @click="viewDetails(r.id)" class="detail-btn">View</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="selected" class="modal-overlay" @click="selected=null">
        <div class="modal-content" @click.stop>
          <h3>Response Details</h3>
          <pre>{{ selected }}</pre>
          <button @click="selected=null" class="close-btn">Close</button>
        </div>
      </div>
    </div>
  </div>
  </template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAdminStore } from '../stores/admin'

const API_BASE_URL = 'http://localhost:8000'

export default {
  name: 'AdminResponses',
  setup() {
    const adminStore = useAdminStore()
    const adminKey = ref(adminStore.adminKey)
    const responses = ref([])
    const loading = ref(false)
    const error = ref(null)
    const selected = ref(null)

    const saveKey = () => adminStore.setAdminKey(adminKey.value)
    const formatTierValue = (v) => typeof v === 'object' ? JSON.stringify(v) : v

    const loadResponses = async () => {
      try {
        loading.value = true; error.value = null
        const items = await adminStore.fetchResponses({ limit: 100 })
        responses.value = items
      } catch (e) {
        error.value = adminStore.error || e.message
      } finally { loading.value = false }
    }

    const viewDetails = async (id) => {
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/responses/${id}`, { headers: { 'X-Admin-Key': adminStore.adminKey } })
        selected.value = JSON.stringify(res.data, null, 2)
      } catch (e) {
        alert('Failed to load details')
      }
    }

    onMounted(() => { if (adminStore.adminKey) loadResponses() })
    return { adminKey, responses, loading, error, selected, saveKey, loadResponses, viewDetails, formatTierValue }
  }
}
</script>

<style scoped>
.container { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }
.title { font-size: 2rem; color: #171C8F; margin: 1.5rem 0; }
.admin-key { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
.key-input { flex: 1; padding: 0.5rem 0.75rem; border: 2px solid #e9ecef; border-radius: 6px; }
.save-btn, .refresh-btn, .detail-btn, .close-btn { background: #0072CE; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; }
.save-btn:hover, .refresh-btn:hover, .detail-btn:hover, .close-btn:hover { background: #005ba3; }
.responses-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.responses-table th, .responses-table td { padding: 0.75rem; border-bottom: 1px solid #e9ecef; text-align: left; vertical-align: top; }
.responses-table thead { background: #f8f9ff; }
.tier-box { display: flex; flex-direction: column; gap: 0.25rem; }
.tier-item { background: #f6f8fa; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.9rem; }
.error { color: #dc3545; margin: 0.5rem 0; }
.loading { color: #666; margin: 0.5rem 0; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
.modal-content { background: #fff; padding: 1rem; border-radius: 8px; width: 90%; max-width: 700px; }
</style>
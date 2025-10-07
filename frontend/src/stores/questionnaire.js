import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

export const useQuestionnaireStore = defineStore('questionnaire', {
  state: () => ({ questionnaires: [], currentQuestionnaire: null, loading: false, error: null }),
  actions: {
    async fetchQuestionnaires() {
      this.loading = true; this.error = null
      try {
        const response = await axios.get(`${API_BASE_URL}/questionnaires`)
        this.questionnaires = response.data.questionnaires
        return this.questionnaires
      } catch (error) {
        this.error = error.message; console.error('Error fetching questionnaires:', error); throw error
      } finally { this.loading = false }
    },
    async fetchQuestionnaire(id) {
      this.loading = true; this.error = null
      try {
        const response = await axios.get(`${API_BASE_URL}/questionnaires/${id}`)
        this.currentQuestionnaire = response.data
        return this.currentQuestionnaire
      } catch (error) {
        this.error = error.message; console.error('Error fetching questionnaire:', error); throw error
      } finally { this.loading = false }
    },
    async submitAssessment(assessmentData) {
      this.loading = true; this.error = null
      try {
        const response = await axios.post(`${API_BASE_URL}/submit-assessment`, assessmentData)
        return response.data
      } catch (error) {
        this.error = error.message; console.error('Error submitting assessment:', error); throw error
      } finally { this.loading = false }
    }
  }
})
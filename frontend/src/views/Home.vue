<template>
  <div class="home">
    <div class="container">
      <div class="hero-section">
        <h1 class="hero-title">AI Navigator Assessment</h1>
        <p class="hero-subtitle">Evaluate your organization's readiness for AI implementation</p>
      </div>
      <div class="questionnaires-grid" v-if="questionnaires.length > 0">
        <div v-for="q in questionnaires" :key="q.id" class="questionnaire-card" @click="startQuestionnaire(q.id)">
          <div class="card-header"><h3 class="card-title">{{ q.title }}</h3></div>
          <div class="card-body"><p class="card-description">{{ q.description }}</p></div>
          <div class="card-footer"><button class="start-btn">Start Assessment</button></div>
        </div>
      </div>
      <div v-else class="loading"><p>Loading questionnaires...</p></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionnaireStore } from '../stores/questionnaire'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    const questionnaireStore = useQuestionnaireStore()
    const questionnaires = ref([])

    const loadQuestionnaires = async () => {
      try {
        questionnaires.value = await questionnaireStore.fetchQuestionnaires()
      } catch (e) {
        console.error('Error loading questionnaires', e)
      }
    }

    const startQuestionnaire = (id) => router.push(`/questionnaire/${id}`)

    onMounted(loadQuestionnaires)
    return { questionnaires, startQuestionnaire }
  }
}
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
.hero-section { text-align: center; margin-bottom: 4rem; }
.hero-title { font-size: 3rem; color: #171C8F; margin-bottom: 1rem; font-weight: 700; }
.hero-subtitle { font-size: 1.2rem; color: #666; max-width: 600px; margin: 0 auto; }
.questionnaires-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; margin-bottom: 2rem; }
.questionnaire-card { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; cursor: pointer; overflow: hidden; border: 2px solid transparent; }
.questionnaire-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(23, 28, 143, 0.15); border-color: #0072CE; }
.card-header { background: linear-gradient(135deg, #171C8F, #0072CE); color: white; padding: 1.5rem; }
.card-title { font-size: 1.5rem; font-weight: 600; margin: 0; }
.card-body { padding: 1.5rem; }
.card-description { color: #666; line-height: 1.6; margin: 0; }
.card-footer { padding: 0 1.5rem 1.5rem; }
.start-btn { background: #0072CE; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; width: 100%; }
.start-btn:hover { background: #005ba3; }
.loading { text-align: center; padding: 2rem; color: #666; }
@media (max-width: 768px) { .hero-title { font-size: 2rem; } .questionnaires-grid { grid-template-columns: 1fr; } .container { padding: 0 1rem; } }
</style>
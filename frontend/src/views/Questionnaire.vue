<template>
  <div class="questionnaire">
    <div class="container">
      <div v-if="loading" class="loading"><p>Loading questionnaire...</p></div>
      <div v-else-if="questionnaire" class="questionnaire-content">
        <div class="questionnaire-header">
          <h1 class="questionnaire-title">{{ questionnaire.title }}</h1>
          <p class="questionnaire-description">{{ questionnaire.description }}</p>
          <div class="progress-bar"><div class="progress-fill" :style="{ width: `${progress}%` }"></div></div>
          <p class="progress-text">Question {{ currentQuestionIndex + 1 }} of {{ questionnaire.questions.length }}</p>
          <div class="quick-fill-toolbar">
            <div class="quick-fill-section">
              <label class="quick-fill-label">Current maturity:</label>
              <select v-model="quickFillSelection" class="quick-fill-select">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="random">Random</option>
              </select>
            </div>
            <div class="quick-fill-section">
              <label class="quick-fill-label">Target maturity:</label>
              <select v-model="targetQuickFillSelection" class="quick-fill-select">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="random">Random</option>
              </select>
            </div>
            <button @click="quickFill" class="quick-fill-btn">Apply</button>
            <button @click="quickFillAndGo" class="quick-fill-submit-btn">Apply & Go to Submit</button>
          </div>
        </div>
        <div v-if="!showResults" class="question-section">
          <div class="question-card">
            <h2 class="question-text">{{ currentQuestion.text }}</h2>
            <div class="options-container">
              <div class="options-section">
                <h3 class="options-heading">Current Maturity</h3>
                <div v-for="option in currentQuestion.options" :key="option.value" class="option-item" :class="{ 'selected': responses[currentQuestion.id] === option.value }" @click="selectOption(option.value)">
                  <div class="option-radio"><div v-if="responses[currentQuestion.id] === option.value" class="radio-dot"></div></div>
                  <span class="option-text">{{ option.text }}</span>
                </div>
              </div>
              <div class="options-section">
                <h3 class="options-heading">Target Maturity</h3>
                <div v-for="option in currentQuestion.options" :key="option.value" class="option-item" :class="{ 'selected': targetResponses[currentQuestion.id] === option.value }" @click="selectTargetOption(option.value)">
                  <div class="option-radio"><div v-if="targetResponses[currentQuestion.id] === option.value" class="radio-dot"></div></div>
                  <span class="option-text">{{ option.text }}</span>
                </div>
              </div>
            </div>
            <div class="navigation-buttons">
              <button v-if="currentQuestionIndex > 0" @click="previousQuestion" class="nav-btn prev-btn">Previous</button>
              <button v-if="currentQuestionIndex < questionnaire.questions.length - 1" @click="nextQuestion" :disabled="!responses[currentQuestion.id]" class="nav-btn next-btn">Next</button>
              <button v-if="currentQuestionIndex === questionnaire.questions.length - 1" @click="showEmailForm = true" :disabled="!responses[currentQuestion.id]" class="nav-btn submit-btn">Complete Assessment</button>
            </div>
          </div>
        </div>
        <div v-if="showEmailForm" class="modal-overlay" @click="showEmailForm = false">
          <div class="modal-content" @click.stop>
            <h3>Enter Your Email</h3>
            <p>We'll send your assessment results to your email address.</p>
            <form @submit.prevent="submitAssessment">
              <input v-model="userEmail" type="email" placeholder="your.email@example.com" required class="email-input" />
              <div class="modal-buttons">
                <button type="button" @click="showEmailForm = false" class="cancel-btn">Cancel</button>
                <button type="submit" :disabled="submitting" class="submit-btn">{{ submitting ? 'Submitting...' : 'Send Results' }}</button>
              </div>
            </form>
          </div>
        </div>
        <div v-if="showResults" class="results-section">
          <div class="results-card">
            <h2 class="results-title">Assessment Complete!</h2>
            <div class="score-display">
              <div class="score-circle"><span class="score-number">{{ Math.round(assessmentResults.score) }}%</span></div>
              <h3 class="score-category">{{ assessmentResults.category }}</h3>
            </div>
            <div class="recommendations">
              <h4>Recommendations:</h4>
              <ul><li v-for="rec in assessmentResults.recommendations" :key="rec">{{ rec }}</li></ul>
            </div>
            
            <div v-if="assessmentResults.maturity_results && assessmentResults.maturity_results.maturity_plot" class="maturity-plot">
              <h4>Current Maturity vs Target Maturity</h4>
              <div class="maturity-table">
                <div class="maturity-header">
                  <div class="maturity-label">Assessment Section</div>
                  <div class="maturity-scores">
                    <div v-for="i in 5" :key="i" class="score-column">{{ i }}</div>
                  </div>
                </div>
                <div v-for="item in assessmentResults.maturity_results.maturity_plot" :key="item.name" class="maturity-row">
                  <div class="maturity-label">{{ item.name }}</div>
                  <div class="maturity-bars">
                    <div class="maturity-bar current" :style="{ width: `${item.current_maturity * 20}%` }">
                      <span class="bar-label">{{ item.current_maturity.toFixed(1) }}</span>
                    </div>
                    <div class="maturity-bar target" :style="{ width: `${item.target_maturity * 20}%` }">
                      <span class="bar-label">{{ item.target_maturity.toFixed(1) }}</span>
                    </div>
                  </div>
                </div>
                <div class="maturity-legend">
                  <div class="legend-item"><span class="legend-color current"></span> Current Maturity</div>
                  <div class="legend-item"><span class="legend-color target"></span> Target Maturity</div>
                </div>
              </div>
            </div>
            
            <p class="email-confirmation">📧 Detailed results have been sent to {{ userEmail }}</p>
            <button @click="$router.push('/')" class="home-btn">Take Another Assessment</button>
          </div>
        </div>
      </div>
      <div v-else class="error">
        <p>Questionnaire not found.</p>
        <button @click="$router.push('/')" class="home-btn">Back to Home</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuestionnaireStore } from '../stores/questionnaire'

export default {
  name: 'Questionnaire',
  setup() {
    const route = useRoute()
    const questionnaireStore = useQuestionnaireStore()
    const loading = ref(true)
    const questionnaire = ref(null)
    const currentQuestionIndex = ref(0)
    const responses = ref({})
    const targetResponses = ref({})
    const showEmailForm = ref(false)
    const showResults = ref(false)
    const userEmail = ref('')
    const submitting = ref(false)
    const assessmentResults = ref(null)
    const quickFillSelection = ref('3')
    const targetQuickFillSelection = ref('3')

    const currentQuestion = computed(() => questionnaire.value?.questions[currentQuestionIndex.value])
    const progress = computed(() => !questionnaire.value ? 0 : ((currentQuestionIndex.value + 1) / questionnaire.value.questions.length) * 100)

    const loadQuestionnaire = async () => {
      try {
        loading.value = true
        questionnaire.value = await questionnaireStore.fetchQuestionnaire(route.params.id)
      } catch (e) {
        console.error('Error loading questionnaire:', e)
      } finally {
        loading.value = false
      }
    }

    const selectOption = (value) => { responses.value[currentQuestion.value.id] = value }
    const selectTargetOption = (value) => { targetResponses.value[currentQuestion.value.id] = value }
    const nextQuestion = () => { if (currentQuestionIndex.value < questionnaire.value.questions.length - 1) currentQuestionIndex.value++ }
    const previousQuestion = () => { if (currentQuestionIndex.value > 0) currentQuestionIndex.value-- }

    const submitAssessment = async () => {
      try {
        submitting.value = true
        const result = await questionnaireStore.submitAssessment({ 
          questionnaire_id: route.params.id, 
          responses: responses.value, 
          target_responses: targetResponses.value,
          user_email: userEmail.value 
        })
        assessmentResults.value = result.results
        showEmailForm.value = false
        showResults.value = true
      } catch (e) {
        console.error('Error submitting assessment:', e)
        alert('Error submitting assessment. Please try again.')
      } finally {
        submitting.value = false
      }
    }

    const quickFill = () => {
      if (!questionnaire.value) return
      questionnaire.value.questions.forEach(q => {
        // Handle current maturity selection
        let currentVal
        if (quickFillSelection.value === 'random') {
          const opts = Array.isArray(q.options) ? q.options.map(o => o.value) : [1,2,3,4,5]
          currentVal = opts[Math.floor(Math.random() * opts.length)]
        } else {
          currentVal = parseFloat(quickFillSelection.value)
          
          // Find the closest available option value if the exact decimal isn't available
          if (Array.isArray(q.options) && !q.options.some(o => o.value === currentVal)) {
            const availableValues = q.options.map(o => o.value);
            // Default to the nearest integer if decimal isn't available
            currentVal = Math.round(currentVal)
          }
        }
        responses.value[q.id] = currentVal
        
        // Handle target maturity selection
        let targetVal
        if (targetQuickFillSelection.value === 'random') {
          const opts = Array.isArray(q.options) ? q.options.map(o => o.value) : [1,2,3,4,5]
          targetVal = opts[Math.floor(Math.random() * opts.length)]
        } else {
          targetVal = parseFloat(targetQuickFillSelection.value)
          
          // Find the closest available option value if the exact decimal isn't available
          if (Array.isArray(q.options) && !q.options.some(o => o.value === targetVal)) {
            const availableValues = q.options.map(o => o.value);
            // Default to the nearest integer if decimal isn't available
            targetVal = Math.round(targetVal)
          }
        }
        targetResponses.value[q.id] = targetVal
      })
    }

    const quickFillAndGo = () => {
      quickFill()
      if (questionnaire.value) {
        currentQuestionIndex.value = questionnaire.value.questions.length - 1
        showEmailForm.value = true
      }
    }

    onMounted(loadQuestionnaire)
    return { 
      loading, 
      questionnaire, 
      currentQuestion, 
      currentQuestionIndex, 
      responses, 
      targetResponses,
      progress, 
      showEmailForm, 
      showResults, 
      userEmail, 
      submitting, 
      assessmentResults, 
      quickFillSelection,
      targetQuickFillSelection,
      selectOption, 
      selectTargetOption,
      nextQuestion, 
      previousQuestion, 
      submitAssessment, 
      quickFillSelection, 
      quickFill, 
      quickFillAndGo 
    }
  }
}
</script>

<style scoped>
.container { max-width: 800px; margin: 0 auto; padding: 0 2rem; }
.questionnaire-header { text-align: center; margin-bottom: 2rem; }
.questionnaire-title { font-size: 2.5rem; color: #171C8F; margin-bottom: 1rem; }
.questionnaire-description { color: #666; font-size: 1.1rem; margin-bottom: 2rem; }
.progress-bar { width: 100%; height: 8px; background-color: #e9ecef; border-radius: 4px; overflow: hidden; margin-bottom: 1rem; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #171C8F, #0072CE); transition: width 0.3s ease; }
.progress-text { color: #666; font-size: 0.9rem; }
.quick-fill-toolbar { display: flex; align-items: center; gap: 0.5rem; justify-content: flex-end; margin-top: 0.5rem; }
.quick-fill-label { color: #555; }
.quick-fill-select { padding: 0.4rem 0.6rem; border: 2px solid #e9ecef; border-radius: 6px; }
.quick-fill-btn, .quick-fill-submit-btn { background-color: #0072CE; color: white; border: none; padding: 0.5rem 0.9rem; border-radius: 6px; font-weight: 600; cursor: pointer; }
.quick-fill-btn:hover, .quick-fill-submit-btn:hover { background-color: #005ba3; }
.question-card { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 2rem; margin-bottom: 2rem; }
.question-text { font-size: 1.5rem; color: #333; margin-bottom: 2rem; line-height: 1.4; }
.options-container {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  margin-bottom: 2rem;
}

.options-section {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
}

.options-heading {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #333;
  text-align: center;
}

@media (max-width: 768px) {
  .options-container {
    flex-direction: column;
  }
}
.option-item { display: flex; align-items: center; padding: 1rem; margin-bottom: 0.5rem; border: 2px solid #e9ecef; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; }
.option-item:hover { border-color: #0072CE; background-color: #f8f9ff; }
.option-item.selected { border-color: #171C8F; background-color: #f0f1ff; }
.option-radio { width: 20px; height: 20px; border: 2px solid #ddd; border-radius: 50%; margin-right: 1rem; display: flex; align-items: center; justify-content: center; transition: border-color 0.3s ease; }
.option-item.selected .option-radio { border-color: #171C8F; }
.radio-dot { width: 10px; height: 10px; background-color: #171C8F; border-radius: 50%; }
.option-text { font-size: 1rem; color: #333; }
.navigation-buttons { display: flex; justify-content: space-between; gap: 1rem; }
.nav-btn { padding: 0.75rem 1.5rem; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
.prev-btn { background-color: #6c757d; color: white; }
.prev-btn:hover { background-color: #5a6268; }
.next-btn, .submit-btn { background-color: #0072CE; color: white; margin-left: auto; }
.next-btn:hover, .submit-btn:hover { background-color: #005ba3; }
.nav-btn:disabled { background-color: #ccc; cursor: not-allowed; }
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; padding: 2rem; border-radius: 12px; max-width: 400px; width: 90%; text-align: center; }
.modal-content h3 { color: #171C8F; margin-bottom: 1rem; }
.email-input { width: 100%; padding: 0.75rem; border: 2px solid #e9ecef; border-radius: 6px; font-size: 1rem; margin: 1rem 0; }
.email-input:focus { outline: none; border-color: #0072CE; }
.modal-buttons { display: flex; gap: 1rem; justify-content: center; }
.cancel-btn { background-color: #6c757d; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; }
.results-section { text-align: center; }
.results-card { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 2rem; }
.results-title { color: #171C8F; font-size: 2rem; margin-bottom: 2rem; }
.score-display { margin-bottom: 2rem; }
.score-circle { width: 120px; height: 120px; border: 8px solid #0072CE; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
.score-number { font-size: 2rem; font-weight: bold; color: #171C8F; }
.score-category { color: #0072CE; font-size: 1.5rem; }
.recommendations { text-align: left; margin-bottom: 2rem; }
.recommendations h4 { color: #171C8F; margin-bottom: 1rem; }
.recommendations ul { list-style-type: none; padding: 0; }
.recommendations li { padding: 0.5rem 0; border-bottom: 1px solid #e9ecef; }
.recommendations li:before { content: "✓ "; color: #0072CE; font-weight: bold; }
.maturity-plot { margin-bottom: 2rem; text-align: left; }
.maturity-plot h4 { color: #171C8F; margin-bottom: 1rem; }
.maturity-table { border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden; }
.maturity-header { display: flex; background-color: #f8f9fa; padding: 0.75rem; border-bottom: 1px solid #e9ecef; }
.maturity-label { flex: 0 0 30%; font-weight: bold; color: #333; }
.maturity-scores { flex: 0 0 70%; display: flex; justify-content: space-between; }
.score-column { flex: 1; text-align: center; font-weight: bold; color: #666; }
.maturity-row { display: flex; padding: 0.75rem; border-bottom: 1px solid #e9ecef; }
.maturity-row:last-child { border-bottom: none; }
.maturity-bars { flex: 0 0 70%; position: relative; height: 40px; }
.maturity-bar { position: absolute; height: 15px; border-radius: 4px; }
.maturity-bar.current { background-color: #0072CE; top: 0; }
.maturity-bar.target { background-color: #171C8F; top: 20px; }
.bar-label { position: absolute; right: -25px; font-size: 0.8rem; color: #333; }
.maturity-legend { display: flex; justify-content: center; gap: 2rem; padding: 0.75rem; background-color: #f8f9fa; }
.legend-item { display: flex; align-items: center; font-size: 0.9rem; }
.legend-color { display: inline-block; width: 15px; height: 15px; margin-right: 0.5rem; border-radius: 4px; }
.legend-color.current { background-color: #0072CE; }
.legend-color.target { background-color: #171C8F; }
.email-confirmation { background-color: #d4edda; color: #155724; padding: 1rem; border-radius: 6px; margin-bottom: 2rem; }
.home-btn { background-color: #171C8F; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; }
.home-btn:hover { background-color: #0f1570; }
.loading, .error { text-align: center; padding: 2rem; color: #666; }
@media (max-width: 768px) { .container { padding: 0 1rem; } .questionnaire-title { font-size: 2rem; } .question-text { font-size: 1.3rem; } .navigation-buttons { flex-direction: column; } .nav-btn { width: 100%; } }
</style>
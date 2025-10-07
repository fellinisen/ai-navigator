import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Questionnaire from '../views/Questionnaire.vue'
import AdminResponses from '../views/AdminResponses.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/questionnaire/:id', name: 'Questionnaire', component: Questionnaire, props: true },
  { path: '/admin', name: 'AdminResponses', component: AdminResponses }
]

const router = createRouter({ history: createWebHistory(), routes })
export default router
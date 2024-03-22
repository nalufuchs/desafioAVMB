// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import TelaInicialView from '@/views/TelaInicialView.vue'
import EnvelopesView from '@/views/EnvelopesView.vue'
import CriarEnvelopeView from '@/views/CriarEnvelopeView.vue'
import ConsultarStatusEnvelopeView from '@/views/ConsultarStatusEnvelopeView.vue'

const routes = [
  { path: '/', component: TelaInicialView },
  { path: '/criar-envelope', component: CriarEnvelopeView },
  { path: '/consultar-envelopes', component: EnvelopesView },
  { path: '/consultar-status-envelope/:idEnvelope', component: ConsultarStatusEnvelopeView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

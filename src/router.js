import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import Login from './views/Login.vue'
import ABMEvento from './views/ABMEvento.vue'
import CompraView from './views/CompraView.vue'
import Gerente from './views/Gerente.vue'
import ListaEventos from './views/ListaEventos.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/organizador/crear', name: 'OrganizadorCrear', component: ABMEvento },
  { path: '/usuario', name: 'UsuarioHome', component: CompraView },
  { path: '/gerente', name: 'Gerente', component: Gerente },
  { path: '/eventos', name: 'ListaEventos', component: ListaEventos }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
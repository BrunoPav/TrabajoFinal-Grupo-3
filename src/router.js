import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import Login from './views/Login.vue'
import ABMEvento from './views/ABMEvento.vue'
import CompraView from './views/CompraView.vue'
import Gerente from './views/Gerente.vue'
import Usuarios from './views/ListaUsuarios.vue'
import DetalleEvento from './views/detalleEvento.vue';


const routes = [
  { path: '/', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/organizador/crear', name: 'OrganizadorCrear', component: ABMEvento },
  { path: '/usuario', name: 'UsuarioHome', component: CompraView },
  { path: '/gerente', name: 'Gerente', component: Gerente },
  { path: '/listausuario', name: 'Usuarios', component: Usuarios },
  { path: '/gerente/eventos/:id', name: 'DetalleEventoGerente',component: DetalleEvento }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
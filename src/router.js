import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import About from './components/About.vue'
import TarjetaEvento from './components/TarjetaEvento.vue'
import Login from './views/Login.vue'

import ABMEvento from './views/ABMEvento.vue'
import CompraView from './views/CompraView.vue'
import { getCurrentScope } from 'vue'
import Gerente from './views/Gerente.vue'
import ListaEventos from './views/ListaEventos.vue'
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/login', name: 'Login', component: Login },

  { path: '/organizador/crear', name: 'OrganizadorCrear', component: ABMEvento },
  { path: '/usuario', name: 'UsuarioHome', component: CompraView },
  { path: '/gerente', name: 'Gerente', component: Gerente },
  { path: '/eventos', name: 'ListaEventos', component: ListaEventos },
  {
    path: '/evento-demo',
    name: 'EventoDemo',
    component: TarjetaEvento,
    props: {
      id: '1',
      nombre: 'Recital Soda Stereo',
      lugar: 'Teatro Colón',
      dia: 'Sábado',
      horario: '20:00',
      modalidad: 'Presencial',
      precio: 15000
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})



export default router
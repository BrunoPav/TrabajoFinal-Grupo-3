import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import Login from './views/Login.vue'
import ABMEvento from './views/ABMEvento.vue'
import CompraView from './views/CompraView.vue'
import Gerente from './views/Gerente.vue'
import Usuarios from './views/ListaUsuarios.vue'
import DetalleEvento from './views/detalleEvento.vue'
import MisTickets from './views/MisTickets.vue'
import { useUsuarioStore } from './stores/usuarioStore'

const routes = [
  { 
    path: '/', 
    component: Home 
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: Login 
  },
  { 
    path: '/organizador/crear', 
    name: 'OrganizadorCrear', 
    component: ABMEvento,
    meta: { requiresAuth: true, roles: ['organizador', 'gerente'] }
  },
  { 
    path: '/usuario', 
    name: 'UsuarioHome', 
    component: CompraView,
    meta: { requiresAuth: true, roles: ['cliente'] }
  },
  { 
    path: '/gerente', 
    name: 'Gerente', 
    component: Gerente,
    meta: { requiresAuth: true, roles: ['gerente'] }
  },
  { 
    path: '/listausuario', 
    name: 'Usuarios', 
    component: Usuarios,
    meta: { requiresAuth: true, roles: ['gerente'] }
  },
  { 
    path: '/gerente/eventos/:id', 
    name: 'DetalleEventoGerente',
    component: DetalleEvento,
    meta: { requiresAuth: true, roles: ['gerente'] }
  },
  { 
    path: '/mis-tickets', 
    name: 'MisTickets',
    component: MisTickets,
    meta: { requiresAuth: true, roles: ['cliente'] }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


router.beforeEach(async (to, from, next) => {
  const usuarioStore = useUsuarioStore()
  

  if (!usuarioStore.usuarioActual && localStorage.getItem('usuarioId')) {
    await usuarioStore.restaurarSesion()
  }
  
 
  if (to.meta.requiresAuth) {
    if (!usuarioStore.estaLogueado) {

      next({ 
        path: '/login', 
        query: { redirect: to.fullPath } 
      })
      return
    }


    if (to.meta.roles && to.meta.roles.length > 0) {
      const tienePermiso = to.meta.roles.includes(usuarioStore.usuarioActual.rol)
      
      if (!tienePermiso) {

        next('/')
        return
      }
    }
  }

  if (to.path === '/login' && usuarioStore.estaLogueado) {
    next('/')
    return
  }
  
  next()
})

export default router
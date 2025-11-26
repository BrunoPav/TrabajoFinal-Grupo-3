<script setup>
import { useRouter } from 'vue-router'
import { useEventoStore } from '../stores/eventoStore.js'
import { useRolStore } from '../stores/rolStore.js'
import { useUsuarioStore } from '../stores/usuarioStore.js'
import { onMounted, computed, ref } from 'vue'

const eventoStore = useEventoStore()
const rolStore = useRolStore()
const usuarioStore = useUsuarioStore()
const router = useRouter()

onMounted(async () => {

  await usuarioStore.restaurarSesion()

  if (usuarioStore.estaLogueado) {
    const rolFormateado = `${usuarioStore.usuarioActual.rol}@a`
    rolStore.setRol(rolFormateado)
  }

  try { 
    await eventoStore.cargarEventos() 
  } catch (e) { 
    console.error(e) 
  }
})

const eventosGuardados = computed(() => eventoStore.eventos)

const search = ref('')
const minPrecio = ref('')
const maxPrecio = ref('')
const modalidad = ref('')
const searchActivo = ref('')
const minPrecioActivo = ref('')
const maxPrecioActivo = ref('')
const modalidadActiva = ref('')
const normaliza = (v) => String(v || '').toLowerCase()

const eventosFiltrados = computed(() => {
  return eventosGuardados.value.filter(e => {
    if (searchActivo.value && searchActivo.value.trim() !== '') {
      if (!normaliza(e.nombre).includes(normaliza(searchActivo.value.trim()))) {
        return false
      }
    }
    
    const precio = Number(e.precio || 0)
    if (minPrecioActivo.value !== '' && minPrecioActivo.value !== null) {
      if (precio < Number(minPrecioActivo.value)) return false
    }
    
    if (maxPrecioActivo.value !== '' && maxPrecioActivo.value !== null) {
      if (precio > Number(maxPrecioActivo.value)) return false
    }

    if (modalidadActiva.value && modalidadActiva.value.trim() !== '') {
      if (normaliza(e.modalidad) !== normaliza(modalidadActiva.value)) {
        return false
      }
    }
    
    return true
  })
})

const buscar = () => {
  searchActivo.value = search.value
  minPrecioActivo.value = minPrecio.value
  maxPrecioActivo.value = maxPrecio.value
  modalidadActiva.value = modalidad.value
}

const limpiarFiltros = () => {
  search.value = ''
  minPrecio.value = ''
  maxPrecio.value = ''
  modalidad.value = ''
  searchActivo.value = ''
  minPrecioActivo.value = ''
  maxPrecioActivo.value = ''
  modalidadActiva.value = ''
}

const goABM = (event = null) => {
  if (event) {
    router.push({ path: '/organizador/crear', query: { id: event.id } })
  } else {
    router.push('/organizador/crear')
  }
}

const goComprar = (event) => {
  if (!usuarioStore.estaLogueado) {
    router.push({ 
      path: '/login', 
      query: { 
        redirect: `/usuario?id=${event.id}` 
      } 
    })
    return
  }
  router.push({ name: 'UsuarioHome', query: { id: event.id } })
}

const logout = () => {
  usuarioStore.logout()
  rolStore.setRol('cliente@a')
  router.push('/login')
}
</script>

<template>
  <div class="home-view">
    <nav class="app-header">
      <div class="nav-container">
        <div class="nav-left">
          <h1 class="logo">TicketOrt</h1>
        </div>
        
        <div class="nav-center">
          <router-link 
            v-if="usuarioStore.estaLogueado && rolStore.rol === 'cliente@a'" 
            to="/mis-tickets" 
            class="btn-nav">
             Mis Tickets
          </router-link>
          
          <router-link 
            v-if="rolStore.rol === 'gerente@a'" 
            to="/gerente" 
            class="btn-nav">
            Panel Gerencial
          </router-link>
        </div>
        
        <div class="nav-right">
          <router-link 
            v-if="!usuarioStore.estaLogueado" 
            to="/login" 
            class="btn-login-nav">
            Iniciar sesión
          </router-link>
      
          <div v-else class="usuario-logueado">
            <span class="nombre-usuario">{{ usuarioStore.usuarioActual.nombre }}</span>
            <button @click="logout" class="btn-logout">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="filters-bar">
      <div class="filters-group">
        <input class="f-input" type="text" v-model="search" placeholder="Buscar por nombre" />
        <input class="f-input" type="number" min="0" v-model.number="minPrecio" placeholder="Precio mín" />
        <input class="f-input" type="number" min="0" v-model.number="maxPrecio" placeholder="Precio máx" />
        <select class="f-input" v-model="modalidad">
          <option value="">Todas</option>
          <option value="presencial">Presencial</option>
          <option value="virtual">Virtual</option>
        </select>
        <button class="btn-buscar" @click="buscar">Buscar</button>
        <button class="btn-limpiar" @click="limpiarFiltros">Limpiar</button>
      </div>
    </div>
    
    <div class="estado-vacio-panel"
      v-if="(eventosGuardados == null || eventosGuardados.length === 0) && (rolStore.rol === 'organizador@a' || rolStore.rol === 'gerente@a')">
      <div class="estado-vacio-contenido">
        <span class="icono-busqueda"></span>
        <p class="mensaje-vacio">No tienes eventos creados</p>
        <button class="btn-crear-evento" @click="goABM">CREAR EVENTO</button>
      </div>
    </div>

    <section class="grid-eventos" v-else>
      <div class="new-card-placeholder" v-if="rolStore.rol === 'organizador@a' || rolStore.rol === 'gerente@a'">
        <button class="btn-crear-evento-pequeño" @click="goABM">Nuevo Evento</button>
      </div>

      <article class="evento-card" v-for="event in eventosFiltrados" :key="event.id">
        <div class="card-image">
          <span v-if="!event.imagen">Imagen no disponible</span>
          <img v-else :src="event.imagen" alt="Imagen del evento" class="event-img">
        </div>
        
        <div class="card-footer">
          <div class="event-info">
            <p class="event-location">{{ event.lugar }}</p>
            <h3 class="event-title">{{ event.nombre }}</h3>
          </div>
          <div class="date-time-info">
            <div class="date-section">
              <span class="day">{{ event.dia.split('-')[0] }}</span>
              <span class="month">{{ 
                new Date(event.dia.split('-').reverse().join('-')).toLocaleDateString('es-AR', { month: 'short' })
              }}</span>
              <span class="year">{{ event.dia.split('-')[2] }}</span>
            </div>
            <div class="divider"></div>
            <div class="time-section">
              <span class="time">{{ event.horario.split(':')[0] }}</span>
              <span class="time-unit">{{ event.horario.split(':')[1] }}</span>
              <span class="time-label">hrs</span>
            </div>
            <div class="divider"></div>
            <div class="modalidad-section">
              <span class="modalidad-label">modalidad</span>
              <span class="modalidad-text">{{ event.modalidad || 'N/A' }}</span>
  
            </div>
          </div>
        </div>
        
        <div class="card-actions">
          <button 
            class="btn-compra" 
            @click="goComprar(event)"
            v-if="rolStore.rol === 'cliente@a' || !usuarioStore.estaLogueado">
            {{ usuarioStore.estaLogueado ? 'COMPRAR' : 'COMPRAR' }}
          </button>
          
          <button 
            class="btn-gestion" 
            @click="goABM(event)"
            v-if="rolStore.rol === 'organizador@a'">
            EDITAR
          </button>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.app-header {
    background-color: #3b82f6;
    color: white;
    padding: 0.75rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.nav-left { display:flex; align-items:center; }
.nav-center { display:flex; gap:12px; }
.nav-right { display:flex; align-items:center; }

.home-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 48px;
}


.estado-vacio-panel { height: 60vh; }
.estado-vacio-contenido { padding:40px; }

.grid-eventos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 8px;
}
.evento-card { transition: box-shadow .25s ease, transform .25s ease; }
.evento-card:hover { transform: translateY(-4px); box-shadow: 0 6px 18px rgba(0,0,0,.12); }
.evento-imagen { height: 160px; }
.card-title { font-size:1.2rem; }
.event-meta { font-size:.9rem; }
.btn-compra, .btn-gestion { margin-top:auto; }

.new-card-placeholder { min-height:160px; }

.btn-nav {
    background: #bfdbfe;
    color: #1f2937;
    text-decoration: none;
    padding: 8px 15px;
    border-radius: 6px;
    font-weight: 600;
    transition: background-color 0.2s;
}

.btn-nav:hover {
    background: #93c5fd;
}

.btn-login-nav {
    background-color: #10b981;
    color: white;
    text-decoration: none;
    padding: 8px 15px;
    border-radius: 6px;
    font-weight: bold;
    transition: background-color 0.2s;
}

.btn-login-nav:hover {
    background-color: #059669;
}

.estado-vacio-panel {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh;
    max-width: 1200px;
    margin: 30px auto;
}

.estado-vacio-contenido {
    text-align: center;
    padding: 50px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    max-width: 400px;
}

.icono-busqueda {
    font-size: 3rem;
    color: #9ca3af;
    display: block;
    margin-bottom: 10px;
}

.mensaje-vacio {
    font-size: 1.5rem;
    color: #6b7280;
    margin-bottom: 25px;
    font-weight: 500;
}

.btn-crear-evento {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-crear-evento:hover {
    background-color: #2563eb;
}

.home-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px 30px 20px;
    min-width: 1024px;
}

.grid-eventos {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.evento-card {
    background: #ffffff;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
}

.evento-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-image {
    height: 250px;
    background: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    font-size: 0.9rem;
    overflow: hidden;
}

.event-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card-footer {
    padding: 20px;
    background: #ffffff;
}

.event-info {
    margin-bottom: 15px;
}

.event-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.event-location {
    font-size: 0.85rem;
    color: #7f8c8d;
    margin: 0 0 8px 0;
    font-weight: 500;
}

.modalidad-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.modalidad-badge.presencial {
    background: #dbeafe;
    color: #1e40af;
}

.modalidad-badge.virtual {
    background: #dcfce7;
    color: #166534;
}

.event-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c3e50;
    margin: 0;
    line-height: 1.2;
}

.date-time-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.date-section {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.day {
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    line-height: 1;
}

.month {
    font-size: 0.8rem;
    color: #7f8c8d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
}

.year {
    font-size: 0.9rem;
    color: #7f8c8d;
}

.divider {
    width: 1px;
    height: 40px;
    background: #e5e7eb;
}

.time-section {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.time {
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    line-height: 1;
}

.time-unit {
    font-size: 1.2rem;
    font-weight: bold;
    color: #2c3e50;
    line-height: 1;
    margin-left: -5px;
}

.time-label {
    font-size: 0.8rem;
    color: #7f8c8d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
}

.modalidad-section {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.modalidad-text {
    font-size: 1.2rem;
    font-weight: bold;
    color: #2c3e50;
    line-height: 1;
    text-transform: capitalize;
}

.modalidad-label {
    font-size: 0.8rem;
    color: #7f8c8d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
}

.card-actions {
    padding: 0 20px 20px;
}

.btn-compra {
    width: 100%;
    background: #10b981;
    border: none;
    color: white;
    font-weight: bold;
    padding: 12px 0;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.btn-compra:hover {
    background: #059669;
}

.btn-gestion {
    width: 100%;
    background: #3b82f6;
    border: none;
    color: white;
    font-weight: bold;
    padding: 12px 0;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.btn-gestion:hover {
    background: #2563eb;
}

.new-card-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eef2ff;
    border: 2px dashed #93c5fd;
    border-radius: 12px;
    min-height: 250px;
}

.btn-crear-evento-pequeño {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
}

.filters-bar { 
  background:#ffffff; 
  border:1px solid #e5e7eb; 
  border-radius:12px; 
  box-shadow:0 6px 16px rgba(0,0,0,.06); 
  padding:12px 16px; 
  margin:-16px 0 16px; 
}

.filters-group { 
  display:flex; 
  gap:10px; 
  flex-wrap:wrap; 
  align-items:center; 
}

.f-input { 
  padding:8px 10px; 
  border:1px solid #d1d5db; 
  border-radius:8px; 
  min-width:150px; 
}

.btn-buscar { 
  background:#10b981; 
  color:#fff; 
  border:none; 
  padding:8px 12px; 
  border-radius:8px; 
  font-weight:700; 
  cursor:pointer; 
}

.btn-buscar:hover {
  background:#059669;
}

.btn-limpiar { 
  background:#ef4444; 
  color:#fff; 
  border:none; 
  padding:8px 12px; 
  border-radius:8px; 
  font-weight:700; 
  cursor:pointer; 
}

.btn-limpiar:hover {
  background:#dc2626;
}

.usuario-logueado {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nombre-usuario {
  color: white;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-logout {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-logout:hover {
  background: #dc2626;
}

@media (max-width: 600px) {
  .nav-container {
    grid-template-columns: 1fr;
    justify-content: center;
  }
  .nav-center {
    order: 3;
    margin-top: 10px;
  }
  .nav-right {
    order: 2;
    justify-content: center;
  }
}

@media (max-width: 900px) {
  .nav-container { 
    flex-wrap: wrap; 
  }
  .nav-center { 
    order:3; 
    width:100%; 
    justify-content:center; 
    margin-top:8px; 
  }
}
</style>
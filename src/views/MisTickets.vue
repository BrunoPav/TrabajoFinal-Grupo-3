<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsuarioStore } from '../stores/usuarioStore'
import { useEventoStore } from '../stores/eventoStore'

const router = useRouter()
const usuarioStore = useUsuarioStore()
const eventoStore = useEventoStore()

const tickets = ref([])
const cargando = ref(true)
const error = ref('')

onMounted(async () => {

  await usuarioStore.restaurarSesion()
  
  if (!usuarioStore.estaLogueado) {
    router.push('/login')
    return
  }
  
  if (!eventoStore.eventos.length) {
    try {
      await eventoStore.cargarEventos()
    } catch (err) {
      console.error('Error al cargar eventos:', err)
    }
  }
  

  try {
    const misTickets = await usuarioStore.obtenerMisTickets()
    

    tickets.value = misTickets.map(ticket => {
      const evento = eventoStore.eventos.find(e => String(e.id) === String(ticket.eventoId))
      return {
        ...ticket,
        evento: evento || { nombre: 'Evento no disponible', lugar: 'N/A', dia: 'N/A' }
      }
    })
  } catch (err) {
    error.value = 'Error al cargar tus tickets'
    console.error(err)
  } finally {
    cargando.value = false
  }
})

/*const cargarTickets = async () => {
  cargando.value = true
  error.value = ''
  try {
    const misTickets = await usuarioStore.obtenerMisTickets()
    tickets.value = misTickets.map(ticket => {
      const evento = eventoStore.eventos.find(e => String(e.id) === String(ticket.eventoId))
      return {
        ...ticket,
        evento: evento || { nombre: 'Evento no disponible', lugar: 'N/A', dia: 'N/A' }
      }
    })
  } catch (err) {
    error.value = 'Error al cargar tus tickets'
    console.error(err)
  } finally {
    cargando.value = false
  }
}*/

const goHome = () => router.push('/')
const logout = () => {
  usuarioStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="tickets-view">
    <nav class="app-header">
      <div class="nav-container">
        <div class="nav-left">
          <router-link to="/" class="logo">TicketOrt</router-link>
        </div>
        <div class="nav-center">
          <h2 class="page-title">Mis Tickets</h2>
        </div>
        <div class="nav-right">
          <div class="usuario-logueado">
            <span class="nombre-usuario">{{ usuarioStore.usuarioActual?.nombre }}</span>
            <button @click="logout" class="btn-logout">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="tickets-container">
      <div v-if="cargando" class="estado-carga">
        <div class="spinner"></div>
        <p>Cargando tus tickets...</p>
      </div>

      <div v-else-if="error" class="estado-error">
        <span class="error-icon">⚠️</span>
        <h3>Error al cargar tickets</h3>
        <p>{{ error }}</p>
        <button @click="cargarTickets" class="btn-reintentar">Reintentar</button>
      </div>

      <div v-else-if="tickets.length === 0" class="estado-vacio">
        <h3>No tienes tickets aún</h3>
        <p>Cuando compres entradas aparecerán aquí.</p>
        <router-link to="/" class="btn-explorar">Explorar eventos</router-link>
      </div>

      <div v-else class="tickets-content">
        <div class="tickets-header">
          <h3>Mis entradas ({{ tickets.length }})</h3>
        </div>

        <div class="tickets-grid">
          <div v-for="ticket in tickets" :key="ticket.id" class="ticket-card">
            <div class="ticket-header">
              <div class="ticket-evento">
                <h4>{{ ticket.evento.nombre }}</h4>
                <span class="ticket-id">#{{ ticket.id }}</span>
              </div>
            </div>
            
            <div class="ticket-details">
              <div class="detail-item">
                <span class="label">Cantidad:</span>
                <span class="value">{{ ticket.cantidad }} entrada{{ ticket.cantidad > 1 ? 's' : '' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Total pagado:</span>
                <span class="value">$ {{ Number(ticket.montoTotal || 0).toLocaleString('es-AR') }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Fecha de compra:</span>
                <span class="value">{{ new Date(ticket.fecha).toLocaleDateString('es-AR') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tickets-view {
  min-height: 100vh;
  background: #f8fafc;
}

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

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.page-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.usuario-logueado {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nombre-usuario {
  color: white;
  font-weight: 600;
}

.btn-logout {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-logout:hover {
  background: #dc2626;
}

.tickets-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 48px;
  min-width: 800px;
}

.estado-carga, .estado-error, .estado-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin: 20px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon, .empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.estado-error h3, .estado-vacio h3 {
  margin: 0 0 8px;
  color: #1f2937;
  font-size: 1.5rem;
}

.estado-error p, .estado-vacio p {
  margin: 0 0 24px;
  color: #6b7280;
}

.btn-reintentar, .btn-explorar {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-reintentar:hover, .btn-explorar:hover {
  background: #2563eb;
}

.tickets-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.tickets-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
}

.tickets-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
}



.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  padding: 24px;
}

.ticket-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.ticket-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.ticket-evento h4 {
  margin: 0 0 4px;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
}

.ticket-id {
  font-size: 0.85rem;
  color: #6b7280;
  font-family: monospace;
}

.ticket-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item .label {
  color: #6b7280;
  font-size: 0.9rem;
}

.detail-item .value {
  color: #1f2937;
  font-weight: 500;
}



@media (max-width: 768px) {
  .nav-container {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .page-title {
    order: 3;
    width: 100%;
    text-align: center;
    margin-top: 8px;
  }
  
  .tickets-container {
    padding: 0 16px 32px;
  }
  
  .tickets-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
  

}
</style>
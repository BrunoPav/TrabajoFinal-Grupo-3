<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsuarioStore } from '../stores/usuarioStore'
import { useEventoStore } from '../stores/eventoStore'

const route = useRoute()
const router = useRouter()
const usuarioStore = useUsuarioStore()
const eventoStore = useEventoStore()

const usuario = ref(null)
const ticketsUsuario = ref([])
const cargando = ref(true)

const usuarioId = route.query.id

// Computed para obtener detalles de eventos
const ticketsConDetalles = computed(() => {
  return ticketsUsuario.value.map(ticket => {
    const evento = eventoStore.eventos.find(e => String(e.id) === String(ticket.eventoId))
    return {
      ...ticket,
      eventoNombre: evento?.nombre || 'Evento no encontrado',
      eventoLugar: evento?.lugar || 'N/A',
      eventoDia: evento?.dia || 'N/A',
      eventoHorario: evento?.horario || 'N/A'
    }
  })
})

const totalGastado = computed(() => {
  return ticketsUsuario.value.reduce((total, ticket) => {
    return total + (parseFloat(ticket.montoTotal) || 0)
  }, 0)
})

const totalTickets = computed(() => {
  return ticketsUsuario.value.reduce((total, ticket) => {
    return total + (parseInt(ticket.cantidad) || 0)
  }, 0)
})

const volverALista = () => {
  router.push('/listausuario')
}

onMounted(async () => {
  try {
    // Cargar datos necesarios
    if (eventoStore.eventos.length === 0) {
      await eventoStore.cargarEventos()
    }
    
    // Buscar el usuario
    await usuarioStore.cargarUsuarios()
    usuario.value = usuarioStore.usuarios.find(u => String(u.id) === String(usuarioId))
    
    if (!usuario.value) {
      console.error('Usuario no encontrado')
      router.push('/listausuario')
      return
    }
    
    // Obtener tickets del usuario
    ticketsUsuario.value = await usuarioStore.obtenerTicketsPorUsuario(usuarioId)
    
  } catch (error) {
    console.error('Error cargando datos del usuario:', error)
  } finally {
    cargando.value = false
  }
})
</script>

<template>
  <div class="usuario-detalle-view">
    <nav class="app-header">
      <div class="nav-container">
        <div class="nav-left">
          <button @click="volverALista" class="btn-volver">← Volver a Lista</button>
        </div>
        <div class="nav-center">
          <h1>Detalle de Usuario</h1>
        </div>
        <div class="perfil">
          <span>Hola, Gerente</span>
          <div class="avatar"></div>
        </div>
      </div>
    </nav>

    <div class="contenedor-principal">
      <!-- Loading -->
      <div v-if="cargando" class="estado-carga">
        <p>Cargando información del usuario...</p>
      </div>

      <!-- Error: Usuario no encontrado -->
      <div v-else-if="!usuario" class="estado-error">
        <p>Usuario no encontrado</p>
      </div>

      <!-- Información del usuario -->
      <div v-else>
        <!-- Header con info del usuario -->
        <div class="usuario-header">
          <div class="usuario-info">
            <h2 class="usuario-nombre">{{ usuario.nombre || 'Sin nombre' }}</h2>
            <p class="usuario-email">{{ usuario.email }}</p>
            <span :class="['tag-rol-grande', usuario.rol]">
              {{ usuario.rol || 'cliente' }}
            </span>
          </div>
          
          <div class="usuario-stats">
            <div class="stat-item">
              <span class="stat-numero">{{ totalTickets }}</span>
              <span class="stat-label">Tickets Comprados</span>
            </div>
            <div class="stat-item">
              <span class="stat-numero">${{ totalGastado.toFixed(2) }}</span>
              <span class="stat-label">Total Gastado</span>
            </div>
          </div>
        </div>

        <!-- Lista de tickets -->
        <div class="tickets-section">
          <h3 class="section-titulo">Historial de Tickets</h3>
          
          <div v-if="ticketsConDetalles.length === 0" class="estado-vacio">
            <p>Este usuario no ha comprado tickets aún.</p>
          </div>

          <div v-else class="tickets-grid">
            <div 
              v-for="ticket in ticketsConDetalles" 
              :key="ticket.id" 
              class="ticket-card"
            >
              <div class="ticket-header">
                <h4 class="evento-nombre">{{ ticket.eventoNombre }}</h4>
                <span class="ticket-fecha">{{ new Date(ticket.fecha).toLocaleDateString('es-AR') }}</span>
              </div>
              
              <div class="ticket-details">
                <div class="detail-row">
                  <span class="detail-label">Lugar:</span>
                  <span class="detail-value">{{ ticket.eventoLugar }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Fecha evento:</span>
                  <span class="detail-value">{{ ticket.eventoDia }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Horario:</span>
                  <span class="detail-value">{{ ticket.eventoHorario }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Cantidad:</span>
                  <span class="detail-value">{{ ticket.cantidad }} tickets</span>
                </div>
                <div class="detail-row total">
                  <span class="detail-label">Total pagado:</span>
                  <span class="detail-value">${{ parseFloat(ticket.montoTotal).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.usuario-detalle-view {
  font-family: 'Inter', sans-serif;
  background-color: #f4f7fa;
  min-height: 100vh;
}

.app-header {
  background-color: #3b82f6;
  color: white;
  padding: 10px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
}

.btn-volver {
  background: #bfdbfe;
  color: #1e40af;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}

.btn-volver:hover {
  background: #dbeafe;
}

.nav-center h1 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
}

.perfil {
  display: flex;
  align-items: center;
  gap: 10px;
}

.perfil .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #bfdbfe;
  border: 2px solid white;
}

.contenedor-principal {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 30px;
}

.estado-carga, .estado-error {
  text-align: center;
  padding: 50px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.usuario-header {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.usuario-nombre {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.usuario-email {
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0 0 15px 0;
}

.tag-rol-grande {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;
}

.tag-rol-grande.cliente {
  background-color: #dbeafe;
  color: #1e40af;
}

.tag-rol-grande.organizador {
  background-color: #fed7d7;
  color: #c53030;
}

.tag-rol-grande.gerente {
  background-color: #d1fae5;
  color: #065f46;
}

.usuario-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
}

.stat-numero {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.9rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tickets-section {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.section-titulo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 10px;
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.ticket-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9fafb;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.evento-nombre {
  font-size: 1.1rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.ticket-fecha {
  font-size: 0.9rem;
  color: #6b7280;
}

.ticket-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
}

.detail-row.total {
  border-top: 1px solid #e5e7eb;
  padding-top: 8px;
  margin-top: 8px;
  font-weight: bold;
}

.detail-label {
  color: #6b7280;
  font-size: 0.9rem;
}

.detail-value {
  color: #1f2937;
  font-weight: 500;
}

.estado-vacio {
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-style: italic;
}

@media (max-width: 768px) {
  .usuario-header {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .usuario-stats {
    justify-content: center;
  }
  
  .tickets-grid {
    grid-template-columns: 1fr;
  }
}
</style>

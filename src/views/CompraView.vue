<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventoStore } from '../stores/eventoStore.js'
import { useUsuarioStore } from '../stores/usuarioStore.js'

const route = useRoute()
const router = useRouter()
const eventoStore = useEventoStore()
const usuarioStore = useUsuarioStore()

const cantidad = ref(1)
const mensaje = ref('')
const compraExitosa = ref(false)
const ticketConfirmado = ref(null)

onMounted(async () => {
  await usuarioStore.restaurarSesion()
  if (!usuarioStore.estaLogueado) {
    router.push({ 
      path: '/login', 
      query: { redirect: route.fullPath } 
    })
    return
  }
  if (!eventoStore.eventos.length) {
    await eventoStore.cargarEventos()
  }
})

const eventoSeleccionado = computed(() => {
  const id = route.query.id
  return eventoStore.eventos.find(e => String(e.id) === String(id)) || null
})

const total = computed(() => {
  const precio = Number(eventoSeleccionado.value?.precio || 0)
  return precio * cantidad.value
})

const confirmarCompra = async () => {
  if (!eventoSeleccionado.value) { 
    mensaje.value = 'Evento no disponible.'
    return 
  }
  if (cantidad.value < 1) { 
    mensaje.value = 'Cantidad mínima: 1.'
    return 
  }
  if (!usuarioStore.estaLogueado) {
    mensaje.value = 'Debes iniciar sesión para comprar'
    router.push('/login')
    return
  }
  mensaje.value = 'Procesando compra...'
  try {
    const ticketGuardado = await usuarioStore.comprarTicket(
      eventoSeleccionado.value.id,
      cantidad.value,
      total.value
    )
    ticketConfirmado.value = {
      ...ticketGuardado,
      eventoDetalles: eventoSeleccionado.value,
      usuario: usuarioStore.usuarioActual.nombre
    }
    compraExitosa.value = true
    mensaje.value = ''
  } catch (error) {
    console.error('Error al registrar la compra:', error)
    mensaje.value = error.message || 'Error al procesar la compra'
  }
}

const seguirComprando = () => {
  router.push({ path: '/' })
}

const volverAlHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="compra-page">
    <div v-if="!eventoSeleccionado" class="error-container">
      <h2>Evento no encontrado</h2>
      <p>No se encontró el evento solicitado.</p>
      <button @click="volverAlHome" class="btn-volver">Volver al inicio</button>
    </div>
    <div v-else-if="compraExitosa && ticketConfirmado" class="compra-exitosa-container">
      <div class="success-icon">✓</div>
      <h1 class="success-title">¡Compra realizada con éxito!</h1>
      <p class="success-subtitle">Gracias {{ ticketConfirmado.usuario }}</p>
      <div class="ticket-resumen">
        <h3>Detalles de tu compra</h3>
        <div class="ticket-info">
          <p><strong>Número de orden:</strong> #{{ ticketConfirmado.id }}</p>
          <p><strong>Evento:</strong> {{ ticketConfirmado.eventoDetalles.nombre }}</p>
          <p><strong>Fecha:</strong> {{ ticketConfirmado.eventoDetalles.dia }}</p>
          <p><strong>Lugar:</strong> {{ ticketConfirmado.eventoDetalles.lugar }}</p>
          <p><strong>Cantidad:</strong> {{ ticketConfirmado.cantidad }} entrada(s)</p>
          <p class="total-pagado"><strong>Total pagado:</strong> ${{ ticketConfirmado.montoTotal.toLocaleString('es-AR') }}</p>
        </div>
      </div>
      <div class="success-actions">
        <button @click="router.push('/mis-tickets')" class="btn-primary">Ver Mis Tickets</button>
        <button @click="seguirComprando" class="btn-secondary">Seguir Comprando</button>
      </div>
    </div>
    <div v-else class="compra-container">
      <div class="event-header">
        <h1 class="event-title">{{ eventoSeleccionado.nombre }}</h1>
        <p class="event-date">{{ eventoSeleccionado.dia }} - {{ eventoSeleccionado.horario }}</p>
      </div>
      <div class="event-info-section">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Lugar:</span>
            <span class="info-value">{{ eventoSeleccionado.lugar }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Modalidad:</span>
            <span class="info-value">
              <span :class="['badge-modalidad', eventoSeleccionado.modalidad.toLowerCase()]">
                {{ eventoSeleccionado.modalidad }}
              </span>
            </span>
          </div>
        </div>
        <div v-if="eventoSeleccionado.descripcion" class="event-description">
          <p><strong>Descripción:</strong></p>
          <p>{{ eventoSeleccionado.descripcion }}</p>
        </div>
      </div>
      <div class="compra-table-section">
        <table class="compra-table">
          <thead>
            <tr>
              <th>Tipo de Ticket</th>
              <th>Valor</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="ticket-type">
                  <strong>{{ eventoSeleccionado.nombre }}</strong>
                </div>
              </td>
              <td class="valor-cell">
                <span class="precio-badge">$ {{ eventoSeleccionado.precio.toLocaleString('es-AR') }}</span>
              </td>
              <td class="cantidad-cell">
                <div class="cantidad-controls">
                  <button type="button" class="btn-cantidad" @click="cantidad > 1 && cantidad--">-</button>
                  <span class="cantidad-display">{{ cantidad }}</span>
                  <button type="button" class="btn-cantidad" @click="cantidad++">+</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="compra-footer">
          <div class="total-section">
            <span class="total-label">Total a pagar:</span>
            <span class="total-amount">$ {{ total.toLocaleString('es-AR') }}</span>
          </div>
          <button 
            @click="confirmarCompra" 
            class="btn-adquirir">
            COMPRAR
          </button>
        </div>
        <div v-if="mensaje" class="mensaje-alert" :class="{ 'error': mensaje.includes('Error') }">
          {{ mensaje }}
        </div>
      </div>
      <div class="comprador-info">
        <p><strong>Comprando como:</strong> {{ usuarioStore.usuarioActual.nombre }}</p>
        <p class="email-info">{{ usuarioStore.usuarioActual.email }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.compra-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.loading-container,
.error-container {
  max-width: 600px;
  margin: 100px auto;
  text-align: center;
  background: white;
  padding: 60px 40px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-volver {
  margin-top: 20px;
  padding: 12px 30px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-volver:hover {
  background: #2563eb;
}

/* Compra exitosa */
.compra-exitosa-container {
  max-width: 700px;
  margin: 40px auto;
  background: white;
  border-radius: 12px;
  padding: 50px 40px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 0 auto 20px;
}

.success-title {
  font-size: 2rem;
  color: #1f2937;
  margin: 0 0 10px;
}

.success-subtitle {
  font-size: 1.2rem;
  color: #6b7280;
  margin-bottom: 30px;
}

.ticket-resumen {
  background: #f9fafb;
  border-radius: 8px;
  padding: 30px;
  margin: 30px 0;
  text-align: left;
}

.ticket-resumen h3 {
  margin: 0 0 20px;
  font-size: 1.3rem;
  color: #1f2937;
}

.ticket-info p {
  margin: 10px 0;
  color: #4b5563;
  font-size: 1rem;
}

.total-pagado {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #e5e7eb;
  font-size: 1.3rem;
  color: #10b981;
}

.success-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.btn-primary,
.btn-secondary {
  padding: 14px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #10b981;
  color: white;
}

.btn-primary:hover {
  background: #059669;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #e5e7eb;
  color: #1f2937;
}

.btn-secondary:hover {
  background: #d1d5db;
}

/* Formulario de compra */
.compra-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.event-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 30px;
  color: white;
  text-align: center;
}

.event-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.event-date {
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.95;
}

.event-info-section {
  padding: 30px;
  border-bottom: 1px solid #e5e7eb;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-label {
  font-weight: 600;
  color: #6b7280;
}

.info-value {
  color: #1f2937;
}

.badge-modalidad {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-modalidad.presencial {
  background: #dbeafe;
  color: #1e40af;
}

.badge-modalidad.virtual {
  background: #fce7f3;
  color: #9f1239;
}

.event-description {
  background: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.event-description p {
  margin: 5px 0;
  color: #4b5563;
  line-height: 1.6;
}

.compra-table-section {
  padding: 30px;
}

.compra-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.compra-table thead {
  background: #f3f4f6;
}

.compra-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.compra-table td {
  padding: 20px 15px;
  border-bottom: 1px solid #e5e7eb;
}

.ticket-type strong {
  display: block;
  color: #1f2937;
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.ticket-note {
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
  font-style: italic;
}

.valor-cell {
  text-align: center;
}

.precio-badge {
  background: #fef3c7;
  color: #92400e;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 1.1rem;
}

.cantidad-cell {
  text-align: center;
}

.cantidad-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
}

.btn-cantidad {
  width: 30px;
  height: 30px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cantidad:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.cantidad-display {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1f2937;
  min-width: 30px;
  text-align: center;
}

.compra-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 20px;
}

.total-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.total-label {
  font-size: 0.95rem;
  color: #6b7280;
}

.total-amount {
  font-size: 2rem;
  font-weight: bold;
  color: #10b981;
}

.btn-adquirir {
  padding: 16px 50px;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-adquirir:hover:not(:disabled) {
  background: #d97706;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.btn-adquirir:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.mensaje-alert {
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

.mensaje-alert.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.comprador-info {
  padding: 20px 30px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.comprador-info p {
  margin: 5px 0;
  color: #4b5563;
}

.email-info {
  font-size: 0.9rem;
  color: #9ca3af;
}

@media (max-width: 768px) {
  .compra-footer {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .btn-adquirir {
    width: 100%;
  }
  
  .compra-table th,
  .compra-table td {
    padding: 10px 8px;
    font-size: 0.9rem;
  }
  
  .event-title {
    font-size: 1.8rem;
  }
}
</style>
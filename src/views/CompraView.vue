<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventoStore } from '../stores/eventoStore'
import { useVentaStore } from '../stores/ventaStore'

const route = useRoute()
const router = useRouter()
const eventoStore = useEventoStore()
const goHome = () => router.push('/')
const pagos = () => router.push({ path: '/pagos', query: { id: id.value, cantidad: cantidad.value } })

const id = computed(() => Number(route.query.id))
const evento = computed(() => eventoStore.eventos.find(e => e.id === id.value))

const cantidad = ref(0)
const inc = () => { cantidad.value++ }
const dec = () => { if (cantidad.value > 0) cantidad.value-- }

const precio = computed(() => evento.value?.precio ?? 0)
const precioFmt = computed(() => precio.value.toLocaleString('es-AR'))

const proceed = () => {
  if (!evento.value) {
    router.push('/')
    return
  }
  if (cantidad.value <= 0) {
    alert('Seleccioná al menos 1 entrada')
    return
  }
  const montoTotal = cantidad.value * precio.value
  // registrar la venta en el store de ventas
  const ventaStore = useVentaStore()
  ventaStore.registrarVenta({ eventoId: evento.value.id, cantidad: cantidad.value, monto: montoTotal })

  alert(`Compraste ${cantidad.value} entrada(s) para ${evento.value.nombre} por $${montoTotal.toLocaleString('es-AR')}`)
  // reset cantidad
  cantidad.value = 0
}
</script>

<template>

  <header class="app-header">
    <div class="logo" @click="goHome">TicketOrt</div>

    <div class="nav-buttons">
      <button class="btn-mis-tickets">Mis Tickets</button>
    </div>

    <div class="perfil">
      <span>Hola, USUARIO</span>
      <div class="avatar"></div>
    </div>
  </header>

  <main class="contenedor-compra">

    <div class="info-card">
      <h2 class="info-title">Detalles del Evento</h2>
      <p class="info-strong"><strong>{{ evento?.nombre || 'Nombre evento' }}</strong></p>
      <p class="info-detail">📍 Lugar: {{ evento?.lugar || 'Lugar' }}</p>
      <p class="info-detail">🗓️ Día: {{ evento?.dia || 'Día' }}</p>
      <p class="info-detail">🕒 Horario: {{ evento?.horario || 'Horario' }}</p>
      <p class="info-detail info-modalidad">🌐 Modalidad:
        <span :class="['tag', evento?.modalidad.toLowerCase()]">
          {{ evento?.modalidad || 'Presencial / Virtual' }}
        </span>
      </p>
    </div>

    <div class="event-image-box">
      <img v-if="evento?.imagen" :src="evento.imagen" alt="Imagen del Evento" class="event-image">
      <span v-else>Imagen no disponible</span>
    </div>

    <div class="descripcion-box">
      <h3 class="desc-title">DESCRIPCIÓN</h3>
      <p class="desc-text">{{ evento?.descripcion || 'Descripción del evento' }}</p>
    </div>


    <div class="tickets-box">
      <h3>SELECCIÓN DE TICKETS</h3>
      <table>
        <thead>
          <tr>
            <th>Tipo de Ticket</th>
            <th>Valor</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Entrada General</td>
            <td class="ticket-price">${{ precioFmt }}</td>
            <td>
              <div class="cantidad-control">
                <button @click="dec" class="control-btn minus">-</button>
                <span class="cantidad-valor">{{ cantidad }}</span>
                <button @click="inc" class="control-btn plus">+</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <button class="btn-siguiente" @click="proceed">
        SIGUIENTE (Pagar Total: ${{ (cantidad * precio).toLocaleString('es-AR') }})
      </button>
    </div>
  </main>

</template>


<style scoped>
body {
  background-color: #f7f7f7;
  margin: 0;
  padding: 0;
}

.app-header {
  background-color: #3b82f6;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.logo {
  background-color: white;
  color: #111827;
  padding: 8px 15px;
  border-radius: 6px;
  font-size: 1.4rem;
  font-weight: bold;
  cursor: pointer;
}

.perfil {
  display: flex;
  align-items: center;
  gap: 10px;
}

.perfil span {
  color: white;
  font-weight: 600;
}

.perfil .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #bfdbfe;
  border: 2px solid white;
}

.btn-mis-tickets {
  background-color: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  padding: 8px 15px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.btn-mis-tickets:hover {
  background-color: #3b82f6;
  color: white;
}

.contenedor-compra {
  max-width: 1200px;
  margin: 30px auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;
}

.info-card,
.event-image-box,
.descripcion-box,
.tickets-box {
  background-color: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.info-card {
  grid-column: 1 / 2;
}

.info-title {
  font-size: 1.7rem;
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 10px;
  margin-bottom: 20px;
  font-weight: 700;
}

.info-strong {
  font-size: 1.6rem;
  font-weight: 800;
  color: #3b82f6;
  margin-bottom: 15px;
}

.info-detail {
  margin: 10px 0;
  color: #4b5563;
  font-size: 1.05rem;
}

.info-modalidad .tag {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
}

.tag.presencial {
  background-color: #10b981;
}

.tag.virtual {
  background-color: #f59e0b;
}

.event-image-box {
  grid-column: 2 / 3;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #6b7280;
  font-size: 1.2rem;
  min-height: 250px;
  background-color: #f3f4f6;
  overflow: hidden;
  padding: 0;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.descripcion-box {
  grid-column: 1 / 3;
}

.desc-title {
  font-size: 1.3rem;
  color: #1f2937;
  text-transform: uppercase;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
  margin-bottom: 15px;
  font-weight: 700;
}

.desc-text {
  line-height: 1.6;
  color: #4b5563;
}

.tickets-box {
  grid-column: 1 / 3;
}

.tickets-box h3 {
  font-size: 1.6rem;
  color: #1f2937;
  margin-bottom: 20px;
  font-weight: 700;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 20px;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

th,
td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #eee;
  color: #333;
  font-size: 1rem;
}

th {
  background-color: #f9fafb;
  font-weight: 700;
  text-transform: uppercase;
  border-bottom: 2px solid #ddd;
  color: #1f2937;
}

td:first-child {
  text-align: left;
  font-weight: 600;
}

.ticket-price {
  font-weight: bold;
  color: #ef4444;
}

.cantidad-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.control-btn {
  width: 30px;
  height: 30px;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.control-btn.minus {
  background-color: #fee2e2;
  color: #b91c1c;
}

.control-btn.minus:hover {
  background-color: #fecaca;
}

.control-btn.plus {
  background-color: #d1fae5;
  color: #047857;
}

.control-btn.plus:hover {
  background-color: #a7f3d0;
}

.cantidad-valor {
  font-weight: 600;
  min-width: 20px;
}

.btn-siguiente {
  display: block;
  width: 100%;
  max-width: 450px;
  margin: 30px auto 0;
  padding: 18px 20px;
  background-color: #10b981;
  color: white;
  font-weight: 800;
  font-size: 1.2rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
}

.btn-siguiente:hover {
  background-color: #059669;
  box-shadow: 0 6px 15px rgba(5, 150, 105, 0.4);
}

@media (max-width: 768px) {
  .contenedor-compra {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .info-card,
  .event-image-box,
  .descripcion-box,
  .tickets-box {
    grid-column: 1 / 2;
  }
}
</style>
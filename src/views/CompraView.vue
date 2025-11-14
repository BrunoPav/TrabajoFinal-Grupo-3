<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEventoStore } from '../stores/eventoStore.js'

const route = useRoute()
const eventoStore = useEventoStore()
const cargando = ref(false)
const cantidad = ref(1)
const mensaje = ref('')

onMounted(async () => {
  if (!eventoStore.eventos.length) {
    cargando.value = true
    try { await eventoStore.cargarEventos() } finally { cargando.value = false }
  }
})

const eventoSeleccionado = computed(() => {
  const id = route.query.id
  return eventoStore.eventos.find(e => String(e.id) === String(id)) || null
})

const total = computed(() => Number(eventoSeleccionado.value?.precio || 0) * cantidad.value)

const confirmarCompra = () => {
  if (!eventoSeleccionado.value) { mensaje.value = 'Evento no disponible.'; return }
  if (cantidad.value < 1) { mensaje.value = 'Cantidad mínima: 1.'; return }
  const ticketsPrevios = JSON.parse(localStorage.getItem('tickets') || '[]')
  ticketsPrevios.push({
    id: Date.now(),
    eventoId: eventoSeleccionado.value.id,
    evento: eventoSeleccionado.value.nombre || ('Evento ' + eventoSeleccionado.value.id),
    cantidad: cantidad.value,
    total: total.value,
    fecha: new Date().toLocaleString('es-AR')
  })
  localStorage.setItem('tickets', JSON.stringify(ticketsPrevios))
  mensaje.value = 'Compra registrada. Ver "Mis Tickets".'
  cantidad.value = 1
}
</script>

<template>
  <div class="compra-wrapper">
    <h1 class="titulo-compra">Comprar Entradas</h1>
    <div v-if="cargando" class="estado">Cargando evento...</div>
    <div v-else-if="!eventoSeleccionado" class="estado">No se encontró el evento. Volvé al Home.</div>
    <div v-else class="layout">
      <div class="evento-card-compra">
        <div class="imagen-box" v-if="eventoSeleccionado.imagen">
          <img :src="eventoSeleccionado.imagen" :alt="eventoSeleccionado.nombre" />
        </div>
        <div class="datos">
          <h2>{{ eventoSeleccionado.nombre || ('Evento ' + eventoSeleccionado.id) }}</h2>
          <div class="tags">
            <span class="tag modalidad" :class="eventoSeleccionado.modalidad.toLowerCase()">{{ eventoSeleccionado.modalidad }}</span>
            <span class="tag precio">$ {{ eventoSeleccionado.precio }}</span>
          </div>
          <p><strong>Lugar:</strong> {{ eventoSeleccionado.lugar }}</p>
          <p><strong>Día:</strong> {{ eventoSeleccionado.dia }}</p>
          <p><strong>Horario:</strong> {{ eventoSeleccionado.horario }}</p>
          <p class="desc"><strong>Descripción:</strong> {{ eventoSeleccionado.descripcion }}</p>
        </div>
      </div>

      <form @submit.prevent="confirmarCompra" class="form-compra">
        <h3>Seleccioná cantidad</h3>
        <div class="cantidad-row">
          <button type="button" @click="cantidad > 1 && (cantidad--)">-</button>
          <input type="number" min="1" v-model.number="cantidad" />
          <button type="button" @click="cantidad++">+</button>
        </div>
        <p class="total"><strong>Total:</strong> $ {{ total }}</p>
        <button type="submit" class="btn-confirmar">CONFIRMAR COMPRA</button>
        <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: #f7f7f7;
  margin: 0;
  padding: 0;
}

.compra-wrapper { max-width:1100px; margin:0 auto; padding:32px 24px; }
.titulo-compra { margin:0 0 28px; font-size:2.1rem; font-weight:700; letter-spacing:.5px; color:#1f2937; }
.estado { text-align:center; padding:60px; color:#555; font-size:1rem; }
.layout { display:grid; grid-template-columns: 1fr 360px; gap:36px; align-items:start; }
.evento-card-compra { background:linear-gradient(135deg,#ffffff 0%,#f3f6fa 100%); border:1px solid #e5e7eb; border-radius:18px; box-shadow:0 8px 24px rgba(0,0,0,.08); overflow:hidden; display:flex; gap:28px; padding:28px; }
.imagen-box { flex:0 0 300px; height:220px; overflow:hidden; border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,.12); }
.imagen-box img { width:100%; height:100%; object-fit:cover; }
.datos h2 { margin:0 0 14px; font-size:1.8rem; font-weight:700; color:#111827; }
.tags { display:flex; gap:10px; margin-bottom:12px; }
.tag { padding:6px 12px; border-radius:999px; font-size:.75rem; font-weight:700; letter-spacing:.5px; text-transform:uppercase; }
.tag.modalidad.presencial { background:#3b82f6; color:#fff; }
.tag.modalidad.virtual { background:#10b981; color:#fff; }
.tag.precio { background:#f59e0b; color:#fff; }
.datos p { margin:4px 0; font-size:.95rem; color:#374151; }
.datos p.desc { margin-top:10px; line-height:1.3; }
.form-compra { background:#ffffff; border:1px solid #e5e7eb; border-radius:18px; box-shadow:0 8px 24px rgba(0,0,0,.08); padding:28px; display:flex; flex-direction:column; gap:18px; }
.form-compra h3 { margin:0; font-size:1.15rem; font-weight:700; color:#1f2937; }
.cantidad-row { display:flex; align-items:center; gap:14px; }
.cantidad-row button { width:42px; height:42px; border:none; background:#3b82f6; color:#fff; font-weight:700; font-size:1.1rem; border-radius:10px; cursor:pointer; transition:background .2s; }
.cantidad-row button:hover { background:#2563eb; }
.cantidad-row input { width:90px; text-align:center; padding:10px; border:1px solid #d1d5db; border-radius:8px; font-size:1rem; }
.total { margin:0; font-size:1.05rem; font-weight:600; color:#111; }
.btn-confirmar { background:#10b981; color:#fff; border:none; padding:16px 20px; border-radius:12px; font-weight:700; font-size:1rem; cursor:pointer; letter-spacing:.5px; box-shadow:0 6px 16px rgba(16,185,129,.3); transition:background .2s, transform .2s; }
.btn-confirmar:hover { background:#059669; transform:translateY(-2px); }
.mensaje { margin:0; font-size:.85rem; font-weight:600; color:#2563eb; }
@media (max-width: 980px) { .layout { grid-template-columns:1fr; } .evento-card-compra { flex-direction:column; } .imagen-box { width:100%; height:240px; } }
</style>
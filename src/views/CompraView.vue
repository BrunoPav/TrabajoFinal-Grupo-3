<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'  
import { useEventoStore } from '../stores/eventoStore.js'

const API_TICKETS_URL = 'https://6918dbf29ccba073ee919f1c.mockapi.io/tickets/tickets';
const route = useRoute()
const router = useRouter()  
const eventoStore = useEventoStore()
const cargando = ref(false)
const cantidad = ref(1)
const mensaje = ref('')
const compraExitosa = ref(false)
const ticketConfirmado = ref(null)

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

// Nacho hay que mirar esta funcion!!! Por en el frontend no calcula bien el total hice esta otra forma para ver si podia andar, pero no funciono. 
//const total = computed(() => {
    
//    const precio = eventoSeleccionado.value?.precio || 0;
  
  //  return Number(precio) * cantidad.value; 
//});


const confirmarCompra = async () => {
    if (!eventoSeleccionado.value) { mensaje.value = 'Evento no disponible.'; return }
    if (cantidad.value < 1) { mensaje.value = 'Cantidad mínima: 1.'; return }
    
    mensaje.value = 'Procesando compra...'

    const nuevoTicket = {
        eventoId: eventoSeleccionado.value.id,
        evento: eventoSeleccionado.value.nombre || ('Evento ' + eventoSeleccionado.value.id),
        cantidad: cantidad.value,
        total: total.value,
        fecha: new Date().toLocaleString('es-AR'),
       
        eventoDetalles: eventoSeleccionado.value 
    };

    try {
        const response = await fetch(API_TICKETS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoTicket)
        });

        if (!response.ok) {
            throw new Error(`Error en la API: ${response.status}`);
        }
        
      
        const ticketGuardado = await response.json(); 
        
       
        ticketConfirmado.value = ticketGuardado; 
        compraExitosa.value = true;             
        
    } catch (error) {
        console.error('Error al registrar la compra:', error);
        mensaje.value = 'Error de conexión. Verifique la URL.';
    }
}
  
const seguirComprando = () => {
  
  router.push({ path: '/' }) 
}


</script>

<template>
    <div class="compra-wrapper">
        <h1 class="titulo-compra">Comprar Entradas</h1>
        <div v-if="cargando" class="estado">Cargando evento...</div>
        <div v-else-if="!eventoSeleccionado" class="estado">No se encontró el evento. Volvé al Home.</div>
        
        <div v-else class="layout">
            <div v-if="compraExitosa && ticketConfirmado" class="compra-exitosa">
                <h1 style="color: white; margin-bottom: 20px;">¡Gracias! Tu compra se ha realizado con éxito.</h1>
                
                <div class="resumen-ticket">
                    <h3>Detalles del Ticket</h3>
                    <p><strong>Numero de orden:</strong> {{ ticketConfirmado.id }}</p>
                    
                    <hr style="margin: 10px 0;">
                    
                    <h3>Evento</h3>
                    <p><strong>Nombre:</strong> {{ ticketConfirmado.eventoDetalles.nombre }}</p>
                    <p><strong>Lugar:</strong> {{ ticketConfirmado.eventoDetalles.lugar }}</p>
                    <p><strong>Día:</strong> {{ ticketConfirmado.eventoDetalles.dia }}</p>
                    
                    <hr style="margin: 10px 0;">

                    <h3>Resumen de la Transacción</h3>
                    <p><strong>Cantidad Comprada:</strong> {{ ticketConfirmado.cantidad }}</p>
                    <p class="total" style="color:blanchedalmond;"><strong>Total Pagado:</strong> ${{ ticketConfirmado.total.toFixed(2) }}</p>
                    <p class="fecha-compra" style="font-size: 0.9em;">Registrado el: {{ ticketConfirmado.fecha }}</p>
                </div>
               <RouterLink to="/" class="btn-seguir-comprando">
                  <button @click="seguirComprando" class="btn-confirmar" style="background-color: #32a8f0;">Seguir Comprando</button>  
                </RouterLink>
               </div>

            

            <template v-else>
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
                    <p class="total"><strong>Total:</strong> $ {{ total.toFixed(2) }}</p>
                    <button type="submit" class="btn-confirmar">CONFIRMAR COMPRA</button>
                    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
                </form>
            </template>
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
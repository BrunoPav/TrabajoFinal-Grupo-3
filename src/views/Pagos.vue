<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventoStore } from '../stores/eventoStore'
import { useVentaStore } from '../stores/ventaStore'

const route = useRoute()
const router = useRouter()
const eventoStore = useEventoStore()
const goHome = () => router.push('/')
const goMisTickets = () => router.push('/usuario')

// 1. Obtención de ID del Query Parameter (se mantiene)
const id = computed(() => Number(route.query.id))
const evento = computed(() => eventoStore.eventos.find(e => e.id === id.value))

// 2. ✨ MODIFICACIÓN CLAVE: Obtener 'cantidad' del Query Parameter
// Usamos computed para reactividad y Number() para asegurar el tipo.
const cantidad = computed(() => Number(route.query.cantidad || 0)) 
// Si la URL es: /ruta-pago?id=10&cantidad=5, 'cantidad' será 5.
// Si el parámetro no existe o es inválido, asumimos 0.

// 3. ELIMINACIÓN DE MÉTODOS DE EDICIÓN
// const inc = () => { cantidad.value++ } // ELIMINADO
// const dec = () => { if (cantidad.value > 0) cantidad.value-- } // ELIMINADO

const precio = computed(() => evento.value?.precio ?? 0)
const precioFmt = computed(() => precio.value.toLocaleString('es-AR'))
// Propiedad computada para el monto total (Buena Práctica)
const montoTotalComputado = computed(() => cantidad.value * precio.value)

const proceed = () => {
    if (!evento.value) {
        router.push('/')
        return
    }
    // Usamos cantidad.value del computed
    if (cantidad.value <= 0) {
        alert('La cantidad de entradas debe ser positiva para proceder al pago.')
        return
    }
    
    const montoTotal = montoTotalComputado.value // Usamos el computed
    
    // registrar la venta en el store de ventas (manejo de objetos)
    const ventaStore = useVentaStore()
    ventaStore.registrarVenta({ eventoId: evento.value.id, cantidad: cantidad.value, monto: montoTotal })

    alert(`Compraste ${cantidad.value} entrada(s) para ${evento.value.nombre} por $${montoTotal.toLocaleString('es-AR')}`)
    // La cantidad no se resetea aquí ya que es gestionada por el router
}
</script>

<template>

    <header class="app-header">
        <div class="logo" @click="goHome">TicketOrt</div>

        <div class="nav-buttons">
            <button class="btn-mis-tickets" @click="goMisTickets">Mis Tickets</button>
             
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
            <p class="info-detail">{{ evento?.lugar || 'Lugar' }}</p>
            <p class="info-detail">{{ evento?.dia || 'Día' }}</p>
            <p class="info-detail">{{ evento?.horario || 'Horario' }}</p>
            <p class="info-detail info-modalidad">Modalidad:
                <span :class="['tag', evento?.modalidad.toLowerCase()]">
                    {{ evento?.modalidad || 'Presencial / Virtual' }}
                </span>
            </p>
        </div>

        <div class="event-image-box">
             
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
                                <span class="cantidad-valor">{{ cantidad }}</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <button class="btn-pagar" @click="proceed"> Pagar a Total: ${{ montoTotalComputado.toLocaleString('es-AR') }})</button>
        </div>
    </main>

</template>



<style scoped>
/* A partir de aquí el CSS se mantiene igual, con un pequeño ajuste para centrar la cantidad */

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
    padding: 10px 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
    background-color: white;
    color: #111827;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 1.3rem;
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
    font-weight: 500;
    padding: 5px 10px;
}

.perfil .avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: white;
    border: 2px solid white;
}

.btn-mis-tickets {
    background-color: white;
    color: #3b82f6;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-mis-tickets:hover {
    background-color: #e5e7eb;
}

.contenedor-compra {
    max-width: 1200px;
    margin: 30px auto;
    padding: 20px;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
}

.info-card,
.event-image-box,
.descripcion-box,
.tickets-box {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-card {
    grid-column: 1 / 2;
    min-height: 250px;
}

.info-title {
    font-size: 1.5rem;
    color: #3b82f6;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 15px;
}

.info-strong {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 10px;
}

.info-detail {
    margin: 8px 0;
    color: #4b5563;
    font-size: 1rem;
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
    background-color: #e5e7eb;
}

.descripcion-box {
    grid-column: 1 / 3;
}

.desc-title {
    font-size: 1.2rem;
    color: #374151;
    text-transform: uppercase;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
    margin-bottom: 15px;
}

.desc-text {
    line-height: 1.6;
    color: #4b5563;
}

.tickets-box {
    grid-column: 1 / 3;
}

.tickets-box h3 {
    font-size: 1.4rem;
    color: #1f2937;
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-bottom: 20px;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid #ddd;
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
    background-color: #f0f4f8;
    font-weight: 700;
    text-transform: uppercase;
    border-bottom: 2px solid #ddd;
}

td:first-child {
    text-align: left;
    font-weight: 500;
}

.ticket-price {
    font-weight: bold;
    color: #10b981;
}

/* MODIFICADO: Ajuste para el número de cantidad */
.cantidad-control {
    display: flex;
    align-items: center;
    justify-content: center; 
}

.cantidad-valor {
    font-weight: 600;
    min-width: 20px;
    font-size: 1.1rem;
}

.btn-pagar {
    display: block;
    width: 100%;
    max-width: 400px;
    margin: 20px auto 0;
    padding: 15px 20px;
    background-color: #3b82f6;
    color: white;
    font-weight: bold;
    font-size: 1.1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.btn-pagar:hover {
    background-color: #2563eb;
}

@media (max-width: 768px) {
    .contenedor-compra {
        grid-template-columns: 1fr;
    }

    .info-card,
    .event-image-box,
    .descripcion-box,
    .tickets-box {
        grid-column: 1 / 2;
    }
}
</style>
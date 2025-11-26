<script setup>
import { ref, onMounted, nextTick } from 'vue'; 
import { 
    Chart, 
    registerables,
    BarController,
    CategoryScale,
    LinearScale,
    BarElement
} from 'chart.js';


Chart.register(
    ...registerables, 
    BarController, CategoryScale, LinearScale, BarElement
); 



const props = defineProps({
    eventoId: {
        type: [String, Number],
        required: true
    },
    eventoNombre: {
        type: String,
        default: 'Evento Desconocido'
    },
    eventoPrecio: {
        type: Number,
        default: 0
    }
});

const API_TICKETS_URL = 'https://691d169bd58e64bf0d34f5f9.mockapi.io/tickets'; 


const chartRecaudacionCanvas = ref(null);
const chartCapacidadCanvas = ref(null); 
const cargandoDatos = ref(true);
const tieneDatos = ref(false); 
const resumenRecaudacion = ref(0); 
const totalTicketsVendidos = ref(0); 


async function fetchDataAndRender() {
    cargandoDatos.value = true;
    
   
    const recaudacionPorCategoria = {}; 
    let acumuladoRecaudacion = 0;
    let acumuladoTickets = 0;

    try {
        const ticketsResponse = await fetch(API_TICKETS_URL);
        if (!ticketsResponse.ok) {
            throw new Error(`Error al cargar tickets: ${ticketsResponse.status}`);
        }
        
        const todosLosTickets = await ticketsResponse.json();
        

        if (Array.isArray(todosLosTickets)) {
            const ticketsFiltrados = todosLosTickets
                .filter(ticket => String(ticket.eventoId) === String(props.eventoId));

            ticketsFiltrados.forEach(ticket => {
                    const montoTicket = parseFloat(ticket.montoTotal) || 0; 
                    const cantidadTicket = parseInt(ticket.cantidad) || 0; 
                    
                    const categoria = ticket.categoria || 'General';
                    
                    if (montoTicket > 0 || cantidadTicket > 0) { 

                        if (!recaudacionPorCategoria[categoria]) {
                            recaudacionPorCategoria[categoria] = 0;
                        }
                        recaudacionPorCategoria[categoria] += montoTicket;
                        acumuladoRecaudacion += montoTicket;

                        acumuladoTickets += cantidadTicket; 
                    }
                });
        }
        
        cargandoDatos.value = false;
        
        if (acumuladoRecaudacion === 0 && acumuladoTickets === 0) {
            tieneDatos.value = false;
            return;
        }

        tieneDatos.value = true;
        resumenRecaudacion.value = acumuladoRecaudacion;
        totalTicketsVendidos.value = acumuladoTickets; 
        
        
        nextTick(() => { 

            renderRecaudacionChart(recaudacionPorCategoria); 

            renderCantidadChart(acumuladoTickets); 
        });

    } catch (error) {
        console.error("Error al obtener datos de tickets para el detalle:", error);
        cargandoDatos.value = false;
    }
}

function renderRecaudacionChart(recaudacionPorCategoria) {
    if (chartRecaudacionCanvas.value) { 
        const ctx = chartRecaudacionCanvas.value.getContext('2d');
        
        if (chartRecaudacionCanvas.value.chart) {
            chartRecaudacionCanvas.value.chart.destroy();
        }

        const labels = Object.keys(recaudacionPorCategoria);
        const data = Object.values(recaudacionPorCategoria);

        chartRecaudacionCanvas.value.chart = new Chart(ctx, {
            type: 'bar', 
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Recaudación Real por Categoría',
                        data: data,
                        backgroundColor: '#10b981', 
                    }
                ]
            },
            options: {
                responsive: true,
                indexAxis: 'y', 
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Recaudación Total por Categoría`,
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: { display: false },
                    tooltip: {
                         callbacks: {
                            label: function(context) {
                                const value = context.parsed.x;
                                return `${context.dataset.label}: ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(value);
                            }
                        }
                    },
                    y: {
                        display: true 
                    }
                }
            }
        });
    }
}


function renderCantidadChart(ticketsVendidos) {
    if (chartCapacidadCanvas.value) {
        const ctx = chartCapacidadCanvas.value.getContext('2d');
        
        if (chartCapacidadCanvas.value.chart) {
            chartCapacidadCanvas.value.chart.destroy();
        }
      
        chartCapacidadCanvas.value.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Tickets Vendidos'],
                datasets: [
                    {
                        label: 'Entradas Vendidas',
                        data: [ticketsVendidos],
                        backgroundColor: '#3b82f6', 
                    }
                ]
            },
            options: {
                responsive: true,
                indexAxis: 'y',
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Total de Entradas Vendidas`,
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                         callbacks: {
                            label: function(context) {
                                const value = context.parsed.x;
                                return `${context.dataset.label}: ${value.toLocaleString('es-AR')} Entradas`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        
                    },
                    y: {
                        display: false 
                    }
                }
            }
        });
    }
}



onMounted(fetchDataAndRender);
</script>

<template>
    <div class="chart-container">
        
        <div v-if="cargandoDatos" class="mensaje-estado loading">
            Cargando datos de ventas...
        </div>

       
        <div v-else-if="!tieneDatos" class="mensaje-estado no-data">
            <p>No se registraron tickets vendidos para el evento <strong>{{ eventoNombre }}</strong>.</p>
        </div>

        
        <div v-else class="chart-wrapper">
            
           
            <div class="resumen-metricas">
                <p class="metric-item">
                    <span class="metric-label">Entradas Vendidas:</span>
                    <strong class="metric-value tickets">{{ totalTicketsVendidos.toLocaleString('es-AR') }}</strong>
                </p>
                <p class="metric-item">
                    <span class="metric-label">Recaudación Total:</span>
                    <strong class="metric-value monto">
                        {{ new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(resumenRecaudacion) }}
                    </strong>
                </p>
            </div>
            

            <!-- CANTIDAD VENDIDA (BARRA HORIZONTAL) -->
            <div class="chart-box capacity-chart-box">
                <canvas ref="chartCapacidadCanvas"></canvas> 
            </div>

            <!--  RECAUDACIÓN REAL (BARRA HORIZONTAL) -->
            <div class="chart-box recaudacion-chart-box">
                <canvas ref="chartRecaudacionCanvas"></canvas> 
            </div>
        </div>
        
    </div>
</template>

<style scoped>
/* Estilos componente */
.chart-container {
    padding: 15px;
    background-color: #f7f9fc;
    border-radius: 8px;
    min-height: 550px; 
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.resumen-metricas {
    width: 100%;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: #ffffff;
}

.metric-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px dashed #f3f4f6;
    font-size: 1rem;
}

.metric-item:last-child {
    border-bottom: none;
}

.metric-label {
    color: #4b5563;
    font-weight: 500;
}

.metric-value {
    font-weight: 700;
    font-size: 1.1rem;
}

.tickets {
    color: #3b82f6; 
}

.monto {
    color: #10b981; 
}

.chart-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.chart-box {
    position: relative;
    width: 100%;
    max-width: 500px; 
    margin-bottom: 25px;
}

.capacity-chart-box, .recaudacion-chart-box {
    height: 100px; 
}



.mensaje-estado {
    text-align: center;
    padding: 20px;
    border-radius: 6px;
    font-size: 1rem;
    width: 100%;
}

.loading {
    color: #3b82f6;
    font-style: italic;
    border: 1px solid #dbeafe;
}

.no-data {
    color: #9ca3af;
    background-color: #e5e7eb;
    font-weight: 500;
}
</style>
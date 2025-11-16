<script setup>
import { ref, onMounted } from 'vue';
// No usamos DashboardPorEvento en este archivo, se mantiene solo si se usa en el template (aunque aquí no se ve).
// import DashboardPorEvento from './DashboardPorEvento.vue'; 
import { 
    Chart, 
    registerables,
    DoughnutController, 
    ArcElement, 
    Tooltip, 
    Legend
} from 'chart.js';

// Registro de elementos necesarios para el gráfico de dona
Chart.register(...registerables, DoughnutController, ArcElement, Tooltip, Legend); 

// --- URLs DE LA API ---
// URL de Eventos (para obtener los nombres de los eventos)
const API_EVENTS_URL = 'https://69154c6384e8bd126af96b43.mockapi.io/eventos'; 
// URL de Tickets (donde se guardan las compras)
// ⚠️ IMPORTANTE: REEMPLAZA ESTA URL CON TU ENDPOINT REAL DE TICKETS
const API_TICKETS_URL = 'https://6918dbf29ccba073ee919f1c.mockapi.io/tickets/tickets'; 

// 1. Estado Reactivo para los datos del gráfico
const chartLabels = ref([]); 
const chartData = ref([]);
const chartcanvas = ref(null);

// Función Asíncrona para cargar y procesar datos dinámicos
async function fetchData() {
    try {
        // Objeto temporal para acumular la recaudación por evento
        const recaudacionPorEvento = {};

        // ----------------------------------------------------
        // PASO 1: Cargar y Procesar Tickets
        // ----------------------------------------------------
        const ticketsResponse = await fetch(API_TICKETS_URL);
        const tickets = await ticketsResponse.json();

        if (Array.isArray(tickets)) {
            tickets.forEach(ticket => {
                const id = ticket.eventoId;
                // Asegurarse de que el total es un número, o usar 0 como fallback
                const totalTicket = parseFloat(ticket.total) || 0; 
                
                if (id && totalTicket > 0) {
                    if (!recaudacionPorEvento[id]) {
                        recaudacionPorEvento[id] = 0;
                    }
                    recaudacionPorEvento[id] += totalTicket;
                }
            });
        }

        // ----------------------------------------------------
        // PASO 2: Cargar Eventos (Para obtener los nombres)
        // ----------------------------------------------------
        const eventsResponse = await fetch(API_EVENTS_URL);
        const eventos = await eventsResponse.json();
        
        // Crear un mapa de IDs de evento a nombres para búsqueda rápida
        const eventoIdToNombre = {};
        if (Array.isArray(eventos)) {
            eventos.forEach(evento => {
                eventoIdToNombre[evento.id] = evento.nombre || `Evento ID ${evento.id}`;
            });
        }

        // ----------------------------------------------------
        // PASO 3: Generar Labels y Data del Gráfico
        // ----------------------------------------------------
        const labels = [];
        const data = [];

        // Iterar sobre los IDs que tienen recaudación
        for (const eventoId in recaudacionPorEvento) {
            const nombre = eventoIdToNombre[eventoId] || `Evento Desconocido (${eventoId})`;
            const totalRecaudado = recaudacionPorEvento[eventoId];

            labels.push(nombre);
            data.push(totalRecaudado);
        }

        // ----------------------------------------------------
        // PASO 4: Actualizar el estado reactivo
        // ----------------------------------------------------
        chartLabels.value = labels;
        chartData.value = data;
        
    } catch (error) {
        console.error("Error al obtener y procesar datos de la API:", error);
    }
}


// Ciclo de vida: Montaje del componente (Vue Instance)
onMounted(async () => {
    // 1. Esperar la carga y procesamiento de datos asíncrona
    await fetchData();

    // 2. Verificar que el elemento <canvas> esté disponible en el DOM
    if (chartcanvas.value) { 
        const ctx = chartcanvas.value.getContext('2d');
        
        // 3. Inicializar el Chart SOLO si el contexto es válido y hay datos cargados
        if (ctx && chartData.value.length > 0) { 
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: chartLabels.value, 
                    datasets: [{
                        label: 'Recaudación Total',
                        data: chartData.value, 
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)', // Rojo
                            'rgba(54, 162, 235, 0.7)', // Azul
                            'rgba(255, 206, 86, 0.7)', // Amarillo
                            'rgba(75, 192, 192, 0.7)', // Verde
                            'rgba(153, 102, 255, 0.7)', // Púrpura
                            'rgba(255, 159, 64, 0.7)' // Naranja
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        title: {
                            display: true,
                            text: 'Recaudación Total por Evento (Ventas de Tickets)'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    // Formatear el valor como moneda
                                    if (context.parsed !== null) {
                                        label += new Intl.NumberFormat('es-AR', { 
                                            style: 'currency', 
                                            currency: 'USD' 
                                        }).format(context.parsed);
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        } else if (chartcanvas.value) {
             // Mostrar mensaje si no hay datos
             chartcanvas.value.parentElement.innerHTML += '<p class="text-gray-500 text-center mt-4">No hay tickets vendidos para mostrar la recaudación.</p>';
        }
    }
});
</script>

<template>
    <!-- Contenedor principal con estilo Tailwind simple para estética -->
    <div class="bg-white p-6 rounded-xl shadow-2xl max-w-lg mx-auto mt-8">
        <h2 class="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Dashboard de Recaudación</h2> 
        
        <!-- El canvas donde se renderiza el gráfico -->
        <div style="max-height: 400px; max-width: 400px; margin: 0 auto;">
            <canvas ref="chartcanvas"></canvas> 
        </div>
        
    </div>
</template>
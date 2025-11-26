<script setup>
import { ref, onMounted } from 'vue';

import { 
    Chart, 
    registerables,
    DoughnutController, 
    ArcElement, 
    Tooltip, 
    Legend
} from 'chart.js';

Chart.register(...registerables, DoughnutController, ArcElement, Tooltip, Legend); 

const API_EVENTS_URL = 'https://69154c6384e8bd126af96b43.mockapi.io/eventos'; 

const API_TICKETS_URL = 'https://691d169bd58e64bf0d34f5f9.mockapi.io/tickets'; 


const chartLabels = ref([]); 
const chartData = ref([]);
const chartcanvas = ref(null);

async function fetchData() {
    try {

        const recaudacionPorEvento = {};

        const ticketsResponse = await fetch(API_TICKETS_URL);
        const tickets = await ticketsResponse.json();

        if (Array.isArray(tickets)) {
            tickets.forEach(ticket => {
                const id = ticket.eventoId;
                const totalTicket = parseFloat(ticket.montoTotal) || 0; 
                
                if (id && totalTicket > 0) {
                    if (!recaudacionPorEvento[id]) {
                        recaudacionPorEvento[id] = 0;
                    }
                    recaudacionPorEvento[id] += totalTicket;
                }
            });
        }

        const eventsResponse = await fetch(API_EVENTS_URL);
        const eventos = await eventsResponse.json();

        const eventoIdToNombre = {};
        if (Array.isArray(eventos)) {
            eventos.forEach(evento => {
                eventoIdToNombre[evento.id] = evento.nombre || `Evento ID ${evento.id}`;
            });
        }

        const labels = [];
        const data = [];

        for (const eventoId in recaudacionPorEvento) {
            const nombre = eventoIdToNombre[eventoId] || `Evento Desconocido (${eventoId})`;
            const totalRecaudado = recaudacionPorEvento[eventoId];

            labels.push(nombre);
            data.push(totalRecaudado);
        }


        chartLabels.value = labels;
        chartData.value = data;
        
    } catch (error) {
        console.error("Error al obtener y procesar datos de la API:", error);
    }
}



onMounted(async () => {

    await fetchData();


    if (chartcanvas.value) { 
        const ctx = chartcanvas.value.getContext('2d');
        

        if (ctx && chartData.value.length > 0) { 
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: chartLabels.value, 
                    datasets: [{
                        label: 'Recaudación Total',
                        data: chartData.value, 
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)', 
                            'rgba(54, 162, 235, 0.7)', 
                            'rgba(255, 206, 86, 0.7)', 
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(153, 102, 255, 0.7)', 
                            'rgba(255, 159, 64, 0.7)' 
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

             chartcanvas.value.parentElement.innerHTML += '<p class="text-gray-500 text-center mt-4">No hay tickets vendidos para mostrar la recaudación.</p>';
        }
    }
});
</script>

<template>

    <div class="bg-white p-6 rounded-xl shadow-2xl max-w-lg mx-auto mt-8">
        <h2 class="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Dashboard de Recaudación</h2> 
        

        <div style="max-height: 400px; max-width: 400px; margin: 0 auto;">
            <canvas ref="chartcanvas"></canvas> 
        </div>
        
    </div>
</template>

<template>
  <div>
    <canvas id="graficoRecaudacion"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'RecaudacionPorEvento',
  async mounted() {
    try {
      const response = await fetch('https://www.mockachino.com/c51e39b8-d8fb-42/eventos');
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }

      const datos = await response.json();
      const eventos = datos.eventos;

      // ✅ Mapa de colores por nombre de evento (coherente con VentasPorEvento)
      const mapaColores = {
        'Concierto Rock': 'rgba(255, 99, 132, 0.6)',
        'Feria de Libros':'rgba(54, 162, 235, 0.6)',
    
        // Podés agregar más eventos aquí si los tenés definidos
      };

      // ✅ Mostrar totales recaudados en consola
      eventos.forEach(evento => {
        console.log(`Evento: ${evento.nombre}`);
        console.log(`Total Recaudado: $${evento.totalRecaudado}`);
      });

      const etiquetas = eventos.map(item => item.nombre);
      const montos = eventos.map(item => item.totalRecaudado);

      // ✅ Asignar colores según el nombre del evento
      const coloresPorEvento = eventos.map(item => {
        return mapaColores[item.nombre] || 'rgba(200, 200, 200, 0.6)'; // color gris si no está definido
      });

      const ctx = document.getElementById('graficoRecaudacion').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: etiquetas,
          datasets: [{
            label: 'Total Recaudado ($)',
            data: montos,
            backgroundColor: coloresPorEvento,
            borderColor: coloresPorEvento,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  const index = context.dataIndex;
                  const evento = eventos[index];
                  return `Recaudación: $${evento.totalRecaudado}`;
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error al cargar el gráfico:', error);
    }
  }
}
</script>

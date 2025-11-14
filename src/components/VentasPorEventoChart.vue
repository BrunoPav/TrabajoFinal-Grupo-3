<template>
  <div class="grafico-container">
    <canvas id="graficoVentas"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'VentasPorEvento',
  async mounted() {
    try {
      const response = await fetch('https://www.mockachino.com/c51e39b8-d8fb-42/eventos');
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }

      const datos = await response.json();
      const eventos = datos.eventos;

      // ✅ Mapa de colores por nombre de evento (usando los colores de la app)
      const mapaColores = {
        'Concierto Rock': '#ef4444', // Rojo
        'Feria de Libros': '#3b82f6', // Azul
        'Evento 1': '#ef4444',
        'Evento 2': '#10b981', // Verde
        'Evento 3': '#f59e0b', // Naranja
      };

      // ✅ Mostrar totales por evento en consola
      eventos.forEach(evento => {
        console.log(`Evento: ${evento.nombre}`);
        console.log(`Entradas Vendidas: ${evento.entradasVendidas}`);

      });

      const etiquetas = eventos.map(item => item.nombre);
      const ventas = eventos.map(item => item.entradasVendidas);

      // ✅ Asignar colores según el nombre del evento
      const coloresPorEvento = eventos.map(item => {
        return mapaColores[item.nombre] || '#9ca3af'; // color gris si no está definido
      });

      const bordesPorEvento = eventos.map(item => {
        return coloresPorEvento[eventos.indexOf(item)];
      });


      const ctx = document.getElementById('graficoVentas').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: etiquetas,
          datasets: [{
            label: 'Entradas Vendidas',
            data: ventas,
            backgroundColor: coloresPorEvento.map(color => color + 'b3'), // 70% opacidad
            borderColor: coloresPorEvento,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#f3f4f6' // Líneas de cuadrícula sutiles
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false // Ocultar leyenda
            },
            title: {
              display: true,
              text: 'Entradas Vendidas por Evento',
              font: {
                size: 16,
                weight: 'bold'
              },
              color: '#1f2937'
            },
            tooltip: {
              backgroundColor: 'rgba(31, 41, 55, 0.9)',
              titleColor: '#fff',
              callbacks: {
                label: function (context) {
                  const valor = context.parsed.y.toLocaleString('es-AR');
                  return ` Entradas Vendidas: ${valor}`;
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

<style scoped>
/* Contenedor del gráfico para darle un margen y fondo limpio */
.grafico-container {
  width: 100%;
  height: 400px;
  /* Altura fija para el gráfico */
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
</style>

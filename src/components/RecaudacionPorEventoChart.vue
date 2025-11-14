<template>
  <div class="grafico-container">
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
        'Concierto Rock': '#3b82f6', // Azul principal
        'Feria de Libros': '#10b981', // Verde principal

        // Podés agregar más eventos aquí si los tenés definidos
        'Evento 1': '#3b82f6',
        'Evento 2': '#f59e0b', // Naranja/Amarillo para diferenciación
        'Evento 3': '#ef4444', // Rojo
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
        const colorBase = mapaColores[item.nombre] || '#9ca3af'; // color gris si no está definido
        // color sólido como fondo y una versión más oscura para el borde
        return colorBase;
      });

      const bordesPorEvento = eventos.map(item => {
        const colorBase = mapaColores[item.nombre] || '#6b7280';
        return colorBase;
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
            borderColor: bordesPorEvento.map(c => c.replace('0.6', '1')), // Borde sólido
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Permitir que el contenedor controle el tamaño
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
              display: false // Ocultar leyenda si solo hay un dataset
            },
            title: {
              display: true,
              text: 'Recaudación Total por Evento',
              font: {
                size: 16,
                weight: 'bold'
              },
              color: '#1f2937'
            },
            tooltip: {
              backgroundColor: 'rgba(31, 41, 55, 0.9)', // Fondo oscuro para tooltip
              titleColor: '#fff',
              callbacks: {
                label: function (context) {
                  const valor = context.parsed.y.toLocaleString('es-AR');
                  return ` Recaudación: $${valor}`;
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

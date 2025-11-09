
<template>
  <div>
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

      // ✅ Mostrar totales por evento en consola
      eventos.forEach(evento => {
        console.log(`Evento: ${evento.nombre}`);
        console.log(`Entradas Vendidas: ${evento.entradasVendidas}`);

      });

      const etiquetas = eventos.map(item => item.nombre);
      const ventas = eventos.map(item => item.entradasVendidas);

      // ✅ Colores personalizados por evento
      const colores = [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',

      ];

      const coloresPorEvento = eventos.map((_, index) => colores[index % colores.length]);

      const ctx = document.getElementById('graficoVentas').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: etiquetas,
          datasets: [{
            label: 'Entradas Vendidas',
            data: ventas,
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
                  return [
                    `Entradas: ${evento.entradasVendidas}`,
                  ];
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

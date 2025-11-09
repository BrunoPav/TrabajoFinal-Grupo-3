

<script setup>
import { computed, onMounted } from 'vue'
import { useEventoStore } from '../stores/eventoStore'
import TarjetaEvento from '../components/TarjetaEvento.vue'
import VentasPorEventoChart from '../components/VentasPorEventoChart.vue'
import RecaudacionPorEventoChart from '../components/RecaudacionPorEventoChart.vue'

const eventoStore = useEventoStore()

onMounted(() => {
  eventoStore.cargarEventos()
})

// Evento por defecto si no hay datos
const eventoSeleccionado = computed(() => {
  return eventoStore.eventos.length
    ? eventoStore.eventos[0]
    : {
        id: 0,
        nombre: 'Sin evento disponible',
        lugar: '—',
        fecha: '—',
        horario: '—',
        descripcion: 'No hay información disponible.',
        modalidad: 'Presencial',
        precio: 0,
        imagenUrl: ''
      }
})
</script>


<template>
   <div class="Gerente">
    <nav class="app-header">
      <div class="nav-container">
        <div class="nav-left">
          <router-link to="/" class="logo">TicketOrt</router-link>
        </div>
        <div class="nav-center">
         
          <router-link to="/listausuario" class="btn-nav">Lista de usuarios</router-link>
          <router-link to="/listausuario" class="btn-nav">Reintegros</router-link>

        </div>
        <div class="perfil">
          <span>Hola, Gerente</span>
          <div class="avatar"></div>
        </div>
      </div>
    </nav>

    <div class="contenedor">
      <h2 class="titulo-panel">Ventas del Evento</h2>
    </div>

    <div class="dashboard-container">
      <!-- Panel de Evento -->
      <div class="dashboard-item evento-panel">
        <h3 class="dashboard-titulo">Evento</h3>
        <div class="tarjetas-evento">
          <TarjetaEvento
            :evento="eventoSeleccionado"
            @comprar="(id) => console.log('Compra solicitada para evento', id)"
          />
        </div>
      </div>

      <!-- Panel de Ventas -->
      <div class="dashboard-item ventas-panel">
        <h3 class="dashboard-titulo">Resumen del Evento</h3>
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

        <RecaudacionPorEventoChart :evento="eventoSeleccionado" />
        <VentasPorEventoChart :evento="eventoSeleccionado" />
      </div>
    </div>
  </div>
</template>


<style scoped>
.Gerente {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9fafb;
  min-height: 100vh;
  padding-bottom: 40px;
}

body {
  font-family: "Segoe UI", Arial, sans-serif;
  background-color: #f7f7f7;
  margin: 0;
  padding: 0;
}


.app-header {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}




.nav-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 2rem;
  padding: 0 20px;
  box-sizing: border-box;
}



.nav-left {
  display: flex;
  align-items: center;
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


.nav-center {
  display: flex;
  justify-content: center;
  gap: 1rem; 
  flex-wrap: wrap; 
}


.btn-nav {
  background: #bfdbfe;
  color: #1f2937;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.2s;
}



.btn-nav:hover {
  background: #93c5fd;
}

.perfil {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  width: 100%;
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

/* Contenedor principal */
.contenedor {
  padding: 30px;
  text-align: center;
}

.titulo-panel {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 20px;
}

/* Dashboard */
.dashboard-container {
  display: flex;
  flex-direction: row;
  gap: 30px;
  padding: 0 30px;
  justify-content: space-between;
  align-items: flex-start;
}

.dashboard-item {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 20px;
  flex: 1;
}

.evento-panel {
  flex: 1 1 40%;
}

.ventas-panel {
  flex: 1 1 60%;
}

.dashboard-titulo {
  font-size: 1.4rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 15px;
}

/* Tarjetas de evento */
.tarjetas-evento {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }

  .evento-panel,
  .ventas-panel {
    flex: 1 1 100%;
  }

  .tarjetas-evento {
    flex-direction: column;
  }
}
</style>

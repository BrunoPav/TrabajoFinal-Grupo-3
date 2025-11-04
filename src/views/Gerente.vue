


<template>
  <div class="Gerente">
    <nav class="app-header">
      <div class="nav-container">
        <div class="nav-left">
          <router-link to="/" class="logo">TicketOrt</router-link>
        </div>
        <div class="nav-center">
          <router-link to="/eventos" class="btn-nav">Lista de eventos</router-link>
        </div>
        <div class="perfil">
          <span>Hola, Gerente</span>
          <div class="avatar"></div>
        </div>
      </div>
    </nav>

    
<div class="contenedor">
  <h2 class="titulo-panel">Dashboard de Ventas y Recaudación</h2>
</div>


    <!-- Dashboards con títulos -->
    <div class="dashboard-container">
      <div class="dashboard-item">
        <h3 class="dashboard-titulo">Ventas por Evento</h3>
        <VentasPorEventoChart :eventos="eventoStore.eventos" />
      </div>
      <div class="dashboard-item">
        <h3 class="dashboard-titulo">Recaudación por Evento</h3>
        <RecaudacionPorEventoChart :eventos="eventoStore.eventos" />
      </div>
    </div>
  </div>
</template>

<script setup>
import VentasPorEventoChart from '../components/VentasPorEventoChart.vue'
import RecaudacionPorEventoChart from '../components/RecaudacionPorEventoChart.vue'
import { useEventoStore } from '../stores/eventoStore'
const eventoStore = useEventoStore()
// Puedes agregar tu lógica aquí
</script>

<style scoped>
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
  justify-content: flex-start;
  gap: 1rem;
  margin-left: -6cm;
  justify-content: left;
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


.dashboard-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  padding: 40px 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}




.dashboard-item {
  background-color: #ffffff;
  padding: 40px 30px; /* 40px arriba y abajo, 30px a los lados */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 410px; /* altura mínima aumentada en 10px */
  
}



.dashboard-titulo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 20px;
  text-align: center;
  border-bottom: 2px solid #3b82f6;
  padding-bottom: 10px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}


.titulo-panel {
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 30px;
}

</style>

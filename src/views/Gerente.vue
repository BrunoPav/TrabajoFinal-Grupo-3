<script setup>
import VentasPorEventoChart from '../components/VentasPorEventoChart.vue'
import RecaudacionPorEventoChart from '../components/RecaudacionPorEventoChart.vue'
import { useEventoStore } from '../stores/eventoStore'
import { useRouter } from 'vue-router'

const eventoStore = useEventoStore()
const router = useRouter()
const goHome = () => router.push('/')
// Puedes agregar tu lógica aquí
</script>

<template>
  <title>TicketOrt - Panel Gerencial</title>
  <div class="gerente-view">
    <nav class="app-header">
      <div class="nav-container">
        <div class="nav-left">
          <a @click="goHome" class="logo">TicketOrt</a>
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


    <div class="contenedor-principal">
      <h2 class="titulo-panel">Dashboard de Ventas y Recaudación</h2>


      <div class="dashboard-container">
        <div class="dashboard-item">
          <h3 class="dashboard-titulo">Ventas por Evento (Tickets)</h3>

          <VentasPorEventoChart :eventos="eventoStore.eventos" />
        </div>
        <div class="dashboard-item">
          <h3 class="dashboard-titulo">Recaudación por Evento (Monto)</h3>

          <RecaudacionPorEventoChart :eventos="eventoStore.eventos" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gerente-view {
  font-family: 'Inter', sans-serif;
  background-color: #f4f7fa;
  min-height: 100vh;
}


.app-header {
  background-color: #3b82f6;
  color: white;
  padding: 10px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
}

.logo {
  background-color: white;
  color: #111827;
  padding: 8px 15px;
  border-radius: 6px;
  font-size: 1.4rem;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
}

.nav-center {
  display: flex;
  gap: 15px;
}

.btn-nav {
  background: #bfdbfe;
  color: #1e40af;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap;
}

.btn-nav:hover {
  background: #dbeafe;
  color: #1c3983;
}

.perfil {
  display: flex;
  align-items: center;
  gap: 10px;
}

.perfil span {
  color: white;
  font-weight: 600;
}

.perfil .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #bfdbfe;
  border: 2px solid white;
}

.contenedor-principal {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 30px;
}

.titulo-panel {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 10px;
  border-bottom: 4px solid #3b82f6;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.dashboard-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
}

.dashboard-item {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.dashboard-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.dashboard-titulo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 25px;
  text-align: left;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 10px;
  width: 100%;
}

@media (max-width: 900px) {
  .dashboard-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .nav-center {
    width: 100%;
    justify-content: center;
  }

  .perfil {
    justify-content: flex-start;
    width: auto;
  }

  .titulo-panel {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 15px;
  }

  .contenedor-principal {
    padding: 20px 15px;
  }

  .btn-nav {
    font-size: 0.9rem;
    padding: 6px 10px;
  }
}
</style>

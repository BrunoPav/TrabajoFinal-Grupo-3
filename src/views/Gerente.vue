<script setup>
import { onMounted, ref } from 'vue'
import VentasPorEventoChart from '../components/VentasPorEventoChart.vue'
import RecaudacionPorEventoChart from '../components/RecaudacionPorEventoChart.vue'
import { useEventoStore } from '../stores/eventoStore'
import { useRouter } from 'vue-router'


const eventoStore = useEventoStore()
const router = useRouter()
const goHome = () => router.push('/')
const cargandoEventos = ref(false)


const verDetalle = (id) => {
    router.push({ path: `/gerente/eventos/${id}` }) 
}



onMounted(async () => {
    if (eventoStore.eventos.length === 0) {
        cargandoEventos.value = true
        try {
            await eventoStore.cargarEventos() 
        } catch (error) {
            console.error('Fallo la carga inicial de eventos:', error)
        } finally {
            cargandoEventos.value = false
        }
    }
})



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

           
            <div class="eventos-listado-contenedor">
                <h3 class="eventos-listado-titulo">Eventos Vigentes </h3>
                
                
                <div v-if="cargandoEventos" class="estado-carga">Cargando la lista de eventos</div>
                
                <!-- 2. Estado Vacío -->
                <div v-else-if="eventoStore.eventos.length === 0" class="estado-vacio">
                    No se encontraron eventos.
                </div>

                <!-- 3. Contenido (Tabla) -->
                <div v-else class="eventos-tabla-wrapper">
                    <table class="eventos-tabla">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Fecha</th>
                                <th>Lugar</th>
                                <th>Precio</th>
                                <th>Modalidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Implementación del @click para ir al detalle -->
                            <tr v-for="evento in eventoStore.eventos" 
                                :key="evento.id" 
                                @click="verDetalle(evento.id)"
                                class="fila-clickable">
                                <td>{{ evento.id }}</td>
                                <td>{{ evento.nombre }}</td>
                                <td>{{ evento.dia }}</td>
                                <td>{{ evento.lugar }}</td>
                                <td>$ {{ (evento.precio || 0).toFixed(2) }}</td>
                                <td><span :class="['tag', (evento.modalidad || '').toLowerCase()]">{{ evento.modalidad }}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
          

        </div>
    </div>
</template>

<style scoped>
/* Cambios implementados: */
/* 1. Fondo de toda la vista cambiado a #e2e8f0 (Celeste/Gris claro). */
/* 2. Color de texto principal: #1a202c (Gris oscuro). */

.gerente-view {
  font-family: 'Inter', sans-serif;
  background-color: #e2e8f0; /* Fondo Celeste/Gris claro para contraste */
  min-height: 100vh;
  color: #1a202c; /* Color de letra principal: Gris oscuro (casi negro) */
}


.app-header {
  background-color: #3b82f6;
  color: white; /* Letras blancas en el header */
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
  color: #111827; /* Letras oscuras en el logo */
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
  color: #1e40af; /* Letras azules en los botones de navegación */
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
  color: white; /* Letras blancas en el saludo */
  font-weight: 600;
}

.perfil .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #bfdbfe;
  border: 2px solid white;
}

/* Estilos del Dashboard y Contenedor Principal */
.contenedor-principal {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 30px;
}

.titulo-panel {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937; /* Letras de título principal: Gris muy oscuro */
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
  background-color: #ffffff; /* Fondo blanco para las cajas de gráficos */
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
  color: #3b82f6; /* Títulos de dashboard en azul */
  margin-bottom: 25px;
  text-align: left;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 10px;
  width: 100%;
}

/* --- ESTILOS DE LA TABLA DE EVENTOS --- */

.eventos-listado-contenedor {
    max-width: 1200px;
    margin: 40px auto;
    padding: 30px;
    background-color: #ffffff; /* Fondo blanco para la caja de la tabla */
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.eventos-listado-titulo {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1f2937; /* Título de la tabla en gris oscuro */
    margin-bottom: 25px;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 10px;
}

.eventos-tabla-wrapper {
    overflow-x: auto;
}

.eventos-tabla {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.95rem;
}

.eventos-tabla th, .eventos-tabla td {
    padding: 12px 15px;
    border-bottom: 1px solid #e5e7eb;
}

.eventos-tabla th {
    background-color: #f3f4f6;
    color: #4b5563; /* Letras de encabezado de tabla en gris */
    font-weight: 600;
    text-transform: uppercase;
}

.eventos-tabla tbody tr:hover {
    background-color: #f9fafb;
}

/* Estilos de tags (Modalidad) */
.tag {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
}

.virtual {
    background-color: #dbeafe;
    color: #1e40af;
}

.presencial {
    background-color: #d1fae5;
    color: #065f46;
}

.estado-carga, .estado-vacio {
    text-align: center;
    padding: 20px;
    color: #6b7280;
    font-style: italic;
}

/* Media Queries */
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
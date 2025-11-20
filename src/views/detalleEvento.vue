<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'; 
import { useEventoStore } from '../stores/eventoStore';
import VentasDetalleChart from '../components/VentasDetalleChart.vue'; 



const route = useRoute();
const router = useRouter();
const eventoStore = useEventoStore();


const eventoDetalle = ref(null);
const cargando = ref(true);


const eventoId = route.params.id;


console.log("Vista Detalle: ID capturado de la URL ->", eventoId); 

const buscarEvento = () => {
   
    const eventoEncontrado = eventoStore.eventos.find(
        e => String(e.id) === String(eventoId)
    );
    
    if (eventoEncontrado) {
        eventoDetalle.value = eventoEncontrado;
    } else {
        console.error(`Evento con ID ${eventoId} no encontrado en el store.`);
    }
};

onMounted(async () => {
    
    if (eventoStore.eventos.length === 0) {
        try {
            await eventoStore.cargarEventos();
        } catch (error) {
            console.error("Error al cargar eventos para la vista de detalle:", error);
        }
    }
    
    
    buscarEvento();
    cargando.value = false;
});


const volverAlPanel = () => {
    
    router.push('/gerente');
};
</script>

<template>
    <!-- El contenedor principal  -->
    <div class="detalle-view-wrapper">
        
    
        <nav class="app-header">
            <div class="nav-container">
                <div class="nav-left">
                
                    <button @click="volverAlPanel" class="logo btn-volver">
                        Panel Gerente
                    </button>
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
            <div class="contenedor">
                <h2 class="titulo-panel">Ventas del Evento (ID: {{ eventoId }})</h2>
            </div>

            <!-- LÓGICA CONDICIONAL: MANEJO DE ESTADOS  -->
            <div v-if="cargando" class="estado-mensaje">Cargando detalles del evento...</div>
            
            <div v-else-if="!eventoDetalle" class="estado-mensaje error">
                Error 404: No se encontró el evento con ID {{ eventoId }}.
            </div>
            
     
            <div v-else class="dashboard-container">
                
                <!--  DETALLES FIJOS DEL EVENTO -->
                <div class="dashboard-item evento-panel">
                    <h3 class="dashboard-titulo">Detalles del Evento</h3>
                    
                    <!-- Información del evento -->
                    <div class="tarjetas-evento">
                        <div class="info-card">
                            <h2 class="info-title">{{ eventoDetalle.nombre || 'Nombre evento' }}</h2>
                            
                            <p class="info-detail">Lugar: <strong>{{ eventoDetalle.lugar }}</strong></p>
                            <p class="info-detail">Día: <strong>{{ eventoDetalle.dia }}</strong></p>
                            <p class="info-detail">Horario: <strong>{{ eventoDetalle.horario }}</strong></p>
                            <p class="info-detail">Precio: <strong>${{ (eventoDetalle.precio || 0).toFixed(2) }}</strong></p>
                            <p class="info-detail info-modalidad">Modalidad:
                                <span :class="['tag', (eventoDetalle.modalidad || '').toLowerCase()]">
                                    {{ eventoDetalle.modalidad || 'Modalidad' }}
                                </span>
                            </p>
                        </div>
                    </div>
                    
                    <div class="event-image-box">
                        <!-- Imagen de Evento -->
                    </div>
                </div>

                <!--  RESUMEN DE VENTAS/ANÁLISIS -->
                <div class="dashboard-item ventas-panel">
                    <h3 class="dashboard-titulo">Análisis y Ventas</h3>
                    
                    <div class="resumen-ventas">
                        <!--  COMPONENTE DE GRÁFICO  -->
                        <VentasDetalleChart 
                            :eventoId="eventoId" 
                            :eventoNombre="eventoDetalle.nombre" 
                        />
                        
                        <p style="margin-top: 15px;">Precio Base del Evento: ${{ (eventoDetalle.precio || 0).toFixed(2) }}</p>
                    </div>
                </div>
            </div>
            

        </div>
    </div>
</template>

<style scoped>

.detalle-view-wrapper { 
    min-height: 100vh; 
    background-color: #f4f7fa; 
    font-family: 'Inter', sans-serif; 
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
.btn-volver {
   
    border: none;
    background: #bfdbfe;
    color: #1e40af;
    cursor: pointer;
    font-weight: 600;
    padding: 8px 15px;
    border-radius: 6px;
    font-size: 1.4rem;
    font-weight: bold;
    text-decoration: none;
}
.btn-volver:hover {
    background: #dbeafe;
    color: #1c3983;
}
.btn-nav {
    background: #bfdbfe;
    color: #1e40af;
    text-decoration: none;
    padding: 8px 15px;
    border-radius: 6px;
    font-weight: 600;
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
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}
.dashboard-item {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
.dashboard-titulo {
    font-size: 1.5rem;
    font-weight: 700;
    color: #3b82f6;
    margin-bottom: 20px;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 10px;
}


.info-card {
    padding: 10px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 20px;
}
.info-title {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: #1f2937;
}
.info-detail {
    margin: 5px 0;
    font-size: 0.95rem;
    color: #4b5563;
}
.info-detail strong {
    color: #111827;
}
.tag {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
    margin-left: 5px;
}
.virtual {
    background-color: #dbeafe;
    color: #1e40af;
}
.presencial {
    background-color: #d1fae5;
    color: #065f46;
}


.estado-mensaje {
    text-align: center;
    padding: 40px;
    color: #6b7280;
    font-size: 1.1rem;
    margin-top: 50px;
}
.estado-mensaje.error {
    color: #ef4444;
    font-weight: bold;
    background-color: #fee2e2;
    border-radius: 8px;
}
</style>
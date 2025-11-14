<script setup>
import { useRouter } from 'vue-router'
import { useEventoStore } from '../stores/eventoStore.js'
import { useRolStore } from '../stores/rolStore.js'
import { onMounted, computed } from 'vue'

const eventoStore = useEventoStore()
const rolStore = useRolStore()

onMounted(async () => {
  try { await eventoStore.cargarEventos() } catch (e) { console.error(e) }
})

const eventosGuardados = computed(() => eventoStore.eventos)

const router = useRouter()
const goABM = (event = null) => {
    if (event) {
        router.push({ path: '/organizador/crear', query: { id: event.id } })
    } else {
        router.push('/organizador/crear')
    }
}


const goComprar = (event) => {
    router.push({ name: 'UsuarioHome', query: { id: event.id } })
}
</script>

<template>
    <div class="home-view">
        <nav class="app-header">
            <div class="nav-container">
                <div class="nav-left">
                    <h1 class="logo">TicketOrt</h1>
                </div>
                <div class="nav-center" v-if="rolStore.rol === 'cliente@a'">
                    <router-link to="/login" class="btn-nav">Mis Tickets</router-link>
                </div>
                <div class="nav-center" v-if="rolStore.rol === 'gerente@a'">
                    <router-link to="/gerente" class="btn-nav">Panel Gerencial</router-link>
                </div>
                <div class="nav-right">
                    <router-link to="/login" class="btn-login-nav">Iniciar sesión</router-link>
                </div>
            </div>
        </nav>

        <div class="estado-vacio-panel"
            v-if="(eventosGuardados == null || eventosGuardados.length === 0) && (rolStore.rol === 'organizador@a' || rolStore.rol === 'gerente@a')">
            <div class="estado-vacio-contenido">
                <span class="icono-busqueda">🔍</span>
                <p class="mensaje-vacio">No tienes eventos creados</p>
                <button class="btn-crear-evento" @click="goABM">CREAR EVENTO</button>
            </div>
        </div>

        <section class="grid-eventos" v-else>
            <article class="evento-card" v-for="event in eventosGuardados" :key="event.id">
                <div class="evento-imagen">
                    <span v-if="!event.imagen">Imagen no disponible</span>
                    <img v-else :src="event.imagen" alt="Imagen del evento" class="preview-img">
                </div>
                <div class="card-body">
                    <h3 class="card-title">{{ event.nombre }}</h3>
                    <ul class="event-meta">
                        <li>Lugar: **{{ event.lugar }}**</li>
                        <li>Día: {{ event.dia }}</li>
                        <li>Horario: {{ event.horario }}</li>
                        <li>Modalidad:
                            <span :class="['modalidad-tag', event.modalidad.toLowerCase()]">
                                {{ event.modalidad }}
                            </span>
                        </li>
                        <li>Precio: <strong class="precio-card">${{ event.precio.toLocaleString('es-AR') }}</strong>
                        </li>
                    </ul>
                    <button class="btn-compra" @click="goComprar(event)"
                        v-if="rolStore.rol === 'cliente@a'">COMPRAR</button>
                    <button class="btn-gestion" @click="goABM(event)"
                        v-if="rolStore.rol === 'organizador@a' || rolStore.rol === 'gerente@a'">EDITAR</button>
                </div>
            </article>

            <div class="new-card-placeholder" v-if="rolStore.rol === 'organizador@a' || rolStore.rol === 'gerente@a'">
                <button class="btn-crear-evento-pequeño" @click="goABM">Nuevo Evento</button>
            </div>
        </section>
    </div>
</template>


<style scoped>
.app-header {
    background-color: #3b82f6;
    color: white;
    padding: 0.75rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
}

/* Nav: usar flex para desktop limpio */
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.nav-left { display:flex; align-items:center; }
.nav-center { display:flex; gap:12px; }
.nav-right { display:flex; align-items:center; }

/* Contenedor principal sin min-width forzada */
.home-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 48px;
}

/* Estado vacío: ajustar altura y sombras suaves */
.estado-vacio-panel { height: 60vh; }
.estado-vacio-contenido { padding:40px; }

/* Tarjetas */
.grid-eventos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 8px;
}
.evento-card { transition: box-shadow .25s ease, transform .25s ease; }
.evento-card:hover { transform: translateY(-4px); box-shadow: 0 6px 18px rgba(0,0,0,.12); }
.evento-imagen { height: 160px; }
.card-title { font-size:1.2rem; }
.event-meta { font-size:.9rem; }
.btn-compra, .btn-gestion { margin-top:auto; }

.new-card-placeholder { min-height:160px; }

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

.btn-login-nav {
    background-color: #10b981;
    color: white;
    text-decoration: none;
    padding: 8px 15px;
    border-radius: 6px;
    font-weight: bold;
    transition: background-color 0.2s;
}

.btn-login-nav:hover {
    background-color: #059669;
}

.estado-vacio-panel {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh;
    max-width: 1200px;
    margin: 30px auto;
}

.estado-vacio-contenido {
    text-align: center;
    padding: 50px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    max-width: 400px;
}

.icono-busqueda {
    font-size: 3rem;
    color: #9ca3af;
    display: block;
    margin-bottom: 10px;
}

.mensaje-vacio {
    font-size: 1.5rem;
    color: #6b7280;
    margin-bottom: 25px;
    font-weight: 500;
}

.btn-crear-evento {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-crear-evento:hover {
    background-color: #2563eb;
}

.home-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px 30px 20px;
    min-width: 1024px;
}

.grid-eventos {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.evento-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s ease;
    display: flex;
    flex-direction: column;
}

.evento-card:hover {
    transform: translateY(-5px);
}

.evento-imagen {
    height: 180px;
    background: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    font-size: 0.9rem;
    overflow: hidden;
}

.preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card-body {
    padding: 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.card-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #1f2937;
    margin: 0 0 10px 0;
}

.event-meta {
    list-style: none;
    padding: 0;
    margin: 0 0 15px;
    color: #4b5563;
    border-top: 1px solid #eee;
    padding-top: 10px;
    flex-grow: 1;
}

.event-meta li {
    margin-bottom: 5px;
    font-size: 0.95rem;
}

.modalidad-tag {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 700;
    color: white;
}

.modalidad-tag.presencial {
    background-color: #3b82f6;
}

.modalidad-tag.virtual {
    background-color: #10b981;
}

.precio-card {
    font-size: 1.1rem;
    color: #ef4444;
}

.btn-compra {
    width: 100%;
    background: #10b981;
    border: none;
    color: white;
    font-weight: bold;
    padding: 10px 0;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-compra:hover {
    background: #059669;
}

.btn-gestion {
    width: 100%;
    background: #3b82f6;
    border: none;
    color: white;
    font-weight: bold;
    padding: 10px 0;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-gestion:hover {
    background: #2563eb;
}

.new-card-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eef2ff;
    border: 2px dashed #93c5fd;
    border-radius: 12px;
    min-height: 250px;
}

.btn-crear-evento-pequeño {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
}

/* Forzar vista de escritorio por defecto */
/* .home-view {
  min-width: 1024px;
}
.nav-container {
  min-width: 1024px;
} */

/* Mantener comportamiento móvil solo en pantallas muy pequeñas */
@media (max-width: 600px) {
  .nav-container {
    grid-template-columns: 1fr;
    justify-content: center;
  }
  .nav-center {
    order: 3;
    margin-top: 10px;
  }
  .nav-right {
    order: 2;
    justify-content: center;
  }
}
@media (max-width: 900px) {
  .nav-container { flex-wrap: wrap; }
  .nav-center { order:3; width:100%; justify-content:center; margin-top:8px; }
}
</style>
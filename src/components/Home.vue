<template>
  <div class="home-view">
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-left">
          <h1 class="brand">TicketOrt</h1>
        </div>
        <div class="nav-center">
          <router-link to="/login" class="nav-btn">Mis compras</router-link>
          <router-link to="/login" class="nav-btn">Mis Tickets</router-link>
        </div>
        <div class="nav-right">
          <router-link to="/login" class="nav-btn">Iniciar sesión</router-link>
        </div>
      </div>
    </nav>

    <div class="event-meta" v-if="eventosGuardados == null || eventosGuardados.length === 0" >
        <div class="icon">🔍</div>
        <p>No tienes eventos creados</p>
        <button class="btn-crear" @click="goABM">CREAR EVENTO</button>
    </div>

    <section class="cards" v-for="event in eventosGuardados" :key="event.id">      
      <article class="card" >
        <div class="card-image">imagen evento</div>
        <div class="card-body">
          <ul class="event-meta">
            <li class="title">{{ event.nombre }}</li>
            <li>Lugar: {{ event.lugar }}</li>
            <li>Día: {{ event.dia }}</li>
            <li>Horario: {{ event.horario }}</li>
            <li>Modalidad: {{ event.modalidad }}</li>
            <li>Precio: ${{ event.precio }}</li>
          </ul>
          <button class="buy" @click="goLogin">COMPRAR</button>
        </div>
      </article>

      <div class="new-card">
          <button class="buy" @click="goABM">Nuevo Evento</button>
      </div>

    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TarjetaEvento from '../components/TarjetaEvento.vue'
import { useEventoStore } from '../stores/eventoStore'


const eventoStore = useEventoStore()//instancio el store de eventos
const eventosGuardados = eventoStore.eventos//le paso el array de los eventos guardados

const router = useRouter()
const goLogin = () => router.push('/login')
const goABM = () => router.push('/organizador/crear')

</script>

<style scoped>
.navbar {
  background-color: #3b82f6; /* azul */
  color: #fff;
  padding: 0.75rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  padding: 0 1.5rem;
}

.nav-left { display: flex; align-items: center; }

.brand {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: #fff;
  color: #1f2937;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
}

.nav-center { display: flex; justify-content: center; gap: 1rem; }

.nav-btn {
  background: #dbeafe; /* azul muy claro */
  color: #1f2937;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid #93c5fd;
}
.nav-btn:hover { background: #bfdbfe; }

.nav-right { display: flex; justify-content: flex-end; align-items: center; gap: 0.75rem; }
.greeting { background: #eef2ff; color: #1f2937; padding: 0.4rem 0.75rem; border-radius: 6px; }
.avatar { width: 56px; height: 56px; border-radius: 50%; background: #fff; border: 2px solid rgba(0,0,0,0.1); }

/* Layout general */
.home-view { max-width: 1200px; margin: 0 auto; }

.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }

/* Card del evento */
.card { background: #f3f4f6; border: 2px solid #cbd5e1; border-radius: 4px; }
.card-image { height: 140px; background: #ffffff; border-bottom: 2px solid #cbd5e1; display: flex; align-items: center; justify-content: center; color: #6b7280; }
.card-body { padding: 1rem 1.25rem 1.25rem; }
.event-meta { list-style: none; padding: 0; margin: 0 0 1rem; color: #4b5563; }
.event-meta .title { font-size: 1.1rem; color: #1f2937; margin-bottom: 0.5rem; }
.new-card { display: flex; align-items: center; justify-content: center; background: #e0e7ff; border: 2px dashed #a5b4fc; border-radius: 4px; }

.buy { width: 180px; display: inline-block; margin-left: auto; background: #93c5fd; border: 1px solid #3b82f6; color: #111827; font-weight: 800; padding: 0.5rem 1rem; border-radius: 6px; }
.buy:hover { background: #60a5fa; }

/* Responsive */
@media (max-width: 1024px) { .cards { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .cards { grid-template-columns: 1fr; } }
</style>
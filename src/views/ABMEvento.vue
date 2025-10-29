<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEventoStore } from '../stores/eventoStore';

const router = useRouter()
const goHome = () => router.push('/')

const eventoStore = useEventoStore()

const evento = ref({
  nombre: '',
  lugar: '',
  dia: '',
  horario: '',
  modalidad: '',
  precio: 0,
  imagen: ''
})

function agregarEvento() {
  eventoStore.agregarEvento({ ...evento.value })
  router.push('/')//vuelve al home
}
  
</script>

<template>
  <title>Gestor de Eventos - TicketOrt</title>
  <header>
    <div class="logo" @click="goHome">TicketOrt</div>
    <div class="perfil">
      <span>Hola, ORGANIZADOR</span>
      <div class="avatar"></div>
    </div>
  </header>
  

  <main class="contenedor">
    <section class="formulario">
      <h2>Completa el Formulario</h2>

      <form @submit.prevent="agregarEvento()">
        <label>Nombre del evento:</label>
        <input v-model="evento.nombre" type="text" placeholder="Ej: RockFest 2025" />

        <label>Lugar:</label>
        <input v-model="evento.lugar" type="text" placeholder="Ej: Estadio Central" />

        <label>Fecha:</label>
        <input v-model="evento.dia" type="date" />

        <label>Horario:</label>
        <input v-model="evento.horario" type="time" />

        <label>Modalidad:</label>
        <select v-model="evento.modalidad">
          <option>Presencial</option>
          <option>Virtual</option>
        </select>

        <label>Precio:</label>
        <input v-model="evento.precio" type="number" placeholder="Ej: 1500" />

        <div class="botones">
          <button type="reset" @click="goHome" >
            CANCELAR
          </button>
          <button type="submit" @click="agregarEvento">
            GUARDAR EVENTO
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<style>

    body {
  font-family: "Segoe UI", Arial, sans-serif;
  background-color: #131a27;
  margin: 0;
  padding: 0;
}



    /* ----- HEADER ----- */
    header {
      background-color: #3b82f6;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      border-bottom: 1px solid #cbd5e1;
    }

    .logo {
      background-color: white;
      color: #111827;
      padding: 15px 25px;
      border-radius: 15px;
      font-size: 1.3rem;
      font-weight: bold;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .perfil {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .perfil span {
      background-color: white;
      color: #374151;
      padding: 5px 15px;
      border-radius: 5px;
      font-weight: 500;
    }

    .perfil .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: white;
      border: 2px solid #2563eb;
    }

    /* ----- CONTENEDOR PRINCIPAL ----- */
    .contenedor {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      background-color: #f9fafb;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      margin: 30px;
      padding: 30px;
      gap: 40px;
    }

    .formulario {
      flex: 1;
    }

    .formulario h2 {
      font-size: 1.2rem;
      font-weight: bold;
      color: #374151;
      margin-bottom: 20px;
    }

    .formulario h2 u {
      text-underline-offset: 4px;
    }

    label {
      display: block;
      font-weight: 500;
      color: #374151;
      margin-top: 10px;
      margin-bottom: 4px;
    }

    input, select {
      width: 100%;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #9ca3af;
      margin-bottom: 8px;
      font-size: 1rem;
    }

    /* ----- PREVISUALIZACIÓN DE EVENTO ----- */
    .preview {
      width: 300px;
      text-align: center;
      border: 1px solid #9ca3af;
      padding: 15px;
      background-color: #f3f4f6;
      border-radius: 8px;
    }

    .preview .imagen {
      width: 100%;
      height: 180px;
      background-color: white;
      border: 1px solid #9ca3af;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 15px;
      font-size: 1rem;
      color: #111827;
    }

    /* ----- BOTONES ----- */
    .botones {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    button {
      background-color: #bfdbfe;
      color: #111827;
      border: 1px solid #9ca3af;
      border-radius: 8px;
      padding: 10px;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    button:hover {
      background-color: #93c5fd;
    }

    @media (max-width: 900px) {
      .contenedor {
        flex-direction: column;
        align-items: center;
      }
      .preview {
        width: 90%;
      }
    }
</style>

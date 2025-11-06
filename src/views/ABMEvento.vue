<script setup>
import { ref } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { useEventoStore } from '../stores/eventoStore';

const router = useRouter()
const route = useRoute()
const goHome = () => router.push('/')

const eventoStore = useEventoStore()

const evento = ref({
  nombre: '',
  lugar: '',
  dia: '',
  horario: '',
  modalidad: '',
  precio: 0,
  descripcion: '',
  imagen: ''
})



function agregarEvento() {
  if (route.query.id) {
    eventoStore.actualizarEvento(evento.value)
  } else {
  eventoStore.agregarEvento({ ...evento.value })//agrega el evento al store con el metodo agregarEvento definido en eventoStore.js
  }
  router.push('/')//vuelve al home
  
}



</script>

<template>
  <title>Gestor de Eventos - TicketOrt</title>
  <header class="app-header">
    <div class="logo" @click="goHome">TicketOrt</div>
    <div class="perfil">
      <span>Hola, ORGANIZADOR</span>
      <div class="avatar"></div>
    </div>
  </header>

  <main class="contenedor">
    <section class="formulario-container">
      <h2 class="title-form">Completa el Formulario</h2>

      <form @submit.prevent="agregarEvento()" class="form-grid">

        <div class="form-inputs">
          <label>Nombre del evento:</label>
          <input v-model="evento.nombre" type="text" placeholder="Ej: RockFest 2025" required />

          <label>Lugar:</label>
          <input v-model="evento.lugar" type="text" placeholder="Ej: Estadio Central" required />

          <label>Fecha:</label>
          <input v-model="evento.dia" type="date" required />

          <label>Horario:</label>
          <input v-model="evento.horario" type="time" required />

          <label>Modalidad:</label>
          <select v-model="evento.modalidad" required>
            <option value="" disabled>Seleccione modalidad</option>
            <option>Presencial</option>
            <option>Virtual</option>
          </select>

          <label>Descripción:</label>
          <textarea v-model="evento.descripcion" placeholder="Descripción del evento" required></textarea>

          <label>Precio:</label>
          <input v-model.number="evento.precio" type="number" min="0" placeholder="Ej: 1500" required />
        </div>

        <div class="form-actions">
          <div class="image-box">
            <span>Imagen evento</span>
          </div>

          <button type="button" class="btn-subir" @click="subirImagen">
            SUBIR IMAGEN
          </button>

          <button type="submit" class="btn-action save" @click="agregarEvento">
            GUARDAR EVENTO
          </button>
          <button type="reset" class="btn-action cancel" @click="goHome">
            CANCELAR
          </button>
        </div>
      </form>
    </section>
  </main>
 </template>

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.perfil {
  display: flex;
  align-items: center;
  gap: 10px;
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

.contenedor {
  padding: 30px;
  background-color: #f7f7f7;
  min-height: calc(100vh - 65px);
}

.formulario-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.title-form {
  font-size: 1.5rem;
  font-weight: bold;
  color: #374151;
  margin-bottom: 25px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.form-inputs {
  grid-column: 1 / 2;
}

.form-actions {
  grid-column: 2 / 3;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-top: 15px;
}

label {
  display: block;
  font-weight: 600;
  color: #4a5568;
  margin-top: 10px;
  margin-bottom: 5px;
}

input,
select {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.image-box {
  width: 100%;
  height: 180px;
  background-color: #f0f4f8;
  border: 2px dashed #93c5fd;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  color: #64748b;
  overflow: hidden;
}

.btn-subir {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-subir:hover {
  background-color: #388e3c;
}

.btn-action {
  padding: 12px 10px;
  font-weight: bold;
  border-radius: 6px;
  border: none;
  transition: background-color 0.2s;
}

.btn-action.cancel {
  background-color: #ef4444;
  color: white;
}

.btn-action.cancel:hover {
  background-color: #dc2626;
}

.btn-action.save {
  background-color: #3b82f6;
  color: white;
}

.btn-action.save:hover {
  background-color: #2563eb;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-inputs,
  .form-actions {
    grid-column: 1 / 2;
  }
}
 </style>
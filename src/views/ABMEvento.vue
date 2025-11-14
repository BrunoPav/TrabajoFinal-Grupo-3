<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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

const imagenPreview = ref('')


onMounted(() => {
  if (route.query.id) {
    const eventoExistente = eventoStore.eventos.find(e => e.id == route.query.id)
    if (eventoExistente) {
      evento.value = { ...eventoExistente }
      imagenPreview.value = eventoExistente.imagen
    }
  }
})


const subirImagen = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagenPreview.value = e.target.result
      evento.value.imagen = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const agregarEvento = async () => {
  if (route.query.id) {
    await eventoStore.actualizarEvento(evento.value) // hace PUT en MockAPI
  } else {

    await eventoStore.agregarEvento({ ...evento.value }) // hace POST en MockAPI
  }
  router.push('/')
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
      <h2 class="title-form">
        {{ route.query.id ? 'Editar Evento' : 'Crear Nuevo Evento' }}
      </h2>

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
          <textarea v-model="evento.descripcion" class="form-textarea" placeholder="Descripción del evento"
            required></textarea>

          <label>Precio:</label>
          <input v-model.number="evento.precio" type="number" min="0" placeholder="Ej: 1500" required />
        </div>

        <div class="form-actions">
          <div class="image-box">
            <template v-if="imagenPreview">
              <img :src="imagenPreview" alt="Preview del evento" />
            </template>
            <template v-else>
              <span>Imagen evento</span>
            </template>
          </div>

          <input type="file" id="imagenUpload" @change="subirImagen" accept="image/*" style="display: none" />
          <label for="imagenUpload" class="btn-subir">SUBIR IMAGEN</label>

          <button type="submit" class="btn-action save" @click="agregarEvento">
            {{ route.query.id ? 'ACTUALIZAR EVENTO' : 'GUARDAR EVENTO' }}
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
.contenedor {
  padding: 30px;
  background-color: #f7f7f7;
  min-height: calc(100vh - 65px);
}

.formulario-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.title-form {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 25px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 10px;
}

.app-header {
  background-color: #3b82f6;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.logo {
  background-color: white;
  color: #111827;
  padding: 8px 15px;
  border-radius: 6px;
  font-size: 1.4rem;
  font-weight: bold;
  cursor: pointer;
}

.perfil span {
  color: white;
  font-weight: 600;
  padding: 5px 10px;
}

.perfil .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #bfdbfe;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #3b82f6;
}

.form-grid {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 40px;
}

.form-inputs {
  grid-column: 1 / 2;
}

.form-actions {
  grid-column: 2 / 3;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 5px;
}

label {
  display: block;
  font-weight: 700;
  color: #1f2937;
  margin-top: 15px;
  margin-bottom: 5px;
}

input,
select,
textarea {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: border-color 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.image-box {
  width: 100%;
  height: 220px;
  background-color: #eef2ff;
  border: 2px dashed #60a5fa;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  color: #64748b;
  overflow: hidden;
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-subir {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 12px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s ease;
}

.btn-subir:hover {
  background-color: #059669;
}

.btn-action {
  padding: 14px 10px;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
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
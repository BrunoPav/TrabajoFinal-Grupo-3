<script setup>
import { ref, watch, computed } from 'vue';
import { useRolStore } from '../stores/rolStore';

const rolStore = useRolStore();

const props = defineProps({
  evento: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['comprar']);

const evento = computed(() => props.evento);

const handleComprar = () => {
  emit('comprar', evento.value.id);
}
</script>

<template>
  <div class="evento-card">

    <div class="evento-imagen">
      <span v-if="!evento.imagen">Imagen no disponible</span>
      <img v-else :src="evento.imagen" alt="Imagen del evento" class="preview-img">
    </div>

    <div class="evento-info">
      <h3 class="card-title">{{ evento.nombre }}</h3>

      <ul class="meta-list">
        <li>
          <span class="icon"></span>
          <span class="label">Lugar:</span> {{ evento.lugar }}
        </li>
        <li>
          <span class="icon"></span>
          <span class="label">Día:</span> {{ evento.dia }}
        </li>
        <li>
          <span class="icon"></span>
          <span class="label">Horario:</span> {{ evento.horario }}
        </li>
        <li>
          <span class="icon"></span>
          <span class="label">Descripción:</span> {{ evento.descripcion }}
        </li>
        <li>
          <span class="icon"></span>
          <span class="label">Modalidad:</span>
          <span :class="['modalidad-tag', evento.modalidad.toLowerCase()]">
            {{ evento.modalidad }}
          </span>
        </li>
      </ul>
    </div>

    <div class="card-footer">
      <div class="precio">
        <span class="moneda">$</span>{{ evento.precio.toLocaleString('es-AR') }}
      </div>
      <button class="evento-boton" @click="handleComprar" v-if="rolStore.rol === 'cliente@a'">
        COMPRAR
      </button>
    </div>
  </div>
</template>

<style scoped>
.evento-card {
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.evento-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.evento-imagen {
  width: 100%;
  height: 180px;
  background-color: #e5e7eb;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  color: #6b7280;
  overflow: hidden;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.evento-info {
  padding: 15px;
  flex-grow: 1;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 10px 0;
  line-height: 1.2;
}

.meta-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid #e5e7eb;
  padding-top: 10px;
}

.evento-info li {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  color: #4b5563;
  margin-bottom: 8px;
}

.evento-info .icon {
  margin-right: 10px;
  font-size: 1.2rem;
  line-height: 1;
}

.evento-info .label {
  font-weight: 600;
  margin-right: 5px;
  color: #374151;
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

.card-footer {
  padding: 15px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9fafb;
}

.precio {
  font-size: 1.8rem;
  font-weight: 800;
  color: #ef4444;
  display: flex;
  align-items: baseline;
}

.precio .moneda {
  font-size: 1.2rem;
  margin-right: 3px;
  opacity: 0.7;
}

.evento-boton {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.evento-boton:hover {
  background-color: #059669;
}
</style>
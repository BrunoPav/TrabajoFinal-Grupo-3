<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  eventoData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update']);

const evento = ref({ ...props.eventoData });

watch(
  () => props.eventoData,
  (newValue) => {
    evento.value = { ...newValue }
    emit('update', { eventoData: newValue })
  },
  { deep: true }
);


</script>


<template>
  <div class="evento-card">
    <div class="evento-imagen">imagen evento</div>
    <div class="evento-info">
      <ul>
        <li><strong>Nombre:</strong> {{ evento.nombre }}</li>
        <li><strong>Lugar:</strong> {{ evento.lugar }}</li>
        <li><strong>Día:</strong> {{ evento.dia }}</li>
        <li><strong>Horario:</strong> {{ evento.horario }}</li>
        <li><strong>Modalidad:</strong> {{ evento.modalidad }}</li>
        <li><strong>Precio:</strong> {{ evento.precio }}</li>
      </ul>
    </div>
    <button class="evento-boton">Comprar</button>
  </div>
</template>

<style scoped>
.evento-card {
  width: 300px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.15);
  padding: 1rem;
  text-align: center;
  transition: transform 0.2s ease;
}
.evento-card:hover {
  transform: translateY(-5px);
}
.evento-imagen img {
  width: 100%;
  border-radius: 10px;
}
.evento-info {
  text-align: left;
  margin-top: 1rem;
}
.evento-boton {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  border-radius: 8px;
  cursor: pointer;
}
.evento-boton:hover {
  background-color: #0056b3;
}
</style>




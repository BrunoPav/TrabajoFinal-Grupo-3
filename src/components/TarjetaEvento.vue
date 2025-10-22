<template>
  <div class="evento-card">
    <div class="evento-imagen">imagen evento</div>
    <div class="evento-info">
      <p><strong>Nombre:</strong> {{ nombre }}</p>
      <p><strong>Lugar:</strong> {{ lugar }}</p>
      <p><strong>Día:</strong> {{ dia }}</p>
      <p><strong>Horario:</strong> {{ horario }}</p>
      <p><strong>Modalidad:</strong> {{ modalidad }}</p>
      <p class="evento-precio">Precio: {{ precio }}</p>
    </div>
    <button class="evento-boton">Comprar</button>
  </div>
</template>

<script setup>
const props = defineProps({
  id: [String, Number],
  nombre: { type: String, required: true },
  lugar: String,
  dia: { type: String, required: true },
  horario: String,
  modalidad: { type: String, required: true },
  precio: [String, Number]
});

</script>

<style scoped>
  body {
    font-family: Arial, sans-serif;
    background-color: #f3f4f6;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
  }

  .evento-card {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 280px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .evento-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  .evento-imagen {
    width: 100%;
    height: 160px;
    background-color: #e5e7eb;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #555;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .evento-info {
    padding: 16px 20px;
    flex-grow: 1;
  }

  .evento-info p {
    margin: 6px 0;
    color: #333;
    line-height: 1.4;
    font-size: 0.95rem;
  }

  .evento-precio {
    font-weight: bold;
    color: #2563eb;
    margin-top: 10px;
  }

  .evento-boton {
    background-color: #3b82f6;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    border: none;
    border-radius: 0 0 12px 12px;
    padding: 12px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 1rem;
  }

  .evento-boton:hover {
    background-color: #2563eb;
  }
</style>



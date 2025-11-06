import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEventoStore = defineStore('eventoStore', () => { // Nombre del store 'eventoStore'
  // Array reactivo de eventos guardados
  const eventos = ref([])

  // Método para agregar un nuevo evento
  const agregarEvento = (nuevoEvento) => {   
    nuevoEvento.id = eventos.value.length + 1;
     eventos.value.push({ ...nuevoEvento })
  }
  
  const actualizarEvento = (eventoActualizado) => {
  const index = eventos.value.findIndex(e => e.id === eventoActualizado.id)
  if (index !== -1) {
    eventos.value[index] = { ...eventoActualizado }
  }
  }
  return { eventos, agregarEvento, actualizarEvento }
})
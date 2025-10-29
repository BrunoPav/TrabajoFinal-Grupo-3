import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEventoStore = defineStore('eventoStore', () => {
  // Array reactivo de eventos guardados
  const eventos = ref([])

  // Método para agregar un nuevo evento
  const agregarEvento = (nuevoEvento) => {
   
    nuevoEvento.id = eventos.value.length + 1;
     eventos.value.push({ ...nuevoEvento })
  }

  return { eventos, agregarEvento }
})
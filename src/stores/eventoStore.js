import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEventoStore = defineStore('eventoStore', () => { // Nombre del store 'eventoStore'
  // Cargar eventos desde localStorage si existen
  const eventosGuardados = localStorage.getItem('eventos')
  const eventos = ref(eventosGuardados ? JSON.parse(eventosGuardados) : [])

  // Función para guardar en localStorage
  const guardarEnLocalStorage = () => {
    localStorage.setItem('eventos', JSON.stringify(eventos.value))
  }

  // Método para agregar un nuevo evento
  const agregarEvento = (nuevoEvento) => {   
    nuevoEvento.id = eventos.value.length + 1;
    eventos.value.push({ ...nuevoEvento })
    guardarEnLocalStorage()
  }
  
  const actualizarEvento = (eventoActualizado) => {
    const index = eventos.value.findIndex(e => e.id === eventoActualizado.id)
    if (index !== -1) {
      eventos.value[index] = { ...eventoActualizado }
      guardarEnLocalStorage()
    }
  }
  
  return { eventos, agregarEvento, actualizarEvento }
})
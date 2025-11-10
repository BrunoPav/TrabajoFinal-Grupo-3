import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEventoStore = defineStore('eventoStore', () => {

  const eventos = ref([])

  const nextId = () =>
    eventos.value.length === 0 ? 1 : Math.max(...eventos.value.map(e => e.id || 0)) + 1

  const agregarEvento = (nuevoEvento) => {
    const id = nuevoEvento.id ?? nextId()
    eventos.value.push({ ...nuevoEvento, id })
  }

  const actualizarEvento = (eventoActualizado) => {
    const index = eventos.value.findIndex(e => e.id === eventoActualizado.id)
    if (index !== -1) {
      eventos.value[index] = { ...eventoActualizado }
    }
  }

  return { eventos, agregarEvento, actualizarEvento }
})
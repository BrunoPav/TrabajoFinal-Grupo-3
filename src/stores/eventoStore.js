import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'https://69154c6384e8bd126af96b43.mockapi.io/eventos'

export const useEventoStore = defineStore('eventoStore', () => {

  // 🔹 Declaración del estado principal
  const eventos = ref([])

  // 👉 Cargar eventos desde MockAPI
  const cargarEventos = async () => {
    try {
      const response = await axios.get(API_URL)
      eventos.value = response.data
    } catch (error) {
      console.error('Error al cargar eventos:', error)
    }
  }

  // 👉 Agregar evento a MockAPI
  const agregarEvento = async (nuevoEvento) => {
    try {
      const response = await axios.post(API_URL, nuevoEvento)
      eventos.value.push(response.data)
    } catch (error) {
      console.error('Error al agregar evento:', error)
    }
  }

  // 👉 Actualizar evento en MockAPI
  const actualizarEvento = async (eventoActualizado) => {
    try {
      const response = await axios.put(`${API_URL}/${eventoActualizado.id}`, eventoActualizado)
      const index = eventos.value.findIndex(e => e.id === eventoActualizado.id)
      if (index !== -1) {
        eventos.value[index] = response.data
      }
    } catch (error) {
      console.error('Error al actualizar evento:', error)
    }
  }

  // 👉 Borrar evento en MockAPI
  const borrarEvento = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      eventos.value = eventos.value.filter(e => e.id !== id)
    } catch (error) {
      console.error('Error al borrar evento:', error)
    }
  }

  // 🔹 Exportamos todo
  return { eventos, cargarEventos, agregarEvento, actualizarEvento, borrarEvento }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'

const API_URL = 'https://69154c6384e8bd126af96b43.mockapi.io/eventos'

export const useEventoStore = defineStore('eventoStore', () => {

  const eventos = ref([])

  const cargarEventos = async () => {
    try {
      const response = await axios.get(API_URL)
      const data = Array.isArray(response.data) ? response.data : []
      
      eventos.value = data.map((item) => {
        const base = { ...item }
        
        if (base.dia && dayjs(base.dia).isValid()) {
          const fechaOriginal = dayjs(base.dia)
          base.dia = fechaOriginal.format('DD-MM-YYYY')
          if (!base.horario) base.horario = fechaOriginal.format('HH:mm')
        }
        
        return base
      })
    } catch (error) {
      console.error('Error al cargar eventos:', error)
    }
  }


  const agregarEvento = async (nuevoEvento) => {
    try {
      const response = await axios.post(API_URL, nuevoEvento)
      eventos.value.push(response.data)
    } catch (error) {
      console.error('Error al agregar evento:', error)
    }
  }


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


  return { eventos, cargarEventos, agregarEvento, actualizarEvento }
})

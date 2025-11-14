import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'https://69154c6384e8bd126af96b43.mockapi.io/eventos'

export const useEventoStore = defineStore('eventoStore', () => {

  const eventos = ref([])

  const cargarEventos = async () => {
    try {
      const response = await axios.get(API_URL)
      const data = Array.isArray(response.data) ? response.data : []

      const normalizarModalidad = (mod) => {
        const s = String(mod || '').toLowerCase()
        if (s.includes('virtual')) return 'Virtual'
        if (s.includes('presencial')) return 'Presencial'
        return 'Presencial'
      }
      const formatearFecha = (date) => date ? date.toISOString().split('T')[0] : ''
      const formatearHora = (date) => date ? date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : ''

      eventos.value = data.map((item) => {
        const base = { ...item }
        const d = base.dia ? new Date(base.dia) : null

        if (!base.nombre) base.nombre = `Evento ${base.id ?? ''}`.trim()

        if (d && !Number.isNaN(d.getTime())) {
          base.dia = formatearFecha(d)
          if (!base.horario) base.horario = formatearHora(d)
        }

        base.modalidad = normalizarModalidad(base.modalidad)
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

  const borrarEvento = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      eventos.value = eventos.value.filter(e => e.id !== id)
    } catch (error) {
      console.error('Error al borrar evento:', error)
    }
  }


  return { eventos, cargarEventos, agregarEvento, actualizarEvento, borrarEvento }
})

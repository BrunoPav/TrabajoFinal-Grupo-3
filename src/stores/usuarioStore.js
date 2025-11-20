import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_USUARIOS_URL = 'https://69154c6384e8bd126af96b43.mockapi.io/usuarios' 
const API_TICKETS_URL = 'https://691d169bd58e64bf0d34f5f9.mockapi.io/tickets'

export const useUsuarioStore = defineStore('usuario', () => {

  const usuarios = ref([])
  const usuarioActual = ref(null) 
  const token = ref(localStorage.getItem('token') || null) 

  const estaLogueado = computed(() => !!usuarioActual.value)
  const esCliente = computed(() => usuarioActual.value?.rol === 'cliente')
  const esOrganizador = computed(() => usuarioActual.value?.rol === 'organizador')
  const esGerente = computed(() => usuarioActual.value?.rol === 'gerente')


  const cargarUsuarios = async () => {
    try {
      const response = await axios.get(API_USUARIOS_URL)
      usuarios.value = response.data
      return response.data
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      throw error
    }
  }

  const login = async (email, password) => {
    try {

      const response = await axios.get(API_USUARIOS_URL)
      const usuarios = response.data

      const usuario = usuarios.find(
        u => u.email === email && u.password === password
      )
      
      if (!usuario) {
        throw new Error('Credenciales incorrectas')
      }
      

      usuarioActual.value = usuario
      

      token.value = `token_${usuario.id}_${Date.now()}`
      localStorage.setItem('token', token.value)
      localStorage.setItem('usuarioId', usuario.id)
      
      return usuario
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  }

  const registrar = async (datosUsuario) => {
    try {

      const response = await axios.get(API_USUARIOS_URL)
      const existe = response.data.find(u => u.email === datosUsuario.email)
      
      if (existe) {
        throw new Error('El email ya está registrado')
      }
      

      const nuevoUsuario = {
        nombre: datosUsuario.nombre,
        email: datosUsuario.email,
        password: datosUsuario.password,
        rol: datosUsuario.rol || 'cliente'
      }
      
      const res = await axios.post(API_USUARIOS_URL, nuevoUsuario)
      return res.data
    } catch (error) {
      console.error('Error en registro:', error)
      throw error
    }
  }


  const logout = () => {
    usuarioActual.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('usuarioId')
  }


  const restaurarSesion = async () => {
    const usuarioId = localStorage.getItem('usuarioId')
    const tokenGuardado = localStorage.getItem('token')
    
    if (usuarioId && tokenGuardado) {
      try {
        const response = await axios.get(`${API_USUARIOS_URL}/${usuarioId}`)
        usuarioActual.value = response.data
        token.value = tokenGuardado
        return response.data
      } catch (error) {
        console.error('Error al restaurar sesión:', error)
        logout() 
      }
    }
    return null
  }

  const obtenerMisTickets = async () => {
    if (!usuarioActual.value) {
      throw new Error('No hay usuario logueado')
    }
    
    try {
      const response = await axios.get(API_TICKETS_URL)
      const todosLosTickets = response.data
      

      const misTickets = todosLosTickets.filter(
        ticket => String(ticket.usuarioId) === String(usuarioActual.value.id)
      )
      
      return misTickets
    } catch (error) {
      console.error('Error al obtener tickets:', error)
      throw error
    }
  }

  const comprarTicket = async (eventoId, cantidad, montoTotal) => {
    if (!usuarioActual.value) {
      throw new Error('Debes iniciar sesión para comprar')
    }
    
    try {
      const nuevoTicket = {
        usuarioId: usuarioActual.value.id,
        eventoId: eventoId,
        cantidad: cantidad,
        montoTotal: montoTotal,
        fecha: new Date().toISOString()
      }
      
      const response = await axios.post(API_TICKETS_URL, nuevoTicket)
      return response.data
    } catch (error) {
      console.error('Error al comprar ticket:', error)
      throw error
    }
  }

  return {

    usuarios,
    usuarioActual,
    token,
    
 
    estaLogueado,
    esCliente,
    esOrganizador,
    esGerente,
    

    cargarUsuarios,
    login,
    registrar,
    logout,
    restaurarSesion,
    obtenerMisTickets,
    comprarTicket
  }
})
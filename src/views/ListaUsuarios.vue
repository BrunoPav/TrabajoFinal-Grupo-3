<script setup>
import { computed } from 'vue' 
import { useRouter } from 'vue-router'
import { useUsuarioStore } from '../stores/usuarioStore'
//import { useUsuarioStore } from '../stores/usuarioStore' 

const usuarioStore = useUsuarioStore()
const usuariosListado = computed(() => usuarioStore.usuarios || []) 
const router = useRouter()

const goToDetalle = (user) => {
    // Navegamos y pasamos el ID del usuario en el Query Parameter (Objeto JS)
    router.push({ path: '/usuario-detalle', query: { id: user.id } })
}

// Función para ir a la vista de creación de usuario
const goToCrearUsuario = () => {
    router.push('/usuario-crear')
} 
</script> 


<template>
  <div class="listado-usuarios">
    <nav class="app-header">
      <div class="nav-container">
        <div class="nav-left">
          <router-link to="/" class="logo">TicketOrt</router-link>
        </div>
        <div class="nav-center">
          <router-link to="/gerente" class="btn-nav">Volver</router-link>
        </div>
        <div class="perfil">
          <span>Hola, Gerente</span>
          <div class="avatar"></div>
        </div>
      </div>
    </nav>

    <h2 class="titulo-panel">Listado de Usuarios</h2>

    <table class="tabla-usuarios" v-if="usuariosListado.length > 0">
      <thead>
        <tr>
          <th>Email</th>
          <th>Nombre</th>
          <th>Cantidad de entradas</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in usuariosListado" :key="user.id">
          <td>{{ user.email || 'N/A' }}</td>
          <td>{{ user.nombre || 'Nombre Apellido' }}</td>
          <td>{{ user.cantidadEntradas || 0 }}</td>
          <td>${{ user.valorTotal || 0 }}</td>
        </tr>
      </tbody>
    </table>

    <div class="estado-vacio" v-else>
      <p>No hay usuarios registrados en el sistema.</p>
    </div>
  </div>
</template>


<style scoped>

/* Estilo del título principal */
.titulo-panel {
  font-size: 1.8rem;
  font-weight: bold;
  color: #f6f8fc;
  text-align: center;
  margin: 30px 0;
}

/* Tabla de usuarios */
.tabla-usuarios {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  border-collapse: collapse;
  background-color: rgb(250, 248, 248);
  box-shadow: 0 2px 8px rgba(219, 215, 215, 0.05);
}

.tabla-usuarios th,
.tabla-usuarios td {
  padding: 12px 16px;
  border-bottom: 1px solid #1e386d;
  text-align: left;
  font-size: 0.95rem;
}

.tabla-usuarios th {
  background-color: #3b82f6;
  color: rgb(247, 244, 244);
  font-weight: 600;
}

.tabla-usuarios tr:hover {
  background-color: #f7f8fa;
}

/* Contenedor principal */
.listado-usuarios {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  color: rgb(12, 12, 12);
}

/* Encabezado de navegación */
.app-header {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.nav-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 2rem;
  padding: 0 20px;
  box-sizing: border-box;
}

.nav-left {
  display: flex;
  align-items: center;
}

.logo {
  background-color: white;
  color: #111827;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
}

.nav-center {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-left: 2cm;
}

.btn-nav {
  background: #bfdbfe;
  color: #1f2937;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-nav:hover {
  background: #93c5fd;
}

.perfil {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  width: 100%;
}

.perfil span {
  color: white;
  font-weight: 500;
  padding: 5px 10px;
}

.perfil .avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid white;
}

/* Mensaje cuando no hay usuarios */
.estado-vacio {
  text-align: center;
  padding: 50px;
  color: #6b7280;
}


</style>
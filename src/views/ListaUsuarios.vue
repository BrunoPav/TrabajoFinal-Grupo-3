<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUsuarioStore } from '../stores/usuarioStore'

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
  <title>TicketOrt - Listado de Usuarios</title>
  <div class="listado-usuarios-view">
    <nav class="app-header">
      <div class="nav-container">
        <div class="nav-left">
          <router-link to="/" class="logo">TicketOrt</router-link>
        </div>
        <div class="nav-center">
          <router-link to="/gerente" class="btn-nav">Volver al Dashboard</router-link>
          <button @click="goToCrearUsuario" class="btn-crear">➕ Crear Usuario</button>
        </div>
        <div class="perfil">
          <span>Hola, Gerente</span>
          <div class="avatar"></div>
        </div>
      </div>
    </nav>

    <div class="contenedor-principal">
      <h2 class="titulo-panel">Listado y Métricas de Usuarios</h2>

      <table class="tabla-usuarios" v-if="usuariosListado.length > 0">
        <thead>
          <tr>
            <th>Email</th>
            <th>Nombre</th>
            <th class="text-center">Tickets Comprados</th>
            <th class="text-right">Recaudación Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usuariosListado" :key="user.id" @click="goToDetalle(user)">
            <td class="email-col">{{ user.email || 'N/A' }}</td>
            <td>{{ user.nombre || 'Nombre Apellido' }}</td>
            <td class="text-center">{{ user.cantidadEntradas || 0 }}</td>
            <td class="text-right">${{ (user.valorTotal || 0).toLocaleString('es-AR') }}</td>
          </tr>
        </tbody>
      </table>

      <div class="estado-vacio" v-else>
        <p class="mensaje-vacio">No hay usuarios registrados en el sistema para mostrar.</p>
      </div>
    </div>
  </div>
</template>


<style scoped>
.listado-usuarios-view {
  font-family: 'Inter', sans-serif;
  background-color: #f4f7fa;
  min-height: 100vh;
}

.contenedor-principal {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 30px;
}

.app-header {
  background-color: #3b82f6;
  color: white;
  padding: 10px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
}

.logo {
  background-color: white;
  color: #111827;
  padding: 8px 15px;
  border-radius: 6px;
  font-size: 1.4rem;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
}

.nav-center {
  display: flex;
  gap: 15px;
  align-items: center;
}

.btn-nav,
.btn-crear {
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap;
  cursor: pointer;
  border: none;
}

.btn-nav {
  background: #bfdbfe;
  color: #1e40af;
}

.btn-nav:hover {
  background: #dbeafe;
  color: #1c3983;
}

.btn-crear {
  background-color: #10b981;
  color: white;
  box-shadow: 0 2px 5px rgba(16, 185, 129, 0.4);
}

.btn-crear:hover {
  background-color: #059669;
}


.perfil {
  display: flex;
  align-items: center;
  gap: 10px;
}

.perfil span {
  color: white;
  font-weight: 600;
}

.perfil .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #bfdbfe;
  border: 2px solid white;
}

.titulo-panel {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 10px;
  border-bottom: 4px solid #3b82f6;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.tabla-usuarios {
  width: 100%;
  margin: 0 auto;
  border-collapse: collapse;
  background-color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

.tabla-usuarios th,
.tabla-usuarios td {
  padding: 15px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  font-size: 1rem;
  color: #374151;
}

.tabla-usuarios th {
  background-color: #eef2ff;
  color: #1e40af;
  font-weight: 700;
  text-transform: uppercase;
}

.tabla-usuarios tr {
  cursor: pointer;
}

.tabla-usuarios tr:hover {
  background-color: #f3f7fe;
}

.tabla-usuarios tbody tr:last-child td {
  border-bottom: none;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
  font-weight: 600;
}

.email-col {
  font-weight: 500;
  color: #1f2937;
}

.estado-vacio {
  text-align: center;
  padding: 50px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.mensaje-vacio {
  font-size: 1.2rem;
  color: #6b7280;
  font-style: italic;
}

@media (max-width: 768px) {
  .tabla-usuarios {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .tabla-usuarios thead,
  .tabla-usuarios tbody,
  .tabla-usuarios tr {
    display: block;
  }

  .tabla-usuarios th,
  .tabla-usuarios td {
    white-space: normal;
  }

  .nav-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    padding: 0 20px;
  }

  .nav-center {
    width: 100%;
    justify-content: space-around;
  }

  .perfil {
    justify-content: flex-start;
    width: auto;
  }

  .titulo-panel {
    font-size: 2rem;
  }
}
</style>
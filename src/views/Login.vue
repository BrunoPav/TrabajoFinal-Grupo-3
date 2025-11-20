<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUsuarioStore } from "../stores/usuarioStore";
import { useRolStore } from "../stores/rolStore";

const router = useRouter()
const usuarioStore = useUsuarioStore()
const rolStore = useRolStore()

const email = ref("");
const password = ref("");
const error = ref("");
const cargando = ref(false);
const modoRegistro = ref(false);
const nombre = ref("");

const goHome = () => router.push('/')

const login = async () => {
  error.value = "";
  cargando.value = true;
  
  try {
    const usuario = await usuarioStore.login(email.value, password.value);
    

    const rolFormateado = `${usuario.rol}@a`; 
    rolStore.setRol(rolFormateado);
    

    if (usuario.rol === 'gerente') {
      router.push('/gerente');
    } else {
      router.push('/');
    }
  } catch (err) {
    error.value = err.message || "Error al iniciar sesión. Verifica tus credenciales.";
  } finally {
    cargando.value = false;
  }
}

const registrar = async () => {
  error.value = "";
  
  if (!nombre.value || !email.value || !password.value) {
    error.value = "Todos los campos son obligatorios";
    return;
  }
  
  cargando.value = true;
  
  try {
    await usuarioStore.registrar({
      nombre: nombre.value,
      email: email.value,
      password: password.value,
      rol: 'cliente' 
    });
    

    await login();
  } catch (err) {
    error.value = err.message || "Error al registrarse";
  } finally {
    cargando.value = false;
  }
}

const toggleModo = () => {
  modoRegistro.value = !modoRegistro.value;
  error.value = "";
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="logo" @click="goHome">Ticket<span class="highlight">Ort</span></h1>
      <h2 class="welcome">{{ modoRegistro ? 'Crear Cuenta' : 'Bienvenidos' }}</h2>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <form class="login-form" @submit.prevent="modoRegistro ? registrar() : login()">
        <div v-if="modoRegistro">
          <label for="nombre">Nombre completo</label>
          <input type="text" id="nombre" v-model="nombre" required />
        </div>

        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />

        <label for="password">Contraseña</label>
        <input type="password" id="password" v-model="password" required />

        <button type="submit" class="btn-login" :disabled="cargando">
          {{ cargando ? 'Procesando...' : (modoRegistro ? 'REGISTRARSE' : 'INGRESAR') }}
        </button>
      </form>

      <div class="toggle-modo">
        <p v-if="!modoRegistro">
          ¿No tenés cuenta? 
          <a @click="toggleModo" class="link-toggle">Registrate aquí</a>
        </p>
        <p v-else>
          ¿Ya tenés cuenta? 
          <a @click="toggleModo" class="link-toggle">Iniciá sesión</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #3b82f6;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.logo {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  background-color: #3b82f6;
  padding: 10px 20px;
  border-radius: 8px;
  margin-bottom: 25px;
  display: inline-block;
  cursor: pointer;
}

.logo .highlight {
  color: white;
  text-decoration: none;
}


.welcome {
  font-size: 1.8rem;
  color: #1f2937;
  margin-bottom: 30px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}

.login-form label {
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  margin-top: 5px;
}

.login-form input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 10px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-login {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.2s;
}

.btn-login:hover {
  background-color: #059669;
}
</style>
<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="logo" @click="goHome">Ticket<span class="highlight">Ort</span></h1>
      <h2 class="welcome">Bienvenidos</h2>

      <form class="login-form" @submit.prevent="login">
        <label for="email">Ingresa tu Mail</label>
        <input type="email" id="email" v-model="email" required />

        <label for="password">Ingresa tu contraseña</label>
        <input type="password" id="password" v-model="password" required />

        <button type="submit" class="btn-login">INGRESAR</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter()
const route = useRoute()
const goHome = () => router.push('/')

const email = ref("");
const password = ref("");

const login = () => {
  const redirect = route.query.redirect
  if (redirect && typeof redirect === 'string') {
    router.push(redirect)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>

.login-container {
  width: 100vw;
  height: 100vh;
  background-color: #f3f3f3;
  display: flex;
  justify-content: center;
  align-items: center;
}


.login-card {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 25px;
  padding: 40px 50px;
  width: 320px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}


.logo {
  font-size: 1.8em;
  font-weight: bold;
  margin-bottom: 10px;
}

.highlight {
  text-decoration: underline red;
}


.welcome {
  font-size: 1.4em;
  font-weight: bold;
  margin-bottom: 30px;
}


.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
}

.login-form label {
  font-weight: 500;
}

.login-form input {
  width: 100%;
  padding: 8px;
  border: 1px solid #888;
  border-radius: 4px;
  font-size: 1em;
}


.btn-login {
  background-color: #d9eaff;
  border: 1px solid #000;
  border-radius: 8px;
  padding: 10px;
  font-weight: bold;
  font-size: 1em;
  cursor: pointer;
  transition: 0.2s;
}

.btn-login:hover {
  background-color: #c5e1ff;
}
</style>
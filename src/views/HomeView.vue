<template>
   <div class="container">
    <header class="header">
      <div class="logo">
        <span class="logo-text">Ticket<span class="highlight">Ort</span></span>
      </div>
      <div class="user-actions">
        <router-link to="/login" class="login-btn">Iniciar sesión</router-link>
      </div>
    </header>

    
    <main class="main-content">
      <div class="no-events">
        <div class="icon">🔍</div>
        <p>No tienes eventos creados</p>
        <button class="btn-crear" @click="goLogin">CREAR EVENTO</button>
      </div>
    </main>

    
    <footer class="footer">
      
    </footer>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goLogin = () => router.push('/login')
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Segoe UI", Arial, sans-serif;
}

body {
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}


.container {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}


.header {
  background-color: #3b82c4;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

.logo {
  background-color: white;
  color: black;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 1.3em;
}


.user-actions {
  display: flex;
  align-items: center;
}

.login-btn {
  background-color: #d9eaff;
  border: 1px solid #000;
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: 700;
  color: #111;
  text-decoration: none;
}

.login-btn:hover { background-color: #c5e1ff; }

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40px;
}

.no-events p {
  font-size: 1.2em;
  color: #444;
  margin: 10px 0 20px;
}

.btn-crear {
  background-color: #d9eaff;
  border: 1px solid #000;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.btn-crear:hover {
  background-color: #c5e1ff;
}

.icon {
  font-size: 2em;
  margin-bottom: 10px;
}

.footer {
  background-color: #eaeaea;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
  flex-shrink: 0;
}

</style>

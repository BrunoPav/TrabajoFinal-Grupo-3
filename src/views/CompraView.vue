<template>

  
  <header>
    <div class="logo">TicketOrt</div>

    <div class="nav-buttons">
      <button>Mis Tickets</button>
    </div>

    <div class="user">
      <span>Hola, USUARIO</span>
      <div class="avatar"></div>
    </div>
  </header>

  
  <main>
    
    <div class="info">
      <p><strong>{{ evento?.nombre || 'Nombre evento' }}</strong></p>
      <p>{{ evento?.lugar || 'Lugar imagen evento' }}</p>
      <p>{{ evento?.dia || 'Día' }}</p>
      <p>{{ evento?.horario || 'Horario' }}</p>
      <p>Modalidad: {{ evento?.modalidad || 'Presencial / Virtual' }}</p>
    </div>

    
    <div class="event-image">
      imagen evento
    </div>

    
    <div class="descripcion">
      <h3>DESCRIPCIÓN</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet elit at lacus gravida tincidunt.</p>
    </div>

    
    <div class="tickets">
      <table>
        <tr>
          <th>Tipo de Ticket</th>
          <th>Valor</th>
          <th>Cantidad</th>
        </tr>
        <tr>
          <td>Entrada Gral.</td>
          <td>${{ precioFmt }}</td>
          <td>
            <div class="cantidad-control">
              <button @click="dec">-</button>
              <span>{{ cantidad }}</span>
              <button @click="inc">+</button>
            </div>
          </td>
        </tr>
      </table>

      <button class="btn-siguiente" @click="proceed">SIGUIENTE</button>
    </div>
  </main>

</template> 

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventoStore } from '../stores/eventoStore'

const route = useRoute()
const router = useRouter()
const eventoStore = useEventoStore()

const id = computed(() => Number(route.query.id))
const evento = computed(() => eventoStore.eventos.find(e => e.id === id.value))

const cantidad = ref(0)
const inc = () => { cantidad.value++ }
const dec = () => { if (cantidad.value > 0) cantidad.value-- }

const precio = computed(() => evento.value?.precio ?? 0)
const precioFmt = computed(() => precio.value.toLocaleString('es-AR'))

const proceed = () => {
  if (!evento.value) {
    router.push('/')
    return
  }
  if (cantidad.value <= 0) {
    alert('Seleccioná al menos 1 entrada')
    return
  }
  alert(`Compraste ${cantidad.value} entrada(s) para ${evento.value.nombre} por $${(cantidad.value * precio.value).toLocaleString('es-AR')}`)
}
</script>

<style>
    * {
      box-sizing: border-box;
      font-family: Arial, sans-serif;
    }

    body {
      background-color: #f2f2f2;
      margin: 0;
      padding: 0;
    }


    header {
      background-color: #4a90e2;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
    }

    .logo {
      font-size: 1.5em;
      font-weight: bold;
    }

    .nav-buttons {
      display: flex;
      gap: 10px;
    }

    .nav-buttons button {
      background-color: #d8e6f7;
      border: 1px solid #8ab4e6;
      border-radius: 5px;
      padding: 5px 10px;
      font-weight: bold;
      cursor: pointer;
      color: #333;
    }

    .user {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user span {
      background-color: #fff;
      color: #333;
      padding: 5px 10px;
      border-radius: 5px;
    }

    .avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background-color: white;
      border: 2px solid #ccc;
    }


    main {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 15px;
      padding: 20px;
    }

 
    .info {
      background-color: white;
      border: 1px solid #ccc;
      padding: 15px;
      min-height: 180px;
    }

    .info p {
      margin: 5px 0;
      color: #333;
    }

    .event-image {
      background-color: rgb(52, 146, 146);
      border: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      min-height: 180px;
    }

  
    .descripcion {
      grid-column: 1 / 3;
      background-color: white;
      border: 1px solid #ccc;
      padding: 15px;
      min-height: 100px;
    }

    .descripcion h3 {
      text-decoration: underline;
      margin-bottom: 10px;
      color: #333;
    }


    .tickets {
      grid-column: 1 / 3;
      background-color: white;
      border: 1px solid #ccc;
      padding: 15px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }

    th, td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: center;
      color: #333;
    }

    th {
      background-color: #f5f5f5;
      text-decoration: underline;
    }

    .cantidad-control {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }

    .cantidad-control button {
      width: 25px;
      height: 25px;
      font-weight: bold;
      border: 1px solid #ccc;
      background-color: #f5f5f5;
      cursor: pointer;
      border-radius: 4px;
    }

    .btn-siguiente {
      display: block;
      margin: 0 auto;
      padding: 10px 20px;
      background-color: #a7cdf0;
      color: black;
      font-weight: bold;
      border: 1px solid #8ab4e6;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .btn-siguiente:hover {
      background-color: #8ab4e6;
    }
</style>





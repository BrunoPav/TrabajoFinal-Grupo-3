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
      <p><strong>Nombre evento</strong></p>
      <p>Lugar imagen evento</p>
      <p>Día</p>
      <p>Horario</p>
      <p>Modalidad: Presencial / Virtual</p>
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
          <td>$15.000</td>
          <td>
            <div class="cantidad-control">
              <button>-</button>
              <span>0</span>
              <button>+</button>
            </div>
          </td>
        </tr>
      </table>

      <button class="btn-siguiente">SIGUIENTE</button>
    </div>
  </main>

</template> 

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

    /* --- NAVBAR --- */
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

    /* --- MAIN LAYOUT --- */
    main {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 15px;
      padding: 20px;
    }

    /* --- INFO EVENTO --- */
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

    /* --- IMAGEN EVENTO --- */
    .event-image {
      background-color: rgb(52, 146, 146);
      border: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      min-height: 180px;
    }

    /* --- DESCRIPCIÓN --- */
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

    /* --- TABLA TICKETS --- */
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

    /* --- BOTÓN SIGUIENTE --- */
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




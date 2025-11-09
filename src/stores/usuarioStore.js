// En src/stores/usuarioStore.js

import { defineStore } from 'pinia';
import { ref } from 'vue'; 

export const useUsuarioStore = defineStore('usuario', () => {

    // ✨ STATE: Array de Objetos con datos de prueba
    const usuarios = ref([
        { id: 99, nombre: 'Test Cliente A', email: 't1@t.com', rol: 'cliente', activo: true },
        { id: 100, nombre: 'Test Organizador B', email: 't2@t.com', rol: 'organizador', activo: false }
    ]);

    // Aquí irían tus Actions y Getters...

    // Retornar las propiedades del State
    return {
        usuarios // Exportamos el Array reactivo
    };
});
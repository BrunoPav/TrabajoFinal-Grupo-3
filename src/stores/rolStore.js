import { defineStore } from 'pinia'
import {ref} from 'vue'

export const useRolStore = defineStore('rolStore', () => {

    const rol = ref('cliente@a')
    const nuevoRol = ref('cliente@a' || 'organizador@a' || 'gerente@a')
    const setRol = (nuevoRol) => {
        rol.value = nuevoRol
    }
    return { rol, setRol }
})
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVentaStore = defineStore('ventaStore', () => {

	const ventas = ref([])

	const registrarVenta = (venta) => {
		venta.id = ventas.value.length + 1
		venta.fecha = venta.fecha || new Date().toISOString()
		ventas.value.push({ ...venta })
	}

	const ventasPorEvento = (eventoId) => ventas.value.filter(v => v.eventoId === eventoId)

	const totalEntradasPorEvento = (eventoId) => {
		return ventasPorEvento(eventoId).reduce((s, v) => s + (Number(v.cantidad) || 0), 0)
	}

	const totalRecaudacionPorEvento = (eventoId) => {
		return ventasPorEvento(eventoId).reduce((s, v) => s + (Number(v.monto) || 0), 0)
	}

	return { ventas, registrarVenta, ventasPorEvento, totalEntradasPorEvento, totalRecaudacionPorEvento }
})


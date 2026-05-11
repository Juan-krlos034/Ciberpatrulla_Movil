// frontend/src/services/api.js
const API_URL = 'http://localhost:3000/api';

// Obtener token del localStorage
const getToken = () => localStorage.getItem('token');

// Headers con autenticación
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-auth-token': getToken() || ''
});

// ============ INCIDENTES ============

// Obtener todos los incidentes
export const getIncidentes = async () => {
  try {
    const response = await fetch(`${API_URL}/incidentes`, {
      headers: getHeaders()
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getIncidentes:', error);
    return { success: false, data: [] };
  }
};

// Obtener incidente por ID
export const getIncidenteById = async (id) => {
  // Validar que el ID existe
  if (!id) {
    console.error('getIncidenteById: ID no proporcionado');
    return { success: false, message: 'ID no proporcionado', data: null };
  }
  
  try {
    const response = await fetch(`${API_URL}/incidentes/${id}`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getIncidenteById:', error);
    return { success: false, message: error.message, data: null };
  }
};

// Crear incidente
export const createIncidente = async (incidente) => {
  try {
    const response = await fetch(`${API_URL}/incidentes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(incidente)
    });
    return await response.json();
  } catch (error) {
    console.error('Error en createIncidente:', error);
    return { success: false };
  }
};

// Actualizar incidente
export const updateIncidente = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/incidentes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return { success: false };
  }
};

// Eliminar incidente
export const deleteIncidente = async (id) => {
  try {
    const response = await fetch(`${API_URL}/incidentes/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return { success: false };
  }
};

// Obtener estadísticas
export const getEstadisticas = async () => {
  try {
    const response = await fetch(`${API_URL}/incidentes/estadisticas`, {
      headers: getHeaders()
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return { success: false, data: null };
  }
};

// ============ TIPOS DE DELITO ============

// Obtener todos los tipos de delito
export const getTiposDelito = async () => {
  try {
    const response = await fetch(`${API_URL}/tipos-delito`, {
      headers: getHeaders()
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getTiposDelito:', error);
    // Datos de ejemplo para desarrollo
    return { 
      success: true, 
      data: [
        { tipo_delito_id: "TD001", nombre: "Estafa por SMS" },
        { tipo_delito_id: "TD002", nombre: "Suplantación de identidad" },
        { tipo_delito_id: "TD003", nombre: "Phishing" },
        { tipo_delito_id: "TD004", nombre: "Ciberacoso" },
        { tipo_delito_id: "TD005", nombre: "Clonación de tarjeta" },
        { tipo_delito_id: "TD006", nombre: "Fraude en compras online" }
      ] 
    };
  }
};

// ============ BÚSQUEDA AVANZADA ============

// Búsqueda avanzada de incidentes
export const busquedaAvanzada = async (criterios) => {
  try {
    const params = new URLSearchParams();
    
    if (criterios.tipo_delito) params.append('tipo_delito', criterios.tipo_delito);
    if (criterios.estado) params.append('estado', criterios.estado);
    if (criterios.fecha_desde) params.append('fecha_desde', criterios.fecha_desde);
    if (criterios.fecha_hasta) params.append('fecha_hasta', criterios.fecha_hasta);
    if (criterios.monto_minimo) params.append('monto_minimo', criterios.monto_minimo);
    if (criterios.monto_maximo) params.append('monto_maximo', criterios.monto_maximo);
    if (criterios.victima_nombre) params.append('victima_nombre', criterios.victima_nombre);
    
    const response = await fetch(`${API_URL}/incidentes/busqueda/avanzada?${params.toString()}`, {
      headers: getHeaders()
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en busquedaAvanzada:', error);
    return { success: false, data: [] };
  }
};

// Búsqueda simple por texto
export const buscarIncidentes = async (termino) => {
  try {
    const response = await fetch(`${API_URL}/incidentes/buscar?q=${encodeURIComponent(termino)}`, {
      headers: getHeaders()
    });
    return await response.json();
  } catch (error) {
    console.error('Error en buscarIncidentes:', error);
    return { success: false, data: [] };
  }
};

// ============ ALERTAS DE MONTOS ALTOS (NUEVO) ============

// Obtener incidentes con montos altos (alertas)
export const getAlertasMontosAltos = async (montoMinimo = 1000000) => {
  try {
    const response = await fetch(`${API_URL}/incidentes?monto_minimo=${montoMinimo}`, {
      headers: getHeaders()
    });
    const data = await response.json();
    
    // Filtrar solo los que superan el monto mínimo
    if (data.success && data.data) {
      const filtrados = data.data.filter(i => 
        (i.afectacion_economica?.monto_perdido || 0) >= montoMinimo
      );
      return { success: true, data: filtrados };
    }
    return data;
  } catch (error) {
    console.error('Error en getAlertasMontosAltos:', error);
    // Datos de ejemplo para desarrollo
    return { 
      success: true, 
      data: [
        {
          incidente_id: "I001",
          tipo_delito_id: "TD001",
          victima: { nombre: "Luis Fernando Gómez" },
          afectacion_economica: { monto_perdido: 2500000 },
          descripcion: "Estafa por SMS - Pérdida de $2.500.000",
          estado: "En investigación"
        },
        {
          incidente_id: "I003",
          tipo_delito_id: "TD003",
          victima: { nombre: "Carlos Mendoza" },
          afectacion_economica: { monto_perdido: 3500000 },
          descripcion: "Phishing - Pérdida de $3.500.000",
          estado: "Abierto"
        }
      ] 
    };
  }
};

// Alias para compatibilidad
export const getIncidentesAltoMonto = getAlertasMontosAltos;

// ============ EXPORTACIONES ============

// Exportar a Excel
export const exportarExcel = async () => {
  try {
    const token = getToken();
    window.open(`${API_URL}/exportar/excel?token=${token}`, '_blank');
    return { success: true };
  } catch (error) {
    console.error('Error exportando a Excel:', error);
    return { success: false };
  }
};

// Exportar a PDF
export const exportarPDF = async () => {
  try {
    const token = getToken();
    window.open(`${API_URL}/exportar/pdf?token=${token}`, '_blank');
    return { success: true };
  } catch (error) {
    console.error('Error exportando a PDF:', error);
    return { success: false };
  }
};

// Exportar incidentes específicos
export const exportarIncidentes = async (filtros = {}) => {
  try {
    const token = getToken();
    const params = new URLSearchParams(filtros).toString();
    window.open(`${API_URL}/exportar/incidentes?token=${token}&${params}`, '_blank');
    return { success: true };
  } catch (error) {
    console.error('Error exportando:', error);
    return { success: false };
  }
};

// ============ OBJETOS DE SERVICIO (COMPATIBILIDAD) ============

export const incidenteService = {
  getAll: getIncidentes,
  getById: getIncidenteById,
  create: createIncidente,
  update: updateIncidente,
  delete: deleteIncidente,
  getEstadisticas: getEstadisticas,
  buscar: buscarIncidentes,
  busquedaAvanzada: busquedaAvanzada,
  getOffline: () => {
    const offline = localStorage.getItem('offline_incidentes');
    return offline ? JSON.parse(offline) : [];
  }
};

export const tiposDelitoService = {
  getAll: getTiposDelito,
  getById: async (id) => {
    const result = await getTiposDelito();
    if (result.success && result.data) {
      const encontrado = result.data.find(t => t.tipo_delito_id === id);
      return { success: true, data: encontrado };
    }
    return { success: false };
  }
};

export const exportacionService = {
  toExcel: exportarExcel,
  toPDF: exportarPDF,
  toIncidentes: exportarIncidentes
};

export const alertasService = {
  getAltoMonto: getAlertasMontosAltos,
  getAlertasMontosAltos: getAlertasMontosAltos
};

// Exportación por defecto
export default {
  getIncidentes,
  getIncidenteById,
  createIncidente,
  updateIncidente,
  deleteIncidente,
  getEstadisticas,
  getTiposDelito,
  busquedaAvanzada,
  buscarIncidentes,
  getAlertasMontosAltos,
  getIncidentesAltoMonto,
  exportarExcel,
  exportarPDF,
  exportarIncidentes,
  incidenteService,
  tiposDelitoService,
  exportacionService,
  alertasService
};
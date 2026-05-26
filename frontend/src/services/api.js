// frontend/src/services/api.js
const API_URL = 'http://localhost:3000/api';

// Obtener token del localStorage - VERSIÓN CORREGIDA
const getToken = () => {
  const token = localStorage.getItem('token');
  console.log('🔑 getToken() - Token existe?', token ? 'SÍ' : 'NO');
  if (token) {
    console.log('🔑 Token (primeros 20 chars):', token.substring(0, 20) + '...');
  }
  return token;
};

// Headers con autenticación - VERSIÓN CORREGIDA
const getHeaders = () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['x-auth-token'] = token;
    console.log('✅ Header x-auth-token agregado a la petición');
  } else {
    console.warn('⚠️ No hay token disponible en los headers');
  }
  
  return headers;
};

// ============ INCIDENTES ============

// Obtener todos los incidentes
export const getIncidentes = async () => {
  try {
    console.log('📡 Haciendo GET a:', `${API_URL}/incidentes`);
    const headers = getHeaders();
    console.log('📡 Headers:', headers);
    
    const response = await fetch(`${API_URL}/incidentes`, {
      headers: headers
    });
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📡 Datos recibidos:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en getIncidentes:', error);
    return { success: false, data: [], message: error.message };
  }
};

// Obtener incidente por ID
export const getIncidenteById = async (id) => {
  if (!id) {
    console.error('❌ getIncidenteById: ID no proporcionado');
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
    console.error('❌ Error en getIncidenteById:', error);
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
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error en createIncidente:', error);
    return { success: false, message: error.message };
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
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error en updateIncidente:', error);
    return { success: false, message: error.message };
  }
};

// Eliminar incidente
export const deleteIncidente = async (id) => {
  try {
    const response = await fetch(`${API_URL}/incidentes/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error en deleteIncidente:', error);
    return { success: false, message: error.message };
  }
};

// ============ AUTENTICACIÓN ============

// Registrar nuevo funcionario
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    console.log('📝 Registro response:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en register:', error);
    return { success: false, message: error.message };
  }
};

// Obtener estadísticas
export const getEstadisticas = async () => {
  try {
    const response = await fetch(`${API_URL}/incidentes/estadisticas`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error en getEstadisticas:', error);
    return { success: false, data: null, message: error.message };
  }
};

// ============ TIPOS DE DELITO ============

// Obtener todos los tipos de delito
export const getTiposDelito = async () => {
  try {
    console.log('📡 Fetching tipos de delito desde:', `${API_URL}/tipos-delito`);
    
    const response = await fetch(`${API_URL}/tipos-delito`, {
      headers: getHeaders()
    });
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📡 Tipos de delito recibidos:', data);
    
    if (data && data.success && Array.isArray(data.data)) {
      return data;
    } else {
      console.warn('⚠️ La respuesta no tiene la estructura esperada, usando datos de ejemplo');
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
  } catch (error) {
    console.error('❌ Error en getTiposDelito:', error);
    return { 
      success: true, 
      data: [
        { tipo_delito_id: "TD001", nombre: "Estafa por SMS" },
        { tipo_delito_id: "TD002", nombre: "Suplantación de identidad" },
        { tipo_delito_id: "TD003", nombre: "Phishing" },
        { tipo_delito_id: "TD004", nombre: "Ciberacoso" }
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
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error en busquedaAvanzada:', error);
    return { success: false, data: [], message: error.message };
  }
};

// Búsqueda simple por texto
export const buscarIncidentes = async (termino) => {
  try {
    const response = await fetch(`${API_URL}/incidentes/buscar?q=${encodeURIComponent(termino)}`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error en buscarIncidentes:', error);
    return { success: false, data: [], message: error.message };
  }
};

// ============ ALERTAS DE MONTOS ALTOS ============

// Obtener incidentes con montos altos (alertas)
export const getAlertasMontosAltos = async (montoMinimo = 1000000) => {
  try {
    const response = await fetch(`${API_URL}/incidentes?monto_minimo=${montoMinimo}`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.success && Array.isArray(data.data)) {
      const filtrados = data.data.filter(i => 
        (i.afectacion_economica?.monto_perdido || 0) >= montoMinimo
      );
      return { success: true, data: filtrados };
    }
    return data;
  } catch (error) {
    console.error('❌ Error en getAlertasMontosAltos:', error);
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
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    window.open(`${API_URL}/exportar/excel?token=${token}`, '_blank');
    return { success: true };
  } catch (error) {
    console.error('❌ Error exportando a Excel:', error);
    return { success: false, message: error.message };
  }
};

// Exportar a PDF
export const exportarPDF = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    window.open(`${API_URL}/exportar/pdf?token=${token}`, '_blank');
    return { success: true };
  } catch (error) {
    console.error('❌ Error exportando a PDF:', error);
    return { success: false, message: error.message };
  }
};

// Exportar incidentes específicos
export const exportarIncidentes = async (filtros = {}) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    const params = new URLSearchParams(filtros).toString();
    window.open(`${API_URL}/exportar/incidentes?token=${token}&${params}`, '_blank');
    return { success: true };
  } catch (error) {
    console.error('❌ Error exportando incidentes:', error);
    return { success: false, message: error.message };
  }
};

// ============ OBJETOS DE SERVICIO ============

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
    try {
      const offline = localStorage.getItem('offline_incidentes');
      return offline ? JSON.parse(offline) : [];
    } catch (error) {
      console.error('Error leyendo offline_incidentes:', error);
      return [];
    }
  }
};

export const tiposDelitoService = {
  getAll: getTiposDelito,
  getById: async (id) => {
    const result = await getTiposDelito();
    if (result.success && Array.isArray(result.data)) {
      const encontrado = result.data.find(t => t.tipo_delito_id === id);
      return { success: true, data: encontrado || null };
    }
    return { success: false, data: null };
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

// ============ EXPORTACIÓN POR DEFECTO ============

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
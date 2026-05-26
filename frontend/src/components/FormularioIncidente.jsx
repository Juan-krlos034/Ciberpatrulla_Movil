// frontend/src/components/FormularioIncidente.jsx
import React, { useState, useEffect } from 'react';
import { createIncidente, tiposDelitoService } from '../services/api';
import EvidenciasUpload from './EvidenciasUpload';

function FormularioIncidente({ onClose, onSave }) {
  const [tiposDelito, setTiposDelito] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTipos, setLoadingTipos] = useState(true);
  const [errorTipos, setErrorTipos] = useState(null);
  const [evidencias, setEvidencias] = useState([]);
  const [formData, setFormData] = useState({
    incidente_id: `I${Date.now()}`,
    tipo_delito_id: '',
    fecha_incidente: new Date().toISOString().split('T')[0],
    hora_incidente: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    descripcion: '',
    victima: {
      nombre: '',
      identificacion: '',
      telefono: '',
      correo: ''
    },
    afectacion_economica: {
      monto_perdido: 0,
      moneda: 'COP',
      entidad_afectada: ''
    },
    estado: 'Abierto'
  });

  // Cargar tipos de delito al montar el componente
  useEffect(() => {
    cargarTiposDelito();
  }, []);

  const cargarTiposDelito = async () => {
    setLoadingTipos(true);
    setErrorTipos(null);
    
    try {
      console.log('📡 Llamando a tiposDelitoService.getAll()...');
      const result = await tiposDelitoService.getAll();
      console.log('📡 Respuesta recibida:', result);
      
      // Verificar si la respuesta es válida y tiene datos
      if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
        console.log(`✅ Cargados ${result.data.length} tipos de delito desde el servidor`);
        setTiposDelito(result.data);
      } else {
        // Si no hay datos del servidor, usar datos de ejemplo
        console.warn('⚠️ El servidor no devolvió datos, usando datos de ejemplo');
        setTiposDelito([
          { tipo_delito_id: "TD001", nombre: "Estafa por SMS" },
          { tipo_delito_id: "TD002", nombre: "Suplantación de identidad" },
          { tipo_delito_id: "TD003", nombre: "Phishing" },
          { tipo_delito_id: "TD004", nombre: "Ciberacoso" },
          { tipo_delito_id: "TD005", nombre: "Clonación de tarjeta" },
          { tipo_delito_id: "TD006", nombre: "Fraude en compras online" }
        ]);
        setErrorTipos('Usando datos de ejemplo. El servidor no respondió correctamente.');
      }
    } catch (error) {
      console.error('❌ Error en cargarTiposDelito:', error);
      setErrorTipos(error.message || 'Error al cargar los tipos de delito');
      // Datos de ejemplo en caso de error
      setTiposDelito([
        { tipo_delito_id: "TD001", nombre: "Estafa por SMS" },
        { tipo_delito_id: "TD002", nombre: "Suplantación de identidad" },
        { tipo_delito_id: "TD003", nombre: "Phishing" },
        { tipo_delito_id: "TD004", nombre: "Ciberacoso" }
      ]);
    } finally {
      setLoadingTipos(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('victima.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        victima: { ...prev.victima, [field]: value }
      }));
    } else if (name.includes('afectacion.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        afectacion_economica: { ...prev.afectacion_economica, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const funcionario = JSON.parse(localStorage.getItem('funcionario'));
      
      if (!funcionario || !funcionario.funcionario_id) {
        throw new Error('No se encontró información del funcionario. Por favor, inicie sesión nuevamente.');
      }

      const incidenteData = {
        ...formData,
        funcionario_id: funcionario.funcionario_id,
        evidencias_url: evidencias.map(e => e.url || e)
      };

      console.log('📝 Enviando incidente:', incidenteData);
      const result = await createIncidente(incidenteData);
      
      if (result && result.success) {
        if (onSave) onSave(incidenteData);
        if (onClose) onClose();
      } else {
        // Si falla, guardar localmente para sincronizar después
        const offlineData = localStorage.getItem('offline_incidentes');
        const pendientes = offlineData ? JSON.parse(offlineData) : [];
        pendientes.push({ ...incidenteData, pendiente: true });
        localStorage.setItem('offline_incidentes', JSON.stringify(pendientes));
        alert('⚠️ Incidente guardado localmente. Se sincronizará cuando haya conexión.');
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('❌ Error en handleSubmit:', error);
      alert(`Error al guardar el incidente: ${error.message || 'Intente nuevamente'}`);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar indicador de carga mientras se cargan los tipos
  if (loadingTipos) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Nuevo Incidente</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Mostrar error si lo hay */}
          {errorTipos && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 rounded-lg text-sm">
              ⚠️ {errorTipos}
            </div>
          )}

          {/* Tipo de delito */}
          <div>
            <label className="block font-semibold mb-1 text-sm">Tipo de delito *</label>
            <select
              name="tipo_delito_id"
              value={formData.tipo_delito_id}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Seleccionar tipo de delito...</option>
              {tiposDelito && tiposDelito.length > 0 ? (
                tiposDelito.map((tipo) => (
                  <option key={tipo.tipo_delito_id} value={tipo.tipo_delito_id}>
                    {tipo.nombre}
                  </option>
                ))
              ) : (
                <option value="" disabled>No hay tipos de delito disponibles</option>
              )}
            </select>
            {tiposDelito.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                No se pudieron cargar los tipos de delito. Verifica la conexión con el servidor.
              </p>
            )}
          </div>

          {/* Fecha y hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-sm">Fecha</label>
              <input
                type="date"
                name="fecha_incidente"
                value={formData.fecha_incidente}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-sm">Hora</label>
              <input
                type="time"
                name="hora_incidente"
                value={formData.hora_incidente}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          {/* Datos de la víctima */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold mb-2 text-sm">Datos de la víctima</h3>
            <div className="space-y-2">
              <input
                type="text"
                name="victima.nombre"
                placeholder="Nombre completo *"
                value={formData.victima.nombre}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="text"
                name="victima.identificacion"
                placeholder="Identificación"
                value={formData.victima.identificacion}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg text-sm"
              />
              <input
                type="tel"
                name="victima.telefono"
                placeholder="Teléfono"
                value={formData.victima.telefono}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg text-sm"
              />
              <input
                type="email"
                name="victima.correo"
                placeholder="Correo electrónico"
                value={formData.victima.correo}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block font-semibold mb-1 text-sm">Descripción del hecho *</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border rounded-lg resize-none text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Describa detalladamente lo ocurrido..."
              required
            />
          </div>

          {/* Afectación económica */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold mb-2 text-sm">Afectación económica</h3>
            <div className="space-y-2">
              <input
                type="number"
                name="afectacion.monto_perdido"
                placeholder="Monto perdido (COP)"
                value={formData.afectacion_economica.monto_perdido}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg text-sm"
              />
              <input
                type="text"
                name="afectacion.entidad_afectada"
                placeholder="Entidad afectada"
                value={formData.afectacion_economica.entidad_afectada}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Evidencias */}
          <EvidenciasUpload onEvidenciasChange={setEvidencias} />

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 p-2 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-700 text-white p-2 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Incidente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioIncidente;
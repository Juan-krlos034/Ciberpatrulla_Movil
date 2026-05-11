// frontend/src/components/DetalleIncidente.jsx
import React, { useState, useEffect } from 'react';
import { getIncidenteById } from '../services/api';
import GaleriaEvidencias from './GaleriaEvidencias';

function DetalleIncidente({ incidente: incidenteProp, onClose }) {
  const [incidente, setIncidente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');

  useEffect(() => {
    const cargarIncidente = async () => {
      // Si ya tenemos el incidente por props, usarlo directamente
      if (incidenteProp && incidenteProp.incidente_id) {
        setIncidente(incidenteProp);
        setNuevoEstado(incidenteProp.estado);
        setLoading(false);
        return;
      }

      // Si no, cargar desde la API
      setLoading(true);
      setError(null);
      try {
        // 🔥 IMPORTANTE: Obtener el ID de la URL o de las props
        const id = incidenteProp?.incidente_id || incidenteProp?._id;
        
        if (!id) {
          throw new Error('No se proporcionó un ID de incidente válido');
        }

        const result = await getIncidenteById(id);
        
        if (result.success && result.data) {
          setIncidente(result.data);
          setNuevoEstado(result.data.estado);
        } else {
          throw new Error(result.message || 'Error al cargar el incidente');
        }
      } catch (err) {
        console.error('Error cargando incidente:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarIncidente();
  }, [incidenteProp]);

  const actualizarEstado = async () => {
    if (!incidente) return;
    
    try {
      const { updateIncidente } = await import('../services/api');
      const result = await updateIncidente(incidente.incidente_id, { estado: nuevoEstado });
      
      if (result.success) {
        setIncidente({ ...incidente, estado: nuevoEstado });
        alert('Estado actualizado correctamente');
      } else {
        throw new Error(result.message || 'Error al actualizar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el estado');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando incidente...</p>
        </div>
      </div>
    );
  }

  if (error || !incidente) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 max-w-sm">
          <div className="text-center">
            <span className="text-4xl">⚠️</span>
            <p className="text-red-600 mt-2">{error || 'No se pudo cargar el incidente'}</p>
            <button
              onClick={onClose}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getEstadoColor = () => {
    switch (incidente.estado) {
      case 'Abierto': return 'bg-yellow-100 text-yellow-800';
      case 'En investigación': return 'bg-blue-100 text-blue-800';
      case 'Cerrado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <h2 className="text-xl font-semibold">Detalle del Incidente</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* ID y estado */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">Caso #{incidente.incidente_id}</p>
              <span className={`px-3 py-1 rounded-full text-sm ${getEstadoColor()}`}>
                {incidente.estado}
              </span>
            </div>
          </div>

          {/* Datos de la víctima */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-green-800">Datos de la víctima</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Nombre:</span> {incidente.victima?.nombre || 'No especificado'}</p>
              <p><span className="text-gray-500">Identificación:</span> {incidente.victima?.identificacion || 'No especificado'}</p>
              <p><span className="text-gray-500">Teléfono:</span> {incidente.victima?.telefono || 'No especificado'}</p>
              <p><span className="text-gray-500">Correo:</span> {incidente.victima?.correo || 'No especificado'}</p>
            </div>
          </div>

          {/* Tipo de delito */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-green-800">Tipo de delito</h3>
            <p>{incidente.tipo_delito_id || 'No especificado'}</p>
          </div>

          {/* Descripción */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-green-800">Descripción del hecho</h3>
            <p className="text-gray-700">{incidente.descripcion || 'Sin descripción'}</p>
          </div>

          {/* Afectación económica */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-green-800">Afectación económica</h3>
            <p className="text-red-600 font-bold">
              ${(incidente.afectacion_economica?.monto_perdido || 0).toLocaleString()} COP
            </p>
            {incidente.afectacion_economica?.entidad_afectada && (
              <p className="text-gray-500 text-sm mt-1">
                Entidad: {incidente.afectacion_economica.entidad_afectada}
              </p>
            )}
          </div>

          {/* Evidencias */}
          {incidente.evidencias_url && incidente.evidencias_url.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-green-800">Evidencias</h3>
              <GaleriaEvidencias evidencias={incidente.evidencias_url} />
            </div>
          )}

          {/* Cambiar estado */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-green-800">Actualizar estado</h3>
            <div className="flex gap-2">
              <select
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
                className="flex-1 p-2 border rounded-lg"
              >
                <option value="Abierto">Abierto</option>
                <option value="En investigación">En investigación</option>
                <option value="Cerrado">Cerrado</option>
              </select>
              <button
                onClick={actualizarEstado}
                className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleIncidente;
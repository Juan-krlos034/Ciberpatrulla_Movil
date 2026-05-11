// frontend/src/components/AlertasMontos.jsx
import React, { useState, useEffect } from 'react';
import { getAlertasMontosAltos } from '../services/api';

function AlertasMontos({ onClose, onVerIncidente, montoMinimo = 1000000 }) {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    setLoading(true);
    try {
      const result = await getAlertasMontosAltos(montoMinimo);
      if (result.success && result.data) {
        // Ordenar por monto descendente
        const ordenados = [...result.data].sort((a, b) => 
          (b.afectacion_economica?.monto_perdido || 0) - (a.afectacion_economica?.monto_perdido || 0)
        );
        setAlertas(ordenados);
      } else {
        setAlertas([]);
      }
    } catch (error) {
      console.error('Error cargando alertas:', error);
      setAlertas([]);
    } finally {
      setLoading(false);
    }
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(monto);
  };

  const getNivelAlerta = (monto) => {
    if (monto >= 5000000) return { nivel: 'Crítico', color: 'bg-red-600', icono: '🔴' };
    if (monto >= 2000000) return { nivel: 'Alto', color: 'bg-orange-500', icono: '🟠' };
    if (monto >= 1000000) return { nivel: 'Medio', color: 'bg-yellow-500', icono: '🟡' };
    return { nivel: 'Bajo', color: 'bg-blue-500', icono: '🔵' };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <h2 className="text-xl font-semibold">Alertas de Montos Altos</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-4 rounded">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Alerta:</strong> Incidentes con pérdidas superiores a {formatearMonto(montoMinimo)}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            </div>
          ) : alertas.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <span className="text-4xl">✅</span>
              <p className="mt-2">No hay alertas de montos altos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alertas.map((alerta, index) => {
                const monto = alerta.afectacion_economica?.monto_perdido || 0;
                const nivel = getNivelAlerta(monto);
                
                return (
                  <div
                    key={alerta.incidente_id || index}
                    onClick={() => onVerIncidente && onVerIncidente(alerta)}
                    className="border rounded-lg p-3 hover:shadow-lg transition cursor-pointer bg-white"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{nivel.icono}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full text-white ${nivel.color}`}>
                        {nivel.nivel}
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {alerta.incidente_id}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800">
                      {alerta.victima?.nombre || 'Sin nombre'}
                    </h3>
                    
                    <p className="text-red-600 font-bold mt-1">
                      {formatearMonto(monto)}
                    </p>
                    
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {alerta.descripcion?.substring(0, 80)}...
                    </p>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">
                        {alerta.tipo_delito_id?.replace('TD', '') || 'N/A'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        alerta.estado === 'Abierto' ? 'bg-yellow-100 text-yellow-800' :
                        alerta.estado === 'En investigación' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alerta.estado || 'Desconocido'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlertasMontos;
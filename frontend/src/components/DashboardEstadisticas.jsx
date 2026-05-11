// frontend/src/components/DashboardEstadisticas.jsx
import React, { useState, useEffect } from 'react';
import { getEstadisticas, exportarExcel, exportarPDF } from '../services/api';

function DashboardEstadisticas({ onClose }) {
  const [estadisticas, setEstadisticas] = useState({
    total_incidentes: 0,
    por_estado: [],
    por_tipo_delito: [],
    monto_total_perdido: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const result = await getEstadisticas();
      if (result.success && result.data) {
        setEstadisticas(result.data);
      } else {
        // Datos de ejemplo
        setEstadisticas({
          total_incidentes: 45,
          por_estado: [
            { _id: "Abierto", count: 23 },
            { _id: "En investigación", count: 15 },
            { _id: "Cerrado", count: 7 }
          ],
          por_tipo_delito: [
            { _id: "Estafa por SMS", count: 18 },
            { _id: "Suplantación de identidad", count: 12 },
            { _id: "Phishing", count: 10 },
            { _id: "Ciberacoso", count: 5 }
          ],
          monto_total_perdido: 125000000
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const manejarExportarExcel = () => {
    exportarExcel();
  };

  const manejarExportarPDF = () => {
    exportarPDF();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h2 className="text-xl font-semibold text-gray-800">Dashboard Estadístico</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Tarjetas principales */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-3">
              <p className="text-xs opacity-90">Total Casos</p>
              <p className="text-2xl font-bold">{estadisticas.total_incidentes}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl p-3">
              <p className="text-xs opacity-90">Casos Activos</p>
              <p className="text-2xl font-bold">
                {(estadisticas.por_estado?.find(e => e._id === "Abierto")?.count || 0) +
                 (estadisticas.por_estado?.find(e => e._id === "En investigación")?.count || 0)}
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-3">
              <p className="text-xs opacity-90">Monto Total</p>
              <p className="text-lg font-bold">
                ${estadisticas.monto_total_perdido?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Gráfico de estados (simulado) */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Incidentes por Estado</h3>
            <div className="space-y-2">
              {estadisticas.por_estado?.map((estado) => (
                <div key={estado._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{estado._id}</span>
                    <span>{estado.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        estado._id === 'Abierto' ? 'bg-yellow-500' :
                        estado._id === 'En investigación' ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(estado.count / estadisticas.total_incidentes) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla de tipos de delito */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Delitos más frecuentes</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {estadisticas.por_tipo_delito?.map((tipo) => (
                <div key={tipo._id} className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm">{tipo._id}</span>
                  <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                    {tipo.count} casos
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de exportación */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={manejarExportarExcel}
              className="flex-1 bg-green-600 text-white p-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <span>📊</span> Exportar a Excel
            </button>
            <button
              onClick={manejarExportarPDF}
              className="flex-1 bg-red-600 text-white p-2 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              <span>📄</span> Exportar a PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardEstadisticas;
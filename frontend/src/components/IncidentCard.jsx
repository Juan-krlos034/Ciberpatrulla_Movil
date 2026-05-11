import React from 'react';

function IncidenteCard({ incidente, onClick }) {
  // Determinar color según estado
  const getEstadoColor = () => {
    switch (incidente.estado) {
      case 'Abierto': return 'bg-yellow-100 text-yellow-800';
      case 'En investigación': return 'bg-blue-100 text-blue-800';
      case 'Cerrado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Ícono según tipo de delito
  const getIcono = () => {
    switch (incidente.tipo_delito_id) {
      case 'TD001': return '📱'; // Estafa SMS
      case 'TD002': return '🕵️'; // Suplantación
      case 'TD003': return '🎣'; // Phishing
      case 'TD004': return '💻'; // Ciberacoso
      default: return '🚨';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border-b border-gray-200 p-4 hover:bg-gray-50 active:bg-gray-100 transition cursor-pointer flex items-center gap-3"
    >
      {/* Icono */}
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
        {getIcono()}
      </div>

      {/* Información principal */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-800">
            {incidente.victima?.nombre || 'Sin nombre'}
          </h3>
          <span className="text-xs text-gray-500">
            {new Date(incidente.fecha_incidente).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-gray-600 truncate">
          {incidente.descripcion?.substring(0, 60)}...
        </p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            💰 ${incidente.afectacion_economica?.monto_perdido?.toLocaleString()}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${getEstadoColor()}`}>
            {incidente.estado}
          </span>
        </div>
      </div>

      {/* Indicador de evidencias */}
      {incidente.evidencias_url?.length > 0 && (
        <div className="text-gray-400">
          📷 {incidente.evidencias_url.length}
        </div>
      )}

      {/* Indicador offline */}
      {!incidente.sincronizado && (
        <div className="text-yellow-500 text-sm">
          ⚪ Pendiente
        </div>
      )}
    </div>
  );
}

export default IncidenteCard;
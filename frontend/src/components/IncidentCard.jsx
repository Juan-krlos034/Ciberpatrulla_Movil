// frontend/src/components/IncidentCard.jsx
import React from 'react';

function IncidentCard({ incidente, onClick }) {
  const getEstadoConfig = () => {
    switch (incidente.estado) {
      case 'Abierto': 
        return { 
          color: 'text-amber-400',
          border: 'border-l-amber-500',
          bg: 'bg-amber-500/10',
          icon: '🟡'
        };
      case 'En investigación': 
        return { 
          color: 'text-blue-400',
          border: 'border-l-blue-500',
          bg: 'bg-blue-500/10',
          icon: '🔍'
        };
      case 'Cerrado': 
        return { 
          color: 'text-emerald-400',
          border: 'border-l-emerald-500',
          bg: 'bg-emerald-500/10',
          icon: '✅'
        };
      default: 
        return { 
          color: 'text-gray-400',
          border: 'border-l-gray-500',
          bg: 'bg-gray-500/10',
          icon: '📋'
        };
    }
  };

  const estadoConfig = getEstadoConfig();
  const fecha = new Date(incidente.fecha_incidente).toLocaleDateString('es-CO');

  return (
    <div
      onClick={onClick}
      className={`glass-card-futuristic border-l-4 ${estadoConfig.border} border-b border-green-500/10 p-5 hover:bg-green-500/5 transition-all duration-200 cursor-pointer group animate-fadeIn`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${estadoConfig.bg} flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform`}>
          {incidente.tipo_delito_id?.includes('SMS') ? '📱' : 
           incidente.tipo_delito_id?.includes('Suplantación') ? '🕵️' :
           incidente.tipo_delito_id?.includes('Phishing') ? '🎣' : '🚨'}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono bg-green-500/20 px-2 py-1 rounded-md text-green-400 border border-green-500/30">
                #{incidente.incidente_id || 'N/A'}
              </span>
              <span className={`text-xs px-2 py-1 rounded-md ${estadoConfig.bg} ${estadoConfig.color} flex items-center gap-1 font-mono`}>
                <span>{estadoConfig.icon}</span> {incidente.estado}
              </span>
              {incidente.evidencias_url?.length > 0 && (
                <span className="text-xs text-green-400/60 flex items-center gap-1 font-mono">
                  📷 {incidente.evidencias_url.length}
                </span>
              )}
            </div>
            <span className="text-xs text-green-400/60 font-mono">{fecha}</span>
          </div>
          
          <h3 className="font-semibold text-white mt-2 text-lg">
            {incidente.victima?.nombre || 'Sin nombre'}
          </h3>
          
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
            {incidente.descripcion?.substring(0, 100)}...
          </p>
          
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-green-500/10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-400/60 font-mono">💰 Monto perdido:</span>
              <span className="text-sm font-bold text-red-400 font-mono">
                ${incidente.afectacion_economica?.monto_perdido?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="text-green-400/40 group-hover:text-green-400 transition-colors">
              <span className="text-sm font-mono">Ver detalles →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentCard;
// frontend/src/components/ListaIncidentes.jsx
import React from 'react';
import IncidentCard from './IncidentCard';

function ListaIncidentes({ incidentes = [], onIncidentClick }) {
  if (incidentes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">📭</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-700">No hay incidentes</h3>
        <p className="text-gray-400 text-sm mt-1">No se encontraron incidentes registrados</p>
        <p className="text-gray-400 text-xs mt-2">Presiona el botón + para crear uno nuevo</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {incidentes.map((incidente, index) => (
        <IncidentCard
          key={incidente.incidente_id || incidente._id || index}
          incidente={incidente}
          onClick={() => onIncidentClick && onIncidentClick(incidente)}
        />
      ))}
    </div>
  );
}

export default ListaIncidentes;
// frontend/src/components/ListaIncidentes.jsx
import React, { useEffect, useState } from 'react';
import IncidentCard from './IncidentCard';
import OfflineIndicator from './OfflineIndicator';

function ListaIncidentes({ incidentes = [], onIncidentClick }) {
  // No cargar nada aquí, solo mostrar lo que recibe de AppContent
  return (
    <div className="space-y-0">
      <OfflineIndicator />
      {incidentes.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-4xl mb-2">📭</p>
          <p>No hay incidentes registrados</p>
        </div>
      ) : (
        incidentes.map((incidente) => (
          <IncidentCard
            key={incidente.incidente_id || incidente._id || Math.random()}
            incidente={incidente}
            onClick={() => onIncidentClick && onIncidentClick(incidente)}
          />
        ))
      )}
    </div>
  );
}

export default ListaIncidentes;
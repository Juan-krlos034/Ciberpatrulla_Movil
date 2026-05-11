// frontend/src/components/OfflineIndicator.jsx
import React, { useState, useEffect } from 'react';

function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(0);

  useEffect(() => {
    // Verificar incidentes pendientes en localStorage
    const checkPendingIncidentes = () => {
      const offlineIncidentes = localStorage.getItem('offline_incidentes');
      if (offlineIncidentes) {
        const pendientes = JSON.parse(offlineIncidentes);
        setPendingSync(pendientes.length);
      }
    };

    checkPendingIncidentes();

    // Listeners para cambios de conexión
    const handleOnline = () => {
      setIsOnline(true);
      // Intentar sincronizar cuando vuelva la conexión
      sincronizarOffline();
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const sincronizarOffline = async () => {
    const offlineData = localStorage.getItem('offline_incidentes');
    if (!offlineData) return;

    const pendientes = JSON.parse(offlineData);
    if (pendientes.length === 0) return;

    // Mostrar notificación de sincronización
    console.log(`Sincronizando ${pendientes.length} incidentes pendientes...`);

    // Intentar sincronizar cada uno (implementar con tu API)
    for (const incidente of pendientes) {
      try {
        const response = await fetch('http://localhost:3000/api/incidentes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify(incidente)
        });
        
        if (response.ok) {
          // Eliminar de pendientes
          const nuevosPendientes = pendientes.filter(p => p.incidente_id !== incidente.incidente_id);
          localStorage.setItem('offline_incidentes', JSON.stringify(nuevosPendientes));
          setPendingSync(nuevosPendientes.length);
        }
      } catch (error) {
        console.error('Error sincronizando:', error);
      }
    }
  };

  if (isOnline && pendingSync === 0) {
    return null; // No mostrar nada si está online y sin pendientes
  }

  return (
    <div className={`sticky top-0 z-30 ${!isOnline ? 'bg-red-600' : 'bg-yellow-600'} text-white px-4 py-2 text-center text-sm`}>
      <div className="flex items-center justify-center gap-2">
        {!isOnline ? (
          <>
            <span className="text-lg">📡</span>
            <span>Sin conexión a internet. Los datos se guardarán localmente.</span>
          </>
        ) : (
          <>
            <span className="animate-pulse">🔄</span>
            <span>Sincronizando {pendingSync} incidente(s) pendiente(s)...</span>
          </>
        )}
      </div>
    </div>
  );
}

export default OfflineIndicator;
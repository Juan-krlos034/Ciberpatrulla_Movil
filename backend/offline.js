// frontend/offline.js - Usar IndexedDB para almacenamiento local

// Abrir base de datos local
const dbOffline = await indexedDB.open('CiberpatrullaOffline', 1);

// Guardar incidente sin conexión
async function guardarOffline(incidente) {
    const transaction = db.transaction(['pendientes'], 'readwrite');
    const store = transaction.objectStore('pendientes');
    await store.add({
        id: Date.now(),
        incidente: incidente,
        fecha: new Date(),
        sincronizado: false
    });
    
    // Intentar sincronizar cuando haya conexión
    if (navigator.onLine) {
        sincronizarPendientes();
    }
}

// Sincronizar cuando hay internet
window.addEventListener('online', sincronizarPendientes);
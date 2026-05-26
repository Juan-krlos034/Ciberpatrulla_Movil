// frontend/src/components/GaleriaEvidencias.jsx
import React, { useState, useEffect } from 'react';

function GaleriaEvidencias({ evidencias = [] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [urlsValidas, setUrlsValidas] = useState([]);

  useEffect(() => {
    // Procesar las URLs de las evidencias
    const procesarUrls = () => {
      const validas = [];
      const lista = Array.isArray(evidencias) ? evidencias : [];
      
      for (const ev of lista) {
        let url = null;
        
        if (typeof ev === 'string') {
          url = ev;
        } else if (ev && typeof ev === 'object') {
          url = ev.url || ev.fileUrl || ev.data;
        }
        
        if (url && typeof url === 'string' && url !== '') {
          // Si es URL relativa, completarla
          if (url.startsWith('/uploads')) {
            url = `http://localhost:3000${url}`;
          }
          // Solo URLs válidas (no temporales)
          if (url.startsWith('http') && !url.includes('temp_') && !url.includes('blob:')) {
            validas.push(url);
          }
        }
      }
      
      console.log('📸 URLs de evidencias válidas:', validas);
      setUrlsValidas(validas);
    };
    
    procesarUrls();
  }, [evidencias]);

  if (urlsValidas.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <span className="text-5xl">📷</span>
        <p className="text-gray-500 mt-2">No hay evidencias adjuntas</p>
        <p className="text-xs text-gray-400">Las imágenes se mostrarán aquí</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {urlsValidas.slice(0, 6).map((url, idx) => (
          <div
            key={idx}
            onClick={() => {
              setSelectedUrl(url);
              setModalOpen(true);
            }}
            className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <img
              src={url}
              alt={`Evidencia ${idx + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('❌ Error cargando imagen:', url);
                e.target.src = 'https://placehold.co/400x400?text=Error';
              }}
            />
          </div>
        ))}
      </div>

      {urlsValidas.length > 6 && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          +{urlsValidas.length - 6} evidencias más
        </p>
      )}

      {/* Modal para ver imagen ampliada */}
      {modalOpen && selectedUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative max-w-full max-h-full">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-gray-300"
            >
              ✕
            </button>
            <img
              src={selectedUrl}
              alt="Evidencia ampliada"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onError={(e) => {
                e.target.src = 'https://placehold.co/800x600?text=No+se+pudo+cargar';
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default GaleriaEvidencias;
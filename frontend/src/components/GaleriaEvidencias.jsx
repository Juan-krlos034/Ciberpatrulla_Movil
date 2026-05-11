import React, { useState } from 'react';

function GaleriaEvidencias({ evidencias = [] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvidencia, setSelectedEvidencia] = useState(null);

  const abrirModal = (evidencia) => {
    setSelectedEvidencia(evidencia);
    setModalOpen(true);
  };

  const esVideo = (url) => {
    return url?.match(/\.(mp4|mov|avi)$/i);
  };

  if (evidencias.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
        📷 No hay evidencias adjuntas
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {evidencias.slice(0, 6).map((ev, index) => (
          <div
            key={index}
            onClick={() => abrirModal(ev)}
            className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
          >
            {esVideo(ev.url) ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                <span className="text-3xl">🎥</span>
              </div>
            ) : (
              <img src={ev.url} alt="Evidencia" className="w-full h-full object-cover" />
            )}
          </div>
        ))}
      </div>

      {evidencias.length > 6 && (
        <p className="text-sm text-gray-500 mt-2">
          +{evidencias.length - 6} evidencias más
        </p>
      )}

      {/* Modal para ver evidencia ampliada */}
      {modalOpen && selectedEvidencia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative max-w-full max-h-full p-4">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-white text-3xl z-10"
            >
              ✕
            </button>
            {esVideo(selectedEvidencia.url) ? (
              <video
                src={selectedEvidencia.url}
                controls
                className="max-w-full max-h-[90vh]"
                autoPlay
              />
            ) : (
              <img
                src={selectedEvidencia.url}
                alt="Evidencia ampliada"
                className="max-w-full max-h-[90vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default GaleriaEvidencias;
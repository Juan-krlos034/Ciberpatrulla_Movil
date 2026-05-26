// frontend/src/components/EvidenciasUpload.jsx
import React, { useState, useRef } from 'react';
import { uploadFile } from '../services/uploadService';

function EvidenciasUpload({ onEvidenciasChange }) {
  const [evidencias, setEvidencias] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Tipos de archivo permitidos
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];
  const maxSize = 50 * 1024 * 1024; // 50MB

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    const nuevosArchivos = [];

    for (const file of files) {
      // Validar tipo
      if (!tiposPermitidos.includes(file.type)) {
        alert(`Formato no válido: ${file.name}. Solo imágenes (JPEG, PNG, GIF) y videos (MP4)`);
        continue;
      }

      // Validar tamaño
      if (file.size > maxSize) {
        alert(`Archivo muy grande: ${file.name}. Máximo 50MB`);
        continue;
      }

      nuevosArchivos.push(file);
    }

    if (nuevosArchivos.length === 0) return;

    setUploading(true);

    try {
      const uploadedEvidencias = [];
      
      for (const file of nuevosArchivos) {
        // Crear una URL local para vista previa inmediata
        const localUrl = URL.createObjectURL(file);
        
        // Mostrar vista previa mientras se sube
        const evidenciaLocal = {
          id: `temp_${Date.now()}_${file.name}`,
          nombre: file.name,
          tipo: file.type.startsWith('image') ? 'imagen' : 'video',
          url: localUrl,
          tamano: file.size,
          pendiente: true,
          fecha: new Date().toISOString()
        };
        
        uploadedEvidencias.push(evidenciaLocal);
        setEvidencias(prev => [...prev, evidenciaLocal]);
        onEvidenciasChange([...evidencias, evidenciaLocal]);

        // Subir al backend (en segundo plano)
        try {
          const result = await uploadFile(file);
          if (result && result.url) {
            // Reemplazar la URL local con la URL del servidor
            setEvidencias(prev => prev.map(ev => 
              ev.id === evidenciaLocal.id 
                ? { ...ev, url: result.url, pendiente: false, serverUrl: result.url }
                : ev
            ));
          }
        } catch (uploadError) {
          console.error('Error subiendo archivo:', uploadError);
          // Mantener la URL local si falla la subida
        }
      }
      
      // Actualizar el estado final
      setEvidencias(prev => {
        const nuevas = [...prev];
        onEvidenciasChange(nuevas);
        return nuevas;
      });
      
    } catch (error) {
      console.error('Error procesando archivos:', error);
      alert('Error al procesar las evidencias');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const eliminarEvidencia = (index) => {
    const nuevas = evidencias.filter((_, i) => i !== index);
    setEvidencias(nuevas);
    onEvidenciasChange(nuevas);
  };

  const getIconoArchivo = (tipo) => {
    return tipo === 'imagen' ? '🖼️' : '🎥';
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm">Evidencias (fotos/videos)</h3>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-700 transition flex items-center gap-1"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              Subiendo...
            </>
          ) : (
            '📎 Adjuntar'
          )}
        </button>
      </div>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Lista de evidencias */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {evidencias.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-2">
            No hay evidencias adjuntas
          </p>
        ) : (
          evidencias.map((ev, index) => (
            <div key={ev.id || index} className="flex items-center justify-between bg-white p-2 rounded border">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-lg">{getIconoArchivo(ev.tipo)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{ev.nombre}</p>
                  <p className="text-xs text-gray-400">
                    {(ev.tamano / 1024 / 1024).toFixed(1)} MB
                    {ev.pendiente && <span className="text-yellow-500 ml-1">(subiendo...)</span>}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => eliminarEvidencia(index)}
                className="text-red-500 text-lg ml-2"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Vista previa de imágenes */}
      {evidencias.filter(e => e.tipo === 'imagen' && e.url).length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {evidencias.filter(e => e.tipo === 'imagen' && e.url).slice(0, 3).map((ev, idx) => (
            <div key={idx} className="relative aspect-square bg-gray-200 rounded overflow-hidden">
              <img
                src={ev.url}
                alt="Evidencia"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/100x100?text=Error';
                }}
              />
            </div>
          ))}
          {evidencias.filter(e => e.tipo === 'imagen' && e.url).length > 3 && (
            <div className="flex items-center justify-center bg-gray-200 rounded text-gray-500 text-xs">
              +{evidencias.filter(e => e.tipo === 'imagen').length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EvidenciasUpload;
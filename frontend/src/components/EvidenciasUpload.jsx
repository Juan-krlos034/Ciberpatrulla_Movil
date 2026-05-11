import React, { useState, useRef } from 'react';
import { uploadFile } from '../services/uploadService';

function EvidenciasUpload({ onEvidenciasChange }) {
  const [evidencias, setEvidencias] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Validar tipos de archivo permitidos
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
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
        // Subir al backend
        const result = await uploadFile(file);
        uploadedEvidencias.push({
          url: result.url,
          nombre: file.name,
          tipo: file.type.startsWith('image') ? 'imagen' : 'video',
          tamano: file.size,
          fecha: new Date().toISOString()
        });
      }

      const nuevasEvidencias = [...evidencias, ...uploadedEvidencias];
      setEvidencias(nuevasEvidencias);
      onEvidenciasChange(nuevasEvidencias);
    } catch (error) {
      console.error('Error subiendo archivos:', error);
      alert('Error al subir las evidencias');
    } finally {
      setUploading(false);
      // Limpiar input
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
    <div className="bg-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Evidencias (fotos/videos)</h3>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
        >
          {uploading ? '⏳ Subiendo...' : '📎 Adjuntar'}
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
      <div className="space-y-2">
        {evidencias.map((ev, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getIconoArchivo(ev.tipo)}</span>
              <div className="flex-1">
                <p className="text-sm font-medium truncate max-w-[150px]">{ev.nombre}</p>
                <p className="text-xs text-gray-500">
                  {(ev.tamano / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => eliminarEvidencia(index)}
              className="text-red-500 text-xl"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Vista previa de imágenes */}
      {evidencias.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {evidencias.filter(e => e.tipo === 'imagen').slice(0, 3).map((ev, idx) => (
            <div key={idx} className="relative aspect-square">
              <img
                src={ev.url}
                alt="Evidencia"
                className="w-full h-full object-cover rounded"
              />
            </div>
          ))}
          {evidencias.filter(e => e.tipo === 'imagen').length > 3 && (
            <div className="flex items-center justify-center bg-gray-200 rounded text-gray-500 text-sm">
              +{evidencias.filter(e => e.tipo === 'imagen').length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EvidenciasUpload;
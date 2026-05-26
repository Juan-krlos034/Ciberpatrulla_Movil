// frontend/src/components/SubirFotoPerfil.jsx
import React, { useState } from 'react';
import axios from 'axios';

function SubirFotoPerfil({ fotoActual, onFotoActualizada }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes');
      return;
    }
    
    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB');
      return;
    }
    
    setUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('foto', file);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/funcionarios/upload-foto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      });
      
      if (response.data.success) {
        onFotoActualizada(response.data.url);
        // Actualizar el localStorage con la nueva foto
        const funcionario = JSON.parse(localStorage.getItem('funcionario') || '{}');
        funcionario.foto_url = response.data.url;
        localStorage.setItem('funcionario', JSON.stringify(funcionario));
      }
    } catch (error) {
      console.error('Error subiendo foto:', error);
      setError('Error al subir la foto. Intenta nuevamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className="cursor-pointer group">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-200">
          {fotoActual ? (
            <img 
              src={fotoActual} 
              alt="Perfil" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '';
                e.target.className = 'hidden';
              }}
            />
          ) : (
            <span className="text-4xl text-white">👮</span>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="text-white text-sm">📷</span>
          </div>
        </div>
        <span className="text-xs text-green-600 mt-2 block text-center group-hover:underline">
          {uploading ? 'Subiendo...' : 'Cambiar foto'}
        </span>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFotoChange} 
          className="hidden" 
          disabled={uploading}
        />
      </label>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default SubirFotoPerfil;
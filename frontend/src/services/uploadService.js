import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('evidencia', file);
  formData.append('tipo', file.type.startsWith('image') ? 'foto' : 'video');

  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/upload/evidencia`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-auth-token': token
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en upload:', error);
    // Si no hay conexión, guardar localmente para subir después
    return await guardarOffline(file);
  }
};

// Guardar evidencia localmente para subir después (offline)
const guardarOffline = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const evidenciaOffline = {
        id: `temp_${Date.now()}_${file.name}`,
        nombre: file.name,
        tipo: file.type,
        data: reader.result,
        pendiente: true,
        fecha: new Date().toISOString()
      };
      
      // Guardar en IndexedDB
      const offlineEvidencias = JSON.parse(localStorage.getItem('offline_evidencias') || '[]');
      offlineEvidencias.push(evidenciaOffline);
      localStorage.setItem('offline_evidencias', JSON.stringify(offlineEvidencias));
      
      resolve({ url: evidenciaOffline.id, offline: true });
    };
    reader.readAsDataURL(file);
  });
};
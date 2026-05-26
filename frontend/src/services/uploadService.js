// frontend/src/services/uploadService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('evidencia', file);

  try {
    const token = localStorage.getItem('token');
    
    console.log('📤 Subiendo archivo:', file.name);
    
    const response = await axios.post(`${API_URL}/upload/evidencia`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-auth-token': token
      }
    });
    
    console.log('✅ Respuesta:', response.data);
    
    if (response.data && response.data.success) {
      return { 
        success: true, 
        url: response.data.url
      };
    }
    
    return { success: false, error: 'No se recibió URL' };
    
  } catch (error) {
    console.error('❌ Error en upload:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};
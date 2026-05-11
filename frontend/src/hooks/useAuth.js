// frontend/src/hooks/useAuth.js
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api';

export const useAuth = () => {
  const [funcionario, setFuncionario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedFuncionario = localStorage.getItem('funcionario');
    
    if (token && storedFuncionario) {
      setFuncionario(JSON.parse(storedFuncionario));
    }
    setLoading(false);
  }, []);

  // Iniciar sesión - NO usa navigate directamente
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Guardar token y datos del funcionario
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('funcionario', JSON.stringify(data.data.funcionario));
      setFuncionario(data.data.funcionario);
      
      return { success: true, funcionario: data.data.funcionario };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Cerrar sesión - NO usa navigate directamente
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('funcionario');
    setFuncionario(null);
    return { success: true };
  };

  // Registrar nuevo funcionario
  const register = async (userData) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar');
      }

      return { success: true, data: data.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Verificar si está autenticado
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  // Obtener token
  const getToken = () => localStorage.getItem('token');

  return {
    funcionario,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated,
    getToken
  };
};
// frontend/src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api';

export const useAuth = () => {
  const [funcionario, setFuncionario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedFuncionario = localStorage.getItem('funcionario');
    
    if (token && storedFuncionario) {
      setFuncionario(JSON.parse(storedFuncionario));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
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

      localStorage.setItem('token', data.data.token);
      localStorage.setItem('funcionario', JSON.stringify(data.data.funcionario));
      setFuncionario(data.data.funcionario);
      
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('funcionario');
    setFuncionario(null);
    navigate('/login');
    return { success: true };
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  // 🔥 NUEVA FUNCIÓN - Actualizar funcionario
  const actualizarFuncionario = (nuevosDatos) => {
    const funcionarioActualizado = { ...funcionario, ...nuevosDatos };
    setFuncionario(funcionarioActualizado);
    localStorage.setItem('funcionario', JSON.stringify(funcionarioActualizado));
  };

  return { funcionario, loading, login, logout, isAuthenticated, actualizarFuncionario };
};
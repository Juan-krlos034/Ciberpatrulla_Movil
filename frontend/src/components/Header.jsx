// frontend/src/components/Header.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { funcionario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const nombreFuncionario = funcionario?.nombre || 'Oficial';
  const rangoFuncionario = funcionario?.rango || 'Funcionario';
  const unidadFuncionario = funcionario?.unidad || 'Policía Nacional';

  const iniciales = nombreFuncionario
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-white shadow-xl sticky top-0 z-20">
      <div className="bg-green-950/50 text-xs text-center py-1">
        <span>🚔 Sistema de Gestión de Incidentes de Ciberseguridad</span>
      </div>

      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3" onClick={() => navigate('/')}>
          <div className="bg-white/20 rounded-full p-2 cursor-pointer">
            <span className="text-2xl">🚔</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">CIBERPATRULLA</h1>
            <p className="text-xs text-green-200">Policía Nacional de Colombia</p>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-2 hover:bg-white/20 transition"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">{iniciales}</span>
            </div>
            <span className="text-sm font-medium hidden sm:inline">{nombreFuncionario}</span>
            <span className="text-xs">▼</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-30 animate-fadeIn">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold text-gray-800">{nombreFuncionario}</p>
                <p className="text-xs text-gray-500">{rangoFuncionario} - {unidadFuncionario}</p>
              </div>
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm flex items-center gap-2">
                <span>👤</span> Mi perfil
              </button>
              <hr className="my-2 mx-2" />
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm flex items-center gap-2 font-medium"
              >
                <span>🚪</span> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
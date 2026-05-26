// frontend/src/components/Header.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from "./Logo";  // ✅ Ya importado
import SubirFotoPerfil from './SubirFotoPerfil';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFotoModal, setShowFotoModal] = useState(false);
  const { funcionario, logout, actualizarFuncionario } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const handleFotoActualizada = (nuevaUrl) => {
    if (actualizarFuncionario) {
      actualizarFuncionario({ ...funcionario, foto_url: nuevaUrl });
    }
    setShowFotoModal(false);
  };

  const nombreFuncionario = funcionario?.nombre || 'Oficial';
  const rangoFuncionario = funcionario?.rango || 'Funcionario';
  const unidadFuncionario = funcionario?.unidad || 'Policía Nacional';
  const fotoUrl = funcionario?.foto_url || '';

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
        {/* ✅ Logo usando el componente Logo */}
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <Logo size="sm" variant="full" />
        </div>

        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-2 hover:bg-white/20 transition"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-green-500 flex items-center justify-center">
              {fotoUrl ? (
                <img src={fotoUrl} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-sm font-bold">{iniciales}</span>
              )}
            </div>
            <span className="text-sm font-medium hidden sm:inline">{nombreFuncionario}</span>
            <span className="text-xs">▼</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-30 animate-fadeIn">
              <div className="px-4 py-3 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
                    {fotoUrl ? (
                      <img src={fotoUrl} alt="Perfil" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-green-700 font-bold">{iniciales}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{nombreFuncionario}</p>
                    <p className="text-xs text-gray-500">{rangoFuncionario}</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => { setShowFotoModal(true); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm flex items-center gap-2"
              >
                <span>📷</span> Cambiar foto de perfil
              </button>
              
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm flex items-center gap-2">
                <span>👤</span> Mi perfil
              </button>
              
              <hr className="my-1" />
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

      {/* Modal para cambiar foto de perfil */}
      {showFotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Cambiar foto de perfil</h3>
              <button onClick={() => setShowFotoModal(false)} className="text-gray-500 text-2xl">✕</button>
            </div>
            <SubirFotoPerfil 
              fotoActual={fotoUrl} 
              onFotoActualizada={handleFotoActualizada} 
            />
            <button 
              onClick={() => setShowFotoModal(false)}
              className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
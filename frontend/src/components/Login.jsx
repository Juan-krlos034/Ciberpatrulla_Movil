// frontend/src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import FondoFuturista from './FondoFuturista';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <FondoFuturista />
      
      <div className="relative z-10 w-full max-w-md animate-fadeInUp">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl flex items-center justify-center shadow-lg animate-glow border border-green-500/30">
              <span className="text-5xl">🚔</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">CIBERPATRULLA</h1>
          <p className="text-green-400 text-sm mt-2 font-mono">Sistema de Gestión de Incidentes</p>
        </div>

        {/* Formulario */}
        <div className="glass-card-futuristic p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fadeIn font-mono">
                <span>⚠️</span> {error}
              </div>
            )}

            <div>
              <label className="block text-green-400 text-sm font-mono mb-2">Correo electrónico</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400">📧</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-white placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-mono"
                  placeholder="correo@policia.gov.co"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-green-400 text-sm font-mono mb-2">Contraseña</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400">🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-white placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-mono"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg font-mono"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Ingresando...
                </span>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/registro" className="text-green-400 hover:text-green-300 text-sm font-mono transition">
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-green-500/20">
            <p className="text-green-400/50 text-xs font-mono">
              Versión 2.0 • Policía Nacional de Colombia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
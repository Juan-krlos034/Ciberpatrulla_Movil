// frontend/src/AppContent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchBar';
import FilterButtons from './components/FilterButtons';
import ListaIncidentes from './components/ListaIncidentes';
import FormularioIncidente from './components/FormularioIncidente';
import DetalleIncidente from './components/DetalleIncidente';
import DashboardEstadisticas from './components/DashboardEstadisticas';
import BusquedaAvanzada from './components/BusquedaAvanzada';
import AlertasMontos from './components/AlertasMontos';
import FondoFuturista from './components/FondoFuturista';
import { getIncidentes, createIncidente } from './services/api';

function AppContent() {
  const { funcionario, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [incidentes, setIncidentes] = useState([]);
  const [filteredIncidentes, setFilteredIncidentes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [selectedIncidente, setSelectedIncidente] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showBusquedaAvanzada, setShowBusquedaAvanzada] = useState(false);
  const [showAlertas, setShowAlertas] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, []);

  const loadIncidentes = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getIncidentes();
      if (result.success && result.data) {
        setIncidentes(result.data);
        setFilteredIncidentes(result.data);
      }
    } catch (error) {
      console.error('Error loadIncidentes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIncidentes();
  }, [loadIncidentes]);

  const filtrarIncidentes = () => {
    let resultados = [...incidentes];
    
    if (currentFilter !== 'todos') {
      resultados = resultados.filter(i => i.estado === currentFilter);
    }
    
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      resultados = resultados.filter(i => {
        const porNumeroCaso = i.incidente_id && i.incidente_id.toLowerCase().includes(term);
        const porNombreVictima = i.victima?.nombre && i.victima.nombre.toLowerCase().includes(term);
        const porTipoDelito = i.tipo_delito_id && i.tipo_delito_id.toLowerCase().includes(term);
        const porDescripcion = i.descripcion && i.descripcion.toLowerCase().includes(term);
        
        return porNumeroCaso || porNombreVictima || porTipoDelito || porDescripcion;
      });
    }
  
    setFilteredIncidentes(resultados);
  };

  useEffect(() => {
    filtrarIncidentes();
  }, [incidentes, searchTerm, currentFilter]);

  const handleSaveIncidente = async (nuevoIncidente) => {
    try {
      const result = await createIncidente(nuevoIncidente);
      if (result.success) {
        await loadIncidentes();
      } else {
        setIncidentes(prev => [...prev, nuevoIncidente]);
      }
    } catch (error) {
      console.error('Error guardando:', error);
      setIncidentes(prev => [...prev, nuevoIncidente]);
    }
    setShowForm(false);
  };

  // ============ CÁLCULO CORREGIDO DE ESTADÍSTICAS ============
  const totalCasos = incidentes.length;
  const casosActivos = incidentes.filter(i => i.estado === 'Abierto' || i.estado === 'En investigación').length;
  
  // Cálculo robusto del monto total
  const montoTotal = incidentes.reduce((sum, incidente) => {
    let monto = 0;
    
    // Obtener el monto de diferentes posibles ubicaciones
    if (incidente.afectacion_economica?.monto_perdido) {
      monto = incidente.afectacion_economica.monto_perdido;
    } else if (incidente.monto_perdido) {
      monto = incidente.monto_perdido;
    }
    
    // Si es string, limpiar y convertir a número
    if (typeof monto === 'string') {
      // Eliminar caracteres no numéricos (excepto punto y signo menos)
      const cleaned = monto.replace(/[^0-9.-]/g, '');
      monto = parseFloat(cleaned);
    }
    
    // Si no es número válido, usar 0
    if (isNaN(monto)) {
      monto = 0;
    }
    
    return sum + monto;
  }, 0);

  // Log para depuración (puedes eliminarlo después)
  console.log('📊 Estadísticas:', { totalCasos, casosActivos, montoTotal });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <FondoFuturista />
        <div className="text-center z-10">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-mono">Cargando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <FondoFuturista />
      
      <div className="relative z-10">
        <Header funcionario={funcionario} onLogout={() => { logout(); navigate('/login'); }} />
        
        {/* Hero Section futurista */}
        <div className="bg-gradient-to-r from-green-900/80 via-green-800/80 to-green-900/80 backdrop-blur-sm text-white py-8 px-4 shadow-lg border-b border-green-500/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30 animate-glow">
                <span className="text-xl">🚔</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-wide">Panel de Control</h2>
                <p className="text-green-200 text-sm mt-0.5 font-mono">Sistema de monitoreo de ciberseguridad</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <StatsCards totalCasos={totalCasos} casosActivos={casosActivos} montoTotal={montoTotal} />
          
          <div className="mt-6 glass-card-futuristic overflow-hidden animate-fadeInUp">
            <div className="border-b border-green-500/20">
              <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            </div>
            <div className="border-b border-green-500/20 px-4 pt-3">
              <FilterButtons currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
            </div>
            
            <div className="divide-y divide-green-500/10">
              <ListaIncidentes incidentes={filteredIncidentes} onIncidentClick={setSelectedIncidente} />
            </div>
          </div>
        </div>

        {/* Botón flotante futurista */}
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-green-700 text-white w-14 h-14 rounded-full text-2xl shadow-lg hover:shadow-green-500/30 transition-all duration-200 hover:scale-105 flex items-center justify-center z-20 animate-glow"
        >
          +
        </button>

        {/* Modales */}
        {showForm && <FormularioIncidente onClose={() => setShowForm(false)} onSave={handleSaveIncidente} />}
        {selectedIncidente && <DetalleIncidente incidente={selectedIncidente} onClose={() => setSelectedIncidente(null)} />}
        {showDashboard && <DashboardEstadisticas onClose={() => setShowDashboard(false)} />}
        {showBusquedaAvanzada && <BusquedaAvanzada onResultados={setFilteredIncidentes} onClose={() => setShowBusquedaAvanzada(false)} />}
        {showAlertas && <AlertasMontos onClose={() => setShowAlertas(false)} onVerIncidente={setSelectedIncidente} />}
      </div>
    </div>
  );
}

export default AppContent;
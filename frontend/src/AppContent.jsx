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
import { getIncidentes, createIncidente } from './services/api';

function AppContent() {
  const { funcionario, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Estados
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

  // Verificar autenticación - solo una vez al montar
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, []); // ← Array vacío, NO agregues isAuthenticated aquí

  // Función para cargar incidentes - definida con useCallback
  const loadIncidentes = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getIncidentes();
      if (result.success && result.data) {
        setIncidentes(result.data);
        setFilteredIncidentes(result.data);
      } else {
        setIncidentes([]);
        setFilteredIncidentes([]);
      }
    } catch (error) {
      console.error('Error loadIncidentes:', error);
      setIncidentes([]);
      setFilteredIncidentes([]);
    } finally {
      setLoading(false);
    }
  }, []); // ← Sin dependencias

  // Cargar incidentes UNA SOLA VEZ al montar el componente
  useEffect(() => {
    loadIncidentes();
  }, [loadIncidentes]); // ← loadIncidentes es estable por useCallback

  // Filtrar incidentes cuando cambien los criterios
  useEffect(() => {
    let resultados = [...incidentes];
    
    if (currentFilter !== 'todos') {
      resultados = resultados.filter(i => i.estado === currentFilter);
    }
    
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      resultados = resultados.filter(i =>
        (i.victima?.nombre || '').toLowerCase().includes(term) ||
        (i.tipo_delito_id || '').toLowerCase().includes(term) ||
        (i.incidente_id || '').toLowerCase().includes(term)
      );
    }
    
    setFilteredIncidentes(resultados);
  }, [incidentes, searchTerm, currentFilter]);

  const handleSaveIncidente = async (nuevoIncidente) => {
    try {
      const result = await createIncidente(nuevoIncidente);
      if (result.success) {
        await loadIncidentes(); // Recargar desde el servidor
      } else {
        // Si falla, agregar localmente
        setIncidentes(prev => [...prev, nuevoIncidente]);
      }
    } catch (error) {
      console.error('Error guardando:', error);
      setIncidentes(prev => [...prev, nuevoIncidente]);
    }
    setShowForm(false);
  };

  const totalCasos = incidentes.length;
  const casosActivos = incidentes.filter(i => i.estado === 'Abierto' || i.estado === 'En investigación').length;
  const montoTotal = incidentes.reduce((sum, i) => sum + (i.afectacion_economica?.monto_perdido || 0), 0);

  // Pantalla de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-900 to-green-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-3"></div>
          <p className="text-white">Cargando incidentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header 
        funcionario={funcionario} 
        onLogout={() => {
          logout();
          navigate('/login');
        }} 
      />
      
      {/* Barra de herramientas */}
      <div className="flex flex-wrap gap-2 px-4 py-2 bg-white shadow-sm sticky top-16 z-10">
        <button 
          onClick={() => setShowDashboard(true)} 
          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-green-700 transition"
        >
          <span>📊</span> Estadísticas
        </button>
        <button 
          onClick={() => setShowBusquedaAvanzada(true)} 
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-700 transition"
        >
          <span>🔍</span> Búsqueda avanzada
        </button>
        <button 
          onClick={() => setShowAlertas(true)} 
          className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-red-700 transition"
        >
          <span>⚠️</span> Alertas
        </button>
      </div>

      <StatsCards totalCasos={totalCasos} casosActivos={casosActivos} montoTotal={montoTotal} />
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <FilterButtons currentFilter={currentFilter} onFilterChange={setCurrentFilter} />

      <ListaIncidentes incidentes={filteredIncidentes} onIncidentClick={(incidente) => setSelectedIncidente(incidente)} />

      {/* Botón flotante + */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 bg-green-700 text-white w-14 h-14 rounded-full text-3xl shadow-lg hover:bg-green-800 transition-all hover:scale-105 flex items-center justify-center z-20"
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
  );
}

export default AppContent;
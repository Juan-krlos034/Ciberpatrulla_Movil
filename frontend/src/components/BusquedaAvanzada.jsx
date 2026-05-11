// frontend/src/components/BusquedaAvanzada.jsx
import React, { useState } from 'react';
import { busquedaAvanzada, getTiposDelito } from '../services/api';

function BusquedaAvanzada({ onResultados, onClose }) {
  const [criterios, setCriterios] = useState({
    tipo_delito: '',
    estado: '',
    fecha_desde: '',
    fecha_hasta: '',
    monto_minimo: '',
    monto_maximo: '',
    victima_nombre: ''
  });
  const [tiposDelito, setTiposDelito] = useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    cargarTiposDelito();
  }, []);

  const cargarTiposDelito = async () => {
    const result = await getTiposDelito();
    if (result.success && result.data) {
      setTiposDelito(result.data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriterios(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await busquedaAvanzada(criterios);
      if (result.success && result.data) {
        onResultados(result.data);
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setCriterios({
      tipo_delito: '',
      estado: '',
      fecha_desde: '',
      fecha_hasta: '',
      monto_minimo: '',
      monto_maximo: '',
      victima_nombre: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <h2 className="text-xl font-semibold">Búsqueda Avanzada</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de delito</label>
            <select
              name="tipo_delito"
              value={criterios.tipo_delito}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Todos</option>
              {tiposDelito.map(tipo => (
                <option key={tipo.tipo_delito_id} value={tipo.tipo_delito_id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              name="estado"
              value={criterios.estado}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Todos</option>
              <option value="Abierto">Abierto</option>
              <option value="En investigación">En investigación</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha desde</label>
              <input
                type="date"
                name="fecha_desde"
                value={criterios.fecha_desde}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha hasta</label>
              <input
                type="date"
                name="fecha_hasta"
                value={criterios.fecha_hasta}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Monto mínimo</label>
              <input
                type="number"
                name="monto_minimo"
                placeholder="COP"
                value={criterios.monto_minimo}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Monto máximo</label>
              <input
                type="number"
                name="monto_maximo"
                placeholder="COP"
                value={criterios.monto_maximo}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nombre de la víctima</label>
            <input
              type="text"
              name="victima_nombre"
              placeholder="Nombre completo"
              value={criterios.victima_nombre}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={limpiarFiltros}
              className="flex-1 bg-gray-200 text-gray-800 p-2 rounded-lg font-semibold"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-400 text-white p-2 rounded-lg font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-700 text-white p-2 rounded-lg font-semibold hover:bg-green-800 transition"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BusquedaAvanzada;
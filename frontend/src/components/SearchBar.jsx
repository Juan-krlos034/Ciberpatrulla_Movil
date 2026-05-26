// frontend/src/components/SearchBar.jsx
import React from 'react';

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="p-4">
      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
          🔍
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por número de caso, víctima o tipo de delito..."
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-700 placeholder-gray-400 transition-all"
        />
      </div>
      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
        <span>🔍 Ejemplos:</span>
        <span className="text-green-600">#I001</span>
        <span className="text-green-600">Juan Pérez</span>
        <span className="text-green-600">Estafa SMS</span>
        <span className="text-green-600">Phishing</span>
      </div>
    </div>
  );
}

export default SearchBar;
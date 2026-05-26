// frontend/src/components/FilterButtons.jsx
import React from 'react';

function FilterButtons({ currentFilter, onFilterChange }) {
  const filters = [
    { id: 'todos', label: 'Todos', icon: '📋' },
    { id: 'Abierto', label: 'Abiertos', icon: '🟡' },
    { id: 'En investigación', label: 'Investigación', icon: '🔍' },
    { id: 'Cerrado', label: 'Cerrados', icon: '✅' }
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-1">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
            ${currentFilter === filter.id 
              ? 'bg-green-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          <span>{filter.icon}</span>
          <span>{filter.label}</span>
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;
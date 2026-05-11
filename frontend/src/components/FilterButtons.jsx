// frontend/src/components/FilterButtons.jsx
import React from 'react';

function FilterButtons({ currentFilter, onFilterChange }) {
    const filters = [
        { value: 'todos', label: '📋 Todos', color: 'gray', activeColor: 'green' },
        { value: 'Abierto', label: '🔴 Abiertos', color: 'red', activeColor: 'red' },
        { value: 'En investigación', label: '🔵 En investigación', color: 'blue', activeColor: 'blue' },
        { value: 'Cerrado', label: '🟢 Cerrados', color: 'green', activeColor: 'green' }
    ];

    const getButtonClass = (filter) => {
        const isActive = currentFilter === filter.value;
        
        if (isActive) {
            switch(filter.activeColor) {
                case 'red': return 'bg-red-600 text-white shadow-md ring-2 ring-red-300';
                case 'blue': return 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300';
                case 'green': return 'bg-green-600 text-white shadow-md ring-2 ring-green-300';
                default: return 'bg-green-700 text-white shadow-md ring-2 ring-green-300';
            }
        }
        
        return 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:shadow-md';
    };

    return (
        <div className="px-4 mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {filters.map(filter => (
                    <button
                        key={filter.value}
                        onClick={() => onFilterChange(filter.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${getButtonClass(filter)}`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default FilterButtons;
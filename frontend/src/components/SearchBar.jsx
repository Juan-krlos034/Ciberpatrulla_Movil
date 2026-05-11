// frontend/src/components/SearchBar.jsx
import React, { useState } from 'react';

function SearchBar({ searchTerm, onSearchChange }) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="px-4 mb-4">
            <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-[1.02]' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">🔍</span>
                </div>
                <input
                    type="text"
                    placeholder="Buscar por víctima, tipo de delito o ID del caso..."
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all bg-white ${
                        isFocused 
                            ? 'border-green-500 shadow-lg ring-2 ring-green-200' 
                            : 'border-gray-200 shadow-sm hover:border-green-300'
                    }`}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {searchTerm && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                        <span className="text-gray-400 text-sm hover:text-gray-600 transition">✖️</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
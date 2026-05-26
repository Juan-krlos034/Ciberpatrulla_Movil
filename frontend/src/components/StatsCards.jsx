// frontend/src/components/StatsCards.jsx
import React from 'react';

function StatsCards({ totalCasos, casosActivos, montoTotal }) {
  // Validar que el monto sea un número
  const montoValido = typeof montoTotal === 'number' && !isNaN(montoTotal) ? montoTotal : 0;
  
  const cards = [
    { 
      title: 'Total Casos', 
      value: totalCasos, 
      icon: '📊', 
      gradient: 'from-green-500 to-green-700',
      border: 'border-green-500/30'
    },
    { 
      title: 'Casos Activos', 
      value: casosActivos, 
      icon: '⚠️', 
      gradient: 'from-amber-500 to-amber-700',
      border: 'border-amber-500/30'
    },
    { 
      title: 'Monto Perdido', 
      value: `$${montoValido.toLocaleString('es-CO')}`,
      icon: '💰', 
      gradient: 'from-red-500 to-red-700',
      border: 'border-red-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          className={`glass-card-futuristic p-5 transition-all duration-300 hover:scale-[1.02] border-l-4 ${card.border} animate-fadeInUp`}
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-green-400 uppercase tracking-wider">{card.title}</p>
              <p className="text-2xl font-bold text-white mt-2 font-mono">{card.value}</p>
            </div>
            <div className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg animate-glow`}>
              <span className="text-white text-2xl">{card.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
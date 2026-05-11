// frontend/src/components/StatsCards.jsx
import React from 'react';

function StatsCards({ totalCasos, casosActivos, montoTotal }) {
    const stats = [
        {
            titulo: 'Total Casos',
            valor: totalCasos,
            icono: '📋',
            color: 'bg-gradient-to-br from-green-500 to-green-700',
            bg: 'from-green-50 to-green-100',
            textColor: 'text-green-700'
        },
        {
            titulo: 'Casos Activos',
            valor: casosActivos,
            icono: '🟡',
            color: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
            bg: 'from-yellow-50 to-yellow-100',
            textColor: 'text-yellow-700'
        },
        {
            titulo: 'Monto Perdido',
            valor: `$${montoTotal.toLocaleString('es-CO')}`,
            icono: '💰',
            color: 'bg-gradient-to-br from-red-500 to-red-700',
            bg: 'from-red-50 to-red-100',
            textColor: 'text-red-700'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
            {stats.map((stat, index) => (
                <div 
                    key={index}
                    className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn`}
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">{stat.titulo}</p>
                            <p className={`text-2xl font-bold ${stat.textColor} mt-2`}>{stat.valor}</p>
                        </div>
                        <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md`}>
                            {stat.icono}
                        </div>
                    </div>
                    {/* Barra de progreso decorativa */}
                    <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${stat.color.replace('bg-gradient-to-br', 'bg')} rounded-full`} style={{ width: '70%' }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StatsCards;
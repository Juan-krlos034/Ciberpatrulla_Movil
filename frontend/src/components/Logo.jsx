// frontend/src/components/Logo.jsx
import React from 'react';

function Logo({ size = 'md', variant = 'full', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-base',
    md: 'w-12 h-12 text-xl',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-24 h-24 text-4xl'
  };

  const sizeClasses = {
    sm: { icon: 'text-xl', title: 'text-lg', subtitle: 'text-xs', shield: 'w-8 h-8' },
    md: { icon: 'text-2xl', title: 'text-xl', subtitle: 'text-xs', shield: 'w-12 h-12' },
    lg: { icon: 'text-3xl', title: 'text-2xl', subtitle: 'text-sm', shield: 'w-16 h-16' },
    xl: { icon: 'text-5xl', title: 'text-3xl', subtitle: 'text-sm', shield: 'w-24 h-24' }
  };

  const IconoConEscudo = () => (
    <div className="relative">
      {/* Escudo de fondo */}
      <svg className={`${sizeClasses[size].shield}`} viewBox="0 0 100 100" fill="none">
        <path d="M50 5L10 20V45C10 70 30 90 50 95C70 90 90 70 90 45V20L50 5Z" 
              fill="url(#shieldGrad)" stroke="#F9A825" strokeWidth="2"/>
        <path d="M50 15L20 27V45C20 65 35 82 50 86C65 82 80 65 80 45V27L50 15Z" 
              fill="url(#innerGrad)" stroke="#F9A825" strokeWidth="1.5"/>
        <circle cx="50" cy="50" r="16" fill="#1B5E20" stroke="#F9A825" strokeWidth="1.5"/>
        <text x="50" y="58" textAnchor="middle" fill="#F9A825" fontSize="18" fontWeight="bold">👮</text>
        <defs>
          <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2E7D32"/>
            <stop offset="100%" stopColor="#0D3B0F"/>
          </linearGradient>
          <linearGradient id="innerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4CAF50"/>
            <stop offset="100%" stopColor="#1B5E20"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  const variants = {
    icon: <IconoConEscudo />,
    full: (
      <div className={`flex items-center gap-3 ${className} group`}>
        <IconoConEscudo />
        <div>
          <h1 className={`${sizeClasses[size].title} font-bold text-white tracking-wide group-hover:scale-105 transition-transform duration-200`}>
            CIBERPATRULLA
          </h1>
          <p className={`${sizeClasses[size].subtitle} text-green-200`}>
            Policía Nacional de Colombia
          </p>
        </div>
      </div>
    )
  };

  return variants[variant] || variants.full;
}

export default Logo;
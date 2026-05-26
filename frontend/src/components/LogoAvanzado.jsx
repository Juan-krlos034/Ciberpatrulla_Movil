// frontend/src/components/LogoAvanzado.jsx
import React from 'react';

function LogoAvanzado({ size = 'md', variant = 'full', className = '' }) {
  const sizes = {
    sm: 40,
    md: 56,
    lg: 72,
    xl: 96
  };

  const dimension = sizes[size];

  const LogoImage = () => (
    <svg width={dimension} height={dimension} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Escudo exterior */}
      <path d="M60 8L12 28V56C12 84 36 108 60 114C84 108 108 84 108 56V28L60 8Z" 
            fill="url(#escudoGradiente)" stroke="#D4AF37" strokeWidth="2.5"/>
      
      {/* Borde interior dorado */}
      <path d="M60 16L20 33V56C20 80 40 100 60 105C80 100 100 80 100 56V33L60 16Z" 
            fill="url(#interiorGradiente)" stroke="#D4AF37" strokeWidth="1.5"/>
      
      {/* Banda superior */}
      <rect x="25" y="28" width="70" height="8" rx="4" fill="#D4AF37" opacity="0.9"/>
      <text x="60" y="35" textAnchor="middle" fill="#0D3B0F" fontSize="8" fontWeight="bold" fontFamily="Arial">CIBER</text>
      
      {/* Estrella central */}
      <polygon points="60,42 65,52 76,53 68,60 70,71 60,66 50,71 52,60 44,53 55,52" 
               fill="#D4AF37" stroke="#F9A825" strokeWidth="1"/>
      
      {/* Escudo interior pequeño */}
      <path d="M60 58L48 66V78C48 86 53 94 60 96C67 94 72 86 72 78V66L60 58Z" 
            fill="url(#escudoGradiente)" stroke="#D4AF37" strokeWidth="1"/>
      
      {/* Ícono de policía */}
      <text x="60" y="82" textAnchor="middle" fill="#D4AF37" fontSize="16" fontWeight="bold">🚔</text>
      
      {/* Estrellas decorativas */}
      <circle cx="78" cy="50" r="2" fill="#D4AF37"/>
      <circle cx="82" cy="58" r="1.5" fill="#D4AF37"/>
      <circle cx="80" cy="66" r="1" fill="#D4AF37"/>
      <circle cx="42" cy="50" r="2" fill="#D4AF37"/>
      <circle cx="38" cy="58" r="1.5" fill="#D4AF37"/>
      <circle cx="40" cy="66" r="1" fill="#D4AF37"/>
      
      {/* Banda inferior */}
      <rect x="30" y="90" width="60" height="6" rx="3" fill="#D4AF37" opacity="0.9"/>
      <text x="60" y="95" textAnchor="middle" fill="#0D3B0F" fontSize="6" fontWeight="bold">PATRULLA</text>
      
      {/* Gradientes */}
      <defs>
        <linearGradient id="escudoGradiente" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E7D32"/>
          <stop offset="100%" stopColor="#0D3B0F"/>
        </linearGradient>
        <linearGradient id="interiorGradiente" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4CAF50"/>
          <stop offset="100%" stopColor="#1B5E20"/>
        </linearGradient>
      </defs>
    </svg>
  );

  const variants = {
    icon: <LogoImage />,
    full: (
      <div className={`flex items-center gap-3 ${className}`}>
        <LogoImage />
        <div>
          <h1 className={`font-bold text-white tracking-wide ${
            size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-2xl' : 'text-3xl'
          }`}>
            CIBERPATRULLA
          </h1>
          <p className={`text-green-200 ${
            size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm'
          }`}>
            Policía Nacional de Colombia
          </p>
        </div>
      </div>
    )
  };

  return variants[variant] || variants.full;
}

export default LogoAvanzado;
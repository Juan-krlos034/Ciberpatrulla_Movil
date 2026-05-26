// frontend/src/components/FondoFuturista.jsx
import React from 'react';

function FondoFuturista() {
  // Generar partículas aleatorias
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDelay: Math.random() * 10,
    animationDuration: 5 + Math.random() * 10
  }));

  return (
    <div className="futuristic-bg">
      {/* Círculos decorativos */}
      <div className="circle-1"></div>
      <div className="circle-2"></div>
      <div className="circle-3"></div>
      
      {/* Líneas de datos */}
      <div className="data-line data-line-1"></div>
      <div className="data-line data-line-2"></div>
      <div className="data-line data-line-3"></div>
      
      {/* Partículas */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`
          }}
        ></div>
      ))}
      
      {/* Efecto de scanline */}
      <div className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 2px, transparent 2px, transparent 4px)'
        }}
      ></div>
    </div>
  );
}

export default FondoFuturista;
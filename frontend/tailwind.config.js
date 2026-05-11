/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Colores institucionales Policía Nacional
      colors: {
        'policia': {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',      // Verde claro
          600: '#388E3C',
          700: '#2E7D32',
          800: '#1B5E20',      // Verde principal
          900: '#0D3B0F',      // Verde oscuro
          'azul': '#0D47A1',
          'azul-claro': '#1976D2',
          'rojo': '#C62828',
          'rojo-claro': '#EF5350',
          'amarillo': '#F9A825',
        }
      },
      
      // Fuentes
      fontFamily: {
        'sans': ['Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'system-ui', 'sans-serif'],
        'mono': ['Courier New', 'monospace'],
      },
      
      // Animaciones personalizadas
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out',
        'fadeInUp': 'fadeInUp 0.4s ease-out',
        'fadeInDown': 'fadeInDown 0.3s ease-out',
        'slideIn': 'slideIn 0.3s ease-out',
        'slideInRight': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 2s infinite',
        'spin-slow': 'spin 1.5s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      
      // Keyframes para animaciones
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      
      // Box shadows personalizados
      boxShadow: {
        'policia': '0 4px 14px 0 rgba(27, 94, 32, 0.2)',
        'policia-lg': '0 8px 25px 0 rgba(27, 94, 32, 0.15)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 25px rgba(0, 0, 0, 0.1)',
        'floating': '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
      },
      
      // Bordes redondeados
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      
      // Altura y ancho específicos para móvil
      minHeight: {
        'screen-safe': '100vh',
      },
      
      // Z-index
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      // Backdrop blur para modales
      backdropBlur: {
        'xs': '2px',
      },
      
      // Gradientes personalizados
      backgroundImage: {
        'gradient-policia': 'linear-gradient(135deg, #1B5E20 0%, #0D3B0F 100%)',
        'gradient-policia-light': 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
        'gradient-hero': 'linear-gradient(135deg, #1B5E20 0%, #0D47A1 100%)',
      },
    },
  },
  plugins: [
    // Plugin para formas (opcional)
    require('@tailwindcss/forms'),
    // Plugin para tipografía (opcional)
    require('@tailwindcss/typography'),
  ],
}
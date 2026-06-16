/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          black: '#0a0a0f',
          dark: '#0f0f1a',
          card: '#13131f',
          border: '#1e1e2e',
          muted: '#2a2a3e',
          red: '#e63946',
          'red-dark': '#c1121f',
          'red-glow': 'rgba(230,57,70,0.15)',
          gold: '#f4a261',
          text: '#e8e8f0',
          subtle: '#8888a8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at top, #1a0a0f 0%, #0a0a0f 60%)',
        'card-gradient': 'linear-gradient(135deg, #13131f 0%, #0f0f1a 100%)',
      },
      boxShadow: {
        'red-glow': '0 0 30px rgba(230,57,70,0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-red': 'pulseRed 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseRed: { '0%, 100%': { boxShadow: '0 0 20px rgba(230,57,70,0.2)' }, '50%': { boxShadow: '0 0 40px rgba(230,57,70,0.4)' } },
      }
    },
  },
  plugins: [],
}

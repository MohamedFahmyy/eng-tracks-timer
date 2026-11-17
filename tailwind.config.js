/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF5A00',
          orangeHover: '#E04E00',
          orangeGlow: 'rgba(255, 90, 0, 0.4)',
          purple: '#371561',
          purpleLight: '#52208E',
          purpleGlow: 'rgba(55, 21, 97, 0.4)',
          dark: '#0B0F19',
          darkSurface: '#121826',
          darkCard: '#1A2234',
          darkBorder: '#26334D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        arabic: ['Cairo', 'Segoe UI', 'Tahoma', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(255, 90, 0, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(255, 90, 0, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}

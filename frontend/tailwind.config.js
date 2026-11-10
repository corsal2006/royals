/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040711',
          900: '#070B19',
          850: '#0B1226',
          800: '#0F172A',
          750: '#15213D',
          700: '#1E293B',
          600: '#334155',
        },
        surface: {
          light: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          muted: '#F1F5F9',
        },
        royal: {
          pink: '#EA1A7F',
          'pink-hover': '#FF2E93',
          'pink-dark': '#BE1266',
          gold: '#E2B714',
          'gold-light': '#FCD34D',
          blue: '#1D4ED8',
          'blue-light': '#3B82F6',
          cyan: '#06B6D4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'royal-glow': '0 0 25px -5px rgba(234, 26, 127, 0.3)',
        'gold-glow': '0 0 25px -5px rgba(226, 183, 20, 0.25)',
        'blue-glow': '0 0 25px -5px rgba(29, 78, 216, 0.3)',
        'card-light': '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
      }
    },
  },
  plugins: [],
}


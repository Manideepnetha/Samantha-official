/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'royal-gold': '#D4AF37',
        'deep-black': '#121212',
        'blush-pink': '#F7D9DB',
        'ivory': '#FFFFFF',
        'charcoal': '#2B2B2B',
        'lavender-mist': '#E6E0F8',

        // Admin Premium Theme
        'admin-dark': '#0a0a0a',      // Ultra dark base
        'admin-card': '#141414',      // Card background
        'admin-accent': '#6366f1',    // Indigo/Violet accent
        'admin-success': '#10b981',   // Emerald
        'admin-warning': '#f59e0b',   // Amber
        'admin-danger': '#ef4444',    // Red
        'admin-glass': 'rgba(255, 255, 255, 0.05)', // Glass effect
        'admin-border': '#333333',
        'admin-text-main': '#f3f4f6',
        'admin-text-muted': '#9ca3af',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        'lora': ['Lora', 'serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.admin-accent"), 0 0 20px theme("colors.admin-accent")',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .5 },
        }
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [],
}
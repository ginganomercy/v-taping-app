/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          crimson: '#dc2626',
          scarlet: '#ef4444',
          dark: '#991b1b',
        },
        surface: {
          base: '#ffffff',
          card: '#fcfcfd',
          muted: '#f8fafc',
          border: '#f1f5f9',
          darkBorder: '#e2e8f0',
        }
      },
      boxShadow: {
        'glow-red': '0 8px 24px -4px rgba(220, 38, 38, 0.35)',
        'glow-sm': '0 4px 14px -2px rgba(220, 38, 38, 0.25)',
        'card-soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'card-lift': '0 10px 30px -4px rgba(220, 38, 38, 0.12)',
      }
    },
  },
  plugins: [],
}

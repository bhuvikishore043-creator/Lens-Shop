/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'obsidian': {
          50: '#FFFFFF',
          100: '#F8FAFC',
          200: '#F1F5F9',
          300: '#E2E8F0',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#F8FAFC',
        },
        'sky-accent': {
          light: '#E0F2FE',
          DEFAULT: '#0284C7',
          hover: '#0369A1',
          glow: '#38BDF8',
        },
        'peach-accent': {
          light: '#FFEDD5',
          DEFAULT: '#EA580C',
          hover: '#C2410C',
          glow: '#FB923C',
        },
        'gold-accent': {
          light: '#FEF9C3',
          DEFAULT: '#CA8A04',
          hover: '#A16207',
          glow: '#FACC15',
        },
        'cyan-glow': '#0284C7',
        'blue-hyper': '#2563EB',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glass-subtle': '0 4px 20px 0 rgba(15, 23, 42, 0.04)',
        'glass-card': '0 10px 30px -5px rgba(15, 23, 42, 0.07), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'glass-hover': '0 20px 40px -10px rgba(15, 23, 42, 0.12), 0 0 25px rgba(2, 132, 199, 0.15)',
        'glass-glow': '0 0 25px rgba(2, 132, 199, 0.25)',
        'peach-glow': '0 0 25px rgba(234, 88, 12, 0.25)',
        'gold-glow': '0 0 25px rgba(202, 138, 4, 0.25)',
        'floating': '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
        'subtle': '0 2px 10px rgba(15, 23, 42, 0.05)',
      },
      backdropBlur: {
        'glass': '16px',
        'glass-lg': '24px',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#6D28D9', // A vibrant purple for primary actions
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        violet: {
          100: '#EDE9FE',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
      },
      backgroundImage: {
        'grid': 'radial-gradient(circle at 1px 1px, #E2E8F0 1px, transparent 0)',
        'grid-gray-100': 'radial-gradient(circle at 1px 1px, #F3F4F6 1px, transparent 0)',
      },
      backgroundSize: {
        'grid': '2rem 2rem',
        'grid-gray-100': '2rem 2rem',
      },
    },
  },
  plugins: [],
}; 
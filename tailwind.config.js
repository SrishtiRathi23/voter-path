/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: '#FF6B00',
          light: '#FFF3E0',
          dark: '#E65C00',
        },
        navy: {
          DEFAULT: '#1A237E',
          light: '#E8EAF6',
          dark: '#0D1257',
        },
        forest: {
          DEFAULT: '#2E7D32',
          light: '#E8F5E9',
          dark: '#1B5E20',
        },
        ink: '#283593',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        h1: ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['22px', { lineHeight: '1.4', fontWeight: '600' }],
        base: ['18px', { lineHeight: '1.7' }],
        small: ['16px', { lineHeight: '1.5' }],
        meta: ['14px', { lineHeight: '1.5' }],
      },
      borderRadius: {
        card: '16px',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'check-in': 'checkIn 0.15s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        checkIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

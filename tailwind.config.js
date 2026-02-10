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
        primary: {
          DEFAULT: '#2563EB', // blue-600 (darker blue)
          dark: '#3B82F6', // blue-500 for dark mode (darker than before)
        },
        background: {
          light: '#FFFFFF',
          dark: '#0A0A0A', // Almost black
        },
        surface: {
          light: '#F9FAFB', // gray-50
          dark: '#18181B', // zinc-900
        },
        text: {
          light: '#18181B', // zinc-900
          dark: '#FAFAFA', // zinc-50
        },
        muted: {
          light: '#71717A', // zinc-500
          dark: '#A1A1AA', // zinc-400
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

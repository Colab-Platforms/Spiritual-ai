/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cosmic dark theme
        'cosmic-black': '#050509',
        'cosmic-dark': '#0B0E1A',
        'cosmic-card': '#1a1a2e',
        // Fiery orange accents
        'cosmic-orange': '#FF6A00',
        'cosmic-orange-light': '#FF7A18',
        // Gold accents
        'cosmic-gold': '#E8C17C',
        // Text colors
        'cosmic-text': '#F5F5F5',
        'cosmic-text-muted': '#9CA3AF',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(circle at 50% 50%, rgba(255, 106, 0, 0.1) 0%, transparent 70%)',
      },
      boxShadow: {
        'cosmic-glow': '0 0 20px rgba(255, 106, 0, 0.3)',
        'cosmic-glow-lg': '0 0 40px rgba(255, 106, 0, 0.2)',
      },
    },
  },
  plugins: [],
}

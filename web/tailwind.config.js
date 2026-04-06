export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-rose': '#C38B94', // A cor do botão "Agendador"
        'brand-dark': '#1A1A1A',
        'brand-bg': '#F9F6F3',   // O off-white elegante do fundo
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
}
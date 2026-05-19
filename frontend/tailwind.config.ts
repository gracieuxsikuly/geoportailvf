import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        virunga: {
          green: '#0e7a3e',
          forest: '#1a5c38',
          lake: '#1a78c2',
          volcano: '#4a4a48',
          earth: '#7a4a14',
          ochre: '#b8860b',
          sky: '#1a78c2',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

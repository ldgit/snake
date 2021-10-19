const production = !process.env.ROLLUP_WATCH;

module.exports = {
  mode: 'jit',
  purge: {
    content: ['./public/index.html', './src/**/*.svelte'],
    enabled: production, // disable purge in dev
  },
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'svelte-red': '#ff3e00',
        'svelte-red-dark': '#ff4000c5',
      },
      gap: {
        'vh-small': '0.15vh',
      },
      padding: {
        'vh-small': '0.15vh',
      },
      width: {
        'vh-large': '3.4vh',
        'vh-medium': '3.1vh',
        'vh-small': '3.0vh',
        'vh-xs': '2.5vh',
      },
      height: {
        'vh-large': '3.4vh',
        'vh-medium': '3.1vh',
        'vh-small': '3.0vh',
        'vh-xs': '2.5vh',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

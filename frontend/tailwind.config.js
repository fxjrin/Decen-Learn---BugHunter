export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        blue: {
          50: "var(--blue-50)",
          100: "var(--blue-100)",
          200: "var(--blue-200)",
          300: "var(--blue-300)",
          400: "var(--blue-400)",
          500: "var(--blue-500)",
          600: "var(--blue-600)",
          700: "var(--blue-700)",
          800: "var(--blue-800)",
          900: "var(--blue-900)",
          950: "var(--blue-950)",
        },
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        background: "var(--background)",
        light: "var(--light)",
        border: "var(--border)",
        button_bg: "var(--button-bg)",
        button_hover: "var(--button-hover)",
      },
    },
  },
  plugins: [],
}


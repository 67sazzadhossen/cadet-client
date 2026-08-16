/** @type {import('tailwindcss').Config} */
export const content = [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  extend: {
    colors: {
      primary: {
        50: "#f0f9ff",
        100: "#e0f2fe",
        500: "#0ea5e9",
        600: "#0284c7",
        700: "#0369a1",
        900: "#0c4a6e",
      },
      secondary: {
        50: "#fdf4ff",
        500: "#d946ef",
        600: "#c026d3",
        700: "#a21caf",
        900: "#701a75",
      },
      accent: {
        50: "#fffbeb",
        500: "#f59e0b",
        600: "#d97706",
        700: "#b45309",
      },
    },
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      display: ["Poppins", "system-ui", "sans-serif"],
    },
    animation: {
      "fade-in": "fadeIn 0.5s ease-in-out",
      "slide-up": "slideUp 0.5s ease-out",
    },
  },
};
export const plugins = [];

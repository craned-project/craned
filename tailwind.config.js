/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './stories//**/*.{ts,tsx}',
    './shadcn/ui/*.tsx',
    './app/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        light: {
          DEFAULT: "#FFF7D4",
          foreground: "#FFF7D4",
        },
        pri: {
          DEFAULT: "#FFD95A",
          foreground: "#FFD95A",
        },
        sec: {
          DEFAULT: "#C07F00",
          foreground: "#hsl(var(--destructive))",
        },
        tri: {
          DEFAULT: "#4C3D3D",
          foreground: "#4C3D3D",
        },
        dark: {
          DEFAULT: "#001C30",
          foreground: "#001C30",
        },
      },
      fontFamily: {
        'overpass': ['Overpass', 'sans-serif']
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
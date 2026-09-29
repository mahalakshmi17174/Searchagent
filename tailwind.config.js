/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aurqo: {
          darkBg: '#090a0f',
          darkSidebar: '#05060a',
          darkCard: '#0f111a',
          darkInput: '#121422',
          darkBorder: '#181b2a',
          darkHover: '#1c1f33',
          purple: '#6d28d9',
          blue: '#3b82f6',
          gradientStart: '#8b5cf6',
          gradientEnd: '#3b82f6',
          lightBg: '#f3f4f6',
          lightSidebar: '#ffffff',
          lightCard: '#f9fafb',
          lightBorder: '#e5e7eb',
        }
      }
    },
  },
  plugins: [],
}

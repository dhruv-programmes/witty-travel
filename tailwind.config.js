/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          bg: '#000000',          // System Background (Pure Black)
          card: '#1c1c1e',        // Secondary System Background
          elevated: '#2c2c2e',    // Tertiary System Background
          separator: '#38383a',   // Separator line
          blue: '#0a84ff',        // System Blue
          green: '#30d158',       // System Green
          indigo: '#5e5ce6',      // System Indigo
          orange: '#ff9f0a',      // System Orange
          pink: '#ff375f',        // System Pink
          purple: '#bf5af2',      // System Purple
          red: '#ff453a',         // System Red
          teal: '#64d2ff',        // System Teal
          yellow: '#ffd60a',      // System Yellow
          gray: '#8e8e93',        // System Gray
          'gray-2': '#aeaeb2',    // System Gray 2
          'gray-3': '#c7c7cc',    // System Gray 3
          'gray-4': '#d1d1d6',    // System Gray 4
          'gray-5': '#e5e5ea',    // System Gray 5
          'gray-6': '#f2f2f7',    // System Gray 6
          label: '#ffffff',       // Primary Label
          'label-secondary': 'rgba(235, 235, 245, 0.6)', // Secondary Label
          'label-tertiary': 'rgba(235, 235, 245, 0.3)',  // Tertiary Label
          glass: 'rgba(28, 28, 30, 0.75)', // Glass material
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'ios-soft': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'ios-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}

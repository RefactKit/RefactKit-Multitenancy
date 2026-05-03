export const theme = {
  colors: {
    bg: '#ffffff',
    'bg-2': '#f9fafb',
    fg: '#111827',
    'fg-2': '#4b5563',
    'fg-3': '#9ca3af',
    'fg-inverted': '#ffffff',
    primary: '#10b981', // Teal 500
  },
  borderRadius: {
    lg: '8px',
  },
}

export const tailwindConfig = {
  theme: {
    extend: {
      colors: theme.colors,
      borderRadius: theme.borderRadius,
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
      },
    },
  },
}

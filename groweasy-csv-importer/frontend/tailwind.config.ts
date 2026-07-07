import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#0f172a',
        'bg-alt': '#1e293b',
        'glass-bg': 'rgba(255, 255, 255, 0.05)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'accent': '#3b82f6',
        'accent-hover': '#2563eb',
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'text-primary': '#f8fafc',
        'text-secondary': '#cbd5e1',
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }
    },
  },
  plugins: [],
};
export default config;

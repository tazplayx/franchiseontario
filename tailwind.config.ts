import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        '7xl': '90rem', // 1440px — wider than default 80rem (1280px)
      },
      colors: {
        brand: {
          navy:       '#00228e',
          red:        '#ff000d',
          'red-dark': '#cc000a',
          cyan:       '#05d4fe',
          blue:       '#4284e4',
          'blue-light': '#e8f2ff',
          white:      '#ffffff',
        },
        ontario: {
          red:     '#ff000d',
          darkred: '#cc000a',
          navy:    '#00228e',
          cyan:    '#05d4fe',
          blue:    '#4284e4',
          dark:    '#0a1428',
        },
        // Override Tailwind red to use brand red throughout the site
        red: {
          50:  '#fff0f0',
          100: '#ffe0e0',
          200: '#ffb3b3',
          300: '#ff8080',
          400: '#ff4040',
          500: '#ff1a1a',
          600: '#ff000d',
          700: '#cc000a',
          800: '#990008',
          900: '#660005',
          950: '#330003',
        },
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'marquee2': 'marquee2 35s linear infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '-200% center' },
          '50%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0,34,142,0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(0,34,142,0.8), 0 0 50px rgba(0,34,142,0.3)' },
        },
      },
      backgroundSize: {
        '200%': '200%',
      },
    },
  },
  plugins: [],
}
export default config

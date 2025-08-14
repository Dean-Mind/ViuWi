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
        'nunito': ['var(--font-nunito-sans)', 'sans-serif'],
        'sans': ['var(--font-nunito-sans)', 'sans-serif'], // Set as default sans font
      },
      colors: {
        // Custom brand colors that work with both light and dark themes
        'brand-orange': 'var(--color-brand-orange)',
        'brand-orange-light': 'var(--color-brand-orange-light)',
        'brand-orange-dark': 'var(--color-brand-orange-dark)',
      },
      boxShadow: {
        'brand-orange': 'var(--shadow-brand-orange)',
        'brand-orange-hover': 'var(--shadow-brand-orange-hover)',
      },
      borderColor: {
        'input': 'var(--color-border-input)',
      },
    },
  },
} satisfies Config

export default config

import type { Config } from 'tailwindcss'

const config = {
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

        // Section label colors for CS and Bot badges
        'label-cs': 'var(--color-label-cs)',
        'label-cs-content': 'var(--color-label-cs-content)',
        'label-bot': 'var(--color-label-bot)',
        'label-bot-content': 'var(--color-label-bot-content)',

        // Avatar colors for subtle, theme-aware user avatars
        'avatar-teal': 'var(--color-avatar-teal)',
        'avatar-teal-content': 'var(--color-avatar-teal-content)',
        'avatar-purple': 'var(--color-avatar-purple)',
        'avatar-purple-content': 'var(--color-avatar-purple-content)',
        'avatar-orange': 'var(--color-avatar-orange)',
        'avatar-orange-content': 'var(--color-avatar-orange-content)',
        'avatar-green': 'var(--color-avatar-green)',
        'avatar-green-content': 'var(--color-avatar-green-content)',
        'avatar-blue': 'var(--color-avatar-blue)',
        'avatar-blue-content': 'var(--color-avatar-blue-content)',
        'avatar-pink': 'var(--color-avatar-pink)',
        'avatar-pink-content': 'var(--color-avatar-pink-content)',
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

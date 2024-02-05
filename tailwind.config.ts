import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
	content: ['./app/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter var', ...defaultTheme.fontFamily.sans],
				google: ['Roboto', 'sans-serif'],
			},
			transitionDuration: {
				0: '0ms',
				1500: '1500ms',
				2000: '2000ms',
				3000: '3000ms',
				4000: '4000ms',
				5000: '5000ms',
				10000: '10000ms',
				20000: '20000ms',
			},
			spacing: {
				72: '18rem',
				84: '21rem',
				112: '28rem',
				120: '30rem',
				128: '32rem',
				144: '36rem',
			},
			maxWidth: {
				'1/4': '25%',
				'1/2': '50%',
				'3/4': '75%',
				'90p': '90%',
				'95p': '95%',
			},
			colors: {},
			fontSize: {
				base: 'var(--font-base-size)',
				med: '0.8rem',
				md: '0.7rem',
			},
		},
	},
} satisfies Config

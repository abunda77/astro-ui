/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [ './pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
		prefix: "",
		theme: {
		  container: {
			center: true,
			padding: "2rem",
			screens: {
			  "2xl": "1400px",
			},
		  },
		  extend: {
			keyframes: {
			  "accordion-down": {
				from: { height: "0" },
				to: { height: "var(--radix-accordion-content-height)" },
			  },
			  "accordion-up": {
				from: { height: "var(--radix-accordion-content-height)" },
				to: { height: "0" },
			  },
			  pulse: {
				'0%, 100%': { opacity: 1 },
				'50%': { opacity: 0.5 },
			  },
			  dash: {
				'0%': { strokeDasharray: '1, 150', strokeDashoffset: '0' },
				'50%': { strokeDasharray: '90, 150', strokeDashoffset: '-35' },
				'100%': { strokeDasharray: '90, 150', strokeDashoffset: '-124' },
			  },
			  bounce: {
				'0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
				'50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
			  },
			    fadeIn: {
         		 '0%': { opacity: 0 },
         		 '100%': { opacity: 1 },
     		  },
			
			},
			animation: {
			  "accordion-down": "accordion-down 0.2s ease-out",
			  "accordion-up": "accordion-up 0.2s ease-out",
			  'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        	  'dash': 'dash 1.5s ease-in-out infinite',
        		'bounce': 'bounce 1s infinite',
				'fadeIn': 'fadeIn 0.5s ease-out forwards',
			},
		  },
		},
		plugins: [require("tailwindcss-animate")],
}

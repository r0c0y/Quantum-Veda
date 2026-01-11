/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'space-blue': '#0B1D3E',
                'cosmic-purple': '#5B4B8A',
                'soft-teal': '#5EEAD4',
                'near-black': '#1a1a1a',
                'off-white': '#F8F9FA',
            },
            fontFamily: {
                'serif': ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
                'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
        },
    },
    plugins: [],
}

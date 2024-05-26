/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/**/*.ejs"],
    theme: {
        extend: {
            screens: {
                'xs': '480px',
            },
            colors: {
                'text': {
                    50: 'var(--text-50)',
                    100: 'var(--text-100))',
                    200: 'var(--text-200)',
                    300: 'var(--text-300)',
                    400: 'var(--text-400)',
                    500: 'var(--text-500)',
                    600: 'var(--text-600)',
                    700: 'var(--text-700)',
                    800: 'var(--text-800)',
                    900: 'var(--text-900)',
                },
                'background': {
                    50: 'var(--background-50)',
                    100: 'var(--background-100)',
                    200: 'var(--background-200)',
                    300: 'var(--background-300',
                    400: 'var(--background-400)',
                    500: 'var(--background-500)',
                    600: 'var(--background-600)',
                    700: 'var(--background-700)',
                    800: 'var(--background-800)',
                    900: 'var(--background-900)',
                },
                'primary': {
                    50: 'var(--primary-50)',
                    100: 'var(--primary-100)',
                    200: 'var(--primary-200)',
                    300: 'var(--primary-300)',
                    400: 'var(--primary-400)',
                    500: 'var(--primary-500)',
                    600: 'var(--primary-600)',
                    700: 'var(--primary-700)',
                    800: 'var(--primary-800)',
                    900: 'var(--primary-900)',
                    950: 'var(--primary-950)',
                },
            },
        },
    },
    plugins: [],
}

import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Instrument Sans', ...defaultTheme.fontFamily.sans],
                display: ['"Playfair Display"', 'serif'],
                copy: ['"Instrument Sans"', 'sans-serif'],
                didot: ['Didot', 'serif'],
            },
            colors: {
                dark: {
                    DEFAULT: '#050505',
                    text: '#f6f0ea',
                },
                light: {
                    DEFAULT: '#fdfaf6',
                    text: '#1a1410',
                },
                accent: {
                    DEFAULT: '#d8b181',
                },
            },
            animation: {
                marquee: 'invitation-marquee 22s linear infinite',
            },
            keyframes: {
                'invitation-marquee': {
                    '0%': { transform: 'translate3d(0, 0, 0)' },
                    '100%': { transform: 'translate3d(-50%, 0, 0)' },
                },
            },
        },
    },

    plugins: [forms],
};

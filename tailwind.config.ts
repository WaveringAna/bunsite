import type { Config } from 'tailwindcss';

export default <Config>{
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
        './public/index.html',
    ],
    theme: {
        extend: {
            // Extend your theme here
        },
    },
    plugins: [
        require("@tailwindcss/aspect-ratio")
    ],
};
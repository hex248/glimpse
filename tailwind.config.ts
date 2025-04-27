import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-rubik)"],
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                destructive: "var(--destructive)",
                muted: "var(--muted)",
                accent: "var(--accent)",
                secondary: "var(--secondary)",
                popover: "var(--popover)",
            },
        },
    },
    plugins: [],
};

export default config;

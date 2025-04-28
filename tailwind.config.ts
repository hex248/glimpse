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
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                muted: "var(--muted)",
                accent: "var(--accent)",
                secondary: "var(--secondary)",
                popover: "var(--popover)",
                primary: "var(--primary)",
                primary_foreground: "var(--primary-foreground)",
            },
        },
    },
    plugins: [],
};

export default config;

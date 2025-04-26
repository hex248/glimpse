import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
    variable: "--font-rubik",
});

export const metadata: Metadata = {
    title: "glimpse",
    description: "glimpse - post your photos!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${rubik.variable}`}>
            <body className="antialiased font-sans">{children}</body>
        </html>
    );
}

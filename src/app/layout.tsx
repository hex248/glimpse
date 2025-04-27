import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const rubik = Rubik({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
    variable: "--font-rubik",
});

export const metadata: Metadata = {
    title: "glimpse",
    description: "glimpse - post your photos!",
    manifest: "/manifest.json",
};

export const viewport: Viewport = {
    themeColor: "#ffffff",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${rubik.variable}`}>
            <body className="antialiased font-sans">
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}

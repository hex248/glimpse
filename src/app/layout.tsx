import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import Header from "@/components/Header";

const rubik = Rubik({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
    variable: "--font-rubik",
});

export const metadata: Metadata = {
    title: "glimpse",
    description: "glimpse - share your photos!",
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
        <html lang="en" suppressHydrationWarning>
            <body className={`${rubik.variable} antialiased font-sans`}>
                <AuthProvider>
                    <Header />
                    <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-var(--header-height))] p-4 overflow-scroll">
                        {children}
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}

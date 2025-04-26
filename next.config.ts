import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
};

const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA(nextConfig);

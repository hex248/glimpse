"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Search, UserRound, Plus } from "lucide-react";
import { APP_PATHS } from "@/lib/APP_PATHS";
import { cn, defaultColor } from "@/lib/utils";
import { Button } from "./ui/button";

export default function BottomNav() {
    const { data: session, status } = useSession();

    const router = useRouter();

    const color =
        status === "authenticated"
            ? (session?.user as any)?.color
            : defaultColor;
    const pathname = usePathname();

    if (status !== "authenticated" || !session?.user) {
        return null;
    }

    const username = (session.user as any)?.username || "";

    const navItems = [
        {
            icon: Home,
            label: "Home",
            href: APP_PATHS.HOME.href,
            isActive: pathname === "/" || pathname === APP_PATHS.HOME.href,
        },
        {
            icon: Search,
            label: "Search",
            href: APP_PATHS.SEARCH.href,
            isActive: pathname === APP_PATHS.SEARCH.href,
        },
        {
            icon: Plus,
            label: "Post",
            href: APP_PATHS.SHARE.href,
            isActive: pathname === APP_PATHS.SHARE.href,
        },
        {
            icon: UserRound,
            label: "Profile",
            href: APP_PATHS.PROFILE(username).href,
            isActive: pathname === APP_PATHS.PROFILE(username).href,
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-gray-200 p-0 z-50">
            <div className="flex justify-around mx-auto w-full">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Button
                            key={item.href}
                            variant="ghost"
                            size="lg"
                            onClick={() => router.push(item.href)}
                            className="flex flex-1 items-center justify-center h-auto py-4 px-6 rounded-none"
                            style={{
                                color: item.isActive ? color : undefined,
                            }}
                        >
                            <Icon
                                className={cn(
                                    "size-6 transition-colors",
                                    item.isActive
                                        ? "fill-current"
                                        : "stroke-current"
                                )}
                            />
                        </Button>
                    );
                })}
            </div>
        </nav>
    );
}

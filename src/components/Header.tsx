"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import GoogleSignIn from "./GoogleSignIn";
import { useRouter } from "next/navigation";
import { APP_PATHS } from "@/lib/APP_PATHS";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ProfileColorText } from "./ui/profile-color-text";
import { LogOut, Settings2, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Header() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const userColor =
        status === "authenticated" ? (session?.user as any)?.color : null;

    return (
        <div className="w-full h-[var(--header-height)] flex items-center justify-between pl-3 pr-1 border-b border-accent">
            <Button
                variant="dummy"
                className="w-auto m-0 p-0"
                onClick={() => router.push(APP_PATHS.HOME.href)}
            >
                <ProfileColorText
                    profileColor={userColor}
                    className="text-3xl font-900"
                >
                    glimpse
                </ProfileColorText>
            </Button>
        </div>
    );
}

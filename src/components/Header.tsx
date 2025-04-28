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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ProfileColorText } from "./ui/profile-color-text";
import { LogOut, Settings2 } from "lucide-react";

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
            <div className="flex flex-row items-center justify-center gap-2">
                {status !== "loading" && (
                    <>
                        {status == "unauthenticated" && <GoogleSignIn />}
                        {status === "authenticated" && session?.user && (
                            <>
                                <div className="flex flex-row items-center justify-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            className={cn(
                                                buttonVariants({
                                                    variant: "outline",
                                                }),
                                                "flex items-center gap-2 px-3 py-5"
                                            )}
                                        >
                                            {session.user.image && (
                                                <Image
                                                    src={session.user.image}
                                                    alt="Profile picture"
                                                    width={28}
                                                    height={28}
                                                    className="rounded-full"
                                                />
                                            )}
                                            <span className="text-sm font-medium text-foreground">
                                                {(session.user as any)
                                                    ?.username ??
                                                    session.user.name ??
                                                    ""}
                                            </span>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            style={{
                                                width: "var(--radix-dropdown-menu-trigger-width)",
                                            }}
                                            className="flex flex-col gap-1 items-start"
                                            align="end"
                                        >
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    router.push(
                                                        APP_PATHS.SETTINGS.href
                                                    )
                                                }
                                            >
                                                <Settings2
                                                    size={25}
                                                    className="text-foreground"
                                                />
                                                Settings
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    signOut({
                                                        callbackUrl:
                                                            APP_PATHS.HOME.href,
                                                    })
                                                }
                                            >
                                                <LogOut
                                                    size={25}
                                                    className="text-foreground"
                                                />
                                                Log out{" "}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </>
                        )}
                    </>
                )}
                {status === "loading" && (
                    <span className="text-sm text-muted-foreground">
                        Loading...
                    </span>
                )}
            </div>
        </div>
    );
}

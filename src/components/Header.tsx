"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { IconLogout2 } from "@tabler/icons-react";
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

export default function Header() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const userColor =
        status === "authenticated" ? (session?.user as any)?.color : null;

    return (
        <div className="w-full h-[50px] flex items-center justify-between p-2 border-b border-accent">
            <Button
                variant="dummy"
                className="w-32"
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
                                                "p-5"
                                            )}
                                        >
                                            {session.user.image && (
                                                <Image
                                                    src={session.user.image}
                                                    alt="Profile picture"
                                                    width={30}
                                                    height={30}
                                                    className="rounded-full"
                                                />
                                            )}
                                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                {(session.user as any)
                                                    ?.username ??
                                                    session.user.name ??
                                                    ""}
                                            </span>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="flex flex-col gap-2">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    router.push(
                                                        APP_PATHS.SETTINGS.href
                                                    )
                                                }
                                            >
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
                                                Log out{" "}
                                                <IconLogout2
                                                    size={20}
                                                    className="text-foreground"
                                                />
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

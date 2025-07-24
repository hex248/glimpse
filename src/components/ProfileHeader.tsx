"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Ellipsis, Settings2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_PATHS } from "@/lib/APP_PATHS";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
    user: {
        id: string;
        username: string | null;
        name?: string | null;
        bio?: string | null;
        image?: string | null;
        color?: string | null;
    };
    profileColor: string;
}

export default function ProfileHeader({
    user,
    profileColor,
}: ProfileHeaderProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    const isOwnProfile =
        status === "authenticated" && session?.user?.username === user.username;

    if (!user.username) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 border-b border-muted pb-6 relative">
            {isOwnProfile && (
                <div className="absolute top-0 right-0">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="p-2 rounded-full"
                            >
                                <Ellipsis size={20} className="size-6" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() =>
                                    router.push(APP_PATHS.SETTINGS.href)
                                }
                            >
                                <Settings2 size={20} className="mr-2" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    signOut({
                                        callbackUrl: APP_PATHS.HOME.href,
                                    })
                                }
                            >
                                <LogOut size={20} className="mr-2" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            <Avatar
                className="h-24 w-24 sm:h-32 sm:w-32 border-6 sm:border-8"
                style={{ borderColor: profileColor }}
            >
                <AvatarImage
                    src={user.image ?? undefined}
                    alt={`${user.username}'s avatar`}
                />
                <AvatarFallback className="text-7xl">
                    {user.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-center sm:items-start gap-0 flex-grow">
                <h1 className="text-3xl font-bold">{user.username}</h1>
                {user.name && (
                    <p className="text-lg text-muted-foreground">{user.name}</p>
                )}
                {user.bio && (
                    <p className="text-sm text-center sm:text-left">
                        {user.bio}
                    </p>
                )}
            </div>
        </div>
    );
}

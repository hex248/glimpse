"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { APP_PATHS } from "@/lib/APP_PATHS";
import { defaultColor } from "@/lib/utils";

interface UserSearchItemProps {
    user: {
        id: string;
        username: string | null;
        name: string | null;
        image: string | null;
        color: string | null;
    };
}

export default function UserSearchItem({ user }: UserSearchItemProps) {
    const router = useRouter();

    if (!user.username) return null;

    const handleClick = () => {
        router.push(APP_PATHS.PROFILE(user.username!).href);
    };

    const userColor = user.color || defaultColor;

    return (
        <Button
            variant="ghost"
            onClick={handleClick}
            className="w-full flex items-center gap-3 p-3 h-auto justify-start hover:bg-accent"
        >
            <Avatar
                className="h-12 w-12 border-2"
                style={{ borderColor: userColor }}
            >
                <AvatarImage
                    src={user.image ?? undefined}
                    alt={`${user.username}'s avatar`}
                />
                <AvatarFallback className="text-lg">
                    {user.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col items-start text-left">
                <span className="font-medium text-foreground">
                    {user.username}
                </span>
                {user.name && (
                    <span className="text-sm text-muted-foreground">
                        {user.name}
                    </span>
                )}
            </div>
        </Button>
    );
}
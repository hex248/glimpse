import Image from "next/image";
import Link from "next/link";
import { type Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart } from "lucide-react";
import { ProfileColorText } from "@/components/ui/profile-color-text";
import { APP_PATHS } from "@/lib/APP_PATHS";
import { defaultColor } from "@/lib/utils";

type PhotoWithUser = Prisma.PhotoGetPayload<{
    include: { user: true };
}>;

interface FeedPhotoProps {
    photo: PhotoWithUser;
}

export default function FeedPhoto({ photo }: FeedPhotoProps) {
    const username = photo.user?.username ?? "Unknown User";
    const userImage = photo.user?.image;
    const userColor = photo.user?.color;

    return (
        <Card className="w-full max-w-sm h-min overflow-hidden py-0 gap-0 rounded-b-xl">
            <CardHeader
                className="flex flex-row items-center gap-2 p-0 space-y-0 h-fit"
                style={{ backgroundColor: userColor || defaultColor }}
            >
                <Link
                    href={APP_PATHS.PROFILE(username).href}
                    className="w-full flex flex-row items-center gap-2 px-2 py-2 "
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={userImage ?? undefined}
                            alt={`${username}'s avatar`}
                        />
                        <AvatarFallback>
                            {username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <h1 className="text-md text-white">{username}</h1>
                    </div>
                </Link>
            </CardHeader>
            <CardContent
                className="p-0 transition-all hover:border-4 border-t-0 overflow-hidden rounded-b-xl"
                style={{
                    borderColor: userColor || defaultColor,
                    backgroundColor: userColor || defaultColor,
                }}
            >
                <Link href={APP_PATHS.PHOTO(photo.id).href}>
                    <Image
                        src={photo.imageUrl}
                        alt={photo.caption || `Photo by ${username}`}
                        width={1080}
                        height={1080}
                        className="w-full h-auto object-cover transition-all hover:rounded-t-md"
                        priority
                    />
                </Link>
            </CardContent>
        </Card>
    );
}

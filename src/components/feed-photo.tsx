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
        <Card className="w-full max-w-xs h-min overflow-hidden py-0 gap-0">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 px-2 py-2 h-fit">
                <Link href={APP_PATHS.PROFILE(username)}>
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={userImage ?? undefined}
                            alt={`${username}'s avatar`}
                        />
                        <AvatarFallback>
                            {username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex flex-col">
                    <Link
                        href={APP_PATHS.PROFILE(username)}
                        className="hover:underline"
                    >
                        <ProfileColorText
                            profileColor={userColor}
                            className="text-sm font-semibold leading-none"
                        >
                            {username}
                        </ProfileColorText>
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Link href={APP_PATHS.PHOTO(photo.id)}>
                    <Image
                        src={photo.imageUrl}
                        alt={photo.caption || `Photo by ${username}`}
                        width={1080}
                        height={1080}
                        className="w-full h-auto object-cover border-y"
                        priority
                    />
                </Link>
            </CardContent>
        </Card>
    );
}

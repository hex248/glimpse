import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileColorText } from "@/components/ui/profile-color-text";
import { APP_PATHS } from "@/lib/APP_PATHS";

export default async function PhotoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const photoId = (await params).id;

    const photo = await prisma.photo.findUnique({
        where: {
            id: photoId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    image: true,
                    color: true,
                },
            },
        },
    });

    if (!photo) {
        notFound();
    }

    const username = photo.user?.username ?? "Unknown User";
    const userImage = photo.user?.image;
    const userColor = photo.user?.color;

    return (
        <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-start py-0 gap-4 h-full">
            <div className="w-full md:w-2/3">
                <Image
                    src={photo.imageUrl}
                    alt={photo.caption || `Photo by ${username}`}
                    width={1080}
                    height={1080}
                    className="w-full h-auto object-contain rounded-md border"
                    priority
                />
            </div>

            <div className="w-full md:w-1/3 flex flex-col gap-2">
                <div className="flex items-center gap-3 border-b pb-4">
                    <Link href={APP_PATHS.PROFILE(username).href}>
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={userImage ?? undefined}
                                alt={`${username}'s avatar`}
                            />
                            <AvatarFallback>
                                {username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    <Link
                        href={APP_PATHS.PROFILE(username).href}
                        className="hover:underline"
                    >
                        <ProfileColorText
                            profileColor={userColor}
                            className="text-lg font-semibold"
                        >
                            {username}
                        </ProfileColorText>
                    </Link>
                </div>

                {photo.caption && <p className="text-xl">{photo.caption}</p>}

                <p className="text-sm text-muted-foreground">
                    {new Date(photo.createdAt)
                        .toLocaleTimeString()
                        .substring(0, 5)}
                    <br />
                    {new Date(photo.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}

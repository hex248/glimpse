import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { APP_PATHS } from "@/lib/APP_PATHS";
import { defaultColor } from "@/lib/utils";

interface ProfilePageProps {
    params: {
        username: string;
    };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const username = params.username;

    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
        include: {
            photos: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!user) {
        notFound();
    }

    const profileColor = user.color || defaultColor;

    return (
        <div className="container mx-auto max-w-4xl py-8 px-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 border-b pb-6">
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
                <div className="flex flex-col items-center sm:items-start gap-1 flex-grow">
                    <h1 className="text-3xl font-bold">{user.username}</h1>
                    {user.name && (
                        <p className="text-lg text-muted-foreground">
                            {user.name}
                        </p>
                    )}
                    {user.bio && (
                        <p className="text-sm mt-3 text-center sm:text-left">
                            {user.bio}
                        </p>
                    )}
                </div>
            </div>
            {user.photos.length === 0 ? (
                <p className="text-center text-muted-foreground">
                    {user.username} hasn't shared any photos yet.
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 md:gap-4">
                    {user.photos.map((photo) => (
                        <Link
                            key={photo.id}
                            href={APP_PATHS.PHOTO(photo.id)}
                            className="relative group"
                        >
                            <div className="aspect-square overflow-hidden rounded-md">
                                <Image
                                    src={photo.imageUrl}
                                    alt={
                                        photo.caption ||
                                        `Photo by ${user.username}`
                                    }
                                    fill
                                    sizes="(max-width: 640px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

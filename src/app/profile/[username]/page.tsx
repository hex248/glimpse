import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { APP_PATHS } from "@/lib/APP_PATHS";
import { defaultColor } from "@/lib/utils";
import ProfileHeader from "@/components/ProfileHeader";

export default async function ProfilePage({
    params,
}: {
    params: Promise<{
        username: string;
    }>;
}) {
    const username = (await params).username;

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
        <div className="container mx-auto max-w-4xl h-full">
            <ProfileHeader user={user} profileColor={profileColor} />
            {user.photos.length === 0 ? (
                <p className="text-center text-muted-foreground">
                    {user.username} hasn't shared any photos yet.
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 md:gap-4 pb-4">
                    {user.photos.map((photo) => (
                        <Link
                            key={photo.id}
                            href={APP_PATHS.PHOTO(photo.id).href}
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
                                    className="object-cover"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

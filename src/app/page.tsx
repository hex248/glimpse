import { prisma } from "@/lib/db";
import PhotoFeed from "@/components/photo-feed";
import SharePhotoButton from "@/components/share-photo-button";

export default async function Home() {
    const photos = await prisma.photo.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    emailVerified: true,
                    image: true,
                    username: true,
                    color: true,
                    bio: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
        },
    });

    return (
        <div className="flex flex-col items-center gap-8">
            <SharePhotoButton />
            <PhotoFeed initialPhotos={photos} />
        </div>
    );
}

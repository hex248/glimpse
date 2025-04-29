import { prisma } from "@/lib/db";
import PhotoFeed from "@/components/photo-feed";
import SharePhotoButton from "@/components/share-photo-button";

export const dynamic = "force-dynamic";

export default async function Home() {
    const photos = await prisma.photo.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: true,
        },
    });

    return (
        <div className="flex flex-col items-center justify-start h-full gap-4">
            <PhotoFeed initialPhotos={photos} />
            <div className="absolute fixed bottom-6 right-6 w-[60px] h-[60px]">
                <SharePhotoButton />
            </div>
        </div>
    );
}

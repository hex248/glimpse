"use client";

import { type Prisma } from "@prisma/client";
import FeedPhoto from "@/components/feed-photo";

type PhotoWithUser = Prisma.PhotoGetPayload<{
    include: { user: true };
}>;

interface PhotoFeedProps {
    initialPhotos: PhotoWithUser[];
}

export default function PhotoFeed({ initialPhotos }: PhotoFeedProps) {
    return (
        <div className="flex flex-row gap-4">
            {initialPhotos.length === 0 && (
                <p className="text-muted-foreground">
                    No photos yet. Be the first to share!
                </p>
            )}

            {initialPhotos.map((photo) => (
                <FeedPhoto key={photo.id} photo={photo} />
            ))}
        </div>
    );
}

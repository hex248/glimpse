"use client";

import { type Prisma } from "@prisma/client";
import FeedPhoto from "@/components/feed-photo";
import Link from "next/link";
import { APP_PATHS } from "@/lib/APP_PATHS";
import { Search } from "lucide-react";

type PhotoWithUser = Prisma.PhotoGetPayload<{
    include: { user: true };
}>;

export interface PhotoFeedProps {
    initialPhotos: PhotoWithUser[];
}

export default function PhotoFeed({ initialPhotos }: PhotoFeedProps) {
    return (
        <div className="flex flex-row flex-wrap justify-center">
            {initialPhotos.length === 0 && (
                <div className="flex flex-col items-center gap-4 text-lg">
                    <p className="text-muted-foreground text-center">
                        Send your friends a request to see their posts
                    </p>
                    <Link
                        href={APP_PATHS.SEARCH.href}
                        className="text-primary text-xl"
                    >
                        <span className="flex items-center gap-2 no-select">
                            Search users
                            <Search size={20} className="size-8" />
                        </span>
                    </Link>
                </div>
            )}

            {initialPhotos.map((photo) => (
                <FeedPhoto key={photo.id} photo={photo} />
            ))}
        </div>
    );
}

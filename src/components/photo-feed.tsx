"use client";

import { type Prisma } from "@prisma/client";
import FeedPhoto from "@/components/feed-photo";
import Link from "next/link";
import { APP_PATHS } from "@/lib/APP_PATHS";
import { Search } from "lucide-react";
import SearchBar from "./search-bar";

type PhotoWithUser = Prisma.PhotoGetPayload<{
    include: { user: true };
}>;

export interface PhotoFeedProps {
    initialPhotos: PhotoWithUser[];
    profileColor: string;
}

export default function PhotoFeed({
    initialPhotos,
    profileColor,
}: PhotoFeedProps) {
    return (
        <div className="flex flex-row flex-wrap justify-center gap-2">
            {initialPhotos.length === 0 && (
                <div className="flex flex-col items-center gap-32">
                    <SearchBar />
                    <p
                        className="text-muted-foreground text-center text-3xl"
                        style={{ color: profileColor }}
                    >
                        Send a friend request to see someone's photos in your
                        feed!
                    </p>
                </div>
            )}

            {initialPhotos.map((photo) => (
                <FeedPhoto key={photo.id} photo={photo} />
            ))}
        </div>
    );
}

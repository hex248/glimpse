"use client";

import PhotoFeed, { PhotoFeedProps } from "@/components/photo-feed";
import GoogleSignIn from "@/components/GoogleSignIn";
import { useSession } from "next-auth/react";

export default function HomeComponent({ initialPhotos }: PhotoFeedProps) {
    const { data: session, status } = useSession();

    if (status === "unauthenticated") {
        return <GoogleSignIn />;
    } else if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-full">
                Loading...
            </div>
        );
    } else if (status === "authenticated") {
        return (
            <div className="flex flex-col items-center justify-start h-full gap-4">
                <PhotoFeed
                    initialPhotos={initialPhotos}
                    profileColor={session.user?.color || "#000000"}
                />
            </div>
        );
    }
}

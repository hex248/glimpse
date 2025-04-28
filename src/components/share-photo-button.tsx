"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ProfileColorButton } from "@/components/ui/profile-color-button";
import { APP_PATHS } from "@/lib/APP_PATHS";

export default function SharePhotoButton() {
    const router = useRouter();
    const { data: session, status } = useSession(); // Get session client-side

    const color =
        status === "authenticated" ? (session?.user as any)?.color : "#888888"; // Default color

    const goToSharePage = () => {
        router.push(APP_PATHS.SHARE.href);
    };

    if (status !== "authenticated") {
        return null;
    }

    return (
        <ProfileColorButton
            onClick={goToSharePage}
            variant="profileSolid"
            profileColor={color}
        >
            Share Photo
        </ProfileColorButton>
    );
}

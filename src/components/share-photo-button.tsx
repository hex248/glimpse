"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ProfileColorButton } from "@/components/ui/profile-color-button";
import { APP_PATHS } from "@/lib/APP_PATHS";
import { Plus } from "lucide-react";
import { defaultColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getContrastColor } from "@/lib/colorUtils";

export default function SharePhotoButton() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const color =
        status === "authenticated"
            ? (session?.user as any)?.color
            : defaultColor;
    const contrastColor = getContrastColor(color);

    if (status !== "authenticated") {
        return null;
    }

    return (
        <div
            className="w-full h-full rounded-full overflow-hidden flex items-center justify-center cursor-pointer"
            style={{
                backgroundColor: color,
            }}
            role="button"
            aria-label="Share Photo"
            tabIndex={0}
            onClick={() => router.push(APP_PATHS.SHARE.href)}
        >
            <Plus size={35} style={{ color: contrastColor }} />
        </div>
    );
}

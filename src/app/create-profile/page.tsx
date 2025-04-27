"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { profileSchema } from "@/lib/schemas";
import { z } from "zod";
import ProfileForm from "@/components/ui/profile-form";

export default function CreateProfilePage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            const user = session.user as any;

            if (user?.username) {
                router.replace("/");
                return;
            }
        } else if (status === "unauthenticated") {
            router.replace("/api/auth/signin");
        }
    }, [status, session, router]);

    if (status === "loading" || !session?.user) {
        return <div>Loading...</div>;
    }

    if ((session.user as any)?.username) {
        return <div>Redirecting...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="flex flex-col items-center justify-center border rounded-xl p-6 shadow-md bg-popover w-full max-w-md gap-6">
                <h1 className="text-xl">Complete Your Profile</h1>
                <ProfileForm />
            </div>
        </div>
    );
}

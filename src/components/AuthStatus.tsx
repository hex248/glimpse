"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import GoogleSignIn from "./GoogleSignIn";

export default function AuthStatus() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (status === "authenticated") {
        const user = session.user as any;

        return (
            <div className="flex flex-row items-center justify-center gap-4">
                {user?.image && (
                    <Image
                        src={user.image}
                        alt="Profile picture"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                )}
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {user?.username}
                </span>
                <Button onClick={() => signOut()} variant="outline">
                    Sign out
                </Button>
            </div>
        );
    }

    return (
        <div>
            <GoogleSignIn />
        </div>
    );
}

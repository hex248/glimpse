"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Button from "@/components/Button";

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
                <Button onClick={() => signOut()} variant="default">
                    Sign out
                </Button>
            </div>
        );
    }

    return (
        <div>
            <Button onClick={() => signIn("google")} variant="default">
                Sign in with Google
            </Button>
        </div>
    );
}

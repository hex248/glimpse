"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IconLogout2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import GoogleSignIn from "./GoogleSignIn";

export default function Header() {
    const [user, setUser] = useState<any>(null);

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            const user = session.user as any;
            setUser(user);
        }
    }, [status]);

    return (
        <div className="w-full h-[50px] flex items-center justify-between p-2">
            <h1 className="text-3xl font-900">glimpse</h1>
            <div className="flex flex-row items-center justify-center gap-2">
                {status === "loading" && "Loading..."}
                {status == "unauthenticated" && <GoogleSignIn />}
                {status === "authenticated" && (
                    <>
                        <div className="flex flex-row items-center justify-center gap-2">
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
                        </div>
                        <Button
                            onClick={() => signOut()}
                            className="p-2"
                            variant="ghost"
                        >
                            <IconLogout2
                                size={20}
                                className="text-gray-900 dark:text-gray-100"
                            />
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { profileSchema } from "@/lib/schemas";

export default function CreateProfilePage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clientValidationErrors, setClientValidationErrors] = useState<
        Record<string, string | undefined>
    >({});

    useEffect(() => {
        if (status === "authenticated") {
            const user = session.user as any;

            if (user?.username) {
                router.replace("/");
                return;
            }

            if (!name && user?.name) {
                setName(user.name);
            }

            if (!username && user?.email) {
                const emailPrefix = user.email.split("@")[0];
                const sanitizedPrefix = emailPrefix.replace(
                    /[^a-zA-Z0-9_-]/g,
                    ""
                );
                setUsername(sanitizedPrefix.slice(0, 30));
            }
        } else if (status === "unauthenticated") {
            router.replace("/api/auth/signin");
        }
    }, [status, session, router, username, name]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setClientValidationErrors({});

        const validation = profileSchema.safeParse({ username, name, bio });
        if (!validation.success) {
            const errors = validation.error.flatten().fieldErrors;
            setClientValidationErrors({
                username: errors.username?.[0],
                name: errors.name?.[0],
                bio: errors.bio?.[0],
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/user/complete-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(validation.data),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || "Failed to update profile.");
            } else {
                await update();
                router.push("/");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading" || !session?.user) {
        return <div>Loading...</div>;
    }

    if ((session.user as any)?.username) {
        return <div>Redirecting...</div>;
    }

    return (
        <div>
            <h1>Complete Your Profile</h1>
            <p>
                Welcome! Please set up your username, name, and bio for Glimpse.
            </p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength={2}
                        maxLength={30}
                        pattern="^[a-zA-Z0-9_-]+$"
                        disabled={isLoading}
                        aria-describedby="username-error"
                    />
                    {clientValidationErrors.username && (
                        <p id="username-error" style={{ color: "red" }}>
                            {clientValidationErrors.username}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="name">Display Name:</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={50}
                        disabled={isLoading}
                        aria-describedby="name-error"
                    />
                    {clientValidationErrors.name && (
                        <p id="name-error" style={{ color: "red" }}>
                            {clientValidationErrors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="bio">Bio (Optional):</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        maxLength={160}
                        disabled={isLoading}
                        rows={3}
                        aria-describedby="bio-error"
                    />
                    {clientValidationErrors.bio && (
                        <p id="bio-error" style={{ color: "red" }}>
                            {clientValidationErrors.bio}
                        </p>
                    )}
                </div>

                {error && <p style={{ color: "red" }}>Error: {error}</p>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
}

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { ProfileColorButton } from "./ui/profile-color-button";
import { Input } from "./ui/input";

export default function CommentForm({ photoId }: { photoId: string }) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const { data: session } = useSession();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    photoId,
                    content,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit comment");
            }

            setContent("");
            router.refresh();
        } catch (error) {
            console.error("Error submitting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-2">
            <Input
                placeholder="Leave a comment..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="resize-none"
                disabled={isSubmitting}
            />
            <ProfileColorButton
                variant="profileSolid"
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className=""
                profileColor={session?.user.color}
            >
                {isSubmitting ? "Posting..." : "Post Comment"}
            </ProfileColorButton>
        </form>
    );
}

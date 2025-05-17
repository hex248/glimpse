import CommentItem from "@/components/comment-item";
import CommentForm from "@/components/comment-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type CommentProps = {
    id: string;
    content: string;
    createdAt: Date;
    user: {
        id: string;
        name?: string | null;
        username?: string | null;
        image?: string | null;
        color?: string | null;
    };
};

type CommentsProps = {
    photoId: string;
    comments: CommentProps[];
};

export default async function CommentsSection({
    photoId,
    comments,
}: CommentsProps) {
    return (
        <div className="border rounded-md">
            {comments.length > 0 ? (
                <div className="">
                    {comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))}
                </div>
            ) : (
                <div className="p-2 text-muted-foreground text-center">
                    No comments yet
                </div>
            )}

            <div className="border-t">
                <CommentForm photoId={photoId} />
            </div>
        </div>
    );
}

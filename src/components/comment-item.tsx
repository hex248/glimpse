import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileColorText } from "@/components/ui/profile-color-text";
import Link from "next/link";
import { APP_PATHS } from "@/lib/APP_PATHS";
import PhotoDate from "@/components/photo-date";

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

export default function CommentItem({ comment }: { comment: CommentProps }) {
    const username = comment.user?.username ?? "Unknown User";
    const userImage = comment.user?.image;
    const userColor = comment.user?.color;
    const displayName = comment.user?.name ?? username;

    return (
        <div className="flex gap-3 p-2 border-b last:border-b-0">
            <Link href={APP_PATHS.PROFILE(username).href}>
                <Avatar className="h-8 w-8">
                    <AvatarImage
                        src={userImage ?? undefined}
                        alt={`${username}'s avatar`}
                    />
                    <AvatarFallback>
                        {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </Link>

            <div className="flex flex-col items-start justify-start">
                <div className="flex items-center justify-between gap-2">
                    <Link href={APP_PATHS.PROFILE(username).href}>
                        <ProfileColorText
                            profileColor={userColor}
                            className="font-medium "
                        >
                            {displayName}
                        </ProfileColorText>
                    </Link>
                    <PhotoDate
                        date={comment.createdAt.toUTCString()}
                        inline
                        className="text-xs"
                    />
                </div>
                <p className="text-sm">{comment.content}</p>
            </div>
        </div>
    );
}

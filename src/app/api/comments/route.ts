import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
    sendPushNotificationToUser,
    createNotificationPayload,
} from "@/lib/pushNotifications";

const commentSchema = z.object({
    photoId: z.string().min(1),
    content: z.string().min(1),
});

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
        );
    }

    let body;
    try {
        body = await request.json();
        commentSchema.parse(body);
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid request data" },
            { status: 400 }
        );
    }

    const { photoId, content } = body;

    try {
        const photo = await prisma.photo.findUnique({
            where: { id: photoId },
        });

        if (!photo) {
            return NextResponse.json(
                { error: "Photo not found" },
                { status: 404 }
            );
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                photoId,
                userId: session.user.id,
            },
            include: {
                user: true,
            },
        });

        // create notification for photo owner if not the commenter
        if (photo.userId !== session.user.id) {
            const commenter = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { username: true, name: true },
            });
            const commenterName =
                commenter?.username || commenter?.name || "Someone";

            await prisma.notification.create({
                data: {
                    userId: photo.userId,
                    type: "comment",
                    message: `${commenterName} commented on your photo`,
                    photoId: photo.id,
                },
            });

            try {
                const payload = createNotificationPayload(
                    "comment",
                    `${commenterName} commented on your photo`,
                    `${content.slice(0, 50)}${
                        content.length > 50 ? "..." : ""
                    }`,
                    { url: `/photo/${photo.id}`, photoId: photo.id }
                );
                await sendPushNotificationToUser(photo.userId, payload);
            } catch (pushError) {
                console.error("failed to send push notification:", pushError);
            }
        }

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error("Failed to create comment:", error);
        return NextResponse.json(
            { error: "Failed to create comment" },
            { status: 500 }
        );
    }
}

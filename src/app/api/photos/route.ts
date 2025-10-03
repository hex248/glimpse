import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { PhotoCreateAPISchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { APP_PATHS } from "@/lib/APP_PATHS";
import {
    sendPushNotificationToUsers,
    createNotificationPayload,
} from "@/lib/pushNotifications";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    let body;
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
        );
    }

    const validationResult = PhotoCreateAPISchema.safeParse(body);
    if (!validationResult.success) {
        return NextResponse.json(
            {
                error: "Invalid input",
                details: validationResult.error.flatten().fieldErrors,
            },
            { status: 400 }
        );
    }

    const { imageUrl, caption } = validationResult.data;

    try {
        const newPhoto = await prisma.photo.create({
            data: {
                imageUrl: imageUrl,
                caption: caption,
                userId: userId,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        username: true,
                    },
                },
            },
        });

        // get friends of the poster
        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [{ user1Id: userId }, { user2Id: userId }],
            },
            select: {
                user1Id: true,
                user2Id: true,
            },
        });

        const friendIds = new Set([
            ...friendships.map((f) => f.user1Id),
            ...friendships.map((f) => f.user2Id),
        ]);
        friendIds.delete(userId); // exclude the poster

        const friends = await prisma.user.findMany({
            where: {
                id: { in: Array.from(friendIds) },
            },
            select: { id: true },
        });

        const showCaption = false;
        const notificationMessage = `${
            newPhoto.user.username || newPhoto.user.name || "Someone"
        } posted a new photo${showCaption && caption ? `: "${caption}"` : ""}`;

        // create notification records for friends
        const notificationPromises = friends.map((friend) =>
            prisma.notification.create({
                data: {
                    userId: friend.id,
                    type: "photo_post",
                    message: notificationMessage,
                    photoId: newPhoto.id,
                },
            })
        );

        await Promise.all(notificationPromises);

        // send push notifications to friends
        try {
            const notificationPayload = createNotificationPayload(
                "photo_post",
                "New Photo Posted",
                notificationMessage,
                {
                    url: `/photo/${newPhoto.id}`,
                    photoId: newPhoto.id,
                }
            );

            await sendPushNotificationToUsers(notificationPayload, friendIds);
        } catch (pushError) {
            console.error("failed to send push notifications:", pushError);
        }

        revalidatePath(APP_PATHS.HOME.href);

        return NextResponse.json(newPhoto, { status: 201 });
    } catch (error) {
        console.error("Failed to create photo:", error);
        return NextResponse.json(
            { error: "Failed to save photo to database." },
            { status: 500 }
        );
    }
}

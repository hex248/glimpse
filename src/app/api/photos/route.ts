import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { PhotoCreateAPISchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { APP_PATHS } from "@/lib/APP_PATHS";
import {
    sendPushNotificationToAllUsers,
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

        // create notifications for all users except the poster
        const users = await prisma.user.findMany({
            where: {
                id: { not: userId },
            },
            select: { id: true },
        });

        const notificationMessage = `${
            newPhoto.user.name || newPhoto.user.username
        } posted a new photo${caption ? `: "${caption}"` : ""}`;

        // create notification records
        const notificationPromises = users.map((user) =>
            prisma.notification.create({
                data: {
                    userId: user.id,
                    type: "photo_post",
                    message: notificationMessage,
                    photoId: newPhoto.id,
                },
            })
        );

        await Promise.all(notificationPromises);

        // send to all subscribed
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

            await sendPushNotificationToAllUsers(notificationPayload, userId);
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

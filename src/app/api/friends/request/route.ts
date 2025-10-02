import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { SendFriendRequestSchema } from "@/lib/schemas";
import {
    sendPushNotificationToUser,
    createNotificationPayload,
} from "@/lib/pushNotifications";

// send friend request
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

    const validationResult = SendFriendRequestSchema.safeParse(body);
    if (!validationResult.success) {
        return NextResponse.json(
            {
                error: "Invalid input",
                details: validationResult.error.flatten().fieldErrors,
            },
            { status: 400 }
        );
    }

    const { requestedId } = validationResult.data;

    if (userId === requestedId) {
        return NextResponse.json(
            { error: "You can't send a friend request to yourself!" },
            { status: 400 }
        );
    }

    try {
        const requestedUser = await prisma.user.findUnique({
            where: { id: requestedId },
        });
        if (!requestedUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const existingFriendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { user1Id: userId, user2Id: requestedId },
                    { user1Id: requestedId, user2Id: userId },
                ],
            },
        });
        if (existingFriendship) {
            return NextResponse.json(
                { error: "You're already friends!" },
                { status: 400 }
            );
        }

        // already sent request?
        const existingRequest = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    { requesterId: userId, requestedId: requestedId },
                    { requesterId: requestedId, requestedId: userId },
                ],
            },
        });
        if (existingRequest) {
            return NextResponse.json(
                { error: "You've already sent a friend request to this user!" },
                { status: 400 }
            );
        }

        const friendRequest = await prisma.friendRequest.create({
            data: {
                requesterId: userId,
                requestedId: requestedId,
            },
        });

        // notification
        const requester = await prisma.user.findUnique({
            where: { id: userId },
            select: { username: true, name: true },
        });
        const requesterName =
            requester?.username || requester?.name || "Someone";

        await prisma.notification.create({
            data: {
                userId: requestedId,
                type: "friend request",
                message: `You have a friend request from ${requesterName}`,
            },
        });

        // send push notification
        try {
            const payload = createNotificationPayload(
                "friend_request",
                "New Friend Request",
                `You have a friend request from ${requesterName}`,
                { url: `/profile/${requester?.username}` }
            );
            await sendPushNotificationToUser(requestedId, payload);
        } catch (pushError) {
            console.error("failed to send push notification:", pushError);
        }

        return NextResponse.json(friendRequest, { status: 201 });
    } catch (error) {
        console.error("Failed to send friend request:", error);
        return NextResponse.json(
            { error: "Failed to send friend request" },
            { status: 500 }
        );
    }
}

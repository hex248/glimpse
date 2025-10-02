import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { RespondFriendRequestSchema } from "@/lib/schemas";

// accept/decline friend request
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const requestId = (await params).id;

    let body;
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
        );
    }

    const validationResult = RespondFriendRequestSchema.safeParse(body);
    if (!validationResult.success) {
        return NextResponse.json(
            {
                error: "Invalid input",
                details: validationResult.error.flatten().fieldErrors,
            },
            { status: 400 }
        );
    }

    const { action } = validationResult.data;

    try {
        const friendRequest = await prisma.friendRequest.findUnique({
            where: { id: requestId },
            include: { requester: { select: { username: true, name: true } } },
        });
        if (!friendRequest) {
            return NextResponse.json(
                { error: "Friend request not found" },
                { status: 404 }
            );
        }

        // ensure that current user is the requested one
        if (friendRequest.requestedId !== userId) {
            return NextResponse.json(
                { error: "Not authorized to respond to this request" },
                { status: 403 }
            );
        }

        if (action === "accept") {
            // create friendship
            const { requesterId, requestedId } = friendRequest;
            // ensure user1 < user2 for unique constraint
            const user1Id =
                requesterId < requestedId ? requesterId : requestedId;
            const user2Id =
                requesterId < requestedId ? requestedId : requesterId;

            await prisma.friendship.create({
                data: {
                    user1Id,
                    user2Id,
                },
            });

            // create notification for requester
            const requestedUser = await prisma.user.findUnique({
                where: { id: userId },
                select: { username: true, name: true },
            });
            const requestedName =
                requestedUser?.username || requestedUser?.name || "Someone";

            await prisma.notification.create({
                data: {
                    userId: requesterId,
                    type: "friend request",
                    message: `${requestedName} accepted your friend request`,
                },
            });
        }

        await prisma.friendRequest.delete({
            where: { id: requestId },
        });

        return NextResponse.json(
            { message: `Friend request ${action}ed` },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to respond to friend request:", error);
        return NextResponse.json(
            { error: "Failed to respond to friend request" },
            { status: 500 }
        );
    }
}

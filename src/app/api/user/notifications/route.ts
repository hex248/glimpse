import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
    postNotifications: z.boolean(),
    commentNotifications: z.boolean(),
    friendRequestNotifications: z.boolean(),
});

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                postNotifications: true,
                commentNotifications: true,
                friendRequestNotifications: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch notification preferences:", error);
        return NextResponse.json(
            { error: "Failed to fetch notification preferences" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
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

    const validationResult = updateSchema.safeParse(body);
    if (!validationResult.success) {
        return NextResponse.json(
            {
                error: "Invalid input",
                details: validationResult.error.flatten().fieldErrors,
            },
            { status: 400 }
        );
    }

    const {
        postNotifications,
        commentNotifications,
        friendRequestNotifications,
    } = validationResult.data;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                postNotifications,
                commentNotifications,
                friendRequestNotifications,
            },
            select: {
                postNotifications: true,
                commentNotifications: true,
                friendRequestNotifications: true,
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Failed to update notification preferences:", error);
        return NextResponse.json(
            { error: "Failed to update notification preferences" },
            { status: 500 }
        );
    }
}

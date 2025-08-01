import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { profileUpdateSchema } from "@/lib/schemas";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true },
    });

    if (!currentUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let body;
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
        );
    }

    const validationResult = profileUpdateSchema.safeParse(body);

    if (!validationResult.success) {
        return NextResponse.json(
            {
                error: "Invalid input",
                details: validationResult.error.flatten().fieldErrors,
            },
            { status: 400 }
        );
    }

    const { username, name, bio, color } = validationResult.data;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                username: username,
                name: name,
                bio: bio,
                color: color,
            },
        });

        console.log({
            username: username,
            name: name,
            bio: bio,
            color: color,
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (
            error?.code === "P2002" &&
            error.meta?.target?.includes("username")
        ) {
            return NextResponse.json(
                { error: "Username is already taken. Please choose another." },
                { status: 409 }
            );
        }
        console.error("Failed to complete profile:", error);
        return NextResponse.json(
            { error: "Failed to update profile due to a server error." },
            { status: 500 }
        );
    }
}

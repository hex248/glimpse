import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

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

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error("Failed to create comment:", error);
        return NextResponse.json(
            { error: "Failed to create comment" },
            { status: 500 }
        );
    }
}

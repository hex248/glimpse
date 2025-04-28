import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { PhotoCreateAPISchema } from "@/lib/schemas";

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
        });

        return NextResponse.json(newPhoto, { status: 201 });
    } catch (error) {
        console.error("Failed to create photo:", error);
        return NextResponse.json(
            { error: "Failed to save photo to database." },
            { status: 500 }
        );
    }
}

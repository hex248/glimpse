import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UserSearchSchema } from "@/lib/schemas";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json(
            { error: "Search query parameter 'q' is required" },
            { status: 400 }
        );
    }

    const validationResult = UserSearchSchema.safeParse({ q: query });

    if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        return NextResponse.json(
            {
                error: "Invalid search query",
                details: errors,
            },
            { status: 400 }
        );
    }

    const searchTerm = validationResult.data.q;

    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        username: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                    {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                ],
                username: {
                    not: null, // Only return users with usernames
                },
            },
            select: {
                id: true,
                username: true,
                name: true,
                image: true,
                color: true,
            },
            take: 20, // Limit results to 20 users
            orderBy: [
                {
                    username: "asc",
                },
            ],
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Failed to search users:", error);
        return NextResponse.json(
            { error: "Failed to search users" },
            { status: 500 }
        );
    }
}
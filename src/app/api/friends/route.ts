import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

// gets list of all friends
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    try {
        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [{ user1Id: userId }, { user2Id: userId }],
            },
            include: {
                user1: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        color: true,
                        image: true,
                    },
                },
                user2: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        color: true,
                        image: true,
                    },
                },
            },
        });

        // get each "other" user in the friendship
        const friends = friendships.map((friendship) => {
            if (friendship.user1Id === userId) {
                return friendship.user2;
            } else {
                return friendship.user1;
            }
        });

        return NextResponse.json(friends, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch friends:", error);
        return NextResponse.json(
            { error: "Failed to fetch friends" },
            { status: 500 }
        );
    }
}

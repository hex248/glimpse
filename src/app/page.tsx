import HomeComponent from "@/components/home";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

export default async function Home() {
    const session = await getServerSession(authOptions);

    let photos = await prisma.photo.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: true,
        },
    });

    if (session?.user?.id) {
        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [
                    { user1Id: session.user.id },
                    { user2Id: session.user.id },
                ],
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
        friendIds.delete(session.user.id); // exclude self

        photos = photos.filter((photo) => friendIds.has(photo.userId));
    } else {
        photos = [];
    }

    return (
        <HomeComponent
            initialPhotos={photos}
            profileColor={session?.user?.color || "#000000"}
        />
    );
}

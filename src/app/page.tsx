import HomeComponent from "@/components/home";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
    const photos = await prisma.photo.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: true,
        },
    });

    return <HomeComponent initialPhotos={photos} />;
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { z } from "zod";

const PushSubscriptionSchema = z.object({
    endpoint: z.string().url(),
    keys: z.object({
        p256dh: z.string(),
        auth: z.string(),
    }),
});

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    let body;
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json(
            { error: "invalid JSON body" },
            { status: 400 }
        );
    }

    const validationResult = PushSubscriptionSchema.safeParse(body);
    if (!validationResult.success) {
        return NextResponse.json(
            {
                error: "invalid input",
                details: validationResult.error.flatten().fieldErrors,
            },
            { status: 400 }
        );
    }

    const { endpoint, keys } = validationResult.data;

    try {
        const subscription = await prisma.pushSubscription.upsert({
            where: {
                endpoint: endpoint,
            },
            update: {
                p256dh: keys.p256dh,
                auth: keys.auth,
            },
            create: {
                userId: userId,
                endpoint: endpoint,
                p256dh: keys.p256dh,
                auth: keys.auth,
            },
        });

        return NextResponse.json(subscription, { status: 201 });
    } catch (error) {
        console.error("failed to save push subscription:", error);
        return NextResponse.json(
            { error: "failed to save push subscription" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const url = new URL(request.url);
    const endpoint = url.searchParams.get("endpoint");

    if (!endpoint) {
        return NextResponse.json(
            { error: "Endpoint parameter required" },
            { status: 400 }
        );
    }

    try {
        const result = await prisma.pushSubscription.deleteMany({
            where: {
                userId: userId,
                endpoint: endpoint,
            },
        });

        if (result.count === 0) {
            return NextResponse.json(
                { error: "subscription not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "subscription removed" },
            { status: 200 }
        );
    } catch (error) {
        console.error("failed to remove push subscription:", error);
        return NextResponse.json(
            { error: "failed to remove push subscription" },
            { status: 500 }
        );
    }
}

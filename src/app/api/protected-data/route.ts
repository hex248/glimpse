import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any)?.id;
    if (!userId) {
        return NextResponse.json(
            { error: "User ID not found in session" },
            { status: 500 }
        );
    }

    return NextResponse.json({
        message: "You have access to protected data!",
        user: session.user,
    });
}

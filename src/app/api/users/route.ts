import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UserCreateSchema } from "@/lib/schemas";

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    let body;
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
        );
    }

    console.log(body);

    const validationResult = UserCreateSchema.safeParse(body);

    if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        console.error("Validation failed:", errors);
        return NextResponse.json(
            {
                error: "Invalid input",
                details: errors,
            },
            { status: 400 }
        );
    }

    const validatedData = validationResult.data;

    try {
        const newUser = await prisma.user.create({
            data: validatedData,
        });
        return NextResponse.json(newUser, { status: 201 });
    } catch (error: any) {
        console.error("Failed to create user:", error);
        if (error?.code === "P2002") {
            const target = error.meta?.target?.[0] || "field";
            return NextResponse.json(
                { error: `User with this ${target} already exists` },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create user due to a server error" },
            { status: 500 }
        );
    }
}

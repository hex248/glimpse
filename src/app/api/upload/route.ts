import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import sharp from "sharp";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const originalFilename = searchParams.get("filename");

    if (!originalFilename) {
        return NextResponse.json(
            { error: "Missing 'filename' query parameter." },
            { status: 400 }
        );
    }

    if (!request.body) {
        return NextResponse.json(
            { error: "No file blob found in request." },
            { status: 400 }
        );
    }

    const uniquePrefix = nanoid();

    const optimizedFilename = `${uniquePrefix}-${
        originalFilename.split(".").slice(0, -1).join(".") || originalFilename
    }.webp`;

    try {
        const imageBuffer = Buffer.from(await request.arrayBuffer());

        const optimizedImageBuffer = await sharp(imageBuffer)
            .resize({
                width: 1080,
                height: 1080,
                fit: "cover",
                withoutEnlargement: true,
            })
            .webp({ quality: 80 })
            .toBuffer();

        const blob = await put(optimizedFilename, optimizedImageBuffer, {
            access: "public",
            contentType: "image/webp",
            cacheControlMaxAge: 60 * 60 * 24 * 30, // Cache for 30 days
        });

        return NextResponse.json(blob);
    } catch (error: any) {
        console.error("Error processing or uploading image:", error);
        const errorMessage = error.message.includes(
            "Input buffer contains unsupported image format"
        )
            ? "Unsupported image format."
            : "Failed to process or upload file.";
        return NextResponse.json(
            { error: errorMessage, details: error.message },
            { status: 500 }
        );
    }
}

"use client";

import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    type Crop,
    type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { getCroppedImageBlob } from "@/lib/cropUtils";
import { APP_PATHS } from "@/lib/APP_PATHS";
import { ProfileColorButton } from "@/components/ui/profile-color-button";

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
): Crop {
    return centerCrop(
        makeAspectCrop(
            {
                unit: "%",
                width: 100,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

export default function SharePage() {
    const router = useRouter();

    const { data: session } = useSession();

    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [caption, setCaption] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);

    const aspect = 1;
    const outputWidth = 1080;
    const outputHeight = 1080;

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setCrop(undefined);
        setCompletedCrop(undefined);
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            setOriginalFile(selectedFile);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImgSrc(reader.result?.toString() || null);
            });
            reader.readAsDataURL(selectedFile);
        } else {
            setImgSrc(null);
            setOriginalFile(null);
        }
        if (event.target) {
            event.target.value = "";
        }
    };

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        imgRef.current = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspect));
    }

    const handleShare = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!completedCrop || !imgRef.current || !originalFile) {
            setError(
                "Please select an image and ensure the crop area is defined."
            );
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const croppedBlob = await getCroppedImageBlob(
                imgRef.current,
                completedCrop,
                originalFile.name,
                outputWidth,
                outputHeight
            );

            if (!croppedBlob) {
                throw new Error("Could not crop image.");
            }

            const croppedFilename = `${
                originalFile.name.split(".").slice(0, -1).join(".") ||
                originalFile.name
            }-cropped.jpg`;

            const uploadResponse = await fetch(
                `/api/upload?filename=${encodeURIComponent(croppedFilename)}`,
                {
                    method: "POST",
                    body: croppedBlob,
                }
            );

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                throw new Error(errorData.error || "File upload failed.");
            }

            const newBlobData = await uploadResponse.json();
            const imageUrl = newBlobData.url;

            if (!imageUrl) {
                throw new Error("Failed to get image URL after upload.");
            }

            const createPhotoResponse = await fetch("/api/photos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageUrl: imageUrl,
                    caption: caption || null,
                }),
            });

            if (!createPhotoResponse.ok) {
                const errorData = await createPhotoResponse.json();
                throw new Error(
                    errorData.error || "Failed to save photo details."
                );
            }

            router.push(
                APP_PATHS.PHOTO((await createPhotoResponse.json()).id).href
            );
        } catch (err: any) {
            console.error("Sharing failed:", err);
            setError(
                err.message || "An unexpected error occurred during sharing."
            );
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <form
                onSubmit={handleShare}
                className="w-full max-w-md p-8 border rounded-lg bg-card text-card-foreground flex flex-col gap-6"
            >
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="picture">Select Picture</Label>
                    <Input
                        id="picture"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isProcessing}
                    />
                </div>

                {!!imgSrc && (
                    <div className="flex flex-col items-center gap-4">
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imgSrc}
                                onLoad={onImageLoad}
                                style={{ maxHeight: "70vh" }}
                            />
                        </ReactCrop>
                        <p className="text-sm text-muted-foreground">
                            Adjust the crop area.
                        </p>
                    </div>
                )}

                {!!imgSrc && (
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="caption">Caption (Optional)</Label>
                        <Input
                            placeholder="Add a caption..."
                            id="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            disabled={isProcessing}
                            maxLength={2200}
                        />
                    </div>
                )}

                {error && <p className="text-sm text-destructive">{error}</p>}

                <ProfileColorButton
                    variant="profileSolid"
                    type="submit"
                    disabled={isProcessing || !completedCrop}
                    className=""
                    profileColor={session?.user.color}
                >
                    {isProcessing ? "Sharing..." : "Share"}
                </ProfileColorButton>
            </form>
        </div>
    );
}

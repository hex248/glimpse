import { PixelCrop } from "react-image-crop";

const TO_RADIANS = Math.PI / 180;

/**
 * Creates a cropped image blob from an image element and crop data.
 * @param image Image element
 * @param crop PixelCrop data
 * @param fileName Output filename
 * @param targetWidth Desired output width (e.g., 1080)
 * @param targetHeight Desired output height (e.g., 1080)
 * @returns Promise resolving to the cropped image Blob or null
 */
export async function getCroppedImageBlob(
    image: HTMLImageElement,
    crop: PixelCrop,
    fileName: string,
    targetWidth: number = 1080,
    targetHeight: number = 1080
): Promise<Blob | null> {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("No 2d context");
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = targetWidth * pixelRatio;
    canvas.height = targetHeight * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    const scaleWidthFactor = targetWidth / crop.width;
    const scaleHeightFactor = targetHeight / crop.height;

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        targetWidth,
        targetHeight
    );

    // Asynchronously convert canvas to blob
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    console.error("Canvas is empty");
                    reject(new Error("Canvas is empty"));
                    return;
                }
                resolve(blob);
            },
            "image/jpeg",
            0.9
        );
    });
}

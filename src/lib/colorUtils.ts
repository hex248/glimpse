/**
 * Converts a hex color string to an RGB object.
 * Handles optional '#' prefix and 3-digit shorthand.
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    let sanitizedHex = hex.startsWith("#") ? hex.slice(1) : hex;

    if (sanitizedHex.length === 3) {
        sanitizedHex = sanitizedHex
            .split("")
            .map((char) => char + char)
            .join("");
    }

    if (sanitizedHex.length !== 6) {
        console.warn("Invalid hex color format:", hex);
        return null;
    }

    const bigint = parseInt(sanitizedHex, 16);
    if (isNaN(bigint)) {
        console.warn("Could not parse hex color:", hex);
        return null;
    }

    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

/**
 * Calculates a contrasting text color (black or white) for a given hex background color.
 * Uses a simple luminance calculation.
 *
 * @param hexColor - The background color in hex format (e.g., "#RRGGBB" or "#RGB").
 * @returns "#000000" (black) or "#FFFFFF" (white).
 */
export function getContrastColor(hexColor: string): string {
    const rgb = hexToRgb(hexColor);

    if (!rgb) {
        return "#000000";
    }

    const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;

    const threshold = 200;

    return luminance > threshold ? "#000000" : "#FFFFFF";
}

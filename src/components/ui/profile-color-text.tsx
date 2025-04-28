"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { getContrastColor } from "@/lib/colorUtils";

export interface ProfileColorTextProps
    extends React.HTMLAttributes<HTMLSpanElement> {
    profileColor?: string | null;
    children: React.ReactNode;
}

const ProfileColorText = React.forwardRef<
    HTMLSpanElement,
    ProfileColorTextProps
>(({ className, profileColor, children, style, ...props }, ref) => {
    const color = profileColor || "#000000";

    const contrastCheck = getContrastColor(color);

    const textColor = contrastCheck === "#000000" ? "#000000" : color;

    const dynamicStyles: React.CSSProperties = {
        color: textColor,
        ...style,
    };

    return (
        <span
            ref={ref}
            className={cn(className)}
            style={dynamicStyles}
            {...props}
        >
            {children}
        </span>
    );
});
ProfileColorText.displayName = "ProfileColorText";

export { ProfileColorText };

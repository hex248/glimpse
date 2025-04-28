import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getContrastColor } from "@/lib/colorUtils";

export interface ProfileColorButtonProps extends ButtonProps {
    profileColor?: string | null;
}

const ProfileColorButton = React.forwardRef<
    HTMLButtonElement,
    ProfileColorButtonProps
>(({ className, profileColor, children, style, variant, ...props }, ref) => {
    const color = profileColor || "#888888";
    const contrastColor = getContrastColor(color);
    let dynamicStyles: React.CSSProperties = { ...style };

    if (variant === "profileOutline") {
        if (contrastColor === "#000000") {
            dynamicStyles = {
                ...dynamicStyles,
                borderColor: contrastColor,
                color: contrastColor,
            };
        } else {
            dynamicStyles = {
                ...dynamicStyles,
                borderColor: color,
                color: color,
            };
        }
    } else if (variant === "profileSolid") {
        let textColor = contrastColor;
        let borderColor = color;
        if (contrastColor === "#000000") {
            textColor = "#000000";
            borderColor = "#000000";
        }
        dynamicStyles = {
            ...dynamicStyles,
            backgroundColor: color,
            color: textColor,
            borderColor: borderColor,
        };
    }

    return (
        <Button
            ref={ref}
            variant={variant}
            style={dynamicStyles}
            className={cn(className)}
            {...props}
        >
            {children}
        </Button>
    );
});
ProfileColorButton.displayName = "ProfileColorButton";

export { ProfileColorButton };

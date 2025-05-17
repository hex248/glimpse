"use client";

import { cn } from "@/lib/utils";

export default function PhotoDate({
    date,
    showSeconds = false,
    inline = false,
    className,
}: {
    date: string;
    showSeconds?: boolean;
    inline?: boolean;
    className?: string;
}) {
    const dateObj = new Date(date);
    return (
        <p
            className={cn(
                "text-sm text-muted-foreground flex items-center gap-1",
                className
            )}
        >
            <span>
                {showSeconds
                    ? dateObj.toLocaleTimeString()
                    : dateObj
                          .toLocaleTimeString()
                          .split(":")
                          .slice(0, 2)
                          .join(":")}{" "}
            </span>
            {inline && <span className="text-xs">|</span>}
            <span>{dateObj.toLocaleDateString()}</span>
        </p>
    );
}

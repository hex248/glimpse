"use client";

export default function PhotoDate({ date }: { date: string }) {
    const dateObj = new Date(date);
    return (
        <p className="text-sm text-muted-foreground">
            {dateObj.toLocaleTimeString()}
            <br />
            {dateObj.toLocaleDateString()}
        </p>
    );
}

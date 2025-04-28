"use client";

import ProfileForm from "@/components/ui/profile-form";
import { useState } from "react";

export default function ProfilePage() {
    const [editing, setEditing] = useState(false);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="flex flex-col items-center justify-center border rounded-xl p-6 shadow-md bg-popover w-[95%] max-w-lg gap-6">
                <h1 className="text-xl">
                    {editing ? "Edit Profile" : "Settings"}
                </h1>

                <ProfileForm setEditing={setEditing} />
            </div>
        </div>
    );
}

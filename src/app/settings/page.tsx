"use client";

import ProfileForm from "@/components/ui/profile-form";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const [editing, setEditing] = useState(false);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <motion.div
                layout
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col items-center justify-center border rounded-xl p-6 shadow-md bg-popover w-[95%] max-w-lg gap-6 overflow-hidden"
            >
                <motion.h1 layout="position" className="text-xl">
                    {editing ? "Edit Profile" : "Settings"}
                </motion.h1>

                <ProfileForm setEditing={setEditing} startReadOnly={!editing} />
            </motion.div>
        </div>
    );
}

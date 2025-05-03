"use client";

import ProfileForm from "@/components/ui/profile-form";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ProfilePage() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <motion.div
                layout
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col items-center justify-center border rounded-xl p-6 shadow-md bg-popover w-[95%] max-w-lg gap-6 overflow-hidden"
            >
                <motion.h1 layout="position" className="text-xl">
                    Edit Profile
                </motion.h1>

                <ProfileForm startReadOnly={false} />
            </motion.div>
        </div>
    );
}

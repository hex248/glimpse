"use client";

import ProfileForm from "@/components/ui/profile-form";
import PushNotificationToggle from "@/components/PushNotificationToggle";
import { motion } from "framer-motion";

export default function ProfilePage() {
    return (
        <motion.div
            layout
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full flex flex-col items-center justify-start pb-8"
        >
            <motion.h1 layout="position" className="text-xl">
                Settings
            </motion.h1>

            <div className="w-full space-y-6">
                <div>
                    <h2 className="text-lg font-medium mb-4">Profile</h2>
                    <ProfileForm startReadOnly={false} />
                </div>

                <div className="pt-3">
                    <h2 className="text-lg font-medium mb-4">Notifications</h2>
                    <PushNotificationToggle />
                </div>
            </div>
        </motion.div>
    );
}

"use client";

import ProfileForm from "@/components/ui/profile-form";
import PushNotificationToggle from "@/components/PushNotificationToggle";
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
                    Settings
                </motion.h1>

                <div className="w-full space-y-6">
                    <div>
                        <h2 className="text-lg font-medium mb-4">Profile</h2>
                        <ProfileForm startReadOnly={false} />
                    </div>

                    <div className="border-t pt-6">
                        <h2 className="text-lg font-medium mb-4">Notifications</h2>
                        <PushNotificationToggle />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

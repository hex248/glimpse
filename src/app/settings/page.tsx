"use client";

import ProfileForm from "@/components/ui/profile-form";
import PushNotificationToggle from "@/components/PushNotificationToggle";

export default function ProfilePage() {
    return (
        <div className="w-full flex flex-col items-center justify-start pb-8">
            <h1 className="text-xl">Settings</h1>

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
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    getPushNotificationPermission,
} from "@/lib/pushNotificationsClient";
import { getContrastColor } from "@/lib/colorUtils";

export default function PushNotificationToggle() {
    const { data: session } = useSession();
    const [isEnabled, setIsEnabled] = useState(false);
    const [permission, setPermission] =
        useState<NotificationPermission>("default");
    const [isLoading, setIsLoading] = useState(false);

    const userColor = (session?.user as any)?.color || "#888888";
    const contrastColor = getContrastColor(userColor);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        const currentPermission = await getPushNotificationPermission();
        setPermission(currentPermission);

        const hasSubscribed = localStorage.getItem("pushSubscribed") === "true";
        const granted = currentPermission === "granted";
        setIsEnabled(hasSubscribed && granted);
    };

    const handleToggle = async () => {
        setIsLoading(true);

        try {
            if (isEnabled) {
                const success = await unsubscribeFromPushNotifications();
                if (success) {
                    localStorage.removeItem("pushSubscribed");
                    setIsEnabled(false);
                }
            } else {
                const success = await subscribeToPushNotifications();
                if (success) {
                    localStorage.setItem("pushSubscribed", "true");
                    setIsEnabled(true);
                    setPermission("granted");
                }
            }
        } catch (error) {
            console.error("error toggling push notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                        (only posts for now)
                    </p>
                </div>
                <button
                    onClick={handleToggle}
                    disabled={isLoading || permission === "denied"}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                    } ${
                        permission === "denied"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                    style={{
                        backgroundColor: isEnabled ? userColor : "#e5e7eb",
                        border: isEnabled
                            ? `1px solid ${
                                  contrastColor === "#000000"
                                      ? "#000000"
                                      : userColor
                              }`
                            : "none",
                    }}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                            isEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                        style={{
                            backgroundColor: isEnabled
                                ? contrastColor
                                : "#ffffff",
                        }}
                    />
                </button>
            </div>

            {permission === "denied" && (
                <p className="text-xs text-amber-600">
                    To enable push notifications, go to your browser settings
                    and allow notifications for this site.
                </p>
            )}
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    getPushNotificationPermission,
} from "@/lib/pushNotificationsClient";
import { getContrastColor } from "@/lib/colorUtils";

interface NotificationPreferences {
    postNotifications: boolean;
    commentNotifications: boolean;
    friendRequestNotifications: boolean;
}

export default function PushNotificationToggle() {
    const { data: session } = useSession();
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        postNotifications: true,
        commentNotifications: true,
        friendRequestNotifications: true,
    });
    const [isPushEnabled, setIsPushEnabled] = useState(false);
    const [permission, setPermission] =
        useState<NotificationPermission>("default");
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const userColor = (session?.user as any)?.color || "#888888";
    const contrastColor = getContrastColor(userColor);

    useEffect(() => {
        checkStatus();
        fetchPreferences();
    }, []);

    const checkStatus = async () => {
        const currentPermission = await getPushNotificationPermission();
        setPermission(currentPermission);

        const hasSubscribed = localStorage.getItem("pushSubscribed") === "true";
        const granted = currentPermission === "granted";
        setIsPushEnabled(hasSubscribed && granted);
    };

    const fetchPreferences = async () => {
        try {
            const response = await fetch("/api/user/notifications");
            if (response.ok) {
                const data = await response.json();
                setPreferences(data);
            }
        } catch (error) {
            console.error("Error fetching preferences:", error);
        }
    };

    const updatePreference = async (
        type: keyof NotificationPreferences,
        value: boolean
    ) => {
        setIsUpdating(type);
        try {
            const response = await fetch("/api/user/notifications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...preferences, [type]: value }),
            });
            if (response.ok) {
                setPreferences((prev) => ({ ...prev, [type]: value }));
            }
        } catch (error) {
            console.error("Error updating preference:", error);
        } finally {
            setIsUpdating(null);
        }
    };

    const handlePushToggle = async () => {
        setIsLoading(true);

        try {
            if (isPushEnabled) {
                const success = await unsubscribeFromPushNotifications();
                if (success) {
                    localStorage.removeItem("pushSubscribed");
                    setIsPushEnabled(false);
                }
            } else {
                const success = await subscribeToPushNotifications();
                if (success) {
                    localStorage.setItem("pushSubscribed", "true");
                    setIsPushEnabled(true);
                    setPermission("granted");
                }
            }
        } catch (error) {
            console.error("error toggling push notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderToggle = (
        type: keyof NotificationPreferences,
        title: string,
        description?: string
    ) => (
        <div
            className={`flex items-center justify-between ${
                !isPushEnabled ? "opacity-50" : ""
            }`}
        >
            <div>
                <h3 className="font-medium">{title}</h3>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            <button
                onClick={() => updatePreference(type, !preferences[type])}
                disabled={isUpdating === type || !isPushEnabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isUpdating === type ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{
                    backgroundColor: preferences[type] ? userColor : "#e5e7eb",
                    border: preferences[type]
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
                        preferences[type] ? "translate-x-6" : "translate-x-1"
                    }`}
                    style={{
                        backgroundColor: preferences[type]
                            ? contrastColor
                            : "#ffffff",
                    }}
                />
            </button>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium">Push Notifications</h3>
                </div>
                <button
                    onClick={handlePushToggle}
                    disabled={isLoading || permission === "denied"}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                    } ${
                        permission === "denied"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                    style={{
                        backgroundColor: isPushEnabled ? userColor : "#e5e7eb",
                        border: isPushEnabled
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
                            isPushEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                        style={{
                            backgroundColor: isPushEnabled
                                ? contrastColor
                                : "#ffffff",
                        }}
                    />
                </button>
            </div>

            {renderToggle(
                "postNotifications",
                "Post notifications",
                "A friend posts a photo"
            )}
            {renderToggle(
                "commentNotifications",
                "Comment notifications",
                "A friend comments on your post"
            )}
            {renderToggle(
                "friendRequestNotifications",
                "Friend Request notifications",
                "You receive a friend request"
            )}

            {permission === "denied" && (
                <p className="text-xs text-amber-600">
                    To enable push notifications, go to your browser settings
                    and allow notifications for this site.
                </p>
            )}
        </div>
    );
}

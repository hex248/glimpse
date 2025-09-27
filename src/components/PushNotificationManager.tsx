"use client";

import { useEffect, useState } from "react";
import {
    subscribeToPushNotifications,
    getPushNotificationPermission,
} from "@/lib/pushNotificationsClient";

export default function PushNotificationManager() {
    const [hasPrompted, setHasPrompted] = useState(false);

    useEffect(() => {
        // register push notification sw
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw-push.js")
                .then((registration) => {})
                .catch((error) => {
                    console.error(
                        "push notification service worker registration failed:",
                        error
                    );
                });
        }
    }, []);

    useEffect(() => {
        if (!hasPrompted) {
            handleNotificationPrompt();
            setHasPrompted(true);
        }
    }, [hasPrompted]);

    const handleNotificationPrompt = async () => {
        const hasPromptedBefore = localStorage.getItem(
            "pushNotificationsPrompted"
        );
        if (hasPromptedBefore) return;

        const permission = await getPushNotificationPermission();

        if (permission === "default") {
            // permission not asked yet, request it
            const success = await subscribeToPushNotifications();
            if (success) {
                localStorage.setItem("pushSubscribed", "true");
            }
        } else if (permission === "granted") {
            // permission already granted, auto-subscribe if not already done
            const hasSubscribed = localStorage.getItem("pushSubscribed");
            if (!hasSubscribed) {
                const success = await subscribeToPushNotifications();
                if (success) {
                    localStorage.setItem("pushSubscribed", "true");
                }
            }
        }

        // browser/device has been prompted
        localStorage.setItem("pushNotificationsPrompted", "true");
    };

    return null;
}

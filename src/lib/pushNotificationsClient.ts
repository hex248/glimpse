export async function subscribeToPushNotifications(): Promise<boolean> {
    try {
        // check if push notifications are supported
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            console.warn("push notifications not supported");
            return false;
        }

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            console.log("push notification permission denied");
            return false;
        }

        const registration = await navigator.serviceWorker.ready;

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
            ),
        });

        const response = await fetch("/api/push-subscription", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: arrayBufferToBase64(subscription.getKey("p256dh")!),
                    auth: arrayBufferToBase64(subscription.getKey("auth")!),
                },
            }),
        });

        if (!response.ok) {
            throw new Error("failed to save push subscription");
        }

        console.log("successfully subscribed to push notifications");
        return true;
    } catch (error) {
        console.error("error subscribing to push notifications:", error);
        return false;
    }
}

export async function unsubscribeFromPushNotifications(): Promise<boolean> {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            console.log("no push subscription found");
            return true;
        }

        const unsubscribed = await subscription.unsubscribe();

        if (unsubscribed) {
            // remove subscription on server
            const response = await fetch(
                `/api/push-subscription?endpoint=${encodeURIComponent(
                    subscription.endpoint
                )}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error(
                    "failed to remove push subscription from server"
                );
            }

            console.log("successfully unsubscribed from push notifications");
            return true;
        }

        return false;
    } catch (error) {
        console.error("error unsubscribing from push notifications:", error);
        return false;
    }
}

export async function getPushNotificationPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
        return "denied";
    }
    return Notification.permission;
}

// for VAPID key conversion
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(new ArrayBuffer(rawData.length));

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

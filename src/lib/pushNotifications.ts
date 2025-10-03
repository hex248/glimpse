import webpush from "web-push";
import { prisma } from "./db";

const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    privateKey: process.env.VAPID_PRIVATE_KEY!,
};

webpush.setVapidDetails(
    "mailto:" + process.env.VAPID_EMAIL!,
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

export interface PushNotificationPayload {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: {
        url?: string;
        photoId?: string;
        type?: "photo_post" | "comment" | "friend_request";
    };
}

export async function sendPushNotificationToUser(
    userId: string,
    payload: PushNotificationPayload
) {
    try {
        const subscriptions = await prisma.pushSubscription.findMany({
            where: {
                userId: userId,
            },
        });

        // send push notification to each subscription
        const sendPromises = subscriptions.map(async (subscription: any) => {
            try {
                await webpush.sendNotification(
                    {
                        endpoint: subscription.endpoint,
                        keys: {
                            p256dh: subscription.p256dh,
                            auth: subscription.auth,
                        },
                    },
                    JSON.stringify(payload)
                );
            } catch (error) {
                console.error("failed to send push notification:", error);
                // TODO destroy invalid subscriptions
            }
        });

        await Promise.all(sendPromises);
    } catch (error) {
        console.error("error sending push notifications:", error);
    }
}

export async function sendPushNotificationToUsers(
    payload: PushNotificationPayload,
    userIds: Set<string>
) {
    try {
        const sendPromises = Array.from(userIds).map((userId) =>
            sendPushNotificationToUser(userId, payload)
        );

        await Promise.all(sendPromises);
    } catch (error) {
        console.error("error sending push notifications to friends:", error);
    }
}

export async function sendPushNotificationToAllUsers(
    payload: PushNotificationPayload,
    excludeUserId?: string
) {
    try {
        // all users except user.id == excludeUserId
        const users = await prisma.user.findMany({
            where: excludeUserId ? { id: { not: excludeUserId } } : {},
            select: { id: true },
        });

        const sendPromises = users.map((user) =>
            sendPushNotificationToUser(user.id, payload)
        );

        await Promise.all(sendPromises);
    } catch (error) {
        console.error("error sending push notifications to all users:", error);
    }
}

export function getVapidPublicKey() {
    return vapidKeys.publicKey;
}

export function createNotificationPayload(
    type: "photo_post" | "comment" | "friend_request",
    title: string,
    body: string,
    data: {
        url?: string;
        photoId?: string;
        commentId?: string;
        friendRequestId?: string;
    }
): PushNotificationPayload {
    return {
        title,
        body,
        icon: "/icon-192x192.png",
        data: {
            ...data,
            type,
        },
    };
}

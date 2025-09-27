// custom service worker for push notifications

self.addEventListener("push", function (event) {
    if (!event.data) return;

    try {
        const data = event.data.json();

        const options = {
            body: data.body,
            icon: data.icon,
            badge: data.badge,
            data: data.data || {},
            requireInteraction: true,
            actions: data.data?.actions || [
                {
                    action: "view",
                    title: "View",
                },
                {
                    action: "dismiss",
                    title: "Dismiss",
                },
            ],
        };

        event.waitUntil(
            self.registration.showNotification(
                data.title || "New Notification",
                options
            )
        );
    } catch (error) {
        console.error("error handling push notification:", error);
    }
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    const action = event.action;
    const data = event.notification.data || {};
    const type = data.type;

    if (action === "dismiss") {
        return;
    }

    let urlToOpen = data.url || "/";

    if (
        action === "view_photo" ||
        action === "view_comment" ||
        !action ||
        action === "view"
    ) {
        // default
        urlToOpen = data.url || "/";
    } else if (action === "accept_friend") {
        // TODO will be redirected to a accept friend specific page once implemented
        urlToOpen = data.url || "/";
    } else if (action === "decline_friend") {
        // TODO will be redirected to a decline friend specific page once implemented
        return;
    }

    event.waitUntil(
        clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then(function (clientList) {
                // if there's already a window/tab open with the target URL, focus it
                for (let i = 0; i < clientList.length; i++) {
                    const client = clientList[i];
                    if (client.url === urlToOpen && "focus" in client) {
                        return client.focus();
                    }
                }

                // open a new window/tab with the target URL if none is found
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

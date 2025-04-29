export const APP_PATHS = {
    HOME: { href: "/" },
    LOGIN: { href: "/api/auth/signin" },
    SIGNUP: { href: "/api/auth/signup" },
    CREATE_PROFILE: { href: "/create-profile" },
    SETTINGS: { href: "/settings" },
    SHARE: { href: "/share" },
    PROFILE: (username: string) => {
        return { href: `/profile/${username}` };
    },
    PHOTO: (photoId: string) => {
        return { href: `/photo/${photoId}` };
    },
};

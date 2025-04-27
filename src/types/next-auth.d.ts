import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            color?: string | null;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        username: string;
        color?: string | null;
    }
}

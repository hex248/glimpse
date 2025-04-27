import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: User & DefaultSession["user"];
    }

    interface User {
        id: string;
        username: string;
        color: string | null;
        bio: string | null;
        name: string | null;
    }
}

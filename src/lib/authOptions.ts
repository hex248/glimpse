import { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { type Adapter } from "next-auth/adapters";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    session: {
        strategy: "database",
    },

    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
                session.user.name = user.name;
                session.user.username = user.username;
                session.user.color = user.color;
                session.user.bio = user.bio;
            }
            return session;
        },
    },

    pages: {
        newUser: "/create-profile",
    },

    secret: process.env.NEXTAUTH_SECRET,
};

import { z } from "zod";

export const UserCreateSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email address" }),

    username: z
        .string()
        .min(2, "Username must be 2-30 characters long")
        .max(30, "Username must be 2-30 characters long")
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            "Username can only contain letters, numbers, _, -"
        )
        .optional(),

    name: z.string().max(50, "Name cannot exceed 50 characters").optional(),

    color: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, "Invalid color format (must be #RRGGBB)")
        .optional(),

    avatarUrl: z.string().url({ message: "Invalid URL format" }).optional(),
});

export const UserUpdateSchema = z
    .object({
        username: z
            .string()
            .min(2, "Username must be 2-30 characters long")
            .max(30, "Username must be 2-30 characters long")
            .regex(
                /^[a-zA-Z0-9_-]+$/,
                "Username can only contain letters, numbers, _, -"
            )
            .optional(),
        name: z
            .string()
            .max(50, "Name cannot exceed 50 characters")
            .optional()
            .nullable(),
        bio: z.string().max(160, "Bio cannot exceed 160 characters").optional(),
        color: z
            .string()
            .regex(/^#[0-9A-F]{6}$/i, "Invalid color format (must be #RRGGBB)")
            .optional(),
        avatarUrl: z
            .string()
            .url({ message: "Invalid URL format" })
            .optional()
            .nullable(),
    })
    .partial();

export type UserCreateInput = z.infer<typeof UserCreateSchema>;
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;

export const profileSchema = z.object({
    username: z
        .string()
        .min(2, "Username must be 2-30 characters long")
        .max(30, "Username must be 2-30 characters long")
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            "Username can only contain letters, numbers, _, -"
        ),
    name: z
        .string()
        .min(1, "Name cannot be empty")
        .max(50, "Name cannot exceed 50 characters"),
    bio: z.string().max(160, "Bio cannot exceed 160 characters"),
    color: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, "Invalid color format (must be #RRGGBB)")
        .optional(),
});

export const profileUpdateSchema = z.object({
    username: z
        .string()
        .min(2, "Username must be 2-30 characters long")
        .max(30, "Username must be 2-30 characters long")
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            "Username can only contain letters, numbers, _, -"
        ),
    name: z
        .string()
        .min(1, "Name cannot be empty")
        .max(50, "Name cannot exceed 50 characters"),
    bio: z.string().max(160, "Bio cannot exceed 160 characters").optional(),
    color: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, "Invalid color format (must be #RRGGBB)")
        .optional(),
});

export const PhotoCreateAPISchema = z.object({
    imageUrl: z
        .string({ required_error: "Image URL is required" })
        .url({ message: "Invalid image URL format" }),
    caption: z
        .string()
        .max(2200, "Caption cannot exceed 2200 characters")
        .optional()
        .nullable(),
});

export type PhotoCreateAPIInput = z.infer<typeof PhotoCreateAPISchema>;

export const UserSearchSchema = z.object({
    q: z
        .string({ required_error: "Search query is required" })
        .min(1, "Search query cannot be empty")
        .max(50, "Search query cannot exceed 50 characters")
        .trim(),
});

export type UserSearchInput = z.infer<typeof UserSearchSchema>;

export const SendFriendRequestSchema = z.object({
    requestedId: z.string({ required_error: "Requested user ID is required" }),
});

export type SendFriendRequestInput = z.infer<typeof SendFriendRequestSchema>;

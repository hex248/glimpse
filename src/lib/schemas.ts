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
    bio: z.string().max(160, "Bio cannot exceed 160 characters").optional(),
});

export const profileCompletionSchema = z.object({
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
    bio: z
        .string()
        .max(160, "Bio cannot exceed 160 characters")
        .optional()
        .nullable(),
});

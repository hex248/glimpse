"use client";

import { HexColorInput, HexColorPicker } from "react-colorful";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { profileSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Textarea } from "./textarea";
import { APP_PATHS } from "@/lib/APP_PATHS";
import { ProfileColorButton } from "./profile-color-button";

export default function ProfileForm({
    fields = ["username", "name", "bio", "color"],
    submitButtonText,
    setEditing: setParentEditing,
    redirectHome,
    startReadOnly = true,
}: {
    fields?: ("username" | "name" | "bio" | "color")[];
    submitButtonText?: string;
    setEditing?: (state: boolean) => void;
    redirectHome?: boolean;
    startReadOnly?: boolean;
}) {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const [editing, setEditing] = useState(!startReadOnly);

    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [color, setColor] = useState("#aa6ef1");

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: "",
            name: "",
            bio: "",
            color: "#aa6ef1",
        },
    });

    const handleSaveChanges = async (values: z.infer<typeof profileSchema>) => {
        const validation = profileSchema.safeParse(values);
        if (!validation.success) {
            console.error(validation.error.flatten().fieldErrors);
            return;
        }

        try {
            const response = await fetch("/api/user/update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(validation.data),
            });

            const result = await response.json();

            if (!response.ok) {
                if (
                    result.error &&
                    result.error.includes("Username is already taken")
                ) {
                    form.setError("username", {
                        type: "server",
                        message: result.error,
                    });
                } else {
                    console.error(
                        "Server error:",
                        result.error || "Failed to update profile."
                    );
                }
            } else {
                await update();
                setEditing(false);
                setParentEditing?.(false);
                if (redirectHome) router.push(APP_PATHS.HOME.href);
            }
        } catch (err) {
            console.error(err);
            console.error("An unexpected error occurred.");
        }
    };

    const handleEditToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const newState = !editing;
        setEditing(newState);
        setParentEditing?.(newState);
    };

    useEffect(() => {
        if (status === "authenticated") {
            const user = session.user as any;

            let initialName = user?.name || "";
            let initialUsername = user?.username || "";
            let initialBio = user?.bio || "";
            let initialColor = user?.color || "#aa6ef1";

            if (user?.email && !initialUsername) {
                const emailPrefix = user.email.split("@")[0];
                initialUsername = emailPrefix
                    .replace(/[^a-zA-Z0-9_-]/g, "")
                    .slice(0, 30);
            }

            setName(initialName);
            setUsername(initialUsername);
            setBio(initialBio);
            setColor(initialColor);

            form.reset({
                name: initialName,
                username: initialUsername,
                bio: initialBio,
                color: initialColor,
            });
        } else if (status === "unauthenticated") {
            router.replace("/api/auth/signin");
        }
    }, [status, session, router, form]);

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSaveChanges)}
                    className="flex flex-col gap-4 w-[95%]"
                >
                    {fields.includes("username") && (
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Your unique username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    {editing && (
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                    )}
                                </FormItem>
                            )}
                            disabled={!editing}
                        />
                    )}
                    {fields.includes("name") && (
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Your full name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    {editing && (
                                        <FormDescription>
                                            Your real name.
                                        </FormDescription>
                                    )}
                                </FormItem>
                            )}
                            disabled={!editing}
                        />
                    )}
                    {fields.includes("bio") && (
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us about yourself"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    {editing && (
                                        <FormDescription>
                                            Some additional information about
                                            you.
                                        </FormDescription>
                                    )}
                                </FormItem>
                            )}
                            disabled={!editing}
                        />
                    )}
                    {fields.includes("color") && (
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile Color</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-wrap items-start gap-4">
                                            <AnimatePresence>
                                                {editing && (
                                                    <motion.div
                                                        initial={{
                                                            height: 0,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            height: "auto",
                                                            opacity: 1,
                                                        }}
                                                        exit={{
                                                            height: 0,
                                                            opacity: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                            ease: "easeInOut",
                                                        }}
                                                        className="overflow-hidden w-fit outline-none"
                                                    >
                                                        <HexColorPicker
                                                            color={color}
                                                            onChange={(
                                                                _color
                                                            ) => {
                                                                setColor(
                                                                    _color
                                                                );
                                                                field.onChange(
                                                                    _color
                                                                );
                                                            }}
                                                            className="rounded-none"
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <div
                                                className="flex items-center border-3 rounded-md overflow-hidden"
                                                style={{
                                                    borderColor: color,
                                                }}
                                            >
                                                <span className="border-r px-3 py-2 bg-muted text-muted-foreground">
                                                    #
                                                </span>
                                                <HexColorInput
                                                    className="w-24 px-3 py-2 outline-none bg-transparent"
                                                    color={color}
                                                    onChange={(_color) => {
                                                        setColor(_color);
                                                        field.onChange(_color);
                                                    }}
                                                    disabled={!editing}
                                                />
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <div className="mt-5">
                        {editing ? (
                            <ProfileColorButton
                                variant="profileSolid"
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                profileColor={color}
                            >
                                {form.formState.isSubmitting
                                    ? "Saving..."
                                    : submitButtonText || "Save Changes"}
                            </ProfileColorButton>
                        ) : (
                            <ProfileColorButton
                                variant="profileSolid"
                                onClick={handleEditToggle}
                                profileColor={color}
                            >
                                Edit Profile
                            </ProfileColorButton>
                        )}
                    </div>
                </form>
            </Form>
        </>
    );
}

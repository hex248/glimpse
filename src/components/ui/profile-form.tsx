"use client";

import { HexColorInput, HexColorPicker } from "react-colorful";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
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

export default function ProfileForm({
    fields = ["username", "name", "bio", "color"],
    submitButtonText,
    setEditing,
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

    const [editing, setEditingState] = useState(!startReadOnly);

    const [username, setUsername] = useState(session?.user?.username || "");
    const [usernameType, setUsernameType] = useState<string>();
    const [name, setName] = useState(session?.user?.name || "");
    const [bio, setBio] = useState(session?.user?.bio || "");
    const [color, setColor] = useState(session?.user?.color || "");

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username,
            name,
            bio,
            color,
        },
    });

    const onSubmit = async (values: z.infer<typeof profileSchema>) => {
        const validation = profileSchema.safeParse({
            username: values.username,
            name: values.name,
            bio: values.bio,
            color: values.color,
        });
        if (!validation.success) {
            const errors = validation.error.flatten().fieldErrors;
            console.error(errors);
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
                console.error(result.error || "Failed to update profile.");
            } else {
                await update();
                // Set editing state to false after successful submission
                setEditingState(false);
                setEditing?.(false);
                if (redirectHome) router.push(APP_PATHS.HOME.href);
            }
        } catch (err) {
            console.error(err);
            console.error("An unexpected error occurred.");
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            const user = session.user as any;

            if (!name && user?.name) {
                setName(user.name);
                form.setValue("name", user.name);
            }

            if (!username && user?.username) {
                setUsername(user.username);
                form.setValue("username", user.username);
                setUsernameType("username");
            }

            if (!bio && user?.bio) {
                setBio(user.bio);
                form.setValue("bio", user.bio);
            }

            if (!color && user?.color) {
                setColor(user.color);
                form.setValue("color", user.color);
            }
        } else if (status === "unauthenticated") {
            router.replace("/api/auth/signin");
        }
    }, [status, session, router, username, name]);

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
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
                                            placeholder={username}
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
                                        <Input placeholder={name} {...field} />
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
                                            placeholder={bio}
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
                                        <div className="flex items-start gap-2">
                                            {editing && (
                                                <HexColorPicker
                                                    className="rounded-lg"
                                                    color={color}
                                                    onChange={(_color) => {
                                                        setColor(_color);
                                                        field.onChange(_color);
                                                    }}
                                                />
                                            )}
                                            <div className="">
                                                <div
                                                    className="flex items-center border-3 w-30 rounded-md"
                                                    style={{
                                                        borderColor: color,
                                                    }}
                                                >
                                                    <span className="border-r border-accent p-2">
                                                        #
                                                    </span>
                                                    <HexColorInput
                                                        className="w-25 p-2 outline-none"
                                                        color={color}
                                                        onChange={setColor}
                                                        disabled={!editing}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            disabled={!editing}
                        />
                    )}

                    {editing ? (
                        <Button
                            className="mt-5 w-fit"
                            variant="outline"
                            type="submit"
                        >
                            {submitButtonText || "Save Changes"}
                        </Button>
                    ) : (
                        <Button
                            className="mt-5 w-fit"
                            variant="outline"
                            onClick={(e) => {
                                e.preventDefault();
                                setEditingState(true);
                                setEditing?.(true);
                            }}
                        >
                            Edit Profile
                        </Button>
                    )}
                </form>
            </Form>
        </>
    );
}

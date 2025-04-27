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

export default function ProfileForm({
    onSubmit,
    fields = ["username", "name", "bio", "color"],
    submitButtonText,
}: {
    onSubmit?: (values: z.infer<typeof profileSchema>) => void;
    fields?: ("username" | "name" | "bio" | "color")[];
    submitButtonText?: string;
}) {
    const { data: session, status, update } = useSession();
    const router = useRouter();

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

    if (!onSubmit) {
        onSubmit = async (values: z.infer<typeof profileSchema>) => {
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
                    router.push("/");
                }
            } catch (err) {
                console.error(err);
                console.error("An unexpected error occurred.");
            }
        };
    }

    useEffect(() => {
        if (status === "authenticated") {
            const user = session.user as any;

            if (!name && user?.name) {
                setName(user.name);
                form.setValue("name", user.name);
            }

            if ((!username || usernameType === "email") && user?.username) {
                setUsername(user.username);
                form.setValue("username", user.username);
                setUsernameType("username");
            }

            if ((!username || username === "2") && user?.email) {
                const emailPrefix = user.email.split("@")[0];
                const sanitizedPrefix = emailPrefix.replace(
                    /[^a-zA-Z0-9_-]/g,
                    ""
                );
                setUsername(sanitizedPrefix.slice(0, 30));
                form.setValue("username", sanitizedPrefix.slice(0, 30));
                setUsernameType("email");
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
                    className="flex flex-col gap-4 w-[85%]"
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
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                </FormItem>
                            )}
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
                                    <FormDescription>
                                        Your real name.
                                    </FormDescription>
                                </FormItem>
                            )}
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
                                    <FormDescription>
                                        Some additional information about you.
                                    </FormDescription>
                                </FormItem>
                            )}
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
                                        <div className="flex items-center gap-2">
                                            <HexColorPicker
                                                className="rounded-lg"
                                                color={color}
                                                onChange={(_color) => {
                                                    setColor(_color);
                                                    field.onChange(_color);
                                                }}
                                            />
                                            <div className="h-50">
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
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <Button
                        className="mt-5 w-fit"
                        variant="outline"
                        type="submit"
                    >
                        {submitButtonText || "Save Changes"}
                    </Button>
                </form>
            </Form>
        </>
    );
}

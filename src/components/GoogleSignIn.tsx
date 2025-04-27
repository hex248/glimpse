import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function GoogleSignIn() {
    return (
        <Button onClick={() => signIn("google")} variant="outline">
            Sign in with Google
        </Button>
    );
}

import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("", {
    variants: {
        variant: {
            default: "",
            destructive:
                "bg-destructive border-destructive text-foreground hover:bg-destructive/85",
            dummy: "",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { className, variant, children, isLoading, asChild = false, ...props },
        ref
    ) => {
        return (
            <button
                className={cn(
                    variant != "dummy"
                        ? "border border-foreground px-4 py-1 rounded-md bg-foreground text-background hover:bg-background hover:text-foreground cursor-pointer inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none outline-none"
                        : "",
                    buttonVariants({ variant, className })
                )}
                ref={ref}
                {...props}
            >
                {isLoading && "Loading..."}

                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;

import { cn } from "@lib/utils";
import { forwardRef } from "react";

export const Checkbox = forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input ref={ref} type="checkbox" className={cn("", className)} {...props} />
  );
});

Checkbox.displayName = "Checkbox";

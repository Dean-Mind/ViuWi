"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import EyeIcon from "@/components/icons/EyeIcon";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-12", className)}
          ref={ref}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <div className="w-px h-8 sm:h-10 bg-viuwi-divider"></div>
          <button
            type="button"
            className="px-3 py-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-viuwi-orange focus:ring-opacity-50 rounded-r-md"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon width={18} height={14} color="#718096" className="sm:w-5 sm:h-[15px]" />
          </button>
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
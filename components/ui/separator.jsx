"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

/**
 * Render a styled separator using Radix UI's Separator.Root.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes to apply to the separator.
 * @param {'horizontal'|'vertical'} [props.orientation="horizontal"] - Layout orientation of the separator.
 * @param {boolean} [props.decorative=true] - If true, marks the separator as decorative (not exposed to assistive technologies).
 * @param {...any} [props] - Additional props forwarded to SeparatorPrimitive.Root.
 * @returns {JSX.Element} The React element for the separator.
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props} />
  );
}

export { Separator }
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

/**
 * Wraps content in a Radix Tooltip provider and configures the tooltip show delay.
 *
 * @param {object} props - Component props.
 * @param {number} [props.delayDuration=0] - Milliseconds to wait before showing the tooltip.
 * @returns {JSX.Element} A TooltipPrimitive.Provider element configured with the given delayDuration and forwarded props.
 */
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return (<TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />);
}

/**
 * Render a tooltip root element wrapped with the module's TooltipProvider.
 *
 * @param {Object} props - Props to apply to the tooltip root; all properties are forwarded to the rendered TooltipPrimitive.Root.
 * @returns {JSX.Element} The tooltip element wrapped in a TooltipProvider.
 */
function Tooltip({
  ...props
}) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

/**
 * Renders a tooltip trigger element and forwards received props to the underlying trigger.
 * @returns {JSX.Element} The tooltip trigger element with forwarded props.
 */
function TooltipTrigger({
  ...props
}) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

/**
 * Renders tooltip content inside a portal with configurable offset, styling, and an arrow.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names appended to the default content styling.
 * @param {number} [props.sideOffset=0] - Distance in pixels between the trigger and the tooltip content.
 * @param {import('react').ReactNode} [props.children] - Elements to display inside the tooltip.
 * @returns {JSX.Element} The tooltip content element wrapped in a portal, including a positioned arrow.
 */
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        )}
        {...props}>
        {children}
        <TooltipPrimitive.Arrow
          className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }